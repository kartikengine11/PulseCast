"use client";
import { useGlobalStore } from "@/store/global";
import { Hash, Users, RotateCcw, Info } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { SyncProgress } from "./SyncProgress";

interface TopBarProps {
  roomId: string;
}

export const TopBar = ({ roomId }: TopBarProps) => {
  const isLoadingAudio = useGlobalStore((state) => state.isInitingSystem);
  const isSynced = useGlobalStore((state) => state.isSynced);
  const roundTripEstimate = useGlobalStore((state) => state.roundTripEstimate);
  const sendNTPRequest = useGlobalStore((state) => state.sendNTPRequest);
  const resetNTPConfig = useGlobalStore((state) => state.resetNTPConfig);
  const pauseAudio = useGlobalStore((state) => state.pauseAudio);
  const connectedClients = useGlobalStore((state) => state.connectedClients);
  const setIsLoadingAudio = useGlobalStore((state) => state.setIsInitingSystem);
  const clockOffset = useGlobalStore((state) => state.offsetEstimate);

  const resync = () => {
    try {
      pauseAudio({ when: 0 });
    } catch (error) {
      console.error("Failed to pause audio:", error);
    }
    resetNTPConfig();
    sendNTPRequest();
    setIsLoadingAudio(true);
  };

  if (!isLoadingAudio && isSynced) {
    return (
      <div className="relative z-50">
        {/* Gradient Accent Border (top) */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-400/30 via-white/10 to-green-400/30" />
        <div className="h-10 px-4 border-b backdrop-blur-md shadow-[0_1px_6px_rgba(255,255,255,0.05)] flex items-center justify-between">
          <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-400">
            {/* PulseCast Logo */}
            <Link
              href="/"
              className="font-semibold text-white hover:text-green-400 transition-all duration-300"
            >
              <motion.span whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                PulseCast
              </motion.span>
            </Link>

            {/* Sync Status with Tooltip */}
            <div className="flex items-center gap-1 group relative">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs">Synced</span>
              <div className="absolute bottom-[-1.5rem] left-0 text-[10px] text-neutral-400 opacity-0 group-hover:opacity-100 transition">
                Fully in sync — audio aligned
              </div>
            </div>

            {/* Room ID Badge */}
            <div className="flex items-center gap-1">
              <Hash size={14} className="mt-px" />
              <span className="font-mono text-green-400 bg-green-400/10 px-2 py-0.5 rounded text-[11px]">
                {roomId}
              </span>
            </div>

            {/* Connected Users */}
            <div className="flex items-center gap-1">
              <Users size={14} className="mt-px" />
              <span>
                {connectedClients.length}{" "}
                {connectedClients.length === 1 ? "user" : "users"}
              </span>
            </div>

            {/* Divider */}
            <div className="hidden md:block text-neutral-700">|</div>

            {/* Clock Info */}
            <div className="hidden md:flex items-center gap-3 font-mono text-[11px]">
              <span className="whitespace-nowrap">Offset: {clockOffset.toFixed(2)}ms</span>
              <span className="whitespace-nowrap">RTT: {roundTripEstimate.toFixed(2)}ms</span>
            </div>

            {/* Divider */}
            <div className="hidden md:block text-neutral-700">|</div>

            {/* Resync Button (text on md+, icon on mobile) */}
            <button
              onClick={resync}
              className="text-neutral-400 hover:text-white transition-all flex items-center gap-1"
              title="Manually re-sync"
            >
              <RotateCcw size={14} className="md:hidden" />
              <span className="hidden md:inline-block">Full Sync</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading or syncing
  return (
    <AnimatePresence>
      {isLoadingAudio && (
        <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
          <SyncProgress />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
