"use client";

import { motion } from "framer-motion";

const petals = [
  {
    left: "8%",
    delay: 0,
    duration: 16,
    size: 18,
  },
  {
    left: "20%",
    delay: 3,
    duration: 20,
    size: 22,
  },
  {
    left: "35%",
    delay: 5,
    duration: 18,
    size: 14,
  },
  {
    left: "48%",
    delay: 1,
    duration: 22,
    size: 20,
  },
  {
    left: "63%",
    delay: 7,
    duration: 17,
    size: 16,
  },
  {
    left: "76%",
    delay: 2,
    duration: 21,
    size: 24,
  },
  {
    left: "90%",
    delay: 4,
    duration: 19,
    size: 18,
  },
];

export default function FloatingPetals() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {petals.map((petal, index) => (
        <motion.div
          key={index}
          className="absolute opacity-30"
          style={{
            left: petal.left,
            top: "-10%",
            fontSize: `${petal.size}px`,
          }}
          animate={{
            y: ["0vh", "120vh"],
            x: [0, -25, 20, -15, 0],
            rotate: [0, 90, 180, 270, 360],
            opacity: [0, 0.35, 0.25, 0.35, 0],
          }}
          transition={{
            duration: petal.duration,
            repeat: Infinity,
            ease: "linear",
            delay: petal.delay,
          }}
        >
          ❀
        </motion.div>
      ))}
    </div>
  );
}
