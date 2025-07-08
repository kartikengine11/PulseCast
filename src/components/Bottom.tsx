"use client";

import { motion } from "framer-motion";
import { Player } from "./Player";

export const Bottom = () => {
  return (
    <motion.footer
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex-shrink-0 border-t border-neutral-800/50 bg-neutral-900/10 backdrop-blur-lg p-4 shadow-[0_-5px_15px_rgba(0,0,0,0.1)] z-10 relative w-full"
    >
      <div className="max-w-3xl mx-auto">
        <Player />
      </div>
    </motion.footer>
  );
};
