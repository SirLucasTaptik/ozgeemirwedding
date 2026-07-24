"use client";

import { motion } from "framer-motion";

import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

import { wedding } from "@/lib/constants";

export default function Hero() {
  return (
    <Section
      id="hero"
      className="relative min-h-screen overflow-hidden bg-[#FCFBF8]"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/hero.jpg')",
        }}
      />

      <div className="absolute inset-0 bg-white/55" />

      <Container className="relative z-10 flex min-h-screen items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <p className="uppercase tracking-[8px] text-[#B89B5E]">
            Wedding Invitation
          </p>

          <h1 className="mt-6 font-serif text-6xl md:text-8xl">
            {wedding.bride}
            <span className="mx-4 text-[#B89B5E]">&amp;</span>
            {wedding.groom}
          </h1>

          <p className="mt-8 text-lg text-neutral-700">
            20 September 2026
          </p>

          <p className="mt-2 text-neutral-600">
            İstanbul
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Button href="#rsvp">
              RSVP
            </Button>

            <Button
              href="#venue"
              variant="secondary"
            >
              Venue
            </Button>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
