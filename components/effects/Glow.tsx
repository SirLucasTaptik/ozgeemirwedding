export default function Glow() {
  return (
    <>
      <div className="absolute left-1/2 top-20 h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-[#D8BF86]/15 blur-[160px]" />

      <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-[#fff5dc]/50 blur-[140px]" />

      <div className="absolute left-0 top-1/2 h-[350px] w-[350px] rounded-full bg-white blur-[120px]" />
    </>
  );
}
