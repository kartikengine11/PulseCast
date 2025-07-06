"use client";

import { cn, trimFileName } from "@/lib/utils";
import { useRoomStore } from "@/store/room";
import { CloudUpload, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";

const MAX_FILE_SIZE_MB = 30;

export const AudioUploader = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const roomId = useRoomStore((state) => state.roomId);

  const handleFileUpload = async (file: File) => {
    setFileName(file.name);

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(`File exceeds ${MAX_FILE_SIZE_MB}MB limit`);
      return;
    }

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "your_unsigned_preset"); // Replace with your preset
      formData.append("folder", `pulseCast/${roomId}`);

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/db1e4nbaa/video/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            console.log(`Upload progress: ${percent}%`);
          },
        }
      );

      console.log("File uploaded:", response.data);
      setTimeout(() => setFileName(null), 3000);
    } catch (err: any) {
      console.error("Upload error:", err);

      if (axios.isAxiosError(err) && err.response?.status === 413) {
        toast.error("File is too large. Please upload a smaller audio file.");
      } else {
        toast.error("Failed to upload audio file.");
      }

      setFileName(null);
    } finally {
      setIsUploading(false);
    }
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    handleFileUpload(file);
  };

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const onDropEvent = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const file = event.dataTransfer?.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("audio/")) {
      toast.error("Please select an audio file");
      return;
    }

    handleFileUpload(file);
  };

  return (
    <div
      className={cn(
        "border border-neutral-700/50 rounded-md mx-2 transition-all overflow-hidden bg-neutral-800/30 hover:bg-neutral-800/50",
        isDragging ? "outline outline-primary-400 outline-dashed" : "outline-none"
      )}
      id="drop_zone"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDragEnd={onDragLeave}
      onDrop={onDropEvent}
    >
      <label htmlFor="audio-upload" className="cursor-pointer block w-full">
        <div className="p-3 flex items-center gap-3">
          <div className="bg-primary-700 text-white p-1.5 rounded-md flex-shrink-0">
            {isUploading ? (
              <CloudUpload className="h-4 w-4 animate-pulse" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-white truncate">
              {isUploading
                ? "Uploading..."
                : fileName
                ? trimFileName(fileName)
                : "Upload audio"}
            </div>
            {!isUploading && !fileName && (
              <div className="text-xs text-neutral-400 truncate">
                Add music to queue
              </div>
            )}
          </div>
        </div>
      </label>

      <input
        id="audio-upload"
        type="file"
        accept="audio/*"
        onChange={onInputChange}
        disabled={isUploading}
        className="hidden"
      />
    </div>
  );
};
