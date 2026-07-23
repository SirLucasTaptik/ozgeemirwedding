import Intro from "@/components/Intro";
import Loader from "@/components/Loader";
import MusicPlayer from "@/components/MusicPlayer";
import ScrollProgress from "@/components/ScrollProgress";
import MouseGlow from "@/components/MouseGlow";
import BackToTop from "@/components/BackToTop";

import Hero from "@/components/sections/Hero";
import Countdown from "@/components/sections/Countdown";
import Details from "@/components/sections/Details";
import Schedule from "@/components/sections/Schedule";
import Venue from "@/components/sections/Venue";
import Weather from "@/components/sections/Weather";
import RSVP from "@/components/sections/RSVP";
import Gallery from "@/components/sections/Gallery";
import Instagram from "@/components/sections/Instagram";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      {/* Intro Animation */}
      <Intro />

      {/* Initial Loader */}
      <Loader />

      {/* Scroll Progress */}
      <ScrollProgress />

      {/* Mouse Glow */}
      <MouseGlow />

      <main className="relative overflow-x-hidden bg-[#FCFBF8] text-neutral-800">

        <Hero />

        <Countdown />

        <Details />

        <Schedule />

        <Venue />

        <Weather />

        <RSVP />

        <Gallery />

        <Instagram />

        <Footer />

      </main>

      {/* Floating Music Button */}
      <MusicPlayer />

      {/* Back To Top */}
      <BackToTop />
    </>
  );
}
