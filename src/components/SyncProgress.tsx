"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import waveAnimation from "../store/assets/wave.json";
import tickAnimation from "../store/assets/tick.json";
import { MAX_NTP_MEASUREMENTS, useGlobalStore } from "@/store/global";

interface SyncProgressProps {
  isLoading?: boolean;
  loadingMessage?: string;
}

export const SyncProgress = ({
  isLoading = false,
  loadingMessage = "Initializing...",
}: SyncProgressProps) => {
  const syncProgress = useGlobalStore(
    (state) => state.ntpMeasurements.length / MAX_NTP_MEASUREMENTS
  );
  const isSyncComplete = useGlobalStore((state) => state.isSynced);
  const setIsLoadingAudio = useGlobalStore((state) => state.setIsInitingSystem);

  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [message, setMessage] = useState("Loading...");
  const [showButton, setShowButton] = useState(false);

  // Smooth animation using requestAnimationFrame
  useEffect(() => {
    let start = Date.now();
    let frame: number;

    const animate = () => {
      const target = isSyncComplete ? 1 : isLoading ? 0.1 : 0.1 + syncProgress * 0.9;
      setAnimatedProgress((prev) => prev + (target - prev) * 0.1);
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isLoading, syncProgress, isSyncComplete]);

  useEffect(() => {
    if (isLoading) {
      setMessage(loadingMessage);
    } else if (isSyncComplete) {
      setMessage("Your device is now synchronized with this room.");
      const timeout = setTimeout(() => setShowButton(true), 500);
      return () => clearTimeout(timeout);
    } else {
      setMessage("Syncing audio across devices...");
    }
  }, [isLoading, isSyncComplete, loadingMessage]);

  const normalizedProgress = Math.min(Math.max(animatedProgress, 0), 1);

  // Animation helper
  const fadeIn = (delay = 0) => ({
    initial: { opacity: 0, y: 5 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.3 },
  });

  return (
    <motion.div
      // className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center"
      className="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] backdrop-blur-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={isSyncComplete ? "Synchronization complete" : "Synchronizing system"}
    >
      <motion.div
        // className="w-full max-w-sm bg-neutral-900 text-white rounded-2xl border border-neutral-700 shadow-xl px-6 py-8 text-center relative"
        className="w-full flex flex-col items-center justify-center p-8 rounded-3xl bg-white/5 border border-white/20 shadow-2xl max-w-md mx-auto space-y-6 backdrop-blur-xl"
        {...fadeIn()}
      >
        {/* Crossfade Lottie animations */}
        <div className="w-24 h-24 mx-auto mb-6 relative">
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 1 }}
            animate={{ opacity: isSyncComplete ? 0 : 1 }}
            transition={{ duration: 0.5 }}
          >
            <Lottie animationData={waveAnimation} loop autoplay />
          </motion.div>
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: isSyncComplete ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <Lottie animationData={tickAnimation} autoplay />
          </motion.div>
        </div>

        {/* Title */}
        <motion.h2
          key={isSyncComplete ? "synced" : "syncing"}
          className="text-lg font-semibold mb-2"
          {...fadeIn(0.2)}
        >
          {isSyncComplete ? "🎉 Synced Successfully" : "Beatsync Calibrating"}
        </motion.h2>

        {/* Description */}
        <motion.p
          className="text-sm text-neutral-400 mb-4"
          {...fadeIn(0.3)}
        >
          {message}
        </motion.p>

        {/* Progress bar */}
        <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden mb-4">
          <motion.div
            className="h-full bg-primary"
            style={{ width: `${normalizedProgress * 100}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${normalizedProgress * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Progress % text */}
        <motion.div
          className="text-xs text-neutral-400"
          {...fadeIn(0.4)}
        >
          {Math.round(normalizedProgress * 100)}% complete
        </motion.div>

        {/* Final Button */}
        {showButton && (
          <motion.button
            className="mt-4 px-5 py-2 bg-primary text-primary-foreground rounded-full font-medium text-xs tracking-wide cursor-pointer w-full hover:shadow-lg hover:shadow-zinc-50/50 transition-shadow duration-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.015 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsLoadingAudio(false)}
          >
            Start System
          </motion.button>
        )}

        {/* Final Note */}
        <motion.p
          className="text-neutral-400 mt-5 text-center text-xs"
          {...fadeIn(0.5)}
        >
          Use native device speakers.
        </motion.p>
      </motion.div>
    </motion.div>
  );
};
