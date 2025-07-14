"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Queue } from "./Queue";
import { Bottom } from "./Bottom";
import { AudioVisualizer } from "./SpatialAudioBackground";

export const Main = () => {
  return (
    <div className="relative flex flex-col flex-1 h-full min-h-0 w-full overflow-hidden">
      {/* Visualizer Canvas Background */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <AudioVisualizer />
      </div>

      {/* Foreground Content */}
      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "relative z-10 flex flex-col flex-1 h-full w-full overflow-y-auto min-h-0",
          "scrollbar-thin scrollbar-thumb-rounded-md scrollbar-thumb-muted-foreground/10 hover:scrollbar-thumb-muted-foreground/20",
          "backdrop-blur-md"
        )}
      >
        {/* Top Content Section */}
        <div className="flex flex-col md:flex-row gap-6 p-4 md:p-6">
          <div className="w-full">
            <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4 shadow-md border border-white/10">
              <Bottom />
            </div>
          </div>
          </div>

        {/* Queue Section */}
        <div className="px-4 md:px-6 pb-10 space-y-6">
          <h2 className="text-lg font-semibold text-white">Now Playing Queue</h2>
          <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4 shadow-md border border-white/10">
            <Queue />
          </div>
        </div>
      </motion.main>
    </div>
  );
};
