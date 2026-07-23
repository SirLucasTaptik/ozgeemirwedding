"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";

export default function RSVP() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);

    const form = new FormData(e.currentTarget);

    const payload = {
      fullName: form.get("fullName"),
      attendance: form.get("attendance"),
      guests: form.get("guests"),
      dietary: form.get("dietary"),
      message: form.get("message"),
    };

    // TODO:
    // Google Sheets / Supabase / API Route

    console.log(payload);

    await new Promise((r) => setTimeout(r, 1200));

    setLoading(false);
    setSuccess(true);

    e.currentTarget.reset();
  }

  return (
    <Section id="rsvp">
      <Container>
        <Heading
          eyebrow="RSVP"
          title="Reserve Your Seat"
          subtitle="Kindly let us know if you will be joining our celebration."
        />

        <motion.form
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .8 }}
          onSubmit={handleSubmit}
          className="glass mx-auto mt-20 max-w-3xl space-y-8 p-10"
        >
          <div>
            <label className="mb-3 block text-sm uppercase tracking-[3px] text-neutral-500">
              Full Name
            </label>

            <input
              name="fullName"
              required
              className="w-full rounded-2xl border border-neutral-200 bg-white px-6 py-5 outline-none transition focus:border-[#B89B5E]"
            />
          </div>

          <div>
            <label className="mb-3 block text-sm uppercase tracking-[3px] text-neutral-500">
              Will you attend?
            </label>

            <select
              name="attendance"
              required
              className="w-full rounded-2xl border border-neutral-200 bg-white px-6 py-5 outline-none transition focus:border-[#B89B5E]"
            >
              <option>Yes, with pleasure</option>
              <option>Unfortunately, I can't attend</option>
            </select>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <label className="mb-3 block text-sm uppercase tracking-[3px] text-neutral-500">
                Number of Guests
              </label>

              <input
                type="number"
                min={1}
                max={10}
                defaultValue={1}
                name="guests"
                className="w-full rounded-2xl border border-neutral-200 bg-white px-6 py-5 outline-none transition focus:border-[#B89B5E]"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm uppercase tracking-[3px] text-neutral-500">
                Dietary Preference
              </label>

              <input
                name="dietary"
                placeholder="Optional"
                className="w-full rounded-2xl border border-neutral-200 bg-white px-6 py-5 outline-none transition focus:border-[#B89B5E]"
              />
            </div>
          </div>

          <div>
            <label className="mb-3 block text-sm uppercase tracking-[3px] text-neutral-500">
              Message
            </label>

            <textarea
              rows={5}
              name="message"
              placeholder="Leave us a lovely note..."
              className="w-full rounded-2xl border border-neutral-200 bg-white px-6 py-5 outline-none transition focus:border-[#B89B5E]"
            />
          </div>

          <div className="flex justify-center pt-4">
            <Button>
              {loading ? "Sending..." : "Submit RSVP"}
            </Button>
          </div>

          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl bg-[#B89B5E]/10 p-5 text-center text-[#8B6A32]"
            >
              Thank you for your RSVP. We can't wait to celebrate with you!
            </motion.div>
          )}
        </motion.form>
      </Container>
    </Section>
  );
}
