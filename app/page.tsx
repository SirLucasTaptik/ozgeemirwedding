"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import type { ChangeEvent, ElementType, ReactNode } from "react";

/**
 * ÖZGE & EMİR — İnteraktif Dijital Davetiye (zarf açılımlı sürüm)
 *
 * Referans videodaki üç öğe temel alındı:
 *   1. Mühürlü zarfın dokunarak açılması ve kartın içeriden yükselmesi
 *   2. Krem kâğıt + adaçayı yeşili paleti
 *   3. Tam ekran fotoğraflarla ilerleyen dergi düzeni
 *
 * Konsepte özel farklar: mühürdeki kabartma beyaz zambak, bölüm başlıklarındaki
 * koordinatlar (Bozcaada → Üsküdar) ve Kız Kulesi karşısındaki lokasyon bölümü.
 *
 * Bağımlılık yoktur, yalnızca React kullanır. Next.js içinde dosyanın en başına
 * "use client" satırını ekleyin.
 */

const DUGUN_TARIHI = new Date("2026-09-20T18:30:00+03:00");

/* Fotoğrafları kendi çekimlerinizle değiştirin — bunlar geçici görsellerdir. */
const FOTO = {
  kule: "https://images.pexels.com/photos/35389652/pexels-photo-35389652.jpeg?auto=compress&cs=tinysrgb&w=1600",
  bozcaada:
    "https://images.pexels.com/photos/34482767/pexels-photo-34482767.jpeg?auto=compress&cs=tinysrgb&w=1400",
  bogaz:
    "https://images.pexels.com/photos/8848483/pexels-photo-8848483.jpeg?auto=compress&cs=tinysrgb&w=1400",
  masa: "https://images.pexels.com/photos/8935893/pexels-photo-8935893.jpeg?auto=compress&cs=tinysrgb&w=1400",
};

const PROGRAM = [
  { saat: "18.00", baslik: "Karşılama", detay: "A11 Hotel Bosphorus, teras" },
  { saat: "18.30", baslik: "Nikâh", detay: "Boğaz manzarasına karşı" },
  { saat: "19.30", baslik: "Kokteyl", detay: "Canlı müzik eşliğinde" },
  { saat: "20.30", baslik: "Yemek", detay: "Oturma düzeni girişte" },
  { saat: "23.00", baslik: "Dans", detay: "Gece sonuna kadar" },
];

/* ------------------------------------------------------------------ */
/* Kabartma zambak mührü                                                */
/* ------------------------------------------------------------------ */

function ZambakMuhru({ boyut = 96 }: { boyut?: number }) {
  return (
    <svg width={boyut} height={boyut} viewBox="-50 -50 100 100" aria-hidden="true">
      <circle className="muhur-zemin" cx="0" cy="0" r="44" />
      <circle className="muhur-cizgi" cx="0" cy="0" r="36" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path
          key={i}
          className="muhur-yaprak"
          transform={`rotate(${i * 60})`}
          d="M 0 4 C -7 -8, -6 -22, 0 -30 C 6 -22, 7 -8, 0 4 Z"
        />
      ))}
      {/* mührün çevresini dolanan inci dizisi */}
      {Array.from({ length: 24 }, (_, i) => (
        <circle key={`i${i}`} className="inci" cx="0" cy="-40" r="2.1" transform={`rotate(${i * 15})`} />
      ))}
      <circle className="inci inci-goze" cx="0" cy="0" r="6" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Dantel — kenar ve madalyon süslemeleri                               */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Dantel — gerçek dokulu dantel deseni                                 */
/* ------------------------------------------------------------------ */

const KAGIT_RENGI = "#F3EFE6";

/**
 * Tek bir dantel karosu. Gerçek bir dantel bordürün katmanları sırasıyla:
 * tül zemin (ağ örgü), motif alanı (gül ve yaprak), motifleri birbirine
 * bağlayan pikolu köprüler, kalın gipe ipliğiyle çizilmiş fisto kenar ve
 * en uçta piko halkaları. Karo 120 × 74 birimdir.
 */
function dantelKarosu(id: string, iplik: string, tul: string, pikoRenk: string) {
  const gipe = iplik;
  const fistolar = [0, 60];

  // tül: iki yönde çapraz ince iplikler
  const ag = [];
  for (let x = -80; x <= 200; x += 5.5) {
    ag.push(<line key={`a${x}`} x1={x} y1="20" x2={x + 54} y2="74" />);
    ag.push(<line key={`b${x}`} x1={x} y1="74" x2={x + 54} y2="20" />);
  }

  // beş yapraklı gül motifi
  const gul = (cx: number, cy: number, olcek: number) => (
    <g transform={`translate(${cx} ${cy}) scale(${olcek})`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          transform={`rotate(${i * 72})`}
          d="M0 0 C -4.6 -2.4, -7.4 -7.2, -5.6 -11 C -3.6 -14.6, 3.6 -14.6, 5.6 -11 C 7.4 -7.2, 4.6 -2.4, 0 0 Z"
          fill={tul}
          stroke={gipe}
          strokeWidth="0.85"
        />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={`d${i}`}
          transform={`rotate(${i * 72})`}
          x1="0"
          y1="-2"
          x2="0"
          y2="-9"
          stroke={iplik}
          strokeWidth="0.4"
          opacity="0.7"
        />
      ))}
      <circle cx="0" cy="0" r="1.7" fill={pikoRenk} stroke={gipe} strokeWidth="0.4" />
    </g>
  );

  // damarlı yaprak demeti
  const yaprakDemeti = (cx: number, cy: number) => (
    <g transform={`translate(${cx} ${cy})`}>
      {[-42, 0, 42].map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <path
            d="M0 2 C -3.6 -2, -5 -8, -3.2 -13 C -1.4 -10, 1.4 -10, 3.2 -13 C 5 -8, 3.6 -2, 0 2 Z"
            fill={tul}
            stroke={gipe}
            strokeWidth="0.75"
          />
          <line x1="0" y1="1" x2="0" y2="-11" stroke={iplik} strokeWidth="0.4" opacity="0.75" />
        </g>
      ))}
    </g>
  );

  return (
    <pattern id={id} width="120" height="74" patternUnits="userSpaceOnUse">
      <defs>
        <clipPath id={`${id}-kirp`}>
          <path d="M0 21 H120 V47 C 112 72, 68 72, 60 47 C 52 72, 8 72, 0 47 Z" />
        </clipPath>
      </defs>

      {/* kâğıt payı */}
      <rect x="0" y="0" width="120" height="21" fill={KAGIT_RENGI} />

      {/* tül zemin */}
      <g clipPath={`url(#${id}-kirp)`}>
        <rect x="0" y="20" width="120" height="54" fill={tul} />
        <g stroke={iplik} strokeWidth="0.32" opacity="0.5">
          {ag}
        </g>
      </g>

      {/* üst kenar: kalın gipe ipliği, ince refakat ipliği ve ajur delikleri */}
      <line x1="0" y1="22" x2="120" y2="22" stroke={gipe} strokeWidth="1.7" />
      <line x1="0" y1="25.4" x2="120" y2="25.4" stroke={iplik} strokeWidth="0.55" opacity="0.75" />
      {[10, 30, 50, 70, 90, 110].map((x) => (
        <circle key={`aj${x}`} cx={x} cy="23.7" r="1.15" fill="none" stroke={iplik} strokeWidth="0.5" />
      ))}

      {/* motif alanı: gül ve yaprak dönüşümlü */}
      {gul(30, 37, 1)}
      {yaprakDemeti(90, 36)}
      {gul(120, 37, 1)}

      {/* köprüler: motifleri kenara bağlayan pikolu barlar */}
      {[
        [30, 26, 30, 30],
        [90, 26, 90, 28],
        [16, 44, 26, 41],
        [44, 41, 54, 44],
        [76, 44, 84, 41],
        [104, 41, 112, 44],
      ].map(([x1, y1, x2, y2], i) => (
        <g key={`kp${i}`}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={iplik} strokeWidth="0.7" opacity="0.85" />
          <circle cx={(x1 + x2) / 2} cy={(y1 + y2) / 2} r="0.9" fill={pikoRenk} />
        </g>
      ))}

      {/* fisto kenar: kalın gipe ve içinde ince refakat ipliği */}
      {fistolar.map((x) => (
        <g key={`f${x}`}>
          <path
            d={`M${x} 47 C ${x + 8} 71, ${x + 52} 71, ${x + 60} 47`}
            fill="none"
            stroke={gipe}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d={`M${x + 4} 46 C ${x + 11} 66, ${x + 49} 66, ${x + 56} 46`}
            fill="none"
            stroke={iplik}
            strokeWidth="0.6"
            opacity="0.7"
          />
          {gul(x + 30, 58, 0.78)}
        </g>
      ))}

      {/* uçtaki piko halkaları */}
      {fistolar.map((x) =>
        [
          [x + 7, 55],
          [x + 13, 62],
          [x + 22, 67.5],
          [x + 30, 69.5],
          [x + 38, 67.5],
          [x + 47, 62],
          [x + 53, 55],
        ].map(([cx, cy], i) => (
          <circle
            key={`pk${x}-${i}`}
            cx={cx}
            cy={cy}
            r="1.8"
            fill={pikoRenk}
            stroke={gipe}
            strokeWidth="0.55"
          />
        ))
      )}
    </pattern>
  );
}

