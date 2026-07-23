"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [mounted, setMounted] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function toggleMusic() {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  }

  if (!mounted) return null;

  return (
    <>
      <audio
        ref={audioRef}
        loop
        preload="auto"
      >
        <source src="/music/romantic.mp3" type="audio/mpeg" />
      </audio>

      <motion.button
        whileHover={{
          scale: 1.06,
          y: -2,
        }}
        whileTap={{
          scale: 0.95,
        }}
        onClick={toggleMusic}
        className="fixed bottom-8 right-8 z-[999] flex h-16 w-16 items-center justify-center rounded-full border border-[#E6D6AE] bg-white/80 shadow-2xl backdrop-blur-xl"
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={playing ? "pause" : "play"}
            initial={{
              opacity: 0,
              rotate: -20,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              rotate: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              rotate: 20,
              scale: 0.8,
            }}
            transition={{
              duration: 0.2,
            }}
            className="text-2xl"
          >
            {playing ? "❚❚" : "♫"}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </>
  );
}
