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
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(devicePixelRatio, devicePixelRatio);


    // Analyser config
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // State
    let angleOffset = 0;
    let time = 0;
    const particles: Particle[] = [];

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      life: number;
      hue: number;
    }

    const createParticle = (hue: number): Particle => ({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      size: Math.random() * 4 + 1,
      life: 2,
      hue,
    });

    const updateParticles=()=>{
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.life / 100})`;
        ctx.fill();
        if (p.life <= 0) particles.splice(i, 1);
      }
    }

    const spiralBars = () => {
      let barWidth = 2;
      for (let i = 0; i < bufferLength; i++) {
        let barHeight = dataArray[i]*0.7;
        let hue = (i * 3 + barHeight + time * 20) % 360;

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((i * 0.1) + angleOffset);
        ctx.shadowBlur = 20;
        ctx.shadowColor = `hsl(${hue}, 100%, 70%)`;
        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        ctx.fillRect(50 + barHeight / 2, 0, barWidth, barHeight);
        ctx.restore();

        if (barHeight > 100) {
          particles.push(createParticle(hue));
        }
      }
      angleOffset += 0.005;
    }

    const animate = () => {
      requestAnimationFrame(animate);
      analyser.getByteFrequencyData(dataArray);
      const waveformArray = new Uint8Array(bufferLength);
      analyser.getByteTimeDomainData(waveformArray);
      time += 0.05;
      // ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      spiralBars();
      updateParticles(); // Always update particles
};


    animate();

    return () => {
    };
  }, [analyser, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      className="flex w-full h-full"
    />
  );
};
