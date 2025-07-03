import { getEventAvailability, getEventDetails } from "@/actions/events";
import { notFound } from "next/navigation";
import EventDetails from "./_components/event-details";
import { Suspense } from "react";
import BookingForm  from "./_components/booking-form";

export async function generateMetadata({ params }) {
  // Fix: Await params before using
  const resolvedParams = await params;
  const event = await getEventDetails(resolvedParams.username, resolvedParams.eventId);

  if (!event) {
    return {
      title: "Event Not Found",
    };
  }

  return {
    title: `Book ${event.title} with ${event.user.name} | Your App Name`,
    description: `Schedule a ${event.duration}-minute ${event.title} event with ${event.user.name}.`,
  };
}

const EventPage = async ({ params }) => {
  // Fix: Await params before using
  const resolvedParams = await params;
  
  const event = await getEventDetails(resolvedParams.username, resolvedParams.eventId);
  const availability = await getEventAvailability(resolvedParams.eventId);

  console.log(availability);

  if (!event) {
    notFound();
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto p-6">
      <EventDetails event={event} />
      
      <Suspense fallback={<div>Loading booking form...</div>}>
        <BookingForm event={event} availability={availability} />
      </Suspense>
    </div>
  );
};

export default EventPage;