"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { wedding } from "@/lib/constants";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <>
      {/* Mobile Top Bar */}

      <div className="fixed top-4 left-4 right-4 z-[9998] lg:hidden">
        <div className="flex items-center justify-between rounded-full border border-white/40 bg-white/70 px-5 py-4 shadow-xl backdrop-blur-xl">

          <div>
            <h2 className="font-serif text-lg">
              {wedding.bride} <span className="text-[#B89B5E]">&</span>{" "}
              {wedding.groom}
            </h2>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E5CF99]"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Drawer */}

      <AnimatePresence>

        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: .45 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="fixed inset-0 z-[9998] bg-black"
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{
                type: "spring",
                damping: 25,
              }}
              className="fixed bottom-0 left-0 right-0 z-[9999] rounded-t-[40px] bg-[#FCFBF8] p-8 shadow-2xl"
            >
              <div className="mx-auto mb-8 h-1.5 w-16 rounded-full bg-neutral-300" />

              <div className="mb-12 text-center">

                <p className="text-xs uppercase tracking-[6px] text-[#B89B5E]">
                  Wedding Invitation
                </p>

                <h2 className="mt-3 font-serif text-4xl">
                  {wedding.bride}
                </h2>

                <div className="my-2 text-[#B89B5E]">
                  ♡
                </div>

                <h2 className="font-serif text-4xl">
                  {wedding.groom}
                </h2>

              </div>

              <nav className="space-y-4">

                {wedding.navigation.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={closeMenu}
                    className="block rounded-2xl border border-[#EEE7D5] bg-white px-6 py-5 text-center text-lg transition hover:border-[#B89B5E] hover:bg-[#FFFDF8]"
                  >
                    {item.label}
                  </a>
                ))}

              </nav>

              <button
                onClick={closeMenu}
                className="mt-8 w-full rounded-full bg-[#B89B5E] py-4 text-white transition hover:bg-[#A98A4E]"
              >
                Close
              </button>

            </motion.div>
          </>
        )}

      </AnimatePresence>
    </>
  );
}
