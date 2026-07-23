"use client";

import { motion } from "framer-motion";

import { wedding } from "@/lib/constants";

import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";

export default function Venue() {
  return (
    <Section
      id="venue"
      className="bg-gradient-to-b from-[#fcfbf8] to-[#f8f4ec]"
    >
      <Container>
        <Heading
          eyebrow="Venue"
          title="Where We'll Say I Do"
          subtitle="We can't wait to celebrate this unforgettable day with you."
        />

        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left */}

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass p-10"
          >
            <p className="uppercase tracking-[6px] text-[#B89B5E] text-xs">
              Wedding Venue
            </p>

            <h3 className="mt-5 font-serif text-5xl">
              {wedding.venue}
            </h3>

            <p className="mt-8 leading-8 text-neutral-600">
              {wedding.address}
            </p>

            <div className="mt-12 flex flex-wrap gap-4">
              <Button
                href={wedding.googleMaps}
                external
              >
                Open in Google Maps
              </Button>

              <Button
                href="#schedule"
                variant="outline"
              >
                View Schedule
              </Button>
            </div>
          </motion.div>

          {/* Right */}

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="overflow-hidden rounded-[36px] shadow-2xl"
          >
            <iframe
              title="Wedding Venue"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                wedding.address
              )}&output=embed`}
              loading="lazy"
              className="h-[520px] w-full border-0"
            />
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
