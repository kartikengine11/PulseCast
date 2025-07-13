"use client";

import { useEffect, useRef, useState } from "react";
import { useGlobalStore } from "@/store/global";

export const AudioVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [analyzer, setAnalyzer] = useState<AnalyserNode | null>(null);

  const audioPlayer = useGlobalStore((state) => state.audioPlayer);
  const isPlaying = useGlobalStore((state) => state.isPlaying);

  useEffect(() => {
    if (!canvasRef.current || !audioPlayer?.audioContext || !audioPlayer?.sourceNode) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const analyserNode = audioPlayer.audioContext.createAnalyser();
    analyserNode.fftSize = 1024;

    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    audioPlayer.sourceNode.connect(analyserNode);
    analyserNode.connect(audioPlayer.audioContext.destination);
    setAnalyzer(analyserNode);

    canvas.width = 500;
    canvas.height = 100;

    const draw = () => {
      if (!ctx || !analyserNode) return;
      requestAnimationFrame(draw);
      analyserNode.getByteFrequencyData(dataArray);

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 2;
        const hue = (i * 4) % 360;
        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };

    draw();

    return () => {
      analyserNode.disconnect();
    };
  }, [audioPlayer?.audioContext, audioPlayer?.sourceNode]);

  return (
    <div className="w-full flex justify-center mt-2">
      <canvas ref={canvasRef} className="rounded-lg shadow-md" />
    </div>
  );
};
