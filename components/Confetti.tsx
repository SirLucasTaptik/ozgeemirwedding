"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type ConfettiProps = {
  trigger: boolean;
  duration?: number;
};

type Piece = {
  id: number;
  left: number;
  delay: number;
  duration: number;
  rotate: number;
  size: number;
  color: string;
};

const COLORS = [
  "#B89B5E",
  "#E5CF99",
  "#F6E7C1",
  "#FFFFFF",
  "#D8BF86",
];

export default function Confetti({
  trigger,
  duration = 5000,
}: ConfettiProps) {
  const [show, setShow] = useState(false);

  const [pieces] = useState<Piece[]>(
    Array.from({ length: 140 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 1.5,
      duration: 3 + Math.random() * 4,
      rotate: Math.random() * 720,
      size: 6 + Math.random() * 12,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }))
  );

  useEffect(() => {
    if (!trigger) return;

    setShow(true);

    const timer = setTimeout(() => {
      setShow(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [trigger, duration]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none fixed inset-0 z-[99998] overflow-hidden"
        >
          {pieces.map((piece) => (
            <motion.span
              key={piece.id}
              initial={{
                x: `${piece.left}vw`,
                y: "-10vh",
                rotate: 0,
                opacity: 1,
              }}
              animate={{
                y: "110vh",
                x: [
                  `${piece.left}vw`,
                  `${piece.left - 4 + Math.random() * 8}vw`,
                  `${piece.left}vw`,
                ],
                rotate: piece.rotate,
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: piece.duration,
                delay: piece.delay,
                ease: "easeOut",
              }}
              style={{
                width: piece.size,
                height: piece.size * 0.55,
                background: piece.color,
                borderRadius: "2px",
                position: "absolute",
                left: 0,
                top: 0,
                boxShadow: "0 0 10px rgba(255,255,255,.3)",
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
