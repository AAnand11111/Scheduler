"use client";

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import EventForm from "./event-form";

export default function CreateEventDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const create = searchParams.get('create');
    setIsOpen(create === 'true');
  }, [searchParams]);

  const handleClose = () => {  
    setIsOpen(false);
    if (searchParams.get("create") === "true") {
      router.replace(window?.location.pathname);
    }
  };

  const handleSubmit = () => {
    // Add your submit logic here
    console.log("Event created!");
    handleClose();
  };

   return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader>
          <DrawerTitle>Create New Event</DrawerTitle>
        </DrawerHeader>
        
        <div className="flex-1 overflow-y-auto px-6">
          <EventForm
            onSubmitForm={() => {
              handleClose();
            }}
          />
        </div>
        
        <DrawerFooter className="px-6 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}