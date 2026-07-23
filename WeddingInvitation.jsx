import React, { useEffect, useState } from "react";

export default function WeddingInvitation() {
  const target = new Date("2026-09-12T18:00:00");

  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = target - new Date();
      if (diff <= 0) return;

      setTime({
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff / (1000 * 60 * 60)) % 24),
        m: Math.floor((diff / (1000 * 60)) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-stone-50 to-white text-gray-800">

      <section className="h-screen flex flex-col justify-center items-center text-center px-6">
        <h3 className="tracking-[8px] uppercase text-yellow-700">
          Wedding Invitation
        </h3>

        <h1 className="text-6xl md:text-8xl font-serif mt-6">
          Özge <span className="text-yellow-600">&amp;</span> Emir
        </h1>

        <p className="mt-6 max-w-xl text-lg text-gray-600">
          We would be honored to celebrate our happiest day with you.
        </p>

        <div className="mt-10 flex gap-4">
          <button className="px-8 py-3 rounded-full bg-yellow-600 text-white">
            RSVP
          </button>

          <button className="px-8 py-3 rounded-full border border-yellow-600 text-yellow-700">
            View Location
          </button>
        </div>
      </section>

      <section className="py-24 text-center">
        <h2 className="text-4xl font-serif mb-10">Countdown</h2>

        <div className="grid grid-cols-4 gap-6 max-w-xl mx-auto">
          {[
            ["Days", time.d],
            ["Hours", time.h],
            ["Minutes", time.m],
            ["Seconds", time.s],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-3xl bg-white shadow-xl p-8"
            >
              <div className="text-5xl font-bold text-yellow-700">{value}</div>
              <div className="mt-2 uppercase text-sm">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-stone-50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-serif text-center mb-12">
            Wedding Schedule
          </h2>

          <div className="space-y-5">
            {[
              "Guest Arrival",
              "Ceremony",
              "Cocktail",
              "Dinner",
              "Cake",
              "First Dance",
              "Party",
            ].map((item) => (
              <div
                key={item}
                className="bg-white rounded-2xl shadow p-6 flex justify-between"
              >
                <span>{item}</span>
                <span>18:00</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 text-center">
        <h2 className="text-4xl font-serif">Venue</h2>

        <div className="mt-8 max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-xl">
          <iframe
            title="map"
            src="https://maps.google.com/maps?q=Dubai&t=&z=13&ie=UTF8&iwloc=&output=embed"
            className="w-full h-[450px]"
          />
        </div>

        <a
          className="inline-block mt-8 bg-yellow-600 text-white px-8 py-3 rounded-full"
          href="#"
        >
          Open Google Maps
        </a>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-xl mx-auto px-6">
          <h2 className="text-4xl font-serif text-center mb-8">RSVP</h2>

          <form className="space-y-4">
            <input className="w-full border rounded-xl p-4" placeholder="Full Name" />
            <select className="w-full border rounded-xl p-4">
              <option>Will Attend</option>
              <option>Yes</option>
              <option>No</option>
            </select>

            <input className="w-full border rounded-xl p-4" placeholder="Guests" />
            <textarea className="w-full border rounded-xl p-4" rows="4" placeholder="Message" />

            <button className="w-full bg-yellow-600 text-white py-4 rounded-xl">
              Submit RSVP
            </button>
          </form>
        </div>
      </section>

      <section className="py-20 bg-stone-50 text-center">
        <h2 className="text-4xl font-serif">Instagram</h2>

        <p className="text-5xl mt-6 font-light text-yellow-700">
          #OzgeEmir
        </p>
      </section>

      <footer className="py-12 text-center text-gray-500">
        Made with ♥ for Özge & Emir
      </footer>

    </div>
  );
}
