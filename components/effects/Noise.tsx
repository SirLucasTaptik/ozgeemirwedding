export default function Noise() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-multiply"
      style={{
        backgroundImage:
          "url('/images/noise.png')",
      }}
    />
  );
}
