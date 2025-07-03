"use client";

import dynamic from "next/dynamic";

// Import CreateEventDrawer only on client side to avoid hydration issues
const CreateEventDrawer = dynamic(() => import("@/components/create-event"), {
  ssr: false
});

export default function ClientDrawerWrapper() {
  return <CreateEventDrawer />;
}