"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import Confetti from "@/components/Confetti";

type RSVPData = {
  fullName: string;
  attendance: string;
  guests: number;
  dietary: string;
  message: string;
};

export default function RSVP() {
  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const [celebrate, setCelebrate] = useState(false);

  const [form, setForm] = useState<RSVPData>({
    fullName: "",
    attendance: "Yes",
    guests: 1,
    dietary: "",
    message: "",
  });

  function updateField(
    key: keyof RSVPData,
    value: string | number
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);

    try {
            const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("RSVP failed.");
      }

      setSuccess(true);

      setCelebrate(true);

      setTimeout(() => {
        setCelebrate(false);
      }, 5000);

      setForm({
        fullName: "",
        attendance: "Yes",
        guests: 1,
        dietary: "",
        message: "",
      });
    } catch (error) {
      console.error(error);

      alert(
        "Something went wrong while sending your RSVP."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Confetti trigger={celebrate} />

      <Section
        id="rsvp"
        className="bg-gradient-to-b from-white to-[#FCFBF8]"
      >
        <Container>

          <Heading
            eyebrow="RSVP"
            title="Reserve Your Seat"
            subtitle="Kindly let us know whether you'll be joining us."
          />

          <motion.form
            initial={{
              opacity: 0,
              y: 40,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: .8,
            }}
            onSubmit={handleSubmit}
            className="glass mx-auto mt-20 max-w-3xl rounded-[36px] p-10 md:p-14"
          >
                        <div className="space-y-8">

              {/* Full Name */}

              <div>
                <label className="mb-3 block text-xs uppercase tracking-[5px] text-neutral-500">
                  Full Name
                </label>

                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) =>
                    updateField("fullName", e.target.value)
                  }
                  placeholder="John Smith"
                  className="w-full rounded-2xl border border-neutral-200 bg-white px-6 py-5 text-lg outline-none transition-all duration-300 focus:border-[#B89B5E] focus:ring-4 focus:ring-[#E5CF99]/30"
                />
              </div>

              {/* Attendance */}

              <div>
                <label className="mb-3 block text-xs uppercase tracking-[5px] text-neutral-500">
                  Will You Attend?
                </label>

                <select
                  value={form.attendance}
                  onChange={(e) =>
                    updateField("attendance", e.target.value)
                  }
                  className="w-full rounded-2xl border border-neutral-200 bg-white px-6 py-5 text-lg outline-none transition-all duration-300 focus:border-[#B89B5E] focus:ring-4 focus:ring-[#E5CF99]/30"
                >
                  <option value="Yes">
                    Yes, I'll be there
                  </option>

                  <option value="No">
                    Unfortunately I can't attend
                  </option>
                </select>
              </div>

              {/* Guests */}

              <div>
                <label className="mb-3 block text-xs uppercase tracking-[5px] text-neutral-500">
                  Number of Guests
                </label>

                <input
                  type="number"
                  min={1}
                  max={10}
                  value={form.guests}
                  onChange={(e) =>
                    updateField(
                      "guests",
                      Number(e.target.value)
                    )
                  }
                  className="w-full rounded-2xl border border-neutral-200 bg-white px-6 py-5 text-lg outline-none transition-all duration-300 focus:border-[#B89B5E] focus:ring-4 focus:ring-[#E5CF99]/30"
                />
              </div>
                                        {/* Dietary Preference */}

              <div>
                <label className="mb-3 block text-xs uppercase tracking-[5px] text-neutral-500">
                  Dietary Preference
                </label>

                <input
                  type="text"
                  value={form.dietary}
                  onChange={(e) =>
                    updateField("dietary", e.target.value)
                  }
                  placeholder="Vegetarian, Vegan, Gluten Free..."
                  className="w-full rounded-2xl border border-neutral-200 bg-white px-6 py-5 text-lg outline-none transition-all duration-300 focus:border-[#B89B5E] focus:ring-4 focus:ring-[#E5CF99]/30"
                />
              </div>

              {/* Message */}

              <div>
                <label className="mb-3 block text-xs uppercase tracking-[5px] text-neutral-500">
                  Leave Us a Message
                </label>

                <textarea
                  rows={5}
                  value={form.message}
                  onChange={(e) =>
                    updateField("message", e.target.value)
                  }
                  placeholder="We can't wait to celebrate with you..."
                  className="w-full resize-none rounded-2xl border border-neutral-200 bg-white px-6 py-5 text-lg outline-none transition-all duration-300 focus:border-[#B89B5E] focus:ring-4 focus:ring-[#E5CF99]/30"
                />

                <p className="mt-3 text-sm text-neutral-400">
                  Share your wishes, a favorite memory, or anything you'd like us to read before the big day.
                </p>
              </div>

            </div>

            <div className="mt-12 flex justify-center">
                            <Button>
                {loading ? "Sending RSVP..." : "Reserve Your Seat"}
              </Button>
            </div>

            {success && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                }}
                className="mt-10 rounded-[28px] border border-[#E5CF99] bg-gradient-to-r from-[#FFFDF8] to-[#FCF8EF] p-8 text-center shadow-lg"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#B89B5E] text-3xl text-white shadow-lg">
                  ✓
                </div>

                <h3 className="mt-6 font-serif text-3xl text-[#8B6A32]">
                  Thank You!
                </h3>

                <p className="mx-auto mt-4 max-w-lg leading-8 text-neutral-600">
                  Your RSVP has been received successfully.
                  <br />
                  We are truly looking forward to celebrating this unforgettable
                  day with you.
                </p>
              </motion.div>
            )}
          </motion.form>

        </Container>
      </Section>
          </>
  );
}
