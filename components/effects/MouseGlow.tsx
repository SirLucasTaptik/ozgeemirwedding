"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function MouseGlow() {
  const [mouse, setMouse] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setMouse({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", move);

    return () =>
      window.removeEventListener("mousemove", move);
  }, []);

  return (
    <motion.div
      animate={{
        x: mouse.x - 250,
        y: mouse.y - 250,
      }}
      transition={{
        type: "spring",
        damping: 30,
        stiffness: 180,
      }}
      className="pointer-events-none fixed z-0 h-[500px] w-[500px] rounded-full bg-[#D8BF86]/10 blur-[120px]"
    />
  );
}
