"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Queue } from "./Queue";
import { Bottom } from "./Bottom";

export const Main = () => {
  return (
    <div className="w-full flex flex-col">
      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "flex-1 h-full w-full overflow-y-auto backdrop-blur-xl",
          "scrollbar-thin scrollbar-thumb-rounded-md scrollbar-thumb-muted-foreground/10 hover:scrollbar-thumb-muted-foreground/20"
        )}
      > 
        <div className="px-6 py-6 space-y-6">
          <h2 className="text-lg font-semibold text-white">Now Playing Queue</h2>
          <Queue />
        </div>
      </motion.main>

      {/* Bottom Player (fixed height) */}
      <Bottom/>
    </div>
  );
};
