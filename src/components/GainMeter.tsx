import { useGlobalStore } from "@/store/global";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const GainMeter = () => {
  const getCurrentGainValue = useGlobalStore(
    (state) => state.getCurrentGainValue
  );
  const isEnabled = useGlobalStore((state) => state.isSpatialAudioEnabled);
  const [gainValue, setGainValue] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentGain = getCurrentGainValue();
      setGainValue(currentGain);
    }, 50);
    return () => clearInterval(intervalId);
  }, [getCurrentGainValue]);

  const barWidthPercent = Math.min(100, Math.max(0, gainValue * 100));
  const gainPercentage = Math.round(gainValue * 100);

  return (
    <div className="flex items-center w-full">
      {/* Percentage */}
      <div className="text-xs font-mono text-neutral-500 pr-2.5 w-[40px] text-right">
        {gainPercentage}%
      </div>

      {/* Meter Track */}
      <div className="relative h-3 w-full rounded-full overflow-hidden bg-neutral-900 border border-neutral-700 shadow-inner">
        {/* Meter Fill */}
        <motion.div
          className="absolute h-full rounded-full shadow-md"
          initial={{ width: 0 }}
          animate={{
            width: `${barWidthPercent}%`,
            opacity: isEnabled ? 1 : 0.5,
          }}
          transition={{
            duration: 0.08,
            ease: "easeOut",
          }}
          style={{
            background: `linear-gradient(to right, #22c55e, #4ade80, #86efac, #facc15, #f87171)`,
            boxShadow: isEnabled
              ? `0 0 6px rgba(34, 197, 94, 0.4), 0 0 12px rgba(34, 197, 94, 0.3)`
              : "none",
          }}
        />
      </div>
    </div>
  );
};
