"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: "gold" | "outline";
  external?: boolean;
  onClick?: () => void;
  className?: string;
};

export default function Button({
  children,
  href,
  variant = "gold",
  external = false,
  onClick,
  className = "",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full px-8 py-4 text-sm md:text-base font-medium transition-all duration-300";

  const styles = {
    gold:
      "bg-gradient-to-r from-[#E5CF99] via-[#B89B5E] to-[#8B6A32] text-white shadow-[0_12px_35px_rgba(184,155,94,.35)] hover:shadow-[0_20px_50px_rgba(184,155,94,.45)]",
    outline:
      "border border-[#B89B5E] text-[#8B6A32] bg-white/70 backdrop-blur hover:bg-[#B89B5E] hover:text-white",
  };

  const content = (
    <motion.span
      whileHover={{ y: -2, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {children}
    </motion.span>
  );

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {content}
        </a>
      );
    }

    return <Link href={href}>{content}</Link>;
  }

  return (
    <button onClick={onClick}>
      {content}
    </button>
  );
}