/** Sayfadaki bütün dantel yüzeyleri bu tanımları kullanır. */
function DantelTanimlari() {
  return (
    <svg width="0" height="0" aria-hidden="true" className="tanimlar">
      <defs>
        <radialGradient id="inci" cx="34%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="42%" stopColor="#F6F1E6" />
          <stop offset="100%" stopColor="#CDC4B0" />
        </radialGradient>
        {/* fotoğraf üzerinde: beyaz iplik */}
        {dantelKarosu("dantelBeyaz", "#FBF9F4", "rgba(255,255,255,0.24)", "#FDFBF7")}
        {/* kâğıt üzerinde: adaçayı iplik */}
        {dantelKarosu("dantelYesil", "#8D9B80", "rgba(141,155,128,0.1)", "#F6F1E6")}
      </defs>
    </svg>
  );
}

/** Bir kenarı kaplayan dantel bordür. */
function DantelKenar({ yon = "ust", sinif = "", desen = "dantelBeyaz", yukseklik = 56 }: { yon?: string; sinif?: string; desen?: string; yukseklik?: number }) {
  return (
    <svg
      className={`dantel dantel-${yon} ${sinif}`}
      width="100%"
      height={yukseklik}
      aria-hidden="true"
    >
      <rect width="100%" height={yukseklik} fill={`url(#${desen})`} />
    </svg>
  );
}

/** İki bölüm arasındaki dantel madalyon ayracı. */
function DantelAyrac() {
  return (
    <div className="ayrac" aria-hidden="true">
      <span className="ayrac-cizgi" />
      <svg width="58" height="58" viewBox="-30 -30 60 60" className="ayrac-motif">
        <circle className="ayrac-halka" cx="0" cy="0" r="21" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <g key={i} transform={`rotate(${i * 45})`}>
            <path className="ayrac-yaprak" d="M 0 -21 C -6 -25, -6 -33, 0 -36 C 6 -33, 6 -25, 0 -21 Z" />
            <circle className="inci" cx="0" cy="-15" r="2" />
          </g>
        ))}
        <circle className="inci inci-goze" cx="0" cy="0" r="4.5" />
      </svg>
      <span className="ayrac-cizgi" />
    </div>
  );
}

/** Bölümler arasına serilen, iki kenarı fistolu tam genişlikte dantel şerit. */
function DantelSerit() {
  return (
    <div className="dantel-serit" aria-hidden="true">
      <svg width="100%" height="46">
        <rect width="100%" height="46" fill="url(#dantelYesil)" />
      </svg>
      <svg width="100%" height="46" className="serit-ters">
        <rect width="100%" height="46" fill="url(#dantelYesil)" />
      </svg>
    </div>
  );
}

/** Başlıkların altına giren küçük dantel kemer. */
function DantelKemer({ sinif = "" }: { sinif?: string }) {
  return (
    <svg className={`kemer ${sinif}`} width="96" height="20" aria-hidden="true">
      <path className="ds-kemer" d="M2 4 C 14 20, 34 20, 48 4 C 62 20, 82 20, 94 4" />
      <circle className="inci" cx="48" cy="9" r="2.6" />
      <circle className="ds-delik" cx="16" cy="7" r="1.8" />
      <circle className="ds-delik" cx="80" cy="7" r="1.8" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Zambak — motifler                                                    */
/* ------------------------------------------------------------------ */

/** Tek bir zambak dalı: sap, iki yaprak ve altı taçlı çiçek. */
function zambakDali(anahtar: string | number, ekSinif = "") {
  return (
    <g key={anahtar} className={ekSinif}>
      <path className="z-sap" d="M0 130 C 2 96, -3 74, 0 50" />
      <path className="z-yaprak" d="M0 104 C -16 96, -26 80, -24 66 C -10 70, -2 86, 0 104 Z" />
      <path className="z-yaprak" d="M0 92 C 15 84, 24 69, 22 56 C 9 60, 2 75, 0 92 Z" />
      <g transform="translate(0 48)">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path
            key={i}
            className="z-tac"
            transform={`rotate(${i * 60})`}
            d="M 0 3 C -6 -8, -5 -24, 0 -32 C 5 -24, 6 -8, 0 3 Z"
          />
        ))}
        <circle className="inci" cx="0" cy="0" r="3.4" />
      </g>
    </g>
  );
}

/** Fotoğrafların alt kenarında ilerleyen zambak sırası. */
const SIRA = [
  { x: 40, o: 0.5, s: 0.72 },
  { x: 130, o: 0.85, s: 1 },
  { x: 232, o: 0.62, s: 0.84 },
  { x: 330, o: 0.95, s: 1.08 },
  { x: 430, o: 0.55, s: 0.78 },
  { x: 520, o: 0.88, s: 0.96 },
  { x: 626, o: 0.6, s: 0.86 },
  { x: 726, o: 0.92, s: 1.05 },
  { x: 828, o: 0.52, s: 0.74 },
  { x: 918, o: 0.86, s: 0.98 },
  { x: 1020, o: 0.64, s: 0.88 },
  { x: 1122, o: 0.9, s: 1.02 },
];

