"use client";

import { motion } from "framer-motion";
import { wedding } from "@/lib/constants";

export default function Hero() {
  const formattedDate = wedding.date.toLocaleDateString("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FCFBF8]"
    >
      {/* Arka Plan */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff_0%,#faf8f3_45%,#f5f1ea_100%)]" />

      {/* Altın Parlama */}
      <div className="absolute left-1/2 top-24 h-96 w-96 -translate-x-1/2 rounded-full bg-[#D8BF86]/20 blur-[120px]" />

      {/* Dekoratif Halkalar */}
      <div className="absolute h-[700px] w-[700px] rounded-full border border-[#d8bf86]/20" />
      <div className="absolute h-[520px] w-[520px] rounded-full border border-[#d8bf86]/30" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center"
      >
        <p className="mb-8 text-sm uppercase tracking-[8px] text-[#B89B5E]">
          Düğün Davetiyesi
        </p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="font-serif text-6xl font-light md:text-8xl"
        >
          {wedding.bride}
        </motion.h1>

        <div className="my-6 text-3xl text-[#B89B5E]">&amp;</div>

        <motion.h2
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
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

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <a
            href="#rsvp"
            className="rounded-full bg-[#B89B5E] px-8 py-4 text-white transition hover:opacity-90"
          >
            Katılım Durumunu Bildir
          </a>

          <a
            href={wedding.googleMaps}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[#B89B5E] px-8 py-4 text-[#B89B5E] transition hover:bg-[#B89B5E] hover:text-white"
          >
            Konumu Aç
          </a>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{
          repeat: Infinity,
          duration: 2,
        }}
        className="absolute bottom-10 flex flex-col items-center text-[#B89B5E]"
      >
        <span className="mb-2 text-xs uppercase tracking-[4px]">
          Aşağı Kaydır
        </span>

        <span className="text-xl">↓</span>
      </motion.div>
    </section>
  );
}
