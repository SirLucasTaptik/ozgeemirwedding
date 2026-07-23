"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const scroll = () =>
      setShow(window.scrollY > 500);

    window.addEventListener("scroll", scroll);

    return () =>
      window.removeEventListener("scroll", scroll);
  }, []);

  if (!show) return null;

  return (
    <motion.button
      initial={{
        opacity: 0,
        scale: .8,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      whileHover={{
        scale: 1.1,
      }}
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      }
      className="fixed bottom-28 right-8 z-[999] flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-xl backdrop-blur"
    >
      ↑
    </motion.button>
  );
}
