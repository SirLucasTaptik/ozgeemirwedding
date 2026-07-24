import Hero from "@/components/sections/Hero";
import Countdown from "@/components/sections/Countdown";
import Details from "@/components/sections/Details";
import Schedule from "@/components/sections/Schedule";
import Venue from "@/components/sections/Venue";
import RSVP from "@/components/sections/RSVP";
import Gallery from "@/components/sections/Gallery";
import Instagram from "@/components/sections/Instagram";
import Weather from "@/components/sections/Weather";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="overflow-x-hidden bg-[#FCFBF8]">
      <Hero />
      <Countdown />
      <Details />
      <Schedule />
      <Venue />
      <RSVP />
      <Gallery />
      <Instagram />
      <Weather />
      <Footer />
    </main>
  );
}
