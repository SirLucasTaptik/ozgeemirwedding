"use client";

import { useEffect, useState, FormEvent, ReactNode } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Instagram, MapPin, Calendar, Clock } from "lucide-react";

/* ---------------------------------------------------------------
   ÖZGE & EMİR — düğün davetiyesi (premium sürüm)
   Next.js 15 / App Router / TypeScript / Tailwind / Framer Motion

   Görseller: Pexels üzerinden telifsiz (ücretsiz kullanım) fotoğraflar.
   - Kız Kulesi gün batımı: Muhammed Mahsum Tunç / Pexels
   - Kız Kulesi (ikinci kare): Akın Gençer / Pexels
   - Beyaz zambak: Trina Snow / Pexels
   - Beyaz tül/dantel doku: Anastasia Shuraeva / Pexels
   - Alaçatı sokak (Ege, sarmaşık çiçekli taş sokak): Doğukan Koçan / Pexels
   Üretime alırken bu görselleri kendi çekimlerinizle değiştirebilirsiniz.
------------------------------------------------------------------ */

const WEDDING_DATE = new Date("2026-09-20T18:30:00+03:00");
const VENUE = { name: "A11 Hotel Bosphorus", address: "Üsküdar / İstanbul" };

const IMAGES = {
  tower: "https://images.pexels.com/photos/35389652/pexels-photo-35389652.jpeg?auto=compress&cs=tinysrgb&w=1600",
  towerAlt: "https://images.pexels.com/photos/8848483/pexels-photo-8848483.jpeg?auto=compress&cs=tinysrgb&w=1400",
  lily: "https://images.pexels.com/photos/1033141/pexels-photo-1033141.jpeg?auto=compress&cs=tinysrgb&w=1200",
  lace: "https://images.pexels.com/photos/8935893/pexels-photo-8935893.jpeg?auto=compress&cs=tinysrgb&w=1200",
  street: "https://images.pexels.com/photos/34482767/pexels-photo-34482767.jpeg?auto=compress&cs=tinysrgb&w=1400",
};