function ZambakSirasi() {
  return (
    <svg
      className="zambak-sirasi"
      viewBox="0 0 1200 130"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      {SIRA.map((d, i) => (
        <g key={i} transform={`translate(${d.x} 0) scale(${d.s})`} opacity={d.o}>
          {zambakDali(i)}
        </g>
      ))}
    </svg>
  );
}

/** Dantel çerçevenin köşelerine yerleşen zambak filizi. */
function ZambakFilizi({ kose }: { kose: string }) {
  return (
    <svg className={`filiz filiz-${kose}`} viewBox="0 0 96 96" aria-hidden="true">
      <path className="z-sap" d="M4 92 C 26 88, 44 72, 54 48" />
      <path className="z-yaprak" d="M22 88 C 20 74, 26 62, 38 56 C 38 72, 32 84, 22 88 Z" />
      <path className="z-yaprak" d="M12 74 C 4 66, 2 54, 8 44 C 18 52, 20 64, 12 74 Z" />
      <g transform="translate(58 38) scale(0.62)">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path
            key={i}
            className="z-tac"
            transform={`rotate(${i * 60})`}
            d="M 0 3 C -6 -8, -5 -24, 0 -32 C 5 -24, 6 -8, 0 3 Z"
          />
        ))}
        <circle className="inci" cx="0" cy="0" r="3.4" />
      </g>
    </svg>
  );
}

/** Üç zambaklı ince ayraç. */
function ZambakAyrac() {
  return (
    <div className="z-ayrac" aria-hidden="true">
      <span className="ayrac-cizgi" />
      <svg viewBox="-70 -34 140 68" className="z-ayrac-motif">
        {[-44, 0, 44].map((x, i) => (
          <g key={x} transform={`translate(${x} 26) scale(${i === 1 ? 0.5 : 0.36})`}>
            {zambakDali(x)}
          </g>
        ))}
      </svg>
      <span className="ayrac-cizgi" />
    </div>
  );
}

