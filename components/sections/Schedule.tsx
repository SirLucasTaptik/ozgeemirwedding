"use client";

import { motion } from "framer-motion";

import { wedding } from "@/lib/constants";

import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Heading from "@/components/ui/Heading";

export default function Schedule() {
  return (
    <Section
      id="schedule"
      className="bg-white"
    >
      <Container>
        <Heading
          eyebrow="Wedding Day"
          title="Celebration Timeline"
          subtitle="A day filled with love, laughter and unforgettable memories."
        />

        <div className="relative mx-auto mt-20 max-w-3xl">

          {/* Timeline Line */}
          <div className="absolute left-6 top-0 h-full w-px bg-gradient-to-b from-[#E5CF99] via-[#B89B5E] to-transparent" />

          <div className="space-y-10">

            {wedding.schedule.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.08,
                }}
                className="relative flex gap-8"
              >
                {/* Timeline Dot */}
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#E5CF99] to-[#B89B5E] text-white shadow-lg">
                  ✦
                </div>

                {/* Card */}
                <div className="glass flex-1 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

                    <div>
                      <h3 className="font-serif text-3xl">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-neutral-600 leading-7">
                        {item.description}
                      </p>
                    </div>

                    <div className="shrink-0 rounded-full bg-[#B89B5E]/10 px-5 py-3 text-[#8B6A32] font-semibold tracking-wider">
                      {item.time}
                    </div>

                  </div>
                </div>
              </motion.div>
            ))}

          </div>

        </div>
      </Container>
    </Section>
  );
}
