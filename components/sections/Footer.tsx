"use client";

import { motion } from "framer-motion";

import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";

import { wedding } from "@/lib/constants";

export default function Footer() {
  const year = wedding.date.getFullYear();

  return (
    <Section className="pb-16 pt-24">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-[40px] border border-[#E8D9B5] bg-white/70 px-8 py-20 text-center shadow-[0_25px_70px_rgba(0,0,0,.06)] backdrop-blur-xl"
        >
          {/* Glow */}
          <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-[#D8BF86]/10 blur-[120px]" />

          <div className="relative z-10">
            <p className="text-xs uppercase tracking-[8px] text-[#B89B5E]">
              Thank You
            </p>

            <h2 className="mt-6 font-serif text-5xl md:text-7xl font-light">
              {wedding.bride}
            </h2>

            <div className="my-6 text-3xl text-[#B89B5E]">
              ♡
            </div>

            <h3 className="font-serif text-5xl md:text-7xl font-light">
              {wedding.groom}
            </h3>

            <div className="mx-auto mt-10 h-px w-40 bg-gradient-to-r from-transparent via-[#B89B5E] to-transparent" />

            <p className="mt-10 text-lg leading-8 text-neutral-600">
              Thank you for being part of our story.
              <br />
              We look forward to celebrating this unforgettable day together.
            </p>

            <p className="mt-12 text-[#B89B5E] tracking-[6px] uppercase text-sm">
              {wedding.hashtag}
            </p>

            <div className="mt-14 flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-[#D9C089]" />
              <span className="text-[#B89B5E] text-xl">✦</span>
              <span className="h-px w-10 bg-[#D9C089]" />
            </div>

            <p className="mt-10 text-sm text-neutral-400">
              © {year} {wedding.bride} & {wedding.groom}
            </p>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