/** Bölüm arkasında soluk duran büyük zambak filigranı. */
function ZambakFiligran({ taraf = "sag" }: { taraf?: string }) {
  return (
    <svg className={`filigran filigran-${taraf}`} viewBox="-70 0 140 140" aria-hidden="true">
      {zambakDali("f")}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Zarf — açılış sahnesi                                                */
/* ------------------------------------------------------------------ */

function Zarf({ onAcildi }: { onAcildi: () => void }) {
  const [asama, setAsama] = useState(0); // 0 kapalı · 1 mühür kırıldı · 2 kapak açık · 3 kart çıktı · 4 sahne gidiyor

  const ac = () => {
    if (asama > 0) return;
    const azAnimasyon = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (azAnimasyon) {
      setAsama(4);
      onAcildi();
      return;
    }
    setAsama(1);
    setTimeout(() => setAsama(2), 420);
    setTimeout(() => setAsama(3), 1200);
    setTimeout(() => {
      setAsama(4);
      onAcildi();
    }, 2500);
  };

  return (
    <div className={`sahne asama-${asama}`}>
      <div className="sahne-fon" />
      <div className="zarf">
        <div className="zarf-arka" />
        <div className="zarf-kart">
          <DantelKenar yon="alt" sinif="kart-dantel" desen="dantelYesil" yukseklik={34} />
          <span className="kart-koordinat">39°50′ K → 41°01′ K</span>
          <p className="kart-isim">Özge & Emir</p>
          <span className="kart-tarih">20 EYLÜL 2026</span>
          <DantelKenar yon="ust" sinif="kart-dantel" desen="dantelYesil" yukseklik={34} />
        </div>
        <div className="zarf-on" />
        <div className="zarf-kapak" />
        <button
          type="button"
          className="muhur-buton"
          onClick={ac}
          aria-label="Davetiyeyi açmak için mühre dokunun"
        >
          <ZambakMuhru />
        </button>
      </div>
      <p className="sahne-ipucu">Mühre dokunun</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Geri sayım                                                           */
/* ------------------------------------------------------------------ */

function kalanHesapla(): [string, number][] | null {
  const fark = DUGUN_TARIHI.getTime() - Date.now();
  if (fark <= 0) return null;
  return [
    ["gün", Math.floor(fark / 86400000)],
    ["saat", Math.floor((fark / 3600000) % 24)],
    ["dakika", Math.floor((fark / 60000) % 60)],
    ["saniye", Math.floor((fark / 1000) % 60)],
  ];
}

function GeriSayim() {
  const [kalan, setKalan] = useState<[string, number][] | null>(kalanHesapla());
  useEffect(() => {
    const t = setInterval(() => setKalan(kalanHesapla()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!kalan) return <p className="mutlu-gun">Bugün o gün.</p>;

  return (
    <div className="sayim">
      {kalan.map(([etiket, deger]: [string, number], i: number) => (
        <React.Fragment key={etiket}>
          {i > 0 && (
            <span className="sayim-ayrac" aria-hidden="true">
              <svg viewBox="-8 -20 16 40">
                <circle className="inci" cx="0" cy="-7" r="4" />
                <circle className="inci" cx="0" cy="7" r="4" />
              </svg>
            </span>
          )}
          <span className="sayim-birim">
            <span className="sayim-sayi">{String(deger).padStart(2, "0")}</span>
            <span className="sayim-etiket">{etiket}</span>
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Görünürlükte belirme                                                 */
/* ------------------------------------------------------------------ */

function Belir({ children, className = "", as: Etiket = "div", id }: { children?: ReactNode; className?: string; as?: ElementType; id?: string }) {
  const Element = Etiket;
  const ref = useRef(null);
  const [gorundu, setGorundu] = useState(false);

  useEffect(() => {
    const dugum = ref.current;
    if (!dugum) return;
    const gozlemci = new IntersectionObserver(
      ([giris]) => {
        if (giris.isIntersecting) {
          setGorundu(true);
          gozlemci.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    gozlemci.observe(dugum);
    return () => gozlemci.disconnect();
  }, []);

  return (
    <Element id={id} ref={ref} className={`belir ${gorundu ? "belir-acik" : ""} ${className}`}>
      {children}
    </Element>
  );
}

/* ------------------------------------------------------------------ */
/* Katılım formu                                                        */
/* ------------------------------------------------------------------ */

const BOS_FORM = {
  adSoyad: "",
  eposta: "",
  telefon: "",
  katilim: "",
  kisiSayisi: 1,
  not: "",
  website: "", // spam tuzağı
};

function KatilimFormu() {
  type FormData = typeof BOS_FORM;

  const [form, setForm] = useState<FormData>(BOS_FORM);
  const [durum, setDurum] = useState("bekliyor");
  const [hataMetni, setHataMetni] = useState("");

  const degistir = useCallback((alan: keyof typeof BOS_FORM, deger: string | number) => {
    setForm((o) => ({ ...o, [alan]: deger }));
  }, []);

  const gonder = async () => {
    if (!form.adSoyad.trim() || !form.eposta.trim() || !form.katilim) {
      setDurum("hata");
      setHataMetni("Ad soyad, e‑posta ve katılım durumu alanlarını doldurun.");
      return;
    }
    setDurum("gönderiliyor");
    setHataMetni("");
    try {
      const yanit = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!yanit.ok) {
        const govde = await yanit.json().catch(() => ({}));
        throw new Error(govde.mesaj || "Kayıt tamamlanamadı.");
      }
      setDurum("tamam");
    } catch (hata: unknown) {
      setDurum("hata");
      const mesaj = hata instanceof Error ? hata.message : "Kayıt tamamlanamadı.";
      setHataMetni(
        mesaj === "Failed to fetch"
          ? "Sunucuya ulaşılamadı. Yayındaki sitede tekrar deneyin."
          : mesaj
      );
    }
  };

  if (durum === "tamam") {
    return (
      <div className="form-tamam" role="status">
        <ZambakMuhru boyut={72} />
        <p className="form-tamam-baslik">
          {form.katilim === "evet" ? "Yerinizi ayırdık" : "Yanıtınız bize ulaştı"}
        </p>
        <p className="form-tamam-alt">
          {form.katilim === "evet"
            ? `${form.adSoyad.trim().split(" ")[0]}, 20 Eylül akşamı Üsküdar'da görüşmek üzere. Onay e‑postası ${form.eposta} adresine gönderildi.`
            : "Yanımızda olamayacağınız için üzgünüz, sizi çok özleyeceğiz."}
        </p>
        <button
          type="button"
          className="baglanti-buton"
          onClick={() => {
            setForm(BOS_FORM);
            setDurum("bekliyor");
          }}
        >
          Başka bir kişi için yanıt ver
        </button>
      </div>
    );
  }

  return (
    <div className="form">
      <label className="alan">
        <span className="alan-etiket">Ad soyad</span>
        <input
          type="text"
          value={form.adSoyad}
          autoComplete="name"
          onChange={(e: ChangeEvent<HTMLInputElement>) => degistir("adSoyad", e.target.value)}
        />
      </label>

      <div className="form-satir">
        <label className="alan">
          <span className="alan-etiket">E‑posta</span>
          <input
            type="email"
            value={form.eposta}
            autoComplete="email"
            onChange={(e: ChangeEvent<HTMLInputElement>) => degistir("eposta", e.target.value)}
          />
        </label>
        <label className="alan">
          <span className="alan-etiket">Telefon (isteğe bağlı)</span>
          <input
            type="tel"
            value={form.telefon}
            autoComplete="tel"
            onChange={(e: ChangeEvent<HTMLInputElement>) => degistir("telefon", e.target.value)}
          />
        </label>
      </div>

      <fieldset className="secim">
        <legend className="alan-etiket">Katılıyor musunuz?</legend>
        <div className="secim-kutulari">
          <button
            type="button"
            className={`secim-kutu ${form.katilim === "evet" ? "secim-kutu-aktif" : ""}`}
            aria-pressed={form.katilim === "evet"}
            onClick={() => {
              degistir("katilim", "evet");
              if (form.kisiSayisi < 1) degistir("kisiSayisi", 1);
            }}
          >
            Evet, katılıyorum
          </button>
          <button
            type="button"
            className={`secim-kutu ${form.katilim === "hayir" ? "secim-kutu-aktif" : ""}`}
            aria-pressed={form.katilim === "hayir"}
            onClick={() => {
              degistir("katilim", "hayir");
              degistir("kisiSayisi", 0);
            }}
          >
            Maalesef katılamıyorum
          </button>
        </div>
      </fieldset>

      <label className="alan">
        <span className="alan-etiket">Kaç kişi katılıyorsunuz? (siz dâhil)</span>
        <input
          type="number"
          min="1"
          max="6"
          value={form.kisiSayisi}
          disabled={form.katilim === "hayir"}
          onChange={(e: ChangeEvent<HTMLInputElement>) => degistir("kisiSayisi", Number(e.target.value))}
        />
      </label>

      <label className="alan">
        <span className="alan-etiket">Çifte notunuz (isteğe bağlı)</span>
        <textarea
          rows={3}
          value={form.not}
          placeholder="Menü tercihi, alerji ya da yalnızca güzel bir dilek…"
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => degistir("not", e.target.value)}
        />
      </label>

      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="tuzak"
        value={form.website}
        onChange={(e: ChangeEvent<HTMLInputElement>) => degistir("website", e.target.value)}
      />

      {durum === "hata" && (
        <p className="form-hata" role="alert">
          {hataMetni}
        </p>
      )}

      <button type="button" className="ana-buton" onClick={gonder} disabled={durum === "gönderiliyor"}>
        {durum === "gönderiliyor" ? "Gönderiliyor…" : "Gönder"}
      </button>
      <p className="form-dipnot">Yanıtınızı 1 Eylül 2026'ya kadar iletmenizi rica ederiz.</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Ana bileşen                                                          */
/* ------------------------------------------------------------------ */

export default function Davetiye() {
  const [acildi, setAcildi] = useState(false);

  useEffect(() => {
    document.body.style.overflow = acildi ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [acildi]);

  return (
    <div className="sayfa">
      <style>{CSS_METNI}</style>

      {/* İnci parlaklığı ve dantel dokusu tanımları */}
      <DantelTanimlari />

      {!acildi && <Zarf onAcildi={() => setAcildi(true)} />}

      <main className={`icerik ${acildi ? "icerik-acik" : ""}`} aria-hidden={!acildi}>
        {/* — Giriş: tam ekran fotoğraf — */}
        <header className="giris">
          <img className="tam-gorsel" src={FOTO.kule} alt="Akşam ışığında Kız Kulesi ve Boğaz" />
          <div className="karartma" />
          <div className="giris-metin">
            <span className="koordinat acik">41°01′ K · 29°00′ D — Üsküdar</span>
            <h1 className="isimler">
              Özge <span className="ve">&amp;</span> Emir
            </h1>
            <div className="ince-cizgi" />
            <p className="giris-tarih">20 EYLÜL 2026 · PAZAR · 18.30</p>
            <p className="giris-yer">A11 Hotel Bosphorus, Üsküdar</p>
          </div>
          <span className="kaydir-ipucu">aşağı kaydırın</span>
          <ZambakSirasi />
          <DantelKenar yon="ust" sinif="foto-dantel" />
        </header>

        {/* — Geri sayım — */}
        <Belir as="section" className="bolum orta">
          <ZambakFiligran taraf="sol" />
          <ZambakFiligran taraf="sag" />
          <p className="ust-etiket">Mutlu güne son</p>
          <GeriSayim />
          <DantelAyrac />
        </Belir>

        {/* — Hikâye: Bozcaada — */}
        <Belir as="section" className="bolum ikili">
          <figure className="ikili-gorsel">
            <div className="ikili-cerceve">
              <img src={FOTO.bozcaada} alt="Bozcaada'da denize inen taş sokak" />
              <DantelKenar yon="ust" sinif="ikili-dantel" yukseklik={42} />
            </div>
            <figcaption>Bozcaada, eylül</figcaption>
          </figure>
          <div className="ikili-metin">
            <span className="koordinat">39°50′ K · 26°04′ D — Bozcaada</span>
            <h2 className="baslik">Bozcaada'da başladı</h2>
            <DantelKemer />
            <p>
              Bir eylül akşamı, bağların arasından denize inen taş sokakta tanıştık. Rüzgâr
              her zamanki gibi kuvvetliydi, kimse acele etmiyordu. O akşamdan bu yana her
              yolculuğumuz aynı adaya, aynı iskeleye çıkıyor.
            </p>
            <p>
              Şimdi bu hikâyeyi Boğaz'ın öbür ucunda, Kız Kulesi'nin karşısında bir düğüne
              bağlıyoruz.
            </p>
          </div>
        </Belir>

        {/* — Dantel şerit — */}
        <DantelSerit />

        {/* — Tam ekran ara görsel — */}
        <section className="serit">
          <img className="tam-gorsel" src={FOTO.masa} alt="Beyaz zambaklarla hazırlanmış masa" />
          <div className="karartma hafif" />
          <DantelKenar yon="alt" sinif="foto-dantel foto-dantel-ust" />
          <p className="serit-yazi">Sizi aramızda görmekten mutluluk duyarız</p>
          <DantelKenar yon="ust" sinif="foto-dantel" />
        </section>

        {/* — Program — */}
        <Belir as="section" className="bolum">
          <p className="ust-etiket">Akşamın akışı</p>
          <h2 className="baslik orta-baslik">20 EYLÜL 2026</h2>
          <ZambakAyrac />
          <ol className="program">
            {PROGRAM.map((m) => (
              <li key={m.saat}>
                <span className="program-saat">{m.saat}</span>
                <span className="program-baslik">{m.baslik}</span>
                <span className="program-detay">{m.detay}</span>
              </li>
            ))}
          </ol>
        </Belir>

        {/* — Lokasyon — */}
        <Belir as="section" className="lokasyon">
          <img className="tam-gorsel" src={FOTO.bogaz} alt="Boğaz'ın ortasında Kız Kulesi" />
          <div className="karartma" />
          <DantelKenar yon="alt" sinif="foto-dantel foto-dantel-ust" />
          <ZambakSirasi />
          <DantelKenar yon="ust" sinif="foto-dantel" />
          <div className="lokasyon-metin">
            <p className="ust-etiket acik">Lokasyon</p>
            <h2 className="lokasyon-ad">A11 Hotel Bosphorus</h2>
            <DantelKemer sinif="kemer-acik kemer-orta" />
            <p className="lokasyon-alt">
              Salacak sahilinde, Kız Kulesi'nin tam karşısında. Otopark vardır; Üsküdar
              iskelesinden yürüyerek yaklaşık on dakika sürer.
            </p>
            <a
              className="ana-buton acik-buton"
              href="https://www.google.com/maps/dir/?api=1&destination=A11%20Hotel%20Bosphorus%2C%20%C3%9Csk%C3%BCdar%20%2F%20%C4%B0stanbul"
              target="_blank"
              rel="noopener noreferrer"
            >
              Yol tarifi almak için tıklayınız
            </a>
          </div>
        </Belir>

        {/* — Katılım — */}
        <DantelSerit />
        <Belir as="section" id="rsvp" className="bolum katilim">
          <div className="dantel-cerceve">
            <ZambakFilizi kose="sol-ust" />
            <ZambakFilizi kose="sag-ust" />
            <ZambakFilizi kose="sol-alt" />
            <ZambakFilizi kose="sag-alt" />
            <p className="ust-etiket">Lütfen katılım durumunuzu bildiriniz</p>
            <KatilimFormu />
          </div>
        </Belir>

        {/* — Paylaşım — */}
        <Belir as="section" className="bolum orta paylas">
          <ZambakFiligran taraf="sol" />
          <ZambakFiligran taraf="sag" />
          <DantelAyrac />
          <h2 className="etiket-adi">#OzgeEmir</h2>
          <p className="paylas-alt">
            Çektiğiniz her kareyi bu etiketle paylaşın; gece bitince hepsini bir araya
            toplayacağız.
          </p>
        </Belir>

        <footer className="alt">
          <DantelKenar yon="alt" sinif="alt-dantel" />
          Özge &amp; Emir · 20 EYLÜL 2026 · İstanbul
        </footer>
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Biçimlendirme                                                        */
/* ------------------------------------------------------------------ */

const CSS_METNI = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&display=swap');

.sayfa {
  --kagit: #F3EFE6;
  --kagit-koyu: #E7E0D2;
  --murekkep: #2B2E27;
  --adacayi: #8D9B80;
  --zeytin: #5C6A51;
  --baslik-yazi: 'Cormorant Garamond', Georgia, serif;
  --govde-yazi: 'Jost', system-ui, sans-serif;
  background: var(--kagit);
  color: var(--murekkep);
  font-family: var(--govde-yazi);
  font-weight: 300;
  line-height: 1.7;
  overflow-x: hidden;
}
.sayfa *, .sayfa *::before, .sayfa *::after { box-sizing: border-box; }
.sayfa :focus-visible { outline: 2px solid var(--zeytin); outline-offset: 4px; }

/* Zarf sahnesi ------------------------------------------------------ */
.sahne {
  position: fixed; inset: 0; z-index: 80;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  perspective: 1600px;
  transition: opacity 800ms ease, visibility 800ms ease;
}
.sahne-fon {
  position: absolute; inset: 0; background: var(--kagit-koyu);
  background-image:
    radial-gradient(circle at 30% 20%, rgba(255,255,255,0.75), transparent 55%),
    radial-gradient(circle at 75% 85%, rgba(141,155,128,0.22), transparent 60%);
}
.asama-4 { opacity: 0; visibility: hidden; }

.zarf {
  position: relative; width: min(78vw, 340px); aspect-ratio: 1 / 0.68;
  transform-style: preserve-3d;
  transition: transform 900ms cubic-bezier(0.4, 0, 0.2, 1);
}
.asama-3 .zarf, .asama-4 .zarf { transform: translateY(4%) scale(1.03); }

.zarf-arka, .zarf-on, .zarf-kapak {
  position: absolute; inset: 0;
  background: #EFE9DC;
  box-shadow: inset 0 0 60px rgba(92,106,81,0.12);
}
.zarf-arka { z-index: 1; border: 1px solid rgba(92,106,81,0.18); }
.zarf-on {
  z-index: 4;
  clip-path: polygon(0 0, 50% 56%, 100% 0, 100% 100%, 0 100%);
  background: #EDE6D8;
  box-shadow: 0 22px 50px rgba(43,46,39,0.18);
}
.zarf-kapak {
  z-index: 5; transform-origin: top center; backface-visibility: hidden;
  clip-path: polygon(0 0, 100% 0, 50% 84%);
  background-color: #F1EBDF;
  background-image:
    radial-gradient(circle at 9px 9px, rgba(141,155,128,0.32) 1.5px, transparent 1.7px),
    radial-gradient(circle at 0 0, rgba(141,155,128,0.18) 1.1px, transparent 1.3px);
  background-size: 18px 18px, 18px 18px;
  transition: transform 900ms cubic-bezier(0.6, 0, 0.3, 1), z-index 0ms linear 450ms;
}
.asama-2 .zarf-kapak, .asama-3 .zarf-kapak, .asama-4 .zarf-kapak {
  transform: rotateX(-172deg); z-index: 0;
}

.zarf-kart {
  position: absolute; left: 6%; right: 6%; top: 8%; bottom: 8%; z-index: 3;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;
  background: #FBF8F2; border: 1px solid rgba(92,106,81,0.22); overflow: hidden;
  transition: transform 1100ms cubic-bezier(0.22, 1, 0.36, 1) 200ms;
}
.asama-3 .zarf-kart, .asama-4 .zarf-kart { transform: translateY(-86%); }
.kart-koordinat { font-size: 8px; letter-spacing: 0.3em; color: var(--adacayi); }
.kart-isim {
  font-family: var(--baslik-yazi); font-style: italic; font-weight: 300;
  font-size: clamp(24px, 6vw, 34px); margin: 2px 0;
}
.kart-tarih { font-size: 10px; letter-spacing: 0.36em; color: var(--zeytin); }

.muhur-buton {
  position: absolute; z-index: 6; left: 50%; top: 50%;
  transform: translate(-50%, -50%);
  background: none; border: 0; padding: 0; cursor: pointer; line-height: 0;
  transition: transform 420ms ease, opacity 420ms ease;
  filter: drop-shadow(0 6px 12px rgba(43,46,39,0.28));
}
.muhur-buton:hover { transform: translate(-50%, -50%) scale(1.05); }
.asama-1 .muhur-buton { transform: translate(-50%, -50%) scale(1.18) rotate(-8deg); }
.asama-2 .muhur-buton, .asama-3 .muhur-buton, .asama-4 .muhur-buton {
  transform: translate(-50%, -30%) scale(0.7) rotate(-22deg); opacity: 0;
}
.muhur-zemin { fill: #F6F2E9; stroke: rgba(92,106,81,0.35); stroke-width: 1; }
.muhur-cizgi { fill: none; stroke: rgba(92,106,81,0.3); stroke-width: 0.7; }
.muhur-yaprak { fill: #EDE7DA; stroke: var(--adacayi); stroke-width: 0.9; }

.sahne-ipucu {
  position: relative; margin-top: 46px;
  font-size: 10px; letter-spacing: 0.36em; text-transform: uppercase; color: var(--zeytin);
  animation: nefes 2600ms ease-in-out infinite;
}
.asama-1 .sahne-ipucu, .asama-2 .sahne-ipucu, .asama-3 .sahne-ipucu { opacity: 0; }
@keyframes nefes { 0%, 100% { opacity: 0.45; } 50% { opacity: 1; } }

/* Dantel ------------------------------------------------------------ */
.dantel { position: absolute; left: 0; right: 0; display: block; z-index: 6; pointer-events: none; }
.dantel-alt { top: 0; }
.dantel-ust { bottom: 0; transform: scaleY(-1); }

.dantel-serit { background: var(--kagit); }
.foto-dantel-ust { top: 0; bottom: auto; }
.dantel-serit svg { display: block; width: 100%; }
.serit-ters { transform: scaleY(-1); }

.ds-kemer { stroke: var(--adacayi); stroke-width: 1; fill: none; opacity: 0.75; }
.ds-delik { fill: none; stroke: var(--adacayi); stroke-width: 0.9; opacity: 0.7; }
.kemer { display: block; margin: 0 0 22px; }
.kemer-orta { margin-left: auto; margin-right: auto; }
.kemer-acik .ds-kemer { stroke: rgba(243,239,230,0.85); opacity: 0.95; }
.kemer-acik .ds-delik { stroke: rgba(243,239,230,0.8); }

/* Dantel çerçevenin yan ajur şeritleri */
.dantel-cerceve::after {
  content: ''; position: absolute; top: 16px; bottom: 16px; left: 16px; right: 16px;
  pointer-events: none;
  background-image:
    radial-gradient(circle at 4px 50%, rgba(141,155,128,0.4) 1.5px, transparent 1.7px),
    radial-gradient(circle at calc(100% - 4px) 50%, rgba(141,155,128,0.4) 1.5px, transparent 1.7px);
  background-size: 100% 14px, 100% 14px;
  background-repeat: repeat-y, repeat-y;
}

/* İnci --------------------------------------------------------------- */
.tanimlar { position: absolute; width: 0; height: 0; overflow: hidden; }
.inci { fill: url(#inci); stroke: rgba(92,106,81,0.35); stroke-width: 0.4; }
.inci-goze { stroke-width: 0.7; filter: drop-shadow(0 1px 1px rgba(43,46,39,0.25)); }

/* Zambak motifleri --------------------------------------------------- */
.z-sap { fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; }
.z-yaprak { fill: currentColor; opacity: 0.45; }
.z-tac { fill: currentColor; opacity: 0.9; stroke: currentColor; stroke-width: 0.6; }

/* Fotoğraf altındaki zambak sırası */
.zambak-sirasi {
  position: absolute; left: 0; right: 0; bottom: 0; width: 100%; height: clamp(90px, 14vh, 140px);
  z-index: 5; pointer-events: none; color: #FBF9F4;
}
.zambak-sirasi .z-tac { opacity: 0.86; }
.zambak-sirasi .z-yaprak { opacity: 0.34; }
.zambak-sirasi .z-sap { opacity: 0.5; }

/* Dantel çerçevenin köşelerindeki filizler */
.filiz { position: absolute; width: 86px; height: 86px; color: var(--adacayi); opacity: 0.5; pointer-events: none; }
.filiz .z-sap { stroke-width: 1.6; }
.filiz .z-yaprak { opacity: 0.32; }
.filiz-sol-ust { left: -6px; top: -6px; transform: scaleY(-1); }
.filiz-sag-ust { right: -6px; top: -6px; transform: scale(-1, -1); }
.filiz-sol-alt { left: -6px; bottom: -6px; }
.filiz-sag-alt { right: -6px; bottom: -6px; transform: scaleX(-1); }

/* Üç zambaklı ayraç */
.z-ayrac { display: flex; align-items: center; justify-content: center; gap: 14px; margin: 26px auto 40px; max-width: 460px; }
.z-ayrac-motif { width: 132px; height: 64px; color: var(--adacayi); }
.z-ayrac .z-yaprak { opacity: 0.3; }
.z-ayrac .z-tac { opacity: 0.65; }

/* Bölüm arkasındaki soluk filigran */
.filigran {
  position: absolute; top: 50%; width: 190px; height: 190px;
  transform: translateY(-50%); color: var(--adacayi); opacity: 0.09;
  pointer-events: none; z-index: 0;
}
.filigran-sol { left: -34px; }
.filigran-sag { right: -34px; transform: translateY(-50%) scaleX(-1); }
.bolum { position: relative; overflow: hidden; }
.bolum > *:not(.filigran) { position: relative; z-index: 1; }

/* Dantel madalyon ayracı */
.ayrac { display: flex; align-items: center; justify-content: center; gap: 18px; margin: 46px auto 0; max-width: 420px; }
.ayrac-cizgi { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, rgba(141,155,128,0.6), transparent); }
.ayrac-halka { fill: none; stroke: var(--adacayi); stroke-width: 0.8; stroke-dasharray: 2 3.4; }
.ayrac-yaprak { fill: rgba(141,155,128,0.16); stroke: var(--adacayi); stroke-width: 0.8; }

/* Dantel çerçeve — katılım formunun etrafı */
.dantel-cerceve {
  position: relative; padding: 46px 34px;
  border: 1px solid rgba(141,155,128,0.45);
  background:
    radial-gradient(circle at 36% 30%, #FFFFFF 0%, #F6F1E6 40%, #CDC4B0 74%, transparent 76%) 3px 3px / 15px 15px no-repeat,
    radial-gradient(circle at 36% 30%, #FFFFFF 0%, #F6F1E6 40%, #CDC4B0 74%, transparent 76%) calc(100% - 3px) 3px / 15px 15px no-repeat,
    radial-gradient(circle at 36% 30%, #FFFFFF 0%, #F6F1E6 40%, #CDC4B0 74%, transparent 76%) 3px calc(100% - 3px) / 15px 15px no-repeat,
    radial-gradient(circle at 36% 30%, #FFFFFF 0%, #F6F1E6 40%, #CDC4B0 74%, transparent 76%) calc(100% - 3px) calc(100% - 3px) / 15px 15px no-repeat,
    radial-gradient(circle at 12px 12px, rgba(141,155,128,0.35) 1.4px, transparent 1.6px) 0 0 / 24px 24px,
    rgba(255,255,255,0.35);
}
.dantel-cerceve::before {
  content: ''; position: absolute; inset: 7px;
  border: 1px dashed rgba(141,155,128,0.5); pointer-events: none;
}


/* İçerik ------------------------------------------------------------ */
.icerik { opacity: 0; transition: opacity 1100ms ease 400ms; }
.icerik-acik { opacity: 1; }

.koordinat, .ust-etiket {
  display: block; font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase;
  color: var(--zeytin); margin: 0 0 16px;
}
.koordinat.acik, .ust-etiket.acik { color: rgba(243,239,230,0.85); }
.baslik {
  font-family: var(--baslik-yazi); font-weight: 300;
  font-size: clamp(30px, 5vw, 48px); line-height: 1.18; margin: 0 0 20px;
}
.orta-baslik { text-align: center; }

/* Tam ekran görseller ----------------------------------------------- */
.tam-gorsel { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.karartma {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(30,33,27,0.5) 0%, rgba(30,33,27,0.22) 45%, rgba(30,33,27,0.8) 100%);
}
.karartma.hafif { background: rgba(30,33,27,0.42); }

.giris { position: relative; height: 100vh; min-height: 560px; display: grid; place-items: center; overflow: hidden; }
.serit, .lokasyon { overflow: hidden; }
.giris-metin { position: relative; text-align: center; color: var(--kagit); padding: 0 26px; }
.isimler {
  font-family: var(--baslik-yazi); font-weight: 300; font-style: italic;
  font-size: clamp(48px, 13vw, 108px); line-height: 1.05; margin: 0;
}
.isimler .ve { font-style: normal; font-size: 0.42em; opacity: 0.7; }
.ince-cizgi {
  position: relative; width: 96px; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(243,239,230,0.7), transparent);
  margin: 26px auto;
}
.ince-cizgi::after {
  content: ''; position: absolute; left: 50%; top: 50%; width: 9px; height: 9px;
  margin: -4.5px 0 0 -4.5px; border-radius: 50%;
  background: radial-gradient(circle at 36% 30%, #FFFFFF 0%, #F6F1E6 42%, #CDC4B0 100%);
}
.giris-tarih { font-size: 13px; letter-spacing: 0.3em; text-transform: uppercase; margin: 0 0 8px; }
.giris-yer { font-size: 12px; letter-spacing: 0.2em; opacity: 0.8; margin: 0; }
.kaydir-ipucu {
  position: absolute; bottom: 30px; font-size: 9px; letter-spacing: 0.34em;
  text-transform: uppercase; color: var(--kagit); opacity: 0.75;
}

.serit { position: relative; height: 62vh; min-height: 340px; display: grid; place-items: center; }
.serit-yazi {
  position: relative; color: var(--kagit); text-align: center; padding: 0 30px;
  font-family: var(--baslik-yazi); font-style: italic;
  font-size: clamp(22px, 4.4vw, 38px); max-width: 20ch; margin: 0;
}

/* Bölümler ---------------------------------------------------------- */
.bolum { max-width: 1020px; margin: 0 auto; padding: 100px 26px; }
.orta { text-align: center; }
.belir { opacity: 0; transform: translateY(24px); transition: opacity 950ms ease, transform 950ms ease; }
.belir-acik { opacity: 1; transform: none; }

.sayim { display: flex; align-items: flex-start; justify-content: center; gap: clamp(8px, 3vw, 22px); }
.sayim-birim { display: flex; flex-direction: column; align-items: center; }
.sayim-sayi {
  font-family: var(--baslik-yazi); font-weight: 300;
  font-size: clamp(38px, 9vw, 66px); line-height: 1; font-variant-numeric: tabular-nums;
}
.sayim-etiket { font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase; color: var(--zeytin); margin-top: 8px; }
.sayim-ayrac { display: block; width: clamp(10px, 2.4vw, 16px); margin-top: clamp(10px, 2.6vw, 20px); }
.sayim-ayrac svg { width: 100%; height: auto; display: block; }
.mutlu-gun { font-family: var(--baslik-yazi); font-size: 34px; font-style: italic; }

.ikili { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
.ikili p { margin: 0 0 16px; max-width: 44ch; }
.ikili-gorsel { margin: 0; }
.ikili-cerceve { position: relative; overflow: hidden; }
.ikili-gorsel img { width: 100%; height: 500px; object-fit: cover; display: block; }
.ikili-gorsel figcaption {
  font-size: 10px; letter-spacing: 0.26em; text-transform: uppercase;
  color: var(--zeytin); margin-top: 12px;
}

.program { list-style: none; margin: 0 auto; padding: 0; max-width: 620px; }
.program li {
  position: relative;
  display: grid; grid-template-columns: 96px 1fr; gap: 2px 26px;
  padding: 22px 0; border-top: 1px solid rgba(141,155,128,0.4);
}
.program li::before {
  content: ''; position: absolute; left: 0; top: -5px; width: 10px; height: 10px; border-radius: 50%;
  background: radial-gradient(circle at 36% 30%, #FFFFFF 0%, #F6F1E6 42%, #CDC4B0 100%);
  box-shadow: 0 1px 2px rgba(43,46,39,0.18);
}
.program li:last-child { border-bottom: 1px solid rgba(141,155,128,0.4); }
.program-saat {
  font-family: var(--baslik-yazi); font-size: 24px; grid-row: span 2;
  color: var(--zeytin); font-variant-numeric: tabular-nums;
}
.program-baslik { font-size: 17px; }
.program-detay { font-size: 13px; color: var(--zeytin); }

.lokasyon { position: relative; min-height: 88vh; display: grid; place-items: center; text-align: center; }
.lokasyon-metin { position: relative; color: var(--kagit); padding: 0 26px; max-width: 560px; }
.lokasyon-ad {
  font-family: var(--baslik-yazi); font-weight: 300; font-style: italic;
  font-size: clamp(34px, 7vw, 60px); margin: 0 0 18px;
}
.lokasyon-alt { font-size: 15px; margin: 0 0 30px; opacity: 0.9; }

/* Form -------------------------------------------------------------- */
.katilim { max-width: 640px; text-align: center; }
.form { text-align: left; margin-top: 30px; }
.form-satir { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.alan { display: block; margin-bottom: 22px; }
.alan-etiket {
  display: block; font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--zeytin); margin-bottom: 8px;
}
.form input, .form textarea {
  width: 100%; padding: 12px 0; font-family: inherit; font-size: 16px; color: var(--murekkep);
  background: transparent; border: 0; border-bottom: 1px solid rgba(141,155,128,0.55);
  border-radius: 0; transition: border-color 220ms ease;
}
.form input:focus, .form textarea:focus { border-bottom-color: var(--zeytin); }
.form input:disabled { opacity: 0.35; }
.secim { border: 0; padding: 0; margin: 0 0 24px; }
.secim-kutulari { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.secim-kutu {
  padding: 16px; font-family: inherit; font-size: 13px; letter-spacing: 0.06em; cursor: pointer;
  background: transparent; color: var(--murekkep);
  border: 1px solid rgba(141,155,128,0.55); transition: background 220ms ease, color 220ms ease, border-color 220ms ease;
}
.secim-kutu:hover { border-color: var(--zeytin); }
.secim-kutu-aktif { background: var(--zeytin); color: var(--kagit); border-color: var(--zeytin); }
.tuzak { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; }

.ana-buton {
  display: inline-block; padding: 16px 36px; font-family: inherit;
  font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; text-decoration: none;
  color: var(--kagit); background: var(--zeytin); border: 0; cursor: pointer;
  transition: background 240ms ease;
}
.ana-buton:hover { background: var(--murekkep); }
.ana-buton:disabled { opacity: 0.55; cursor: progress; }
.acik-buton { background: rgba(243,239,230,0.14); border: 1px solid rgba(243,239,230,0.55); }
.acik-buton:hover { background: rgba(243,239,230,0.9); color: var(--murekkep); }
.baglanti-buton {
  background: none; border: 0; padding: 0; margin-top: 18px; cursor: pointer;
  font-family: inherit; font-size: 12px; letter-spacing: 0.16em;
  color: var(--zeytin); text-decoration: underline; text-underline-offset: 5px;
}
.form-hata { color: #9C3B2E; font-size: 13px; margin: 0 0 14px; }
.form-dipnot { font-size: 12px; color: var(--zeytin); margin-top: 18px; }
.form-tamam { text-align: center; padding: 24px 0; }
.form-tamam-baslik {
  font-family: var(--baslik-yazi); font-style: italic;
  font-size: 30px; margin: 16px 0 10px;
}
.form-tamam-alt { max-width: 42ch; margin: 0 auto; font-size: 15px; }

/* Paylaşım ve alt --------------------------------------------------- */
.etiket-adi {
  font-family: var(--baslik-yazi); font-weight: 300; font-style: italic;
  font-size: clamp(40px, 10vw, 76px); margin: 14px 0 14px;
}
.paylas-alt { max-width: 40ch; margin: 0 auto; font-size: 15px; }
.alt {
  position: relative; overflow: hidden;
  background: var(--murekkep); color: rgba(243,239,230,0.75); text-align: center;
  padding: 56px 20px 36px; font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase;
}

/* Küçük ekranlar ---------------------------------------------------- */
/* Tipografi düzeni --------------------------------------------------- */
/* Sayfadaki bütün yazı kararları burada toplanır; üstteki bölüm kuralları
   yalnızca yerleşimden sorumludur. Üç rol vardır:
   1) Etiket  — büyük harf, geniş harf aralığı, Jost
   2) Başlık  — Cormorant Garamond, düz
   3) Ad      — Cormorant Garamond, italik (yalnızca özel adlar)            */

.koordinat,
.ust-etiket,
.alan-etiket,
.kart-koordinat,
.kart-tarih,
.giris-yer,
.kaydir-ipucu,
.sayim-etiket,
.sahne-ipucu,
.ikili-gorsel figcaption,
.ana-buton,
.alt {
  font-family: var(--govde-yazi);
  font-weight: 400;
  font-size: 11px;
  line-height: 1.6;
  letter-spacing: 0.28em;
  text-transform: uppercase;
}
.giris-tarih {
  font-family: var(--govde-yazi);
  font-weight: 400;
  font-size: 13px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
}
.kart-koordinat { font-size: 8px; letter-spacing: 0.28em; }
.sayim-etiket, .kaydir-ipucu { font-size: 10px; }

.baslik,
.mutlu-gun,
.form-tamam-baslik,
.program-saat,
.sayim-sayi,
.isimler,
.kart-isim,
.lokasyon-ad,
.etiket-adi,
.serit-yazi {
  font-family: var(--baslik-yazi);
  font-weight: 300;
  font-style: normal;
  line-height: 1.15;
}
.isimler, .kart-isim, .lokasyon-ad, .etiket-adi, .serit-yazi { font-style: italic; }

.isimler { font-size: clamp(48px, 13vw, 108px); line-height: 1.02; }
.lokasyon-ad, .etiket-adi { font-size: clamp(34px, 7vw, 60px); }
.baslik { font-size: clamp(30px, 5vw, 46px); }
.serit-yazi { font-size: clamp(24px, 4.4vw, 38px); }
.mutlu-gun, .form-tamam-baslik { font-size: clamp(24px, 4vw, 32px); }
.sayim-sayi { font-size: clamp(38px, 9vw, 66px); line-height: 1; }
.program-saat { font-size: 24px; }
.kart-isim { font-size: clamp(24px, 6vw, 34px); }

.program-baslik, .form-tamam-alt, .paylas-alt, .lokasyon-alt, .ikili p, .form-dipnot {
  font-family: var(--govde-yazi);
  font-weight: 300;
  letter-spacing: 0.01em;
  text-transform: none;
}
.program-baslik { font-size: 17px; }
.program-detay, .form-dipnot { font-size: 13px; letter-spacing: 0.04em; }
.secim-kutu, .baglanti-buton { font-family: var(--govde-yazi); font-size: 13px; letter-spacing: 0.14em; }

@media (max-width: 780px) {
  .filigran { display: none; }
  .filiz { width: 60px; height: 60px; }
  .z-ayrac-motif { width: 104px; }
  .zambak-sirasi { height: clamp(70px, 11vh, 100px); }
  .dantel-cerceve { padding: 34px 20px; }
  .ikili { grid-template-columns: 1fr; gap: 32px; }
  .ikili-gorsel img { height: 320px; }
  .form-satir, .secim-kutulari { grid-template-columns: 1fr; }
  .form-satir { gap: 0; }
  .secim-kutulari { gap: 10px; }
  .bolum { padding: 72px 22px; }
  .program li { grid-template-columns: 72px 1fr; gap: 2px 18px; }
}

@media (prefers-reduced-motion: reduce) {
  .sayfa *, .sayfa *::before, .sayfa *::after {
    transition-duration: 1ms !important; animation: none !important;
  }
  .belir { opacity: 1; transform: none; }
}
`;
