"use server";

import { eventSchema } from "@/app/lib/validators";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import {addDays, addMinutes, format, isBefore, parseISO, startOfDay} from 'date-fns'

export async function createEvent(data) {
  try {
    console.log("=== CREATE EVENT SERVER ACTION STARTED ===");
    console.log("1. Raw form data received:", data);
    
    // Get authentication
    const authResult = await auth();
    console.log("2. Full auth result:", authResult);
    
    const { userId } = authResult;
    console.log("3. Extracted userId:", userId);

    if (!userId) {
      console.log("4. ERROR: No userId found - throwing Unauthorized");
      throw new Error("Unauthorized - No user ID found");
    }

    // Validate the data
    console.log("5. Validating data with schema...");
    const validatedData = eventSchema.parse(data);
    console.log("6. Validation successful:", validatedData);

    // Find user in database
    console.log("7. Looking for user in database with clerkUserId:", userId);
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    
    console.log("8. User found in database:", user);

    if (!user) {
      console.log("9. ERROR: User not found in database");
      throw new Error("User not found in database");
    }

    // Create the event
    console.log("10. Creating event with data:", {
      ...validatedData,
      userId: user.id,
    });
    
    const event = await db.event.create({
      data: {
        ...validatedData,
        userId: user.id,
      },
    });

    console.log("11. SUCCESS: Event created:", event);
    console.log("=== CREATE EVENT SERVER ACTION COMPLETED ===");
    
    return event;

  } catch (error) {
    console.log("=== ERROR IN CREATE EVENT SERVER ACTION ===");
    console.log("Error type:", error.constructor.name);
    console.log("Error message:", error.message);
    console.log("Error stack:", error.stack);
    console.log("=== END ERROR LOG ===");
    
    throw error;
  }
}

export async function getUserEvents() {
  const { userId } = await auth(); // ✅ FIXED: Added await here
  
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const events = await db.event.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { bookings: true },
      },
    },
  });

  return { events, username: user.username };
}

export async function deleteEvent(eventId) {
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

  const event = await db.event.findUnique({
    where: { id: eventId },
  });

  if (!event || event.userId !== user.id) {
    throw new Error("Event not found or unauthorized");
  }

  await db.event.delete({
    where: { id: eventId },
  });

  return { success: true };
}

export async function getEventDetails(username, eventId) {
  const event = await db.event.findFirst({
    where: {
      id: eventId,
      user: {
        username: username,
      },
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          username: true,
          imageUrl: true,
        },
      },
    },
  });

  return event;
}

export async function getEventAvailability(eventId) {
  try {
    console.log("=== GET EVENT AVAILABILITY STARTED ===");
    console.log("1. EventId received:", eventId);

    const event = await db.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        user: {
          include: {
            availability: {
              select: {
                days: true,
                timeGap: true,
              },
            },
            bookings: {
              select: {
                startTime: true,
                endTime: true,
              }
            }
          },
        },
      },
    });

    console.log("2. Event found:", event ? "Yes" : "No");
    console.log("3. Event data:", JSON.stringify(event, null, 2));

    if (!event) {
      console.log("4. ERROR: Event not found");
      return [];
    }

    if (!event.user) {
      console.log("5. ERROR: Event user not found");
      return [];
    }

    if (!event.user.availability) {
      console.log("6. ERROR: User availability not found");
      return [];
    }

    console.log("7. User availability:", JSON.stringify(event.user.availability, null, 2));
    console.log("8. User bookings:", JSON.stringify(event.user.bookings, null, 2));

    const { availability, bookings } = event.user;

    const startDate = startOfDay(new Date());
    const endDate = addDays(startDate, 30);

    console.log("9. Date range:", {
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd")
    });

    const availableDates = [];

    for (let date = startDate; date <= endDate; date = addDays(date, 1)) {
      const dayOfWeek = format(date, "EEEE").toUpperCase();
      console.log(`10. Processing date: ${format(date, "yyyy-MM-dd")} (${dayOfWeek})`);
      
      const dayAvailability = availability.days.find((d) => d.day === dayOfWeek);
      console.log(`11. Day availability found:`, dayAvailability ? "Yes" : "No");

      if (dayAvailability) {
        const dateStr = format(date, "yyyy-MM-dd");
        console.log(`12. Generating slots for ${dateStr}`);

        const slots = generateAvailableTimeSlots(
          dayAvailability.startTime,
          dayAvailability.endTime,
          event.duration,
          bookings,
          dateStr,
          availability.timeGap
        );

        console.log(`13. Generated ${slots.length} slots for ${dateStr}:`, slots);

        availableDates.push({
          date: dateStr,
          slots,
        });
      }
    }

    console.log("14. Final available dates:", JSON.stringify(availableDates, null, 2));
    console.log("=== GET EVENT AVAILABILITY COMPLETED ===");
    
    return availableDates;

  } catch (error) {
    console.log("=== ERROR IN GET EVENT AVAILABILITY ===");
    console.log("Error type:", error.constructor.name);
    console.log("Error message:", error.message);
    console.log("Error stack:", error.stack);
    console.log("=== END ERROR LOG ===");
    
    throw error;
  }
}

