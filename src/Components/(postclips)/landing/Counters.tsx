import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, animate } from "framer-motion";

type CountersProps = {
  step: number;
};

export const Counters: React.FC<CountersProps> = ({ step }) => {
  const [earnings, setEarnings] = useState(1200);
  const [clips, setClips] = useState(280);
  const [displayEarnings, setDisplayEarnings] = useState(earnings);
  const [displayClips, setDisplayClips] = useState(clips);

  const earningsMotion = useMotionValue(earnings);
  const clipsMotion = useMotionValue(clips);

  useMotionValueEvent(earningsMotion, "change", (latest) => {
    setDisplayEarnings(Math.floor(latest));
  });

  useMotionValueEvent(clipsMotion, "change", (latest) => {
    setDisplayClips(Math.floor(latest));
  });

  useEffect(() => {
    const newEarnings = earnings + Math.floor(Math.random() * 400 + 1);
    const newClips = clips + 1;

    animate(earningsMotion, newEarnings, { duration: 0.5 });
    animate(clipsMotion, newClips, { duration: 0.5 });

    setEarnings(newEarnings);
    setClips(newClips);
  }, [step]);

  return (
    <div className="slider_counters">
      <div className="earnings-stat-box chipped-top-right slider_counterItem">
        <h2 className="slider_counterLabel">Total Earnings</h2>
        <motion.p className="slider_counterValue">
          ${displayEarnings}
        </motion.p>
      </div>
      <div className="earnings-stat-box chipped-top-right slider_counterItem">
        <h2 className="slider_counterLabel">Clips Posted</h2>
        <motion.p className="slider_counterValue">
          {displayClips}
        </motion.p>
      </div>
    </div>
  );
};
