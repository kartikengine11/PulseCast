import axios from "axios";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const trimFileName = (fileName: string) => {
  // Remove file extensions like .mp3, .wav, etc.
  return fileName.replace(/\.[^/.]+$/, "");
};

export function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "00:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}


export async function fetchAudio(audio_url:string) {
  // console.log("inside fetchAudio");
  try {
    const url = await axios.get(audio_url);
    const response = await axios.get(audio_url, {
      responseType: 'arraybuffer',
    });

    console.log("after fetch, content length:", response.data);
    const audioBlob = new Blob([response.data], { type: "audio/mp3" }); // or appropriate MIME type
    return audioBlob;
  } 
  catch (error) {
    console.error("Error fetching audio:", error);
    return null;
  }
}