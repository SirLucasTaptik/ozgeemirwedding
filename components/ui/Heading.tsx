type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
};

export default function Heading({
  eyebrow,
  title,
  subtitle,
}: Props) {
  return (
    <div className="mx-auto mb-16 max-w-3xl text-center">
      {eyebrow && (
        <p className="mb-4 uppercase tracking-[8px] text-[#B89B5E] text-sm">
          {eyebrow}
        </p>
      )}

      <h2 className="font-serif text-5xl md:text-6xl">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-6 text-lg text-neutral-600">
          {subtitle}
        </p>
      )}
    </div>
  );
}
