import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { google } from "googleapis";

export async function getUserMeetings(type = "upcoming") {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const now = new Date();

  const meetings = await db.booking.findMany({
    where: {
      userId: user.id,
      startTime: type === "upcoming" ? { gte: now } : { lt: now },
    },
    include: {
      event: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      startTime: type === "upcoming" ? "asc" : "desc",
    },
  });

  return meetings;
}

export async function cancelMeeting(meetingId) {
  try {
    const { userId } = await auth(); // Fixed: Added await
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const meeting = await db.booking.findUnique({
      where: { id: meetingId },
      include: { event: true, user: true },
    });

    if (!meeting) {
      return { success: false, error: "Meeting not found" };
    }

    if (meeting.userId !== user.id) {
      return { success: false, error: "Unauthorized to cancel this meeting" };
    }

    // Cancel the meeting in Google Calendar
    try {
      // Updated for Clerk v5 - use the correct method
      const tokenResponse = await clerkClient.users.getUserOauthAccessToken(
        meeting.user.clerkUserId,
        "oauth_google"
      );

      const token = tokenResponse.data?.[0]?.token;

      if (token && meeting.googleEventId) {
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: token });

        const calendar = google.calendar({ version: "v3", auth: oauth2Client });

        await calendar.events.delete({
          calendarId: "primary",
          eventId: meeting.googleEventId,
        });
      }
    } catch (calendarError) {
      console.error("Failed to delete event from Google Calendar:", calendarError);
      // Continue with database deletion even if Google Calendar deletion fails
    }

    // Delete the meeting from the database
    await db.booking.delete({
      where: { id: meetingId },
    });

    return { success: true };
  } catch (error) {
    console.error("Error in cancelMeeting:", error);
    return { success: false, error: error.message || "Failed to cancel meeting" };
  }
}