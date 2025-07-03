"use client";

import { eventSchema } from "@/app/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form"
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import useFetch from "@/hooks/use-fetch";
import { createEvent } from "@/actions/events";

const EventForm = ({onSubmitForm}) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      duration: 30,
      isPrivate: true,
    },
  });

  const { loading, error, fn: fnCreateEvent } = useFetch(createEvent);

  const onSubmit = async (data) => {
    console.log("Form data being submitted:", data); // Debug log
    
    try {
      const result = await fnCreateEvent(data);
      console.log("Event creation result:", result); // Debug log
      
      // Only proceed if the function executed successfully
      if (result) {
        onSubmitForm();
        router.refresh();
      }
    } catch (err) {
      console.error("Error creating event:", err);
    }
  };

  return <form className="px-6 flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
    <div>
        <label htmlFor="title"
            className="block text-sm font-medium text-gray-700"
            >Event Title
       </label>

       <Input id="title" {...register("title")} className="mt-1" />

       {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
        )}

    </div>

     <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
         Description
        </label>

        <Input id="description"
          {...register("description")}
          className="mt-1"
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="duration"
          className="block text-sm font-medium text-gray-700"
        >
          Duration (minutes)
        </label>

        <Input
          id="duration"
          {...register("duration", {
            valueAsNumber: true,
          })}
          type="number"
          className="mt-1"
        />

        {errors.duration && (
          <p className="text-red-500 text-xs mt-1">{errors.duration.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="isPrivate"
          className="block text-sm font-medium text-gray-700"
        >
          Event Privacy
        </label>
        <Controller 
          name="isPrivate"
          control={control}
          render={({ field }) => (
            <Select 
              value={field.value ? "true" : "false"}
              onValueChange={(value) => field.onChange(value === "true")}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select privacy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Private</SelectItem>
                <SelectItem value="false">Public</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        {errors.isPrivate && (
          <p className="text-red-500 text-xs mt-1">
            {errors.isPrivate.message}
          </p>
        )}
      </div>

       {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Event"}
      </Button>
      
  </form>
}

export default EventForm