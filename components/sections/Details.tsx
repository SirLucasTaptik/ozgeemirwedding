"use client";

import { motion } from "framer-motion";

import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Heading from "@/components/ui/Heading";

import { wedding } from "@/lib/constants";

export default function Details() {
  return (
    <Section
      id="details"
      className="bg-gradient-to-b from-white to-[#faf7f2]"
    >
      <Container>
        <Heading
          eyebrow="Wedding Details"
          title="Everything You Need to Know"
          subtitle="A few helpful details before celebrating with us."
        />

        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {wedding.details.map((item, index) => (
            <motion.div
              key={item.title}
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
                duration: 0.6,
              }}
              whileHover={{
                y: -8,
              }}
              className="glass rounded-[32px] p-10"
            >
              <div className="mb-6 text-4xl">
                {item.icon}
              </div>

              <h3 className="font-serif text-3xl">
                {item.title}
              </h3>

              <p className="mt-5 leading-8 text-neutral-600">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
