"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CancelMeetingButton({ meetingId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCancel = async () => {
    if (window.confirm("Are you sure you want to cancel this meeting?")) {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/cancel-meeting', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ meetingId }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to cancel meeting');
        }

        // Success - refresh the page to show updated meetings
        router.refresh();
      } catch (err) {
        console.error('Cancel meeting error:', err);
        setError(err.message || 'Failed to cancel meeting');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <Button 
        variant="destructive" 
        onClick={handleCancel} 
        disabled={loading}
        className="bg-red-600 hover:bg-red-700 text-white border-red-600"
      >
        {loading ? "Canceling..." : "Cancel Meeting"}
      </Button>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
}