function generateAvailableTimeSlots(
  startTime,
  endTime,
  duration,
  bookings,
  dateStr,
  timeGap = 0
) {
  try {
    console.log("=== GENERATE TIME SLOTS STARTED ===");
    console.log("Parameters:", {
      startTime,
      endTime,
      duration,
      dateStr,
      timeGap,
      bookingsCount: bookings.length
    });

    const slots = [];

    // Fix: Better time parsing
    let currentTime = parseISO(`${dateStr}T${startTime.toISOString().slice(11, 19)}`);
    const slotEndTime = parseISO(`${dateStr}T${endTime.toISOString().slice(11, 19)}`);

    console.log("Parsed times:", {
      currentTime: currentTime.toISOString(),
      slotEndTime: slotEndTime.toISOString()
    });

    const now = new Date();
    if (format(now, "yyyy-MM-dd") === dateStr) {
      const adjustedTime = addMinutes(now, timeGap);
      if (isBefore(currentTime, adjustedTime)) {
        currentTime = adjustedTime;
        console.log("Adjusted current time for today:", currentTime.toISOString());
      }
    }

    let slotCount = 0;
    while (currentTime < slotEndTime && slotCount < 50) { // Safety limit
      const slotEnd = new Date(currentTime.getTime() + duration * 60000);
      
      // Check if slot end time exceeds the day's end time
      if (slotEnd > slotEndTime) {
        console.log("Slot end exceeds day end time, breaking");
        break;
      }

      const isSlotAvailable = !bookings.some(booking => {
        const bookingStart = new Date(booking.startTime);
        const bookingEnd = new Date(booking.endTime);

        const overlaps = (
          (currentTime >= bookingStart && currentTime < bookingEnd) ||
          (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
          (currentTime <= bookingStart && slotEnd >= bookingEnd)
        );

        if (overlaps) {
          console.log("Slot overlap detected:", {
            slotStart: currentTime.toISOString(),
            slotEnd: slotEnd.toISOString(),
            bookingStart: bookingStart.toISOString(),
            bookingEnd: bookingEnd.toISOString()
          });
        }

        return overlaps;
      });

      if (isSlotAvailable) {
        const timeSlot = format(currentTime, "HH:mm");
        slots.push(timeSlot);
        console.log(`Added slot: ${timeSlot}`);
      }

      currentTime = slotEnd;
      slotCount++;
    }

    console.log(`Generated ${slots.length} total slots`);
    console.log("=== GENERATE TIME SLOTS COMPLETED ===");
    
    return slots;

  } catch (error) {
    console.log("=== ERROR IN GENERATE TIME SLOTS ===");
    console.log("Error:", error.message);
    console.log("=== END ERROR LOG ===");
    return [];
  }
}