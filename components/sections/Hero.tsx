"use client";

import { motion } from "framer-motion";

import { wedding } from "@/lib/constants";

import Background from "@/components/effects/Background";
import Glow from "@/components/effects/Glow";
import Noise from "@/components/effects/Noise";
import Particles from "@/components/effects/Particles";
import FloatingPetals from "@/components/effects/FloatingPetals";

import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function Hero() {
  const formattedDate = wedding.date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Section className="min-h-screen flex items-center justify-center overflow-hidden">

      <Background />
      <Glow />
      <Noise />
      <Particles />
      <FloatingPetals />

      <Container>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="relative z-20 flex flex-col items-center text-center"
        >

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .2 }}
            className="uppercase tracking-[10px] text-[#B89B5E] text-sm"
          >
            Wedding Invitation
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .4 }}
            className="mt-12 text-7xl md:text-[120px] font-serif font-light tracking-[.35em] ml-[.35em]"
          >
            {wedding.bride.toUpperCase()}
          </motion.h1>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: .7 }}
            className="my-10 text-4xl text-[#B89B5E]"
          >
            ♡
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .9 }}
            className="text-6xl md:text-[105px] font-serif font-light tracking-[.35em] ml-[.35em]"
          >
            {wedding.groom.toUpperCase()}
          </motion.h2>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 180 }}
            transition={{ delay: 1.2 }}
            className="mt-16 h-px bg-gradient-to-r from-transparent via-[#B89B5E] to-transparent"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="mt-10 max-w-xl text-lg leading-8 text-neutral-600"
          >
            {wedding.heroTitle}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="mt-10 uppercase tracking-[6px] text-[#B89B5E]"
          >
            {formattedDate}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 }}
            className="mt-16 flex flex-wrap justify-center gap-5"
          >
            <Button href="#rsvp">
              Reserve Your Seat
            </Button>

            <Button
              href={wedding.googleMaps}
              external
              variant="outline"
            >
              View Venue
            </Button>
          </motion.div>

        </motion.div>

      </Container>

      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{
          repeat: Infinity,
          duration: 2.5,
        }}
        className="absolute bottom-10 left-1/2 z-20 -translate-x-1/2 text-center"
      >
        <p className="text-[10px] tracking-[6px] uppercase text-[#B89B5E]">
          Scroll
        </p>

        <div className="mt-2 text-xl text-[#B89B5E]">
          ↓
        </div>
      </motion.div>

    </Section>
  );
}
