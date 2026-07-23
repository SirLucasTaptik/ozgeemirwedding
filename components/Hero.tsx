"use client";

import { motion } from "framer-motion";
import { wedding } from "@/lib/constants";

export default function Hero() {
  const formattedDate = wedding.date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff_0%,#faf8f3_45%,#f5f1ea_100%)]" />

      {/* Gold Glow */}
      <div className="absolute left-1/2 top-24 h-96 w-96 -translate-x-1/2 rounded-full bg-[#D8BF86]/20 blur-[120px]" />

      {/* Decorative Circles */}
      <div className="absolute h-[700px] w-[700px] rounded-full border border-[#d8bf86]/20" />
      <div className="absolute h-[520px] w-[520px] rounded-full border border-[#d8bf86]/30" />

      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="relative z-10 flex flex-col items-center px-6 text-center"
      >
        <p className="mb-8 text-sm uppercase tracking-[8px] text-[#B89B5E]">
          Wedding Invitation
        </p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="font-serif text-7xl font-light md:text-9xl"
        >
          {wedding.bride}
        </motion.h1>

        <div className="my-6 text-3xl text-[#B89B5E]">
          ✦
        </div>

        <motion.h2
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="font-serif text-6xl font-light md:text-8xl"
        >
          {wedding.groom}
        </motion.h2>

        <p className="mt-10 max-w-2xl text-lg leading-8 text-gray-600">
          {wedding.heroTitle}
        </p>

        <p className="mt-8 text-sm uppercase tracking-[5px] text-[#B89B5E]">
          {formattedDate}
        </p>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-5">
          <a href="#rsvp" className="btn-gold">
            RSVP Now
          </a>

          <a
            href={wedding.googleMaps}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            View Location
          </a>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{
          repeat: Infinity,
          duration: 2,
        }}
        className="absolute bottom-10 flex flex-col items-center text-[#B89B5E]"
      >
        <span className="mb-2 text-xs uppercase tracking-[4px]">
          Scroll
        </span>

        <span className="text-xl">↓</span>
      </motion.div>
    </section>
  );
}
