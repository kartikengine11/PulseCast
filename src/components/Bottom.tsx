"use client";

import { motion } from "framer-motion";
import { Player } from "./Player";

export const Bottom = () => {
  return (
    <motion.footer
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative z-20 w-full flex-shrink-0 border-t border-white/10 bg-black/40 backdrop-blur-md shadow-[0_-8px_24px_rgba(0,0,0,0.2)] px-4 py-3 md:px-6 md:py-4"
    >
      <div className="max-w-3xl mx-auto w-full">
        <Player />
      </div>
    </motion.footer>
  );
};
