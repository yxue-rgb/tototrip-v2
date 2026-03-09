"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Edit page is no longer needed (trips are managed via localStorage).
 * Redirect to trip detail page.
 */
export default function EditTripPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [tripId, setTripId] = useState("");

  useEffect(() => {
    params.then((p) => {
      setTripId(p.id);
      router.replace(`/trips/${p.id}`);
    });
  }, [params, router]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a1a13] flex items-center justify-center">
      <p className="text-slate-400 text-sm">Redirecting...</p>
    </div>
  );
}
