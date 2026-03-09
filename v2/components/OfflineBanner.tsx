"use client";

import { useState, useEffect } from "react";
import { WifiOff, Wifi } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      // Hide "reconnected" banner after 3s
      setTimeout(() => setShowReconnected(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-0 left-0 right-0 z-[100] bg-[#E95331] text-white py-2.5 px-4 text-center shadow-lg"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <WifiOff className="h-4 w-4" aria-hidden="true" />
            <span>You&apos;re offline — check your connection</span>
          </div>
        </motion.div>
      )}

      {isOnline && showReconnected && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-0 left-0 right-0 z-[100] bg-[#6BBFAC] text-white py-2.5 px-4 text-center shadow-lg"
        >
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <Wifi className="h-4 w-4" />
            <span>Back online!</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
