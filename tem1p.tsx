"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Queue } from "./Queue";

export const Right = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "w-full lg:flex-1 h-full overflow-y-auto backdrop-blur-xl",
        "scrollbar-thin scrollbar-thumb-rounded-md scrollbar-thumb-muted-foreground/10 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/20"
      )}
    >
      <motion.div
        className="px-6 py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div className="mb-8">
          <Queue />
        </div>
      </motion.div>
    </motion.div>
  );
};
