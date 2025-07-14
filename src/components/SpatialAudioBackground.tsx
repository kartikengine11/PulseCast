"use client";

import { useEffect, useRef } from "react";
import { useGlobalStore } from "@/store/global";

export const AudioVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isPlaying = useGlobalStore((state) => state.isPlaying);
  const analyser = useGlobalStore((state) => state.audioPlayer?.analyser);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Set canvas resolution
      canvas.width = width * dpr;
      canvas.height = height * dpr;

      // Set canvas display size
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Reset transform and apply scale for high DPI
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // FFT setup
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    let angleOffset = 0;
    let time = 0;

    const animate = () => {
      requestAnimationFrame(animate);
      analyser.getByteFrequencyData(dataArray);

      time += 0.05;

      // Clear entire canvas
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      // Draw spiral bars centered
      ctx.save();
      ctx.translate(canvas.width / 2 / dpr, canvas.height / 2 / dpr);

      for (let i = 0; i < bufferLength; i++) {
        const value = dataArray[i];
        const barHeight = value * 0.7;
        const hue = (i * 4 + time * 20) % 360;

        ctx.save();
        ctx.rotate(i * 0.1 + angleOffset);
        ctx.fillStyle = `hsl(${hue}, 100%, 60%)`;
        ctx.shadowBlur = 15;
        ctx.shadowColor = `hsl(${hue}, 100%, 60%)`;
        ctx.fillRect(60, 0, 2, barHeight);
        ctx.restore();
      }

      ctx.restore();
      angleOffset += 0.005;
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [analyser, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 block"
      style={{
        width: "100vw",
        height: "100vh",
        zIndex: -1, // Optional: send canvas behind other content
      }}
    />
  );
};
