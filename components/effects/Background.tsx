export default function Background() {
  return (
    <>
      {/* Main Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff_0%,#faf8f3_45%,#f3eee5_100%)]" />

      {/* Gold Glow */}
      <div className="absolute left-1/2 top-20 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-[#d8bf86]/15 blur-[180px]" />

      {/* White Glow */}
      <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-white blur-[160px]" />

      {/* Bottom Light */}
      <div className="absolute bottom-0 right-0 h-[600px] w-[600px] rounded-full bg-[#fffdf9] blur-[200px]" />
    </>
  );
}
