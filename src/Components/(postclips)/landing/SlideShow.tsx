import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type SlideShowProps = {
  images: string[];
  onSlideChange: () => void;
};

export const SlideShow: React.FC<SlideShowProps> = ({ images, onSlideChange }) => {
  const [centerIndex, setCenterIndex] = useState(3); // Start in middle
  const [disappeared, setDisappeared] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Trigger animation 3 times only
  useEffect(() => {
    if (disappeared.length >= 3 || isAnimating) return;

    const timeout = setTimeout(() => {
      setIsAnimating(true);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [disappeared, isAnimating]);

  // After animation finishes, mark it as disappeared and move center
  const handleExitComplete = () => {
    setDisappeared((prev) => [...prev, centerIndex]);
    setCenterIndex((prev) => prev + 1);
    setIsAnimating(false);
    onSlideChange();
  };

  return (
    <div className="slider_rowWrapper">
      {images.map((src, i) => {
        const isDisappeared = disappeared.includes(i);
        const isCenter = i === centerIndex;

        if (isDisappeared && !isCenter) return null;

        return (
          <div key={i} className={`slider_rowItem ${isCenter ? "slider_rowItem--center" : ""}`}>
            <AnimatePresence>
              {isCenter && isAnimating ? (
                <motion.img
                  key={`center-${i}`}
                  src={src}
                  alt={`Slide ${i}`}
                  className="slider_image"
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 0, y: -600 }}
                  exit={{}}
                  transition={{ duration: 0.8 }}
                  onAnimationComplete={handleExitComplete}
                />
              ) : !isDisappeared ? (
                <img src={src} alt={`Slide ${i}`} className="slider_image" />
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