function useCountdown(target: Date) {
  const [left, setLeft] = useState(() => target.getTime() - Date.now());
  useEffect(() => {
    const id = setInterval(() => setLeft(target.getTime() - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);
  const clamp = Math.max(left, 0);
  return {
    days: Math.floor(clamp / 86400000),
    hours: Math.floor((clamp % 86400000) / 3600000),
    minutes: Math.floor((clamp % 3600000) / 60000),
    seconds: Math.floor((clamp % 60000) / 1000),
  };
}

/* Fades and lifts content in as it scrolls into view */
function Reveal({
  children,
  delay = 0,
  y = 26,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* Slow Ken Burns zoom + fade-in, used for every full-bleed photograph */
function KenBurnsImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      <motion.img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${className}`}
        initial={{ scale: 1 }}
        animate={{ scale: 1.08 }}
        transition={{ duration: 22, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
      />
    </motion.div>
  );
}

function Flourish() {
  return (
    <svg width="96" height="26" viewBox="0 0 90 26" fill="none" className="flourish mx-auto">
      <path d="M2 13 C 20 2, 30 24, 45 13 C 60 2, 70 24, 88 13" stroke="currentColor" strokeWidth="1" />
      <circle cx="45" cy="13" r="2.4" fill="currentColor" />
    </svg>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-center text-[11px] tracking-[0.4em] uppercase mb-5" style={{ color: "var(--gold)" }}>
      {children}
    </p>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex-1 min-w-[200px] text-left">
      <label className="block text-[10px] uppercase tracking-[0.25em] mb-2 opacity-55">{label}</label>
      {children}
    </div>
  );
}

function Nav() {
  const { scrollY } = useScroll();
  const bg = useTransform(scrollY, [0, 220], ["rgba(250,246,239,0)", "rgba(250,246,239,0.9)"]);
  const borderOpacity = useTransform(scrollY, [0, 220], [0, 1]);

  return (
    <motion.nav
      style={{ background: bg }}
      className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 sm:px-12 py-5 backdrop-blur-sm"
    >
      <motion.div style={{ opacity: borderOpacity }} className="absolute bottom-0 inset-x-0 rule-gold" />
      <span className="font-display text-lg tracking-[0.3em]" style={{ color: "var(--gold)" }}>
        Ö · E
      </span>
      <div className="hidden sm:flex items-center gap-10 text-[10px] tracking-[0.3em] uppercase opacity-75">
        <a href="#program" className="hover:opacity-100 transition-opacity">
          Program
        </a>
        <a href="#rsvp" className="hover:opacity-100 transition-opacity">
          Katılım
        </a>
        <a href="#paylas" className="hover:opacity-100 transition-opacity">
          Paylaş
        </a>
      </div>
    </motion.nav>
  );
}

export default function Page() {
  const cd = useCountdown(WEDDING_DATE);
  const [form, setForm] = useState({ name: "", email: "", attend: "" });
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const mapsQuery = encodeURIComponent(`${VENUE.name}, ${VENUE.address}`);

  return (
    <main className="bg-[color:var(--ivory)] text-[color:var(--ink)] relative">
      <div className="grain-overlay" />
      <Nav />

      {/* ---------------- ANA GÖRSEL (HERO) ---------------- */}
      <section className="relative min-h-[100svh] grid grid-cols-1 sm:grid-cols-2 overflow-hidden">
        {/* Sol: zambak + dantel, sayfaya geçişli */}
        <div className="relative hidden sm:block">
          <KenBurnsImage src={IMAGES.lily} alt="" />
          <img
            src={IMAGES.lace}
            alt=""
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-35"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(90deg, rgba(250,246,239,0) 38%, rgba(250,246,239,0.95) 92%)" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(140% 120% at 30% 25%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.16) 100%)" }}
          />
        </div>
        {/* Sağ: Kız Kulesi, gün batımı */}
        <div className="relative">
          <KenBurnsImage src={IMAGES.tower} alt="Kız Kulesi, İstanbul" />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(270deg, rgba(250,246,239,0) 38%, rgba(250,246,239,0.95) 92%)" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(140% 120% at 70% 25%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.16) 100%)" }}
          />
        </div>
        {/* Sadece mobilde: tam ekran arka plan fotoğrafı */}
        <div className="absolute inset-0 sm:hidden">
          <KenBurnsImage src={IMAGES.tower} alt="Kız Kulesi, İstanbul" />
          <div className="absolute inset-0 bg-[color:var(--ivory)]/75" />
        </div>

        {/* Ortalanmış başlık katmanı */}
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.2 }}>
              <Flourish />
            </motion.div>
            <h1 className="font-display mt-5 leading-[1.05]">
              <motion.span
                initial={{ opacity: 0, letterSpacing: "0.5em" }}
                animate={{ opacity: 1, letterSpacing: "0.3em" }}
                transition={{ duration: 1.3, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="block text-6xl sm:text-7xl"
                style={{ color: "var(--gold)" }}
              >
                ÖZGE
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.9 }}
                className="block text-2xl sm:text-3xl my-3 italic"
                style={{ color: "var(--gold-light)" }}
              >
                &amp;
              </motion.span>
              <motion.span
                initial={{ opacity: 0, letterSpacing: "0.5em" }}
                animate={{ opacity: 1, letterSpacing: "0.3em" }}
                transition={{ duration: 1.3, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="block text-6xl sm:text-7xl"
                style={{ color: "var(--gold)" }}
              >
                EMİR
              </motion.span>
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.3 }}
              className="font-display text-lg tracking-[0.2em] mt-7"
            >
              {WEDDING_DATE.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }).toUpperCase()}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="text-[11px] tracking-[0.3em] uppercase mt-3 opacity-70"
            >
              {VENUE.name.toUpperCase()}
              <br />
              {VENUE.address.toUpperCase()}
            </motion.p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="absolute bottom-9 inset-x-0 flex flex-col items-center gap-2"
          style={{ color: "var(--gold)" }}
        >
          <span className="text-[9px] tracking-[0.35em] uppercase opacity-70">Aşağı Kaydırın</span>
          <motion.svg
            width="15"
            height="15"
            viewBox="0 0 16 16"
            fill="none"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <path d="M2 5 L8 11 L14 5" stroke="currentColor" strokeWidth="1.4" />
          </motion.svg>
        </motion.div>
      </section>

      {/* ---------------- GERİ SAYIM ---------------- */}
      <section className="py-24 px-6">
        <Reveal>
          <Eyebrow>Bu Özel Güne Kalan Süre</Eyebrow>
          <div className="rule-gold max-w-[120px] mx-auto mb-12" />
          <div className="flex items-center justify-center gap-4 sm:gap-10 max-w-2xl mx-auto">
            {[
              [cd.days, "Gün"],
              [cd.hours, "Saat"],
              [cd.minutes, "Dakika"],
              [cd.seconds, "Saniye"],
            ].map(([val, label], i) => (
              <div key={label as string} className="flex items-center gap-4 sm:gap-10">
                {i > 0 && <span className="h-12 w-px" style={{ background: "var(--rule)" }} />}
                <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }} className="text-center">
                  <div className="font-display text-5xl sm:text-6xl" style={{ color: "var(--gold)" }}>
                    {val}
                  </div>
                  <div className="text-[10px] tracking-[0.3em] uppercase mt-2 opacity-70">{label}</div>
                </motion.div>
              </div>
            ))}
          </div>
          <div className="rule-gold max-w-[120px] mx-auto mt-12" />
        </Reveal>
      </section>

      {/* ---------------- HİKAYEMİZ ---------------- */}
      <section className="grid sm:grid-cols-2">
        <div className="relative flex items-center py-24 px-8 sm:px-16 overflow-hidden order-2 sm:order-1">
          {/* silik zambak çizgi deseni (filigran) */}
          <svg
            viewBox="0 0 200 200"
            className="absolute -left-10 -bottom-10 w-64 h-64 opacity-[0.07] pointer-events-none"
            fill="none"
          >
            <g stroke="var(--gold)" strokeWidth="1">
              <path d="M100 120 L100 190" />
              {[0, 72, 144, 216, 288].map((deg) => (
                <path
                  key={deg}
                  d="M100 120 C 80 95, 80 55, 100 20 C 120 55, 120 95, 100 120 Z"
                  transform={`rotate(${deg} 100 105)`}
                />
              ))}
            </g>
          </svg>
          <Reveal className="relative">
            <p className="text-[11px] tracking-[0.4em] uppercase mb-5" style={{ color: "var(--gold)" }}>
              Bizim Hikayemiz
            </p>
            <h2 className="font-display text-4xl sm:text-5xl leading-tight max-w-xs">
              Bozcaada&rsquo;da başladı&hellip;
            </h2>
            <div className="mt-7 w-12">
              <div className="rule-gold" />
            </div>
          </Reveal>
        </div>
        <div className="relative min-h-[340px] sm:min-h-0 order-1 sm:order-2 overflow-hidden">
          <KenBurnsImage src={IMAGES.street} alt="Ege kıyısında taş sokak" />
        </div>
      </section>

      {/* ---------------- DAVET DETAYLARI ---------------- */}
      <section id="program" className="py-24 px-6">
        <Reveal>
          <Eyebrow>Davetlisiniz</Eyebrow>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-12 sm:gap-20 max-w-3xl mx-auto mt-8">
            {[
              {
                Icon: Calendar,
                big: WEDDING_DATE.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }),
                small: WEDDING_DATE.toLocaleDateString("tr-TR", { weekday: "long" }).toUpperCase(),
              },
              { Icon: Clock, big: "18:30", small: "NİKAH & DAVET" },
              { Icon: MapPin, big: VENUE.name, small: VENUE.address.toUpperCase() },
            ].map(({ Icon, big, small }, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex flex-col items-center text-center gap-3"
              >
                <span
                  className="w-12 h-12 rounded-full flex items-center justify-center border"
                  style={{ borderColor: "var(--gold-pale)" }}
                >
                  <Icon size={19} style={{ color: "var(--gold)" }} strokeWidth={1.3} />
                </span>
                <div className="font-display text-xl mt-1">{big}</div>
                <div className="text-[10px] tracking-[0.25em] uppercase opacity-55">{small}</div>
              </motion.div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ---------------- KONUM ---------------- */}
      <section className="grid sm:grid-cols-2">
        <div className="relative min-h-[300px] sm:min-h-0 overflow-hidden">
          <KenBurnsImage src={IMAGES.towerAlt} alt="Kız Kulesi" />
        </div>
        <div className="flex items-center py-20 px-8 sm:px-16">
          <Reveal>
            <p className="text-[11px] tracking-[0.4em] uppercase mb-5" style={{ color: "var(--gold)" }}>
              Kız Kulesi&rsquo;ne Yakın
            </p>
            <p className="font-display text-2xl max-w-sm mb-8 leading-relaxed opacity-90">
              Bu özel günde Üsküdar&rsquo;ın büyüleyici atmosferinde bir araya geliyoruz.
            </p>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`}
              target="_blank"
              rel="noreferrer"
              className="btn-outline-gold inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] px-7 py-3.5"
            >
              <MapPin size={14} /> Haritada Görüntüle
            </a>
          </Reveal>
        </div>
      </section>

      {/* ---------------- KATILIM BİLDİRİMİ ---------------- */}
      <section id="rsvp" className="py-24 px-6">
        <Reveal>
          <Eyebrow>Lütfen Katılım Bildiriniz</Eyebrow>
          <div className="rule-gold max-w-[120px] mx-auto mb-12" />
          <div className="max-w-md mx-auto">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="sent" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
                  <Flourish />
                  <p className="font-display text-xl mt-4">Teşekkürler — yanıtınız alındı.</p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={submit} className="flex flex-col sm:flex-row flex-wrap gap-6">
                  <Field label="Adınız Soyadınız">
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="field-underline w-full pb-2 text-sm"
                    />
                  </Field>
                  <Field label="E-posta">
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="field-underline w-full pb-2 text-sm"
                    />
                  </Field>
                  <Field label="Katılım Durumunuz">
                    <select
                      required
                      value={form.attend}
                      onChange={(e) => setForm({ ...form, attend: e.target.value })}
                      className="field-underline w-full pb-2 text-sm"
                    >
                      <option value="" disabled>
                        Seçiniz
                      </option>
                      <option value="yes">Seve Seve, Evet</option>
                      <option value="no">Maalesef, Hayır</option>
                    </select>
                  </Field>
                  <button type="submit" className="btn-gold w-full py-4 text-[11px] tracking-[0.3em] uppercase mt-2">
                    Gönder
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </section>

      {/* ---------------- INSTAGRAM PAYLAŞIMI ---------------- */}
      <section id="paylas" className="py-24 px-6 text-center">
        <Reveal>
          <Eyebrow>Anılarımızı Paylaşalım</Eyebrow>
          <h2 className="font-display text-5xl sm:text-6xl tracking-wide" style={{ color: "var(--gold)" }}>
            #OzgeEmir
          </h2>
          <Instagram size={20} className="mx-auto mt-6" style={{ color: "var(--gold)" }} strokeWidth={1.4} />
        </Reveal>
      </section>

      <footer className="py-10 text-center text-[10px] tracking-[0.3em] uppercase opacity-45">
        Özge &amp; Emir · {WEDDING_DATE.getFullYear()}
      </footer>
    </main>
  );
}
