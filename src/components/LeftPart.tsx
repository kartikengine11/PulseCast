"use client";

import { cn } from "@/lib/utils";
import { Library, Search } from "lucide-react";
import { motion } from "framer-motion";
import { Separator } from "../components/ui/separator";
import { Button } from "./ui/button";
import { AudioUploader } from "./AudioUpload";
import Link from "next/link";
import { AudioControls } from "./AudioControls";

interface LeftProps {
  className?: string;
}

const LeftPart = ({ className }: LeftProps) => {
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "w-full lg:w-72 flex-shrink-0 border-r border-white/10 backdrop-blur-md flex flex-col h-full",
        "scrollbar-thin overflow-y-auto text-white text-sm",
        className
      )}
    >
      {/* Header */}
      <div className="px-5 py-4 flex items-center gap-3 border-b border-white/10">
        <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse shadow-md" />
        <h1 className="font-semibold tracking-wide text-base">PulseCast</h1>
      </div>

      {/* Search & Controls */}
      <div className="p-5 space-y-4">
        <div className="space-y-1">
          <p className="text-neutral-400 text-xs uppercase font-semibold">
            Actions
          </p>
          <Link href="#">
            <Button
              variant="ghost"
              className="w-full justify-start text-sm text-white bg-white/5 hover:bg-white/10"
            >
              <Search className="h-4 w-4 mr-2" />
              Search Music
            </Button>
          </Link>
        </div>

        <AudioControls />
      </div>

      {/* Tips & Upload */}
      <div className="mt-auto border-t border-white/10 px-5 py-4 space-y-4 text-neutral-400 text-xs">
        <div>
          <h2 className="font-semibold text-white text-sm mb-2">Tips</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Use multiple devices for immersive sound.</li>
            <li>Pause + sync if de-synced.</li>
            <li>Avoid Bluetooth for lowest latency.</li>
          </ul>
        </div>
        <AudioUploader />
      </div>
    </motion.aside>
  );
};

export default LeftPart;
