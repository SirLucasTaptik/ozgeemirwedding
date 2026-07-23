"use client";

import { useEffect, useState } from "react";
import { wedding } from "@/lib/constants";
import { motion } from "framer-motion";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export default function Countdown() {
  const calculate = (): TimeLeft => {
    const difference = wedding.date.getTime() - new Date().getTime();

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [time, setTime] = useState<TimeLeft>(calculate());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(calculate());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const Item = ({
    value,
    label,
  }: {
    value: number;
    label: string;
  }) => (
    <motion.div
      whileHover={{ y: -8 }}
      className="glass flex h-40 w-40 flex-col items-center justify-center"
    >
      <span className="text-6xl font-light gold">
        {String(value).padStart(2, "0")}
      </span>

      <span className="mt-4 uppercase tracking-[4px] text-sm text-gray-500">
        {label}
      </span>
    </motion.div>
  );

  return (
    <section
      id="countdown"
      className="relative overflow-hidden py-32"
    >
      <div className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-[#D8BF86]/20 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">

        <p className="text-center uppercase tracking-[8px] text-[#B89B5E]">
          Until We Say "I Do"
        </p>

        <h2 className="mt-4 text-center text-5xl font-serif">
          Counting Every Moment
        </h2>

        <div className="mt-20 flex flex-wrap justify-center gap-8">

          <Item value={time.days} label="Days" />

          <Item value={time.hours} label="Hours" />

          <Item value={time.minutes} label="Minutes" />

          <Item value={time.seconds} label="Seconds" />

        </div>

      </div>
    </section>
  );
}
