import { useEffect } from "react";
import { useGlobalStore } from "@/store/global";

export const useAudioVisualizer = (canvasId: string) => {
  useEffect(() => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const { analyser } = useGlobalStore.getState().audioPlayer ?? {};
    if (!analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    let animationFrameId: number;
    let time = 0;
    let angleOffset = 0;

    const particles: any[] = [];

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      analyser.getByteFrequencyData(dataArray);

      time += 0.05;
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      spiralBars();
    //   updateParticles();
    };

    const spiralBars = () => {
      const barWidth = 2;
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] * 0.7;
        const hue = (i * 3 + barHeight + time * 20) % 360;

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(i * 0.1 + angleOffset);
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
    };

    const createParticle = (hue: number) => ({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      size: Math.random() * 4 + 1,
      life: 2,
      hue,
    });
    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, [canvasId]);
};
