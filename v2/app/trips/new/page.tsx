"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Redirect /trips/new to the chat page.
 * Trips are now created by saving AI-generated itineraries from chat.
 */
export default function NewTripPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/chat/new");
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a1a13] flex items-center justify-center">
      <p className="text-slate-400 text-sm">Redirecting to chat...</p>
    </div>
  );
}
