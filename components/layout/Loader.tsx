"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { wedding } from "@/lib/constants";

export default function Loader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: {
              duration: 0.8,
            },
          }}
          className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden bg-[#FCFBF8]"
        >
          {/* Background Glow */}
          <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D8BF86]/15 blur-[180px]" />

          {/* Rings */}
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              repeat: Infinity,
              duration: 18,
              ease: "linear",
            }}
            className="absolute h-[320px] w-[320px] rounded-full border border-[#D8BF86]/20"
          />

          <motion.div
            animate={{
              rotate: -360,
            }}
            transition={{
              repeat: Infinity,
              duration: 24,
              ease: "linear",
            }}
            className="absolute h-[250px] w-[250px] rounded-full border border-[#D8BF86]/10"
          />

          <div className="relative z-10 text-center">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 1,
              }}
              className="mb-6 text-xs uppercase tracking-[8px] text-[#B89B5E]"
            >
              Wedding Invitation
            </motion.p>

            <motion.h1
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.3,
              }}
              className="font-serif text-6xl font-light md:text-8xl"
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
                delay: 0.7,
              }}
              className="my-5 text-3xl text-[#B89B5E]"
            >
              ♡
            </motion.div>

            <motion.h2
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 1,
              }}
              className="font-serif text-5xl font-light md:text-7xl"
            >
              {wedding.groom}
            </motion.h2>

            <motion.div
              initial={{
                width: 0,
              }}
              animate={{
                width: 180,
              }}
              transition={{
                delay: 1.4,
                duration: 0.8,
              }}
              className="mx-auto mt-10 h-px bg-gradient-to-r from-transparent via-[#B89B5E] to-transparent"
            />

            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 1.8,
              }}
              className="mt-12 flex justify-center"
            >
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      delay: i * 0.2,
                      duration: 0.8,
                    }}
                    className="h-2 w-2 rounded-full bg-[#B89B5E]"
                  />
                ))}
              </div>
            </motion.div>

            <motion.p
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 2,
              }}
              className="mt-8 text-xs tracking-[5px] uppercase text-neutral-400"
            >
              Loading Experience...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
