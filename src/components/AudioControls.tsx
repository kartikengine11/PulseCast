"use client";

import { useGlobalStore } from "@/store/global";
import { Construction, Orbit,Shell } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";

export const AudioControls = () => {
  const startSpatialAudio = useGlobalStore((state) => state.startSpatialAudio);
  const stopSpatialAudio = useGlobalStore((state) => state.sendStopSpatialAudio);
  const startSpiralSpatialAudio = useGlobalStore((state) => state.startSpiralSpatialAudio);
  const isLoadingAudio = useGlobalStore((state) => state.isInitingSystem);

  const handleStartSpatialAudio = () => {
    console.log("handle start interval");
    startSpatialAudio();
  }
  const handleStopSpatialAudio = () => {stopSpatialAudio()};
  const handleSpiralSpatialAudio = () => {
    console.log("inside spiral");
    startSpiralSpatialAudio()
  };

  return (
    <motion.div className="px-4 space-y-3 py-3">
      <h2
        className={`text-xs font-medium uppercase tracking-wide ${
          isLoadingAudio ? "text-neutral-500" : "text-neutral-400"
        }`}
      >
        Audio Effects{" "}
        {isLoadingAudio && (
          <span className="text-xs opacity-70">(loading...)</span>
        )}
      </h2>

      <div className="space-y-3">
        <motion.div className="bg-neutral-800/20 rounded-md p-3 hover:bg-neutral-800/30 transition-colors">
          <div className="flex justify-between items-center">
            <div className="text-xs text-neutral-300 flex items-center gap-1.5">
              <Orbit className="h-3 w-3 text-primary-500" />
              <span>Rotation</span>
            </div>
            <div className="flex gap-2">
              <Button
                className="text-xs px-3 py-1 h-auto bg-primary-600/80 hover:bg-primary-600 text-white cursor-pointer"
                size="sm"
                onClick={handleStartSpatialAudio}
                disabled={isLoadingAudio}
              >
                Start
              </Button>
              <Button
                className="text-xs px-3 py-1 h-auto bg-neutral-700/60 hover:bg-neutral-700 text-white cursor-pointer"
                size="sm"
                onClick={handleStopSpatialAudio}
                disabled={isLoadingAudio}
              >
                Stop
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="space-y-3">
        <motion.div className="bg-neutral-800/20 rounded-md p-3 hover:bg-neutral-800/30 transition-colors">
          <div className="flex justify-between items-center">
            <div className="text-xs text-neutral-300 flex items-center gap-1.5">
              <Shell className="h-3 w-3 text-primary-500" />
              <span>Spiral</span>
            </div>
            <div className="flex gap-2">
              <Button
                className="text-xs px-3 py-1 h-auto bg-primary-600/80 hover:bg-primary-600 text-white cursor-pointer"
                size="sm"
                onClick={handleSpiralSpatialAudio}
                disabled={isLoadingAudio}
              >
                Start
              </Button>
              <Button
                className="text-xs px-3 py-1 h-auto bg-neutral-700/60 hover:bg-neutral-700 text-white cursor-pointer"
                size="sm"
                onClick={handleStopSpatialAudio}
                disabled={isLoadingAudio}
              >
                Stop
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
