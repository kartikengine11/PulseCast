"use client";

import { cn } from "@/lib/utils";
import { Library, Search } from "lucide-react";
import { motion } from "framer-motion";
import { Separator } from "../components/ui/separator";
import { Button } from "./ui/button";
import { AudioUploader } from "./AudioUpload";

interface LeftProps {
  className?: string;
}

const LeftPart = ({ className }: LeftProps) => {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "w-full lg:w-72 flex-shrink-0 border-r border-neutral-800/60 backdrop-blur-md flex flex-col h-full text-sm",
        "scrollbar-thin scrollbar-thumb-rounded-md scrollbar-thumb-muted-foreground/10 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/20",
        "overflow-y-auto",
        className
      )}
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-2">
        <div className="bg-gradient-to-tr from-green-500/20 to-white/10 p-2 rounded-md">
          <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
        </div>
        <h1 className="text-white font-semibold tracking-wide text-base">
          PulseCast
        </h1>
      </div>

      <Separator className="bg-neutral-800/50" />

      {/* Library Title */}
      <h2 className="text-sm font-bold text-neutral-300 select-none px-4 py-3">
        Your Library
      </h2>

      {/* Navigation Buttons */}
      <motion.div className="px-4 space-y-2 py-2">
        <Button
          className="w-full flex items-center gap-3 py-2 text-white font-medium bg-white/5 hover:bg-white/10 rounded-lg text-xs transition-all"
          variant="ghost"
        >
          <Library className="h-4 w-4" />
          <span>Default Library</span>
        </Button>

        <a href="https://cobalt.tools/" target="_blank" rel="noopener noreferrer">
          <Button
            className="w-full flex items-center gap-3 py-2 text-white font-medium bg-white/5 hover:bg-white/10 rounded-lg text-xs transition-all"
            variant="ghost"
          >
            <Search className="h-4 w-4" />
            <span>Search Music</span>
          </Button>
        </a>
      </motion.div>

      <Separator className="bg-neutral-800/50 mt-2" />

      {/* Tips Section */}
      <div className="mt-auto p-4 pt-3 border-t border-neutral-800/50 text-neutral-400 text-xs space-y-4">
        <div>
          <h5 className="font-medium text-neutral-300 mb-2">Tips</h5>
          <ul className="list-disc list-outside pl-4 space-y-1.5 leading-relaxed">
            <li>Best with multiple devices in the same room.</li>
            <li>If de-synced: pause, sync, or refresh.</li>
            <li>Use direct speakers — avoid Bluetooth.</li>
          </ul>
        </div>

        {/* Audio Upload */}
        <div className="pt-2">
          <AudioUploader />
        </div>
      </div>
    </motion.div>
  );
};

export default LeftPart;
