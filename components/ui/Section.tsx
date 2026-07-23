type Props = {
  id?: string;
  children: React.ReactNode;
  className?: string;
};

export default function Section({
  id,
  children,
  className = "",
}: Props) {
  return (
    <section
      id={id}
      className={`relative py-28 md:py-36 ${className}`}
    >
      {children}
    </section>
  );
}
