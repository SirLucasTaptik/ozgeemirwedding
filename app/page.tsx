import Intro from "@/components/Intro";

import Hero from "@/components/sections/Hero";
import Countdown from "@/components/Countdown";
import Details from "@/components/sections/Details";
import Schedule from "@/components/sections/Schedule";
import Venue from "@/components/sections/Venue";
import RSVP from "@/components/sections/RSVP";
import Gallery from "@/components/sections/Gallery";
import Instagram from "@/components/sections/Instagram";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="overflow-hidden">

      <Intro />

      <Hero />

      <Countdown />

      <Details />

      <Schedule />

      <Venue />

      <RSVP />

      <Gallery />

      <Instagram />

      <Footer />

    </main>
  );
}
