import Intro from "@/components/Intro";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="overflow-hidden">
      <Intro />

      <Hero />

      {/* Countdown */}
      <section id="countdown"></section>

      {/* Story */}
      <section id="story"></section>

      {/* Schedule */}
      <section id="schedule"></section>

      {/* Couple */}
      <section id="couple"></section>

      {/* Venue */}
      <section id="venue"></section>

      {/* RSVP */}
      <section id="rsvp"></section>

      {/* Gallery */}
      <section id="gallery"></section>

      {/* Weather */}
      <section id="weather"></section>

      {/* Instagram */}
      <section id="instagram"></section>

      {/* Footer */}
      <section id="footer"></section>

    </main>
  );
}
