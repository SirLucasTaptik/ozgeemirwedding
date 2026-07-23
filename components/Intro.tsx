"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { wedding } from "@/lib/constants";

export default function Intro() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 4200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          exit={{
            opacity: 0,
            transition: {
              duration: 1,
            },
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#111]"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 180 }}
              transition={{
                duration: 1,
              }}
              className="mx-auto h-px bg-gradient-to-r from-transparent via-[#D8BF86] to-transparent"
            />

            <motion.h1
              initial={{
                opacity: 0,
                letterSpacing: ".8em",
              }}
              animate={{
                opacity: 1,
                letterSpacing: ".35em",
              }}
              transition={{
                delay: .8,
                duration: 1,
              }}
              className="mt-12 ml-[.35em] font-serif text-6xl font-light uppercase tracking-[.35em] text-white md:text-8xl"
            >
              {wedding.bride}
            </motion.h1>

            <motion.div
              initial={{
                scale: 0,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              transition={{
                delay: 1.7,
              }}
              className="my-8 text-4xl text-[#D8BF86]"
            >
              ♡
            </motion.div>

            <motion.h2
              initial={{
                opacity: 0,
                letterSpacing: ".8em",
              }}
              animate={{
                opacity: 1,
                letterSpacing: ".35em",
              }}
              transition={{
                delay: 2.1,
                duration: 1,
              }}
              className="ml-[.35em] font-serif text-5xl font-light uppercase tracking-[.35em] text-white md:text-7xl"
            >
              {wedding.groom}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 3.2,
              }}
              className="mt-12 text-xs uppercase tracking-[8px] text-[#D8BF86]"
            >
              Wedding Invitation
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
