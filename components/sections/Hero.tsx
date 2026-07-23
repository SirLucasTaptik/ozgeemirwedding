"use client";

import { motion } from "framer-motion";

import { wedding } from "@/lib/constants";

import Background from "@/components/effects/Background";
import VideoBackground from "@/components/effects/VideoBackground";
import Glow from "@/components/effects/Glow";
import Noise from "@/components/effects/Noise";
import Particles from "@/components/effects/Particles";
import FloatingPetals from "@/components/effects/FloatingPetals";

import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Calendar from "@/components/Calendar";

export default function Hero() {
  const formattedDate = wedding.date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Section className="relative min-h-screen overflow-hidden flex items-center justify-center">

      <Background />

      <VideoBackground />

      <Glow />

      <Noise />

      <Particles />

      <FloatingPetals />

      <Container>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="relative z-20 text-center"
        >

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .2 }}
            className="uppercase tracking-[10px] text-[#B89B5E] text-sm"
          >
            WE ARE GETTING MARRIED
          </motion.p>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 220 }}
            transition={{ delay: .4 }}
            className="mx-auto mt-8 h-px bg-gradient-to-r from-transparent via-[#B89B5E] to-transparent"
          />

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .6 }}
            className="mt-12 font-serif text-6xl md:text-[120px] font-light tracking-[.35em] ml-[.35em]"
          >
            {wedding.bride.toUpperCase()}
          </motion.h1>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: .9 }}
            className="my-8 text-4xl text-[#B89B5E]"
          >
            ♡
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="font-serif text-5xl md:text-[105px] font-light tracking-[.35em] ml-[.35em]"
          >
            {wedding.groom.toUpperCase()}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="mt-10 uppercase tracking-[6px] text-[#B89B5E]"
          >
            {formattedDate}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="mt-3 text-neutral-600 tracking-[4px] uppercase"
          >
            Dubai • United Arab Emirates
          </motion.p>

          {/* Mini Countdown Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 }}
            className="glass mx-auto mt-14 inline-flex flex-wrap items-center justify-center gap-8 rounded-full px-10 py-6"
          >
            {[
              { value: "112", label: "Days" },
              { value: "08", label: "Hours" },
              { value: "13", label: "Minutes" },
              { value: "05", label: "Seconds" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="font-serif text-4xl gold">
                  {item.value}
                </p>

                <p className="mt-2 text-[11px] uppercase tracking-[4px] text-neutral-500">
                  {item.label}
                </p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
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

          <Calendar />

        </motion.div>

      </Container>

      <motion.div
        animate={{
          y: [0, 12, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 2.5,
        }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center z-20"
      >
        <p className="uppercase tracking-[6px] text-[#B89B5E] text-xs">
          Discover
        </p>

        <div className="mt-2 text-xl text-[#B89B5E]">
          ↓
        </div>
      </motion.div>

    </Section>
  );
}
