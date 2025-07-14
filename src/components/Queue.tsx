import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LocalAudioSource } from "../lib/localtypes";
import { cn, formatTime } from "@/lib/utils";
import { useGlobalStore } from "@/store/global";
import { MoreHorizontal, Pause, Play, UploadCloud } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

export const Queue = ({ className, ...rest }: React.ComponentProps<"div">) => {
  const audioSources = useGlobalStore((state) => state.audioSources);
  const selectedAudioId = useGlobalStore((state) => state.selectedAudioId)
  const setSelectedAudioId = useGlobalStore((state) => state.setSelectedAudioId);
  const isInitingSystem = useGlobalStore((state) => state.isInitingSystem);
  const broadcastPlay = useGlobalStore((state) => state.broadcastPlay);
  const broadcastPause = useGlobalStore((state) => state.broadcastPause);
  const isPlaying = useGlobalStore((state) => state.isPlaying);
  const reuploadAudio = useGlobalStore((state) => state.reuploadAudio);
  function temp() {
    const index = audioSources.findIndex(
      (source) => source.id === selectedAudioId
    );
    return index >= 0 ? index : null;
  }

  // Auto-play when selection changes
  // useEffect(() => {
  //   if (selectedAudioId && !isPlaying) {
  //     broadcastPlay(0); // play from beginning
  //   }
  // }, [selectedAudioId]);
  
  const handleItemClick = (source: LocalAudioSource) => {
    if (source.id === selectedAudioId) {
      isPlaying ? broadcastPause() : broadcastPlay();
    } else {
      setSelectedAudioId(source.id);
    }
  };

  const handleReupload = (sourceId: string, sourceName: string) => {
    reuploadAudio(sourceId, sourceName);
  };


 return (
    <div className={cn("w-full", className)} {...rest}>
      <div className="space-y-1">
        {audioSources.length > 0 ? (
          <AnimatePresence initial={true}>
            {audioSources.map((source, index) => {
              const isSelected = source.id === selectedAudioId;
              const isPlayingThis = isSelected && isPlaying;

              return (
                <motion.div
                  key={source.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.05 * index,
                    ease: "easeOut",
                  }}
                  className={cn(
                    "group flex items-center px-3 py-2 rounded-lg cursor-pointer transition-colors",
                    isSelected
                      ? "bg-white/5 text-white"
                      : "hover:bg-white/5 text-neutral-300"
                  )}
                  onClick={() => handleItemClick(source)}
                >
                  {/* Play/Pause or Index */}
                  <div className="w-6 h-6 relative flex items-center justify-center">
                    <button
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      aria-label={isPlayingThis ? "Pause" : "Play"}
                    >
                      {isPlayingThis ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </button>

                    <div className="group-hover:opacity-0">
                      {isPlayingThis ? (
                        <div className="flex items-end gap-[2px] h-4 w-4">
                          <div className="bg-primary w-[2px] h-[40%] animate-[sound-wave-1_1.2s_ease-in-out_infinite]" />
                          <div className="bg-primary w-[2px] h-[80%] animate-[sound-wave-2_1.4s_ease-in-out_infinite]" />
                          <div className="bg-primary w-[2px] h-[60%] animate-[sound-wave-3_1s_ease-in-out_infinite]" />
                        </div>
                      ) : (
                        <span
                          className={cn(
                            "text-xs",
                            isSelected ? "text-primary" : "text-neutral-400"
                          )}
                        >
                          {index + 1}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Track Title */}
                  <div className="flex-grow min-w-0 ml-4">
                    <div
                      className={cn(
                        "truncate text-sm font-medium",
                        isSelected ? "text-primary" : "text-neutral-300"
                      )}
                    >
                      {source.name}
                    </div>
                  </div>

                  {/* Duration + Dropdown */}
                  <div className="ml-4 flex items-center gap-2">
                    <span className="text-xs text-neutral-500">
                      {formatTime(source.audioBuffer.duration)}
                    </span>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-1 rounded-full hover:bg-white/10 transition"
                          aria-label="More options"
                        >
                          <MoreHorizontal className="w-4 h-4 text-neutral-400 hover:text-white" />
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        className="z-50"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DropdownMenuItem
                          onSelect={() =>
                            handleReupload(source.id, source.name)
                          }
                          disabled={source.id.startsWith("static")}
                          className="flex items-center gap-2 text-sm"
                        >
                          <UploadCloud className="w-4 h-4 text-neutral-400" />
                          <span>Reupload to room</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-6 text-neutral-500"
          >
            {isInitingSystem ? "Loading tracks..." : "No tracks available"}
          </motion.div>
        )}
      </div>
    </div>
  );
};