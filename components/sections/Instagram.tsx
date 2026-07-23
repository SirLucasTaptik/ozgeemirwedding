"use client";

import { motion } from "framer-motion";

import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

import { wedding } from "@/lib/constants";

export default function Instagram() {
  return (
    <Section
      id="instagram"
      className="relative overflow-hidden bg-gradient-to-b from-[#faf7f2] to-white"
    >
      {/* Background Glow */}
      <div className="absolute left-1/2 top-0 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-[#D8BF86]/10 blur-[180px]" />

      <Container>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 mx-auto max-w-5xl rounded-[40px] border border-[#E8D9B5] bg-white/70 p-12 text-center shadow-[0_30px_80px_rgba(0,0,0,.06)] backdrop-blur-xl md:p-20"
        >
          <p className="text-xs uppercase tracking-[8px] text-[#B89B5E]">
            Share The Love
          </p>

          <h2 className="mt-6 font-serif text-5xl md:text-7xl">
            {wedding.hashtag}
          </h2>

          <div className="mx-auto mt-8 h-px w-40 bg-gradient-to-r from-transparent via-[#B89B5E] to-transparent" />

          <p className="mx-auto mt-10 max-w-2xl text-lg leading-8 text-neutral-600">
            Capture your favorite moments and share them using our wedding
            hashtag. We can't wait to relive every smile, every dance and every
            unforgettable memory through your eyes.
          </p>

          <div className="mt-14 flex flex-wrap justify-center gap-5">
            <Button
              href={`https://www.instagram.com/explore/tags/${wedding.hashtag.replace(
                "#",
                ""
              )}`}
              external
            >
              View Hashtag
            </Button>

            <Button
              href="https://instagram.com"
              external
              variant="outline"
            >
              Open Instagram
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-4 md:grid-cols-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <motion.div
                key={index}
                whileHover={{
                  scale: 1.05,
                }}
                className="aspect-square rounded-2xl border border-dashed border-[#D9C089] bg-gradient-to-br from-[#FFFDF8] to-[#F7F2E8]"
              />
            ))}
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
