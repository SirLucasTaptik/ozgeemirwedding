"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Heading from "@/components/ui/Heading";

import { wedding } from "@/lib/constants";

type WeatherData = {
  temp: number;
  description: string;
  humidity: number;
  wind: number;
  icon: string;
};

export default function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getWeather() {
      try {
        const res = await fetch("/api/weather");
        const data = await res.json();

        setWeather(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    getWeather();
  }, []);

  return (
    <Section id="weather" className="bg-white">
      <Container>
        <Heading
          eyebrow="Wedding Weather"
          title="Forecast"
          subtitle="We'll keep an eye on the weather for our special day."
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass mx-auto mt-16 max-w-5xl rounded-[36px] p-12"
        >
          {loading ? (
            <div className="py-20 text-center">
              Loading weather...
            </div>
          ) : weather ? (
            <div className="grid gap-10 md:grid-cols-2">
              <div>
                <p className="uppercase tracking-[6px] text-[#B89B5E]">
                  {wedding.venue}
                </p>

                <div className="mt-6 flex items-center gap-5">
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                    alt=""
                    className="h-24 w-24"
                  />

                  <div>
                    <h2 className="font-serif text-6xl">
                      {Math.round(weather.temp)}°
                    </h2>

                    <p className="mt-2 capitalize text-neutral-600">
                      {weather.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="rounded-3xl bg-[#FCFBF8] p-6">
                  <p className="text-xs uppercase tracking-[4px] text-neutral-500">
                    Humidity
                  </p>

                  <h3 className="mt-3 text-4xl font-serif">
                    {weather.humidity}%
                  </h3>
                </div>

                <div className="rounded-3xl bg-[#FCFBF8] p-6">
                  <p className="text-xs uppercase tracking-[4px] text-neutral-500">
                    Wind
                  </p>

                  <h3 className="mt-3 text-4xl font-serif">
                    {weather.wind} km/h
                  </h3>
                </div>

                <div className="col-span-2 rounded-3xl bg-gradient-to-r from-[#E5CF99]/20 to-[#B89B5E]/10 p-6">
                  <p className="text-xs uppercase tracking-[4px] text-neutral-500">
                    Suggested Outfit
                  </p>

                  <h3 className="mt-3 text-2xl font-serif">
                    Elegant • Lightweight Formal Wear
                  </h3>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center">
              Weather information is currently unavailable.
            </div>
          )}
        </motion.div>
      </Container>
    </Section>
  );
}
