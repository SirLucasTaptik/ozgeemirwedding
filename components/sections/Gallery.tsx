"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Heading from "@/components/ui/Heading";

import { wedding } from "@/lib/constants";

export default function Gallery() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Section id="gallery" className="bg-[#FCFBF8]">
      <Container>
        <Heading
          eyebrow="Gallery"
          title="Moments Before Forever"
          subtitle="A few beautiful memories before our biggest day."
        />

        <div className="mt-20 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {wedding.gallery.map((image, index) => (
            <motion.button
              key={image}
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.08,
              }}
              whileHover={{
                y: -8,
                scale: 1.02,
              }}
              onClick={() => setSelected(image)}
              className="group relative aspect-[4/5] overflow-hidden rounded-[30px] shadow-xl"
            >
              <img
                src={image}
                alt=""
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition group-hover:opacity-100" />
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-8 backdrop-blur-lg"
            >
              <motion.img
                layoutId={selected}
                src={selected}
                alt=""
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                transition={{
                  duration: 0.3,
                }}
                className="max-h-[90vh] max-w-[90vw] rounded-3xl shadow-2xl"
              />

              <button
                className="absolute right-8 top-8 text-4xl text-white"
                onClick={() => setSelected(null)}
              >
                ×
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </Section>
  );
}
