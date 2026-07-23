"use client";

export default function VideoBackground() {
  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      className="absolute inset-0 h-full w-full object-cover opacity-[0.12]"
    >
      <source
        src="/videos/wedding.mp4"
        type="video/mp4"
      />
    </video>
  );
}
