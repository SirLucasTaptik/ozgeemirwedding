"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

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

type Yon = "ust" | "alt";
type Kose = "sol-ust" | "sag-ust" | "sol-alt" | "sag-alt";

type SerpmeYeri = {
  ust: string;
  sol?: string;
  sag?: string;
  boyut: number;
  aci: number;
  saydam: number;
};

type FormAlanlari = {
  adSoyad: string;
  eposta: string;
  telefon: string;
  katilim: "" | "evet" | "hayir";
  kisiSayisi: number;
  not: string;
  website: string;
};

/* Fon görselleri. A11 fotoğrafları doğrudan public klasörünün içindedir;
   Bozcaada görselini kendi çekiminizle değiştirebilirsiniz. */
const FON = {
  su: "/a11-havuz.jpg",
  otel: "/a11-gun-batimi.jpg",
  bozcaada:
    "https://images.pexels.com/photos/34482767/pexels-photo-34482767.jpeg?auto=compress&cs=tinysrgb&w=1600",
};

const DUGUN_TARIHI = new Date("2026-09-20T18:30:00+03:00");

/* Serpme zambakların bölüm bölüm yerleşimi — her bölümde farklı bir dağılım */
const SERPME = {
  gerisayim: [
    { ust: "12%", sol: "6%", boyut: 104, aci: -22, saydam: 0.5 },
    { ust: "58%", sag: "8%", boyut: 138, aci: 26, saydam: 0.42 },
    { ust: "72%", sol: "16%", boyut: 78, aci: -48, saydam: 0.32 },
  ],
  program: [
    { ust: "8%", sag: "5%", boyut: 122, aci: 18, saydam: 0.45 },
    { ust: "46%", sol: "3%", boyut: 92, aci: -34, saydam: 0.38 },
    { ust: "82%", sag: "14%", boyut: 70, aci: 44, saydam: 0.3 },
  ],
  katilim: [
    { ust: "6%", sol: "1%", boyut: 116, aci: -16, saydam: 0.4 },
    { ust: "64%", sag: "1%", boyut: 134, aci: 28, saydam: 0.36 },
  ],
  paylas: [
    { ust: "10%", sol: "8%", boyut: 128, aci: 32, saydam: 0.46 },
    { ust: "54%", sag: "7%", boyut: 96, aci: -26, saydam: 0.4 },
    { ust: "78%", sol: "22%", boyut: 74, aci: 12, saydam: 0.3 },
  ],
  hikaye: [
    { ust: "4%", sag: "2%", boyut: 88, aci: -30, saydam: 0.35 },
    { ust: "70%", sol: "0%", boyut: 108, aci: 20, saydam: 0.3 },
  ],
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
      <SedefTanimi />
      <circle className="muhur-zemin" cx="0" cy="0" r="44" />
      <circle className="muhur-cizgi" cx="0" cy="0" r="36" />
      <g className="muhur-zambak" transform="translate(0 4) scale(0.62)">
        {zambakCicegi(1)}
      </g>
      {/* zambağın çevresini dolanan iri inci kuşağı */}
      {Array.from({ length: 18 }, (_, i) => (
        <circle key={`i${i}`} className="mg-inci" cx="0" cy="-40" r="4.6" transform={`rotate(${i * 20})`} />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Dantel — kenar ve madalyon süslemeleri                               */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Dantel — gerçek dokulu dantel deseni                                 */
/* ------------------------------------------------------------------ */

const KAGIT_RENGI = "#F7F4ED";

/**
 * Tek bir dantel karosu. Gerçek bir dantel bordürün katmanları sırasıyla:
 * tül zemin (ağ örgü), motif alanı (gül ve yaprak), motifleri birbirine
 * bağlayan pikolu köprüler, kalın gipe ipliğiyle çizilmiş fisto kenar ve
 * en uçta piko halkaları. Karo 120 × 74 birimdir.
 */
function dantelKarosu(
  id: string,
  iplik: string,
  tul: string,
  pikoRenk: string,
  olcek = 1
) {
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
          strokeWidth="0.7"
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
      <circle cx="0" cy="0" r="2.6" fill={pikoRenk} stroke={gipe} strokeWidth="0.45" />
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
            strokeWidth="0.6"
          />
          <line x1="0" y1="1" x2="0" y2="-11" stroke={iplik} strokeWidth="0.4" opacity="0.75" />
        </g>
      ))}
    </g>
  );

  return (
    <pattern
      id={id}
      width="120"
      height="74"
      patternUnits="userSpaceOnUse"
      patternTransform={olcek === 1 ? undefined : `scale(${olcek})`}
    >
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
        <g stroke={iplik} strokeWidth="0.26" opacity="0.42">
          {ag}
        </g>
      </g>

      {/* üst kenar: kalın gipe ipliği, ince refakat ipliği ve ajur delikleri */}
      <line x1="0" y1="22" x2="120" y2="22" stroke={gipe} strokeWidth="1.1" />
      <line x1="0" y1="25.4" x2="120" y2="25.4" stroke={iplik} strokeWidth="0.4" opacity="0.6" />
      {[10, 30, 50, 70, 90, 110].map((x) => (
        <circle key={`aj${x}`} cx={x} cy="23.7" r="1.7" fill="none" stroke={iplik} strokeWidth="0.5" />
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
          <circle cx={(x1 + x2) / 2} cy={(y1 + y2) / 2} r="1.5" fill={pikoRenk} />
        </g>
      ))}

      {/* fisto kenar: arkada soluk ikinci kat (duvak katmanı), önde gipe */}
      {fistolar.map((x) => (
        <g key={`f${x}`}>
          <path
            d={`M${x - 4} 44 C ${x + 6} 74, ${x + 54} 74, ${x + 64} 44`}
            fill="none"
            stroke={iplik}
            strokeWidth="0.9"
            opacity="0.4"
          />
          <path
            d={`M${x} 47 C ${x + 8} 71, ${x + 52} 71, ${x + 60} 47`}
            fill="none"
            stroke={gipe}
            strokeWidth="1.25"
            strokeLinecap="round"
          />
          <path
            d={`M${x + 5} 46 C ${x + 12} 65, ${x + 48} 65, ${x + 55} 46`}
            fill="none"
            stroke={iplik}
            strokeWidth="0.45"
            opacity="0.65"
          />
          {gul(x + 30, 58, 0.72)}
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
            r="2.6"
            fill={pikoRenk}
            stroke={gipe}
            strokeWidth="0.45"
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
        {/* fotoğraf üzerinde: beyaz iplik */}
        {dantelKarosu("dantelBeyaz", "#FFFDF9", "rgba(255,255,255,0.46)", "#FFFFFF", 1.4)}
        {/* kâğıt üzerinde: krem iplik, sütbeyazı tül — ton tonuna gelin danteli */}
        {dantelKarosu("dantelKrem", "#E0D5BE", "rgba(255,255,255,0.7)", "#FFFDF8", 1.4)}
        {/* zarf kartı gibi küçük yüzeyler için aynı desenin küçültülmüşü */}
        {dantelKarosu("dantelKremKucuk", "#E0D5BE", "rgba(255,255,255,0.7)", "#FFFDF8", 0.62)}
      </defs>
    </svg>
  );
}

/** Bölüm arkasına serilen, krem tona çekilmiş fon görseli. */
function FonGorsel({ src }: { src: string }) {
  return (
    <div className="fon" aria-hidden="true">
      <img
        className="fon-gorsel"
        src={src}
        alt=""
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
      <span className="fon-tul" />
    </div>
  );
}

/** Bir kenarı kaplayan dantel bordür. */
function DantelKenar({
  yon = "ust",
  sinif = "",
  desen = "dantelBeyaz",
  yukseklik = 104,
}: {
  yon?: Yon;
  sinif?: string;
  desen?: string;
  yukseklik?: number;
}) {
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

/** Bölümler arasına serilen, iki kenarı fistolu tam genişlikte dantel şerit. */
function DantelSerit() {
  return (
    <div className="dantel-serit" aria-hidden="true">
      <svg width="100%" height="104">
        <rect width="100%" height="104" fill="url(#dantelKrem)" />
      </svg>
      <svg width="100%" height="104" className="serit-ters">
        <rect width="100%" height="104" fill="url(#dantelKrem)" />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Zambak — motifler                                                    */
/* ------------------------------------------------------------------ */

/* Zambağın altı tepali: üç dış (dar, geriye kıvrık), üç iç (geniş).
   Uçları geriye kıvrıldığı için beyaz zambak sivri yıldız değil, açılmış
   bir borazan gibi görünür. */
const TEPAL_DIS =
  "M0 4 C -5 -6, -9 -19, -8.4 -30 C -7.8 -39, -3.6 -45, -0.4 -49 C 1.4 -51.4, 3.6 -50.4, 3 -47.4 C 0.6 -40, 0.4 -30, 2.4 -21 C 4.2 -12, 3 -3, 0 4 Z";
const TEPAL_IC =
  "M0 4 C -7 -5, -11.4 -18, -10.4 -29 C -9.6 -38, -4.6 -44, 0 -47.5 C 4.6 -44, 9.6 -38, 10.4 -29 C 11.4 -18, 7 -5, 0 4 Z";

/** Zambak çiçeği: tepaller, borazan boğazı, altı erkek organ ve dişi organ. */
function zambakCicegi(olcek = 1) {
  return (
    <g transform={`scale(${olcek})`}>
      {/* arkadaki üç dış tepal */}
      {[-120, 0, 120].map((a) => (
        <path key={`d${a}`} className="z-tepal z-tepal-dis" transform={`rotate(${a}) scale(0.97)`} d={TEPAL_DIS} />
      ))}
      {/* öndeki üç iç tepal */}
      {[-60, 60, 180].map((a) => (
        <path key={`i${a}`} className="z-tepal" transform={`rotate(${a})`} d={TEPAL_IC} />
      ))}
      {/* boğaz gölgesi */}
      <circle className="z-bogaz" cx="0" cy="0" r="7.5" />
      {/* altı erkek organ: kıvrık filament ve ucunda uzun başçık */}
      {[-104, -62, -20, 22, 64, 106].map((a) => (
        <g key={`e${a}`} transform={`rotate(${a})`}>
          <path className="z-filament" d="M0 0 C 1.5 -10, 4 -19, 7 -26" />
          <ellipse className="z-bascik" cx="8" cy="-28" rx="1.7" ry="4.4" transform="rotate(-24 8 -28)" />
        </g>
      ))}
      {/* dişi organ */}
      <path className="z-filament z-disi" d="M0 0 C -1 -12, -2 -22, -2 -32" />
      <ellipse className="z-tepecik" cx="-2" cy="-34" rx="2.4" ry="1.8" />
    </g>
  );
}

/** Tek bir zambak dalı: sap, mızrak biçimli yapraklar, gonca ve açmış çiçek. */
function zambakDali(anahtar: string | number, ekSinif = "") {
  return (
    <g key={anahtar} className={ekSinif}>
      <path className="z-sap" d="M0 190 C 4 150, -2 108, 0 62" />
      <path className="z-sap z-sap-ince" d="M0 132 C 11 122, 18 106, 20 88" />

      {/* mızrak biçimli, damarlı yapraklar */}
      <g className="z-yaprak-grup">
        <path className="z-yaprak" d="M0 166 C -15 158, -29 140, -31 120 C -15 126, -4 146, 0 166 Z" />
        <path className="z-damar" d="M-1 163 C -11 152, -22 137, -29 124" />
        <path className="z-yaprak" d="M0 144 C 15 135, 27 116, 26 98 C 12 105, 2 124, 0 144 Z" />
        <path className="z-damar" d="M1 141 C 9 130, 17 115, 23 102" />
        <path className="z-yaprak" d="M0 112 C -12 105, -20 90, -20 76 C -9 83, -2 97, 0 112 Z" />
        <path className="z-damar" d="M-1 109 C -7 101, -14 89, -18 79" />
      </g>

      {/* açılmamış gonca */}
      <g transform="translate(20 84)">
        <path className="z-gonca" d="M0 4 C -4.4 0, -6 -8, -3.4 -15 C -1.6 -19.6, 1.6 -19.6, 3.4 -15 C 6 -8, 4.4 0, 0 4 Z" />
        <path className="z-damar" d="M0 3 C -1 -3, -1 -10, 0 -16" />
      </g>

      {/* açmış çiçek */}
      <g transform="translate(0 62)">{zambakCicegi(1)}</g>
    </g>
  );
}

/** Fotoğrafların alt kenarında ilerleyen zambak sırası. */
const SIRA = [
  { x: 44, o: 0.6, s: 1 },
  { x: 148, o: 0.9, s: 1.42 },
  { x: 262, o: 0.7, s: 1.14 },
  { x: 372, o: 1, s: 1.55 },
  { x: 486, o: 0.62, s: 1.05 },
  { x: 590, o: 0.92, s: 1.34 },
  { x: 706, o: 0.68, s: 1.18 },
  { x: 820, o: 0.98, s: 1.48 },
  { x: 934, o: 0.6, s: 1.02 },
  { x: 1036, o: 0.9, s: 1.36 },
  { x: 1146, o: 0.72, s: 1.2 },
];

function ZambakSirasi() {
  return (
    <svg
      className="zambak-sirasi"
      viewBox="0 0 1200 190"
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

/** Üç zambak çiçeğinden ayraç. */
function ZambakAyrac() {
  return (
    <div className="z-ayrac" aria-hidden="true">
      <span className="ayrac-cizgi" />
      <svg viewBox="-124 -58 248 116" className="z-ayrac-motif">
        {[
          [-76, 0.6],
          [0, 0.95],
          [76, 0.6],
        ].map(([x, o]) => (
          <g key={x} transform={`translate(${x} 0)`}>
            {zambakCicegi(o)}
          </g>
        ))}
      </svg>
      <span className="ayrac-cizgi" />
    </div>
  );
}

/** Bölüm köşelerine yaslanan büyük zambak dalı. */
function KoseZambak({
  kose = "sag-ust",
  boyut = "orta",
}: {
  kose?: Kose;
  boyut?: "orta" | "buyuk";
}) {
  return (
    <svg
      className={`kose-zambak kose-${kose} kose-${boyut}`}
      viewBox="-60 0 120 200"
      aria-hidden="true"
    >
      {zambakDali("kose")}
    </svg>
  );
}

/** Bölümlere serpiştirilen tek tek zambak çiçekleri. */
function ZambakSerpme({ yerler }: { yerler: SerpmeYeri[] }) {
  return (
    <>
      {yerler.map((y, i) => (
        <svg
          key={i}
          className="serpme"
          viewBox="-58 -58 116 116"
          aria-hidden="true"
          style={{
            top: y.ust,
            left: y.sol,
            right: y.sag,
            width: y.boyut,
            height: y.boyut,
            opacity: y.saydam,
            transform: `rotate(${y.aci}deg)`,
          }}
        >
          {zambakCicegi(1)}
        </svg>
      ))}
    </>
  );
}

/** Bölüm arkasında soluk duran büyük zambak filigranı. */
function ZambakFiligran({ taraf = "sag" }: { taraf?: "sol" | "sag" }) {
  return (
    <svg className={`filigran filigran-${taraf}`} viewBox="-70 0 140 200" aria-hidden="true">
      {zambakDali("f")}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Nostaljik çizgiler — gravür üslubunda süslemeler                     */
/* ------------------------------------------------------------------ */

/** Kalın–ince çift çizgi: eski matbaa davetiyelerinin ayraç çizgisi. */
function CiftCizgi({ sinif = "" }: { sinif?: string }) {
  return (
    <div className={`cift-cizgi ${sinif}`} aria-hidden="true">
      <span className="cizgi-kalin" />
      <span className="cizgi-ince" />
    </div>
  );
}

/** İki yanı beyaz incili, ortasında O & E monogramı olan ayraç. */
function InciDizisi({
  sinif = "",
  logo = true,
  logoBoyut = 64,
}: {
  sinif?: string;
  logo?: boolean;
  logoBoyut?: number;
}) {
  const taneler = [10, 16, 22, 28];

  const yarim = (ters: boolean) =>
    (ters ? [...taneler].reverse() : taneler).map((cap, i) => (
      <span key={i} className="inci-tane" style={{ width: cap, height: cap }} />
    ));

  return (
    <div className={`inci-dizisi ${sinif}`} aria-hidden="true">
      <span className="dizi-cizgi" />
      <span className="dizi-yarim">{yarim(false)}</span>
      {logo && <Monogram boyut={logoBoyut} />}
      <span className="dizi-yarim">{yarim(true)}</span>
      <span className="dizi-cizgi" />
    </div>
  );
}

/** Köşelere oturan kıvrımlı gravür süsü. */
function KoseSusu({ kose }: { kose: Kose }) {
  return (
    <svg className={`kose-susu susu-${kose}`} viewBox="0 0 60 60" aria-hidden="true">
      <path d="M2 2 H26" />
      <path d="M2 2 V26" />
      <path d="M2 8 C 12 8, 18 14, 18 24" />
      <path d="M8 2 C 8 12, 14 18, 24 18" />
      <path d="M6 6 C 16 10, 22 16, 26 26" />
      <circle cx="26" cy="26" r="2.6" className="inci susu-inci" />
    </svg>
  );
}

/** İncilerin sedef parlaklığı. İnci çizen her SVG bunu kendi içine alır ki
    tanım her koşulda çözülsün. */
function SedefTanimi() {
  return (
    <defs>
      <radialGradient id="mgInci" cx="34%" cy="27%" r="72%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="38%" stopColor="#FFFFFF" />
        <stop offset="72%" stopColor="#FAF6EE" />
        <stop offset="100%" stopColor="#E4DAC6" />
      </radialGradient>
    </defs>
  );
}

/**
 * Ö & E madalyonu. Dıştan içe: ince çerçeve çizgisi, çevresini dolanan inci
 * kuşağı, kesintili iç çizgi, altta çaprazlanan iki zambak filizi ve ortada
 * kavuşan baş harfler.
 */
function Monogram({ boyut = 120 }: { boyut?: number }) {
  const inciler = Array.from({ length: 28 }, (_, i) => (i * 360) / 28);

  return (
    <svg className="monogram" width={boyut} height={boyut} viewBox="-64 -64 128 128" aria-hidden="true">
      <SedefTanimi />

      {/* dış çerçeve */}
      <ellipse className="mg-halka mg-dis" cx="0" cy="0" rx="58" ry="62" />

      {/* inci kuşağı */}
      {inciler.map((a) => (
        <circle key={a} className="mg-inci" cx="0" cy="-53" r="3.6" transform={`rotate(${a})`} />
      ))}

      {/* iç çizgi: altta ve üstte süs için açık bırakılmış */}
      <path
        className="mg-halka mg-ic"
        d="M0 -44 A 40 44 0 0 1 0 44 M0 44 A 40 44 0 0 1 0 -44"
      />
      <path className="mg-halka mg-tuy" d="M0 -40 A 36 40 0 0 1 0 40" />

      {/* altta çaprazlanan iki zambak filizi — halkanın içinde kalır */}
      {[-1, 1].map((y) => (
        <g key={y} transform={`scale(${y} 1)`}>
          <path className="mg-dal" d="M1 42 C -9 40, -17 33, -21 24" />
          <path className="mg-yaprak" d="M-7 39 C -12 36, -15 30, -14 24 C -9 27, -7 33, -7 39 Z" />
          <path className="mg-yaprak" d="M-16 33 C -19 28, -20 23, -18 18 C -15 22, -15 28, -16 33 Z" />
          <g transform="translate(-24 19) scale(0.24)">
            {[-120, 0, 120].map((a) => (
              <path key={a} className="mg-tepal mg-tepal-dis" transform={`rotate(${a})`} d={TEPAL_DIS} />
            ))}
            {[-60, 60, 180].map((a) => (
              <path key={a} className="mg-tepal" transform={`rotate(${a})`} d={TEPAL_IC} />
            ))}
          </g>
        </g>
      ))}

      {/* baş harfler */}
      <text className="mg-harf mg-sol" x="-15" y="6">
        Ö
      </text>
      <text className="mg-ve" x="0" y="2">
        &amp;
      </text>
      <text className="mg-harf mg-sag" x="15" y="6">
        E
      </text>
    </svg>
  );
}

/** Tırtıklı kenarlı eski usul pul, üzerinde çiftin madalyonu. */
function Pul() {
  return (
    <svg className="pul" viewBox="0 0 60 74" aria-hidden="true">
      <SedefTanimi />
      <rect className="pul-zemin" x="3" y="3" width="54" height="68" rx="1" />
      <rect className="pul-cerceve" x="8" y="8" width="44" height="58" />
      <g transform="translate(30 40) scale(0.3)" className="pul-monogram">
        <ellipse className="mg-halka mg-ic" cx="0" cy="0" rx="52" ry="56" />
        {Array.from({ length: 24 }, (_, i) => (i * 360) / 24).map((a) => (
          <circle key={a} className="mg-inci" cx="0" cy="-46" r="4.2" transform={`rotate(${a})`} />
        ))}
        <text className="mg-harf mg-sol" x="-15" y="10">
          Ö
        </text>
        <text className="mg-ve" x="0" y="6">
          &amp;
        </text>
        <text className="mg-harf mg-sag" x="15" y="10">
          E
        </text>
      </g>
      <text className="pul-yazi" x="30" y="16">
        TÜRKİYE
      </text>
      <text className="pul-yazi" x="30" y="64">
        2026
      </text>
    </svg>
  );
}

/** Dairesel posta damgası. */
function Damga() {
  return (
    <svg className="damga" viewBox="-42 -42 84 84" aria-hidden="true">
      <circle className="dm-halka" cx="0" cy="0" r="38" />
      <circle className="dm-halka dm-ince" cx="0" cy="0" r="31" />
      <path id="damgaYolu" d="M0 -24 m -24 0 a 24 24 0 1 1 48 0 a 24 24 0 1 1 -48 0" fill="none" />
      <text className="dm-yazi" x="0" y="-14">
        ÜSKÜDAR
      </text>
      <line className="dm-cizgi" x1="-26" y1="-4" x2="26" y2="-4" />
      <text className="dm-yazi dm-tarih" x="0" y="9">
        20.IX.26
      </text>
      <line className="dm-cizgi" x1="-26" y1="15" x2="26" y2="15" />
      <text className="dm-yazi" x="0" y="27">
        İSTANBUL
      </text>
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
        {/* zarfın gövdesi */}
        <div className="zarf-arka" />

        {/* içeriden çıkan davetiye kartı */}
        <div className="zarf-kart">
          <div className="kart-cerceve">
            <KoseSusu kose="sol-ust" />
            <KoseSusu kose="sag-ust" />
            <KoseSusu kose="sol-alt" />
            <KoseSusu kose="sag-alt" />
            <Monogram boyut={74} />
            <span className="kart-ust-yazi">Nikâh davetiyesi</span>
            <CiftCizgi sinif="kart-ayrac" />
            <p className="kart-isim">Özge &amp; Emir</p>
            <CiftCizgi sinif="kart-ayrac" />
            <span className="kart-tarih">20 EYLÜL 2026</span>
            <span className="kart-yer">A11 Hotel Bosphorus · Üsküdar</span>
          </div>
        </div>

        {/* yan, alt ve üst kapaklar — gerçek bir zarfın dikiş düzeni */}
        <div className="kanat kanat-sol" />
        <div className="kanat kanat-sag" />
        <div className="kanat kanat-alt" />
        <div className="zarf-kapak">
          <div className="kapak-yuz" />
          <div className="kapak-astar" />
        </div>

        {/* zarfın aralığındaki inci kopça: kapağın ucundan gövdeye bağlanan
            ince kordon ve üzerinde gerçek bir inci */}
        <svg className="zarf-kopca" viewBox="-30 -22 60 44" aria-hidden="true">
          <SedefTanimi />
          <path className="kopca-kordon" d="M-19 -13 C -13 8, 13 8, 19 -13" />
          <path className="kopca-kordon kopca-ince" d="M-15 -14 C -10 4, 10 4, 15 -14" />
          <circle className="kopca-inci-govde" cx="0" cy="0" r="8.6" />
          <circle className="kopca-parlak" cx="-3" cy="-3.2" r="2.6" />
        </svg>

        {/* pul ve posta damgası */}
        <div className="zarf-pul">
          <Pul />
        </div>
        <div className="zarf-damga">
          <Damga />
        </div>

        {/* alıcı satırı */}
        <div className="zarf-adres">
          <span className="adres-ust">Sayın</span>
          <span className="adres-ad">Davetlimiz</span>
          <span className="adres-cizgi" />
        </div>

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

function kalanHesapla() {
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
  const [kalan, setKalan] = useState(kalanHesapla);
  useEffect(() => {
    const t = setInterval(() => setKalan(kalanHesapla()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!kalan) return <p className="mutlu-gun">Bugün o gün.</p>;

  return (
    <div className="sayim">
      {kalan.map(([etiket, deger], i) => (
        <React.Fragment key={etiket}>
          {i > 0 && (
            <span className="sayim-ayrac" aria-hidden="true">
              <span className="inci-tane" />
              <span className="inci-tane" />
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

function Belir({
  children,
  className = "",
  as: Etiket = "div",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  id?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
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
    <Etiket id={id} ref={ref} className={`belir ${gorundu ? "belir-acik" : ""} ${className}`}>
      {children}
    </Etiket>
  );
}

/* ------------------------------------------------------------------ */
/* Katılım formu                                                        */
/* ------------------------------------------------------------------ */

const BOS_FORM: FormAlanlari = {
  adSoyad: "",
  eposta: "",
  telefon: "",
  katilim: "",
  kisiSayisi: 1,
  not: "",
  website: "", // spam tuzağı
};

function KatilimFormu() {
  const [form, setForm] = useState(BOS_FORM);
  const [durum, setDurum] = useState("bekliyor");
  const [hataMetni, setHataMetni] = useState("");

  const degistir = useCallback(<A extends keyof FormAlanlari>(alan: A, deger: FormAlanlari[A]) => {
    setForm((o) => ({ ...o, [alan]: deger }));
  }, []);

  const gonder = async () => {
    if (!form.adSoyad.trim() || !form.telefon.trim() || !form.katilim) {
      setDurum("hata");
      setHataMetni("Ad soyad, telefon ve katılım durumu alanlarını doldurun.");
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
    } catch (hata) {
      const mesaj = hata instanceof Error ? hata.message : "Kayıt tamamlanamadı.";
      setDurum("hata");
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
            ? `${form.adSoyad.trim().split(" ")[0]}, 20 Eylül akşamı Üsküdar'da görüşmek üzere.`
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
          onChange={(e) => degistir("adSoyad", e.target.value)}
        />
      </label>

      <div className="form-satir">
        <label className="alan">
          <span className="alan-etiket">Telefon</span>
          <input
            type="tel"
            value={form.telefon}
            autoComplete="tel"
            inputMode="tel"
            onChange={(e) => degistir("telefon", e.target.value)}
          />
        </label>
        <label className="alan">
          <span className="alan-etiket">E‑posta (isteğe bağlı)</span>
          <input
            type="email"
            value={form.eposta}
            autoComplete="email"
            onChange={(e) => degistir("eposta", e.target.value)}
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
              // "gelemiyorum" seçilip geri dönülürse sayaç sıfırda kalmasın
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

      <div className="alan sayac-alan">
        <span className="alan-etiket">Kaç kişi katılıyorsunuz? (siz dâhil)</span>
        <div className="sayac">
          <button
            type="button"
            className="sayac-dugme"
            aria-label="Bir kişi azalt"
            disabled={form.katilim === "hayir" || form.kisiSayisi <= 1}
            onClick={() => degistir("kisiSayisi", Math.max(1, form.kisiSayisi - 1))}
          >
            −
          </button>
          <span className="sayac-deger">{form.katilim === "hayir" ? 0 : form.kisiSayisi}</span>
          <button
            type="button"
            className="sayac-dugme"
            aria-label="Bir kişi ekle"
            disabled={form.katilim === "hayir" || form.kisiSayisi >= 8}
            onClick={() => degistir("kisiSayisi", Math.min(8, form.kisiSayisi + 1))}
          >
            +
          </button>
        </div>
      </div>

      <label className="alan">
        <span className="alan-etiket">Çifte notunuz (isteğe bağlı)</span>
        <textarea
          rows={3}
          value={form.not}
          placeholder="Menü tercihi, alerji ya da yalnızca güzel bir dilek…"
          onChange={(e) => degistir("not", e.target.value)}
        />
      </label>

      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="tuzak"
        value={form.website}
        onChange={(e) => degistir("website", e.target.value)}
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
/* Müzik                                                                */
/* ------------------------------------------------------------------ */

/**
 * Arka plan müziği: Ata Demirer & Melek Büyükçınar — Beyaz Zambaklar.
 *
 * Ses dosyası doğrudan `public/beyaz-zambaklar.mp3` yolundadır.
 *
 * Tarayıcılar sesli otomatik oynatmayı engeller. Bu yüzden müzik ancak
 * ziyaretçi mühre dokunduğunda başlar — o dokunuş tarayıcı için geçerli bir
 * kullanıcı hareketidir. Ziyaretçi istediği an susturabilir.
 *
 * Dosya, sayfa açılışını yavaşlatmasın diye önceden indirilmez; yalnızca zarf
 * açıldığında yüklenir.
 */
const MUZIK_DOSYASI = "/beyaz-zambaklar.mp3";
const SES_DUZEYI = 0.4;

function MuzikCalar({ calsin }: { calsin: boolean }) {
  const sesRef = useRef<HTMLAudioElement | null>(null);
  const [acik, setAcik] = useState(false);
  const [kullanilabilir, setKullanilabilir] = useState(true);

  // sesi birden patlatmadan, iki saniyede yavaşça aç
  const yumusakAc = useCallback((ses: HTMLAudioElement) => {
    ses.volume = 0;
    let adim = 0;
    const zamanlayici = setInterval(() => {
      adim += 1;
      ses.volume = Math.min(SES_DUZEYI, (SES_DUZEYI * adim) / 20);
      if (adim >= 20) clearInterval(zamanlayici);
    }, 100);
  }, []);

  useEffect(() => {
    const ses = sesRef.current;
    if (!ses || !calsin) return;
    ses.load();
    ses
      .play()
      .then(() => {
        yumusakAc(ses);
        setAcik(true);
      })
      .catch(() => setAcik(false)); // tarayıcı engellediyse düğmeyle açılır
  }, [calsin, yumusakAc]);

  const degistir = () => {
    const ses = sesRef.current;
    if (!ses) return;
    if (acik) {
      ses.pause();
      setAcik(false);
    } else {
      ses
        .play()
        .then(() => {
          yumusakAc(ses);
          setAcik(true);
        })
        .catch(() => setKullanilabilir(false));
    }
  };

  if (!kullanilabilir) return null;

  return (
    <>
      <audio
        ref={sesRef}
        src={MUZIK_DOSYASI}
        loop
        preload="none"
        onError={() => setKullanilabilir(false)}
      />
      {calsin && (
        <button
          type="button"
          className="muzik-dugme"
          onClick={degistir}
          aria-label={acik ? "Müziği durdur" : "Müziği çal"}
          title="Beyaz Zambaklar — Ata Demirer & Melek Büyükçınar"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 9.5h3.2L12 5.4v13.2L7.2 14.5H4z" />
            {acik ? (
              <>
                <path className="dalga" d="M15.4 9.2a4 4 0 0 1 0 5.6" />
                <path className="dalga" d="M17.9 6.7a7.5 7.5 0 0 1 0 10.6" />
              </>
            ) : (
              <path className="dalga" d="M15.8 9.6l4.6 4.8M20.4 9.6l-4.6 4.8" />
            )}
          </svg>
          <span>{acik ? "Müzik açık" : "Müzik kapalı"}</span>
        </button>
      )}
    </>
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
      <MuzikCalar calsin={acildi} />

      {!acildi && <Zarf onAcildi={() => setAcildi(true)} />}

      <main className={`icerik ${acildi ? "icerik-acik" : ""}`} aria-hidden={!acildi}>
        {/* — Giriş — */}
        <header className="giris">
          <KoseZambak kose="sag-ust" boyut="buyuk" />
          <KoseZambak kose="sol-ust" boyut="orta" />
          <KoseZambak kose="sol-alt" boyut="buyuk" />
          <KoseZambak kose="sag-alt" boyut="orta" />
          <div className="giris-metin">
            <Monogram boyut={196} />
            <h1 className="isimler">
              <span className="isim-blok">
                <span className="isim">Özge</span>
                <span className="aile">Özmen Ailesi</span>
              </span>
              <span className="ve">&amp;</span>
              <span className="isim-blok">
                <span className="isim">Emir</span>
                <span className="aile">Uyanık Ailesi</span>
              </span>
            </h1>
            <InciDizisi logo={false} />
            <p className="giris-tarih">20 EYLÜL 2026 · PAZAR · 18.30</p>
            <p className="giris-yer">A11 Hotel Bosphorus, Üsküdar</p>
          </div>
          <span className="kaydir-ipucu">aşağı kaydırın</span>
          <DantelKenar yon="ust" desen="dantelKrem" />
        </header>

        {/* — Geri sayım — */}
        <Belir as="section" className="bolum orta fonlu">
          <FonGorsel src={FON.su} />
          <ZambakFiligran taraf="sol" />
          <ZambakFiligran taraf="sag" />
          <KoseZambak kose="sag-ust" boyut="orta" />
          <ZambakSerpme yerler={SERPME.gerisayim} />
          <p className="ust-etiket buyuk-etiket">Mutlu güne son</p>
          <InciDizisi sinif="bolum-inci" />
          <GeriSayim />
          <ZambakAyrac />
        </Belir>

        {/* — Hikâye: Bozcaada — */}
        <Belir as="section" className="bolum hikaye-bolum fonlu">
          <FonGorsel src={FON.bozcaada} />
          <KoseZambak kose="sag-ust" boyut="orta" />
          <ZambakSerpme yerler={SERPME.hikaye} />
          <div className="ikili-metin">
            <span className="koordinat">39°50′ K · 26°04′ D — Bozcaada</span>
            <h2 className="baslik">Bozcaada'da başladı</h2>
            <CiftCizgi sinif="baslik-ayrac" />
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

        {/* — Ara söz — */}
        <section className="serit">
          <KoseZambak kose="sag-ust" boyut="buyuk" />
          <KoseZambak kose="sol-alt" boyut="orta" />
          <div className="serit-cerceve">
            <KoseSusu kose="sol-ust" />
            <KoseSusu kose="sag-ust" />
            <KoseSusu kose="sol-alt" />
            <KoseSusu kose="sag-alt" />
            <p className="serit-yazi">Sizi aramızda görmekten mutluluk duyarız</p>
          </div>
          <DantelKenar yon="ust" desen="dantelKrem" />
        </section>

        {/* — Program — */}
        <Belir as="section" className="bolum">
          <KoseZambak kose="sag-ust" boyut="orta" />
          <ZambakSerpme yerler={SERPME.program} />
          <p className="ust-etiket">Akşamın akışı</p>
          <h2 className="baslik orta-baslik">20 EYLÜL 2026</h2>
          <CiftCizgi sinif="baslik-ayrac" />
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
        <Belir as="section" className="lokasyon fonlu">
          <FonGorsel src={FON.otel} />
          <DantelKenar yon="alt" desen="dantelKrem" />
          <KoseZambak kose="sag-ust" boyut="buyuk" />
          <ZambakSirasi />
          <div className="lokasyon-metin">
            <p className="ust-etiket">Lokasyon</p>
            <h2 className="lokasyon-ad">A11 Hotel Bosphorus</h2>
            <CiftCizgi sinif="baslik-ayrac" />
            <p className="lokasyon-alt">
              Salacak sahilinde, Kız Kulesi'nin tam karşısında. Otopark vardır; Üsküdar
              iskelesinden yürüyerek yaklaşık on dakika sürer.
            </p>
            <a
              className="ana-buton"
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
          <KoseZambak kose="sag-ust" boyut="orta" />
          <ZambakSerpme yerler={SERPME.katilim} />
          <div className="dantel-cerceve">
            <KoseSusu kose="sol-ust" />
            <KoseSusu kose="sag-ust" />
            <KoseSusu kose="sol-alt" />
            <KoseSusu kose="sag-alt" />
            <p className="ust-etiket">Lütfen katılım durumunuzu bildiriniz</p>
            <InciDizisi sinif="form-inci" logoBoyut={48} />
            <KatilimFormu />
          </div>
        </Belir>

        {/* — Paylaşım — */}
        <Belir as="section" className="bolum orta paylas">
          <KoseZambak kose="sag-ust" boyut="buyuk" />
          <ZambakSerpme yerler={SERPME.paylas} />
          <ZambakAyrac />
          <InciDizisi sinif="bolum-inci" logoBoyut={104} />
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
  --kagit: #F7F4ED;
  --sut: #FDFBF6;
  --kagit-koyu: #EFE9DC;
  --murekkep: #2B2E27;
  --krem: #E0D5BE;
  --adacayi: #9AA68E;
  --zeytin: #6B7660;
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
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 18px;
  perspective: 1800px;
  transition: opacity 800ms ease, visibility 800ms ease;
}
.sahne-fon {
  position: absolute; inset: 0; background: var(--kagit-koyu);
  background-image:
    radial-gradient(circle at 30% 20%, rgba(255,255,255,0.8), transparent 55%),
    radial-gradient(circle at 75% 85%, rgba(224,213,190,0.55), transparent 60%);
}
.asama-4 { opacity: 0; visibility: hidden; }

.zarf {
  position: relative; width: min(92vw, 540px); aspect-ratio: 1 / 0.7;
  transform-style: preserve-3d;
  filter: drop-shadow(0 30px 46px rgba(140,122,92,0.18)) drop-shadow(0 3px 6px rgba(140,122,92,0.1));
  transition: transform 900ms cubic-bezier(0.4, 0, 0.2, 1);
}
.asama-3 .zarf, .asama-4 .zarf { transform: translateY(4%) scale(1.03); }

/* kâğıt dokusu: ince lif çizgileri ve yumuşak ışık */
.zarf-arka, .kanat, .kapak-yuz {
  background-color: #FFFFFF;
  background-image:
    repeating-linear-gradient(94deg, rgba(200,186,158,0.06) 0 1px, transparent 1px 5px),
    repeating-linear-gradient(4deg, rgba(200,186,158,0.05) 0 1px, transparent 1px 6px),
    linear-gradient(158deg, #FFFFFF 0%, #FFFFFF 46%, #FBF8F2 100%);
}
.zarf-arka {
  position: absolute; inset: 0; z-index: 1;
  border: 1px solid rgba(222,211,188,0.85);
}

/* yan, alt ve üst kanatlar — gerçek bir zarfın dikiş düzeni */
.kanat { position: absolute; inset: 0; z-index: 4; }
.kanat-sol { clip-path: polygon(0 0, 50.4% 50%, 0 100%); filter: brightness(0.995); }
.kanat-sag { clip-path: polygon(100% 0, 49.6% 50%, 100% 100%); filter: brightness(0.995); }
.kanat-alt { clip-path: polygon(0 100.5%, 50% 49.6%, 100% 100.5%); filter: brightness(0.995); }
.kanat::after {
  content: ''; position: absolute; inset: 0;
  border: 1px solid rgba(226,216,195,0.85);
  clip-path: inherit;
}

.zarf-kapak {
  position: absolute; inset: 0; z-index: 5;
  transform-origin: top center; transform-style: preserve-3d;
  transition: transform 1000ms cubic-bezier(0.6, 0, 0.3, 1), z-index 0ms linear 500ms;
}
.kapak-yuz, .kapak-astar {
  position: absolute; inset: 0; backface-visibility: hidden;
  clip-path: polygon(0 -0.5%, 100% -0.5%, 50% 62%);
}
.kapak-yuz { border-bottom: 1px solid rgba(214,199,170,0.95); }
.kapak-astar {
  transform: rotateX(180deg);
  /* astar kâğıdı: zarfın gövdesinden bir ton sıcak, çapraz kafes desenli.
     Kapak devrildiğinde katlanma yerini gözle gösteren şey bu fark. */
  background-color: #F6EFE0;
  background-image:
    radial-gradient(circle at 50% 50%, rgba(190,172,138,0.28) 1px, transparent 1.4px),
    repeating-linear-gradient(45deg, rgba(190,172,138,0.5) 0 1px, transparent 1px 9px),
    repeating-linear-gradient(-45deg, rgba(190,172,138,0.42) 0 1px, transparent 1px 9px),
    linear-gradient(180deg, rgba(150,128,92,0.16) 0%, transparent 22%);
  background-size: 9px 9px, auto, auto, auto;
}
.asama-2 .zarf-kapak, .asama-3 .zarf-kapak, .asama-4 .zarf-kapak {
  transform: rotateX(-168deg); z-index: 0;
}

/* zarfın aralığındaki inci kopça */
.zarf-kopca {
  position: absolute; z-index: 6; left: 50%; top: 62%;
  width: clamp(46px, 12vw, 68px); height: auto;
  transform: translate(-50%, -50%);
  transition: opacity 420ms ease, transform 620ms ease;
  filter: drop-shadow(0 2px 3px rgba(150,130,98,0.3));
}
.kopca-kordon { fill: none; stroke: rgba(214,202,178,0.95); stroke-width: 1.2; stroke-linecap: round; }
.kopca-ince { stroke-width: 0.6; opacity: 0.7; }
.kopca-inci-govde { fill: url(#mgInci); stroke: rgba(212,198,171,0.8); stroke-width: 0.5; }
.kopca-parlak { fill: #FFFFFF; opacity: 0.85; }
/* kapak açılınca kopça çözülür */
.asama-1 .zarf-kopca { transform: translate(-50%, -46%) scale(1.06); }
.asama-2 .zarf-kopca, .asama-3 .zarf-kopca, .asama-4 .zarf-kopca {
  opacity: 0; transform: translate(-50%, -20%) scale(0.8) rotate(-14deg);
}

/* pul, posta damgası ve alıcı satırı */
.zarf-pul { position: absolute; z-index: 6; top: 7%; right: 7%; width: clamp(46px, 11vw, 66px); }
.zarf-damga { position: absolute; z-index: 6; top: 10%; right: 27%; width: clamp(46px, 12vw, 66px); opacity: 0.5; }
.zarf-pul, .zarf-damga, .zarf-adres { transition: opacity 500ms ease; }
.asama-2 .zarf-pul, .asama-3 .zarf-pul, .asama-4 .zarf-pul,
.asama-2 .zarf-damga, .asama-3 .zarf-damga, .asama-4 .zarf-damga,
.asama-2 .zarf-adres, .asama-3 .zarf-adres, .asama-4 .zarf-adres { opacity: 0; }

.pul { width: 100%; height: auto; display: block; }
.pul-zemin { fill: #FFFFFF; stroke: rgba(196,182,156,0.9); stroke-width: 0.9; stroke-dasharray: 2.6 2.6; }
.pul-cerceve { fill: none; stroke: rgba(196,182,156,0.85); stroke-width: 0.6; }
.pul-yazi { fill: var(--zeytin); font-family: var(--govde-yazi); font-size: 6px; letter-spacing: 0.18em; text-anchor: middle; }
/* pulun üzerindeki O & E madalyonu */
.pul-monogram { color: var(--zeytin); }
.pul-monogram .mg-ic { stroke-width: 3; opacity: 0.7; }
.pul-monogram .mg-inci { stroke-width: 1; }
.pul-monogram .mg-harf { font-size: 40px; }
.pul-monogram .mg-ve { font-size: 20px; }

.damga { width: 100%; height: auto; display: block; color: var(--zeytin); }
.dm-halka { fill: none; stroke: currentColor; stroke-width: 1.6; }
.dm-ince { stroke-width: 0.7; }
.dm-cizgi { stroke: currentColor; stroke-width: 0.7; }
.dm-yazi { fill: currentColor; font-family: var(--govde-yazi); font-size: 8px; letter-spacing: 0.14em; text-anchor: middle; }
.dm-tarih { font-size: 9px; letter-spacing: 0.1em; }

.zarf-adres {
  position: absolute; z-index: 6; left: 9%; bottom: 12%; width: 44%;
  display: flex; flex-direction: column; align-items: flex-start; gap: 2px;
}
.adres-ust { font-family: var(--govde-yazi); font-size: 8px; letter-spacing: 0.3em; text-transform: uppercase; color: var(--zeytin); }
.adres-ad { font-family: var(--baslik-yazi); font-style: italic; font-size: clamp(15px, 3.6vw, 20px); color: var(--murekkep); }
.adres-cizgi { width: 100%; height: 1px; background: rgba(196,182,156,0.9); margin-top: 4px; }

/* içeriden çıkan davetiye kartı */
.zarf-kart {
  position: absolute; left: 5%; right: 5%; top: 6%; bottom: 6%; z-index: 3;
  background: #FFFDF9; border: 1px solid rgba(206,192,164,0.9);
  box-shadow: 0 2px 6px rgba(150,132,100,0.12);
  padding: 7px;
  transition: transform 1200ms cubic-bezier(0.22, 1, 0.36, 1) 260ms;
}
.asama-3 .zarf-kart, .asama-4 .zarf-kart { transform: translateY(-88%); }
.kart-cerceve {
  position: relative; height: 100%;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px;
  border: 1px solid rgba(214,202,178,0.95);
  padding: 12px;
}
.kart-cerceve::before {
  content: ''; position: absolute; inset: 4px;
  border: 1px solid rgba(224,213,190,0.7);
}
.kart-ust-yazi {
  font-family: var(--govde-yazi); font-size: 7.5px; letter-spacing: 0.34em;
  text-transform: uppercase; color: var(--zeytin);
}
.kart-isim {
  font-family: var(--baslik-yazi); font-style: italic; font-weight: 300;
  font-size: clamp(22px, 5.4vw, 32px); margin: 0; color: var(--murekkep); line-height: 1.1;
}
.kart-tarih { font-family: var(--govde-yazi); font-size: 8.5px; letter-spacing: 0.32em; color: var(--murekkep); }
.kart-yer { font-family: var(--govde-yazi); font-size: 7px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--zeytin); margin-top: 3px; }
.kart-ayrac { width: 58%; margin: 6px auto; }
.monogram { margin-bottom: 3px; }

.muhur-buton {
  position: absolute; z-index: 7; left: 50%; top: 50%;
  transform: translate(-50%, -50%);
  background: none; border: 0; padding: 0; cursor: pointer; line-height: 0;
  transition: transform 420ms ease, opacity 420ms ease;
  filter: drop-shadow(0 5px 10px rgba(120,104,76,0.35));
}
.muhur-buton:hover { transform: translate(-50%, -50%) scale(1.05); }
.asama-1 .muhur-buton { transform: translate(-50%, -50%) scale(1.18) rotate(-8deg); }
.asama-2 .muhur-buton, .asama-3 .muhur-buton, .asama-4 .muhur-buton {
  transform: translate(-50%, -30%) scale(0.7) rotate(-22deg); opacity: 0;
}
.muhur-zemin { fill: #FFFFFF; stroke: rgba(222,211,188,0.9); stroke-width: 0.9; }
.muhur-cizgi { fill: none; stroke: rgba(226,216,195,0.85); stroke-width: 0.6; }

.sahne-ipucu {
  position: relative; margin-top: 46px;
  font-size: 10px; letter-spacing: 0.36em; text-transform: uppercase; color: var(--zeytin);
  animation: nefes 2600ms ease-in-out infinite;
}
.asama-1 .sahne-ipucu, .asama-2 .sahne-ipucu, .asama-3 .sahne-ipucu { opacity: 0; }
@keyframes nefes { 0%, 100% { opacity: 0.45; } 50% { opacity: 1; } }

/* Nostaljik gravür çizgileri ----------------------------------------- */
.cift-cizgi { display: flex; flex-direction: column; gap: 2px; width: 100%; }
.cizgi-kalin { height: 2px; background: rgba(190,175,145,0.85); }
.cizgi-ince { height: 1px; background: rgba(214,202,178,0.9); }
.bolum-ayrac { max-width: 240px; margin: 0 auto 28px; }
.serit-cerceve {
  position: relative; padding: 54px 46px; max-width: 640px;
  border: 1px solid rgba(214,202,178,0.9);
}
.serit-cerceve::before {
  content: ''; position: absolute; inset: 6px;
  border: 1px solid rgba(224,213,190,0.7); pointer-events: none;
}
.baslik-ayrac { max-width: 170px; margin: 4px auto 26px; }

.kose-susu {
  position: absolute; width: 40px; height: 40px; pointer-events: none; z-index: 2;
  fill: none; stroke: rgba(190,175,145,0.9); stroke-width: 1; stroke-linecap: round;
}
.kose-susu .susu-inci { stroke: rgba(226,216,196,0.95); stroke-width: 0.3; }
.susu-sol-ust { top: 3px; left: 3px; }
.susu-sag-ust { top: 3px; right: 3px; transform: scaleX(-1); }
.susu-sol-alt { bottom: 3px; left: 3px; transform: scaleY(-1); }
.susu-sag-alt { bottom: 3px; right: 3px; transform: scale(-1); }

/* Fon görselleri ----------------------------------------------------- */
/* Fotoğraf önce griye indirilip krem tona boyanır, sonra üstüne sütbeyazı
   bir tül serilir. Böylece görsel yazının okunmasını hiç engellemez. */
.fon { position: absolute; inset: 0; overflow: hidden; z-index: 0; pointer-events: none; }
.fon-gorsel {
  width: 100%; height: 100%; object-fit: cover; display: block;
  filter: grayscale(1) sepia(0.55) saturate(1.4) brightness(1.06) contrast(0.9);
  opacity: 0.62;
}
.fon-tul {
  position: absolute; inset: 0;
  background:
    linear-gradient(180deg, rgba(253,251,246,0.86) 0%, rgba(253,251,246,0.5) 42%, rgba(253,251,246,0.88) 100%);
}
.fonlu { position: relative; }

.hikaye-bolum { max-width: 680px; margin: 0 auto; text-align: center; }
.hikaye-bolum .ikili-metin { display: flex; flex-direction: column; align-items: center; }
.lokasyon .fon { z-index: 0; }
.lokasyon-metin, .lokasyon .kose-zambak, .lokasyon .zambak-sirasi { z-index: 1; }

/* Ö & E madalyonu ---------------------------------------------------- */
.monogram { display: block; margin: 0 auto; color: var(--zeytin); overflow: visible; }
.mg-halka { fill: none; stroke: currentColor; }
.mg-dis { stroke-width: 0.7; opacity: 0.45; }
.mg-ic { stroke-width: 1.4; opacity: 0.85; }
.mg-tuy { stroke-width: 0.5; opacity: 0.42; }
.mg-inci {
  fill: url(#mgInci); stroke: rgba(216,203,178,0.85); stroke-width: 0.4;
  filter: drop-shadow(0 0.9px 1.1px rgba(150,130,98,0.38));
}
.mg-dal { fill: none; stroke: currentColor; stroke-width: 0.8; opacity: 0.55; }
.mg-yaprak { fill: currentColor; opacity: 0.28; }
.mg-tepal { fill: #FFFFFF; stroke: rgba(190,175,145,0.85); stroke-width: 1.6; }
.mg-tepal-dis { fill: #F7F2E6; }
.mg-harf {
  fill: currentColor; font-family: var(--baslik-yazi); font-style: italic;
  font-weight: 300; font-size: 31px; text-anchor: middle;
}
.mg-sol { text-anchor: end; }
.mg-sag { text-anchor: start; }
.mg-ve {
  fill: currentColor; font-family: var(--baslik-yazi); font-style: italic;
  font-size: 14px; text-anchor: middle; opacity: 0.6;
}

/* İsim blokları ve aile adları --------------------------------------- */
.isimler {
  display: flex; align-items: flex-start; justify-content: center;
  gap: clamp(14px, 4vw, 38px);
}
.isim-blok { display: flex; flex-direction: column; align-items: center; }
.isim { display: block; }
.aile {
  display: block; margin-top: 14px;
  font-family: var(--govde-yazi); font-style: normal; font-weight: 400;
  font-size: clamp(10px, 1.5vw, 13px); letter-spacing: 0.3em; text-transform: uppercase;
  color: var(--zeytin); white-space: nowrap;
}
.isimler .ve {
  font-style: normal; font-size: 0.4em; opacity: 0.7;
  align-self: center; margin-top: -0.35em;
}

/* İri inci dizisi ---------------------------------------------------- */
.inci-dizisi {
  display: flex; align-items: center; justify-content: center; gap: 14px;
  margin: 30px auto 26px; max-width: 620px;
}
.dizi-yarim { display: flex; align-items: center; gap: 9px; }
.inci-tane {
  display: block; border-radius: 50%; flex: 0 0 auto;
  background:
    radial-gradient(circle at 34% 27%, #FFFFFF 0%, #FFFFFF 34%, #FBF8F1 62%, #EFE8DA 100%);
  box-shadow:
    inset -1px -1.5px 3px rgba(196,182,156,0.35),
    inset 1px 1px 2px rgba(255,255,255,0.95),
    0 2px 3px rgba(150,132,100,0.22);
}
/* dizinin ortasındaki O & E madalyonu, incilerle aynı sedef dilde */
.inci-dizisi .monogram { flex: 0 0 auto; margin: 0 4px; color: var(--zeytin); }
.inci-dizisi .monogram .mg-halka { stroke: rgba(200,186,158,0.95); }

/* geri sayımın üstündeki büyük etiket */
.buyuk-etiket {
  font-size: clamp(15px, 3vw, 26px) !important;
  letter-spacing: 0.34em !important;
  color: var(--murekkep) !important;
  margin-bottom: 30px !important;
}
.bolum-inci { margin: 26px auto 30px; }
.form-inci { margin: 18px auto 6px; max-width: 300px; }
.dizi-cizgi {
  flex: 1; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(214,202,178,0.95), transparent);
}


/* Müzik düğmesi — sağ altta sabit, sayfayla aynı sessiz dilde */
.muzik-dugme {
  position: fixed; right: 18px; bottom: 18px; z-index: 40;
  display: flex; align-items: center; gap: 8px;
  padding: 10px 16px; cursor: pointer;
  font-family: var(--govde-yazi); font-size: 9px; letter-spacing: 0.24em; text-transform: uppercase;
  color: var(--zeytin); background: rgba(253,251,246,0.9);
  border: 1px solid rgba(224,213,190,0.95); border-radius: 999px;
  backdrop-filter: blur(6px);
  transition: background 220ms ease, color 220ms ease;
}
.muzik-dugme:hover { background: var(--zeytin); color: var(--sut); border-color: var(--zeytin); }
.muzik-dugme svg { width: 15px; height: 15px; fill: currentColor; }
.muzik-dugme .dalga { fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; }
@media (max-width: 780px) {
  /* isimler dar ekranda da yan yana durur; punto ve boşluk küçülür */
  .isimler { flex-direction: row; gap: 10px; flex-wrap: nowrap; }
  .isimler .ve { font-size: 0.34em; margin-top: -0.2em; }
  .isim { font-size: clamp(30px, 11vw, 56px); }
  .aile { margin-top: 9px; font-size: 8px; letter-spacing: 0.16em; }
  .inci-dizisi { margin: 22px auto 20px; gap: 12px; }
  .muzik-dugme span { display: none; }
  .muzik-dugme { padding: 11px; right: 14px; bottom: 14px; }
}

/* Köşe zambakları — kenarlara yaslanan büyük dallar */
.kose-zambak {
  position: absolute; color: #FFFFFF; pointer-events: none; z-index: 0;
  filter: drop-shadow(0 2px 4px rgba(150,132,100,0.2));
}
.kose-zambak .z-tepal { stroke: rgba(176,160,128,0.55); stroke-width: 0.55; opacity: 1; }
.kose-zambak .z-tepal-dis { opacity: 0.86; }
.kose-zambak .z-yaprak { fill: #F2EADA; opacity: 0.9; }
.kose-zambak .z-damar { stroke: rgba(176,160,128,0.5); }
.kose-zambak .z-sap { stroke: #E3D9C4; opacity: 0.95; }
.kose-zambak .z-gonca { fill: #FFFFFF; opacity: 0.92; }
.kose-zambak .z-bascik { fill: #D3C39B; }
.kose-orta { width: clamp(120px, 20vw, 210px); height: auto; }
.kose-buyuk { width: clamp(170px, 30vw, 320px); height: auto; }
.kose-sag-ust { top: -14px; right: -26px; transform: rotate(168deg); }
.kose-sol-ust { top: -14px; left: -26px; transform: rotate(-168deg); }
.kose-sag-alt { bottom: -14px; right: -26px; transform: rotate(24deg); }
.kose-sol-alt { bottom: -14px; left: -26px; transform: rotate(-24deg); }

/* Serpme zambaklar — bölüm zeminine dağılmış tek çiçekler */
.serpme {
  position: absolute; color: var(--krem); pointer-events: none; z-index: 0;
}
.serpme .z-tepal { opacity: 0.85; }
.serpme .z-tepal-dis { opacity: 0.6; }
.serpme .z-bogaz { opacity: 0.35; }
.serpme .z-filament { opacity: 0.55; }
.serpme .z-bascik { fill: #D3C39B; opacity: 0.75; }

/* Zambak motifleri --------------------------------------------------- */
.z-sap { fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; opacity: 0.75; }
.z-sap-ince { stroke-width: 1.3; opacity: 0.6; }
.z-yaprak { fill: currentColor; opacity: 0.34; }
.z-damar { fill: none; stroke: currentColor; stroke-width: 0.6; opacity: 0.55; }
.z-tepal { fill: currentColor; opacity: 0.9; stroke: currentColor; stroke-width: 0.5; }
.z-tepal-dis { opacity: 0.68; }
.z-bogaz { fill: currentColor; opacity: 0.28; }
.z-gonca { fill: currentColor; opacity: 0.72; }
.z-filament { fill: none; stroke: currentColor; stroke-width: 0.9; opacity: 0.7; }
.z-disi { stroke-width: 1.1; opacity: 0.8; }
.z-bascik { fill: #CBBC98; opacity: 0.9; }
.z-tepecik { fill: currentColor; opacity: 0.8; }
.muhur-zambak { color: var(--krem); }
.muhur-zambak .z-tepal { fill: #FFFFFF; stroke: #DCD0B6; stroke-width: 0.75; opacity: 1; }
.muhur-zambak .z-tepal-dis { fill: #FAF6EC; opacity: 1; }
.muhur-zambak .z-bogaz { fill: #E2D7C0; opacity: 0.5; }
.muhur-zambak .z-bascik { fill: #CDBF9E; }

/* Fotoğraf altındaki zambak sırası */
.zambak-sirasi {
  position: absolute; left: 0; right: 0; bottom: 0; width: 100%; height: clamp(150px, 24vh, 240px);
  z-index: 5; pointer-events: none; color: #FFFFFF;
  filter: drop-shadow(0 2px 3px rgba(140,122,92,0.22));
}
.zambak-sirasi .z-tepal { opacity: 1; stroke: rgba(176,160,128,0.55); stroke-width: 0.55; }
.zambak-sirasi .z-tepal-dis { opacity: 0.88; }
.zambak-sirasi .z-yaprak { opacity: 0.42; }
.zambak-sirasi .z-sap { opacity: 0.62; }
.zambak-sirasi .z-bascik { fill: #D8C69C; opacity: 1; }


/* Üç zambaklı ayraç */
.z-ayrac { display: flex; align-items: center; justify-content: center; gap: 18px; margin: 30px auto 44px; max-width: 620px; }
.z-ayrac-motif { width: 224px; height: 104px; color: var(--krem); }
.z-ayrac .z-yaprak { opacity: 0.28; }
.z-ayrac .z-tepal { opacity: 0.7; }

/* Bölüm arkasındaki soluk filigran */
.filigran {
  position: absolute; top: 50%; width: 300px; height: 300px;
  transform: translateY(-50%); color: var(--krem); opacity: 0.55;
  pointer-events: none; z-index: 0;
}
.filigran-sol { left: -70px; }
.filigran-sag { right: -70px; transform: translateY(-50%) scaleX(-1); }
.bolum { position: relative; overflow: hidden; }
.bolum > *:not(.filigran):not(.serpme):not(.kose-zambak):not(.fon) { position: relative; z-index: 1; }

/* Ayraç çizgisi */
.ayrac-cizgi { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, rgba(224,213,190,0.9), transparent); }

/* Dantel çerçeve — katılım formunun etrafı */
.dantel-cerceve {
  position: relative; padding: 54px 40px;
  box-shadow: 0 2px 22px rgba(160,142,110,0.09);
  border: 1px solid rgba(224,213,190,0.95);
  background:
    radial-gradient(circle at 36% 30%, #FFFFFF 0%, #FCFAF5 45%, #EDE6D6 76%, transparent 76%) 3px 3px / 21px 21px no-repeat,
    radial-gradient(circle at 36% 30%, #FFFFFF 0%, #FCFAF5 45%, #EDE6D6 76%, transparent 76%) calc(100% - 3px) 3px / 21px 21px no-repeat,
    radial-gradient(circle at 36% 30%, #FFFFFF 0%, #FCFAF5 45%, #EDE6D6 76%, transparent 76%) 3px calc(100% - 3px) / 21px 21px no-repeat,
    radial-gradient(circle at 36% 30%, #FFFFFF 0%, #FCFAF5 45%, #EDE6D6 76%, transparent 76%) calc(100% - 3px) calc(100% - 3px) / 21px 21px no-repeat,
    #FFFFFF;
}
.dantel-cerceve::before {
  content: ''; position: absolute; inset: 7px;
  border: 1px dashed rgba(224,213,190,0.95); pointer-events: none;
}


/* İçerik ------------------------------------------------------------ */
.icerik { opacity: 0; transition: opacity 1100ms ease 400ms; }
.icerik-acik { opacity: 1; }

.koordinat, .ust-etiket {
  display: block; font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase;
  color: var(--zeytin); margin: 0 0 16px;
}
.baslik {
  font-family: var(--baslik-yazi); font-weight: 300;
  font-size: clamp(30px, 5vw, 48px); line-height: 1.18; margin: 0 0 20px;
}
.orta-baslik { text-align: center; }

/* Tam ekran görseller ----------------------------------------------- */

.giris {
  position: relative; height: 100vh; min-height: 580px; display: grid; place-items: center;
  overflow: hidden; background: var(--sut);
}
.serit, .lokasyon { overflow: hidden; position: relative; }
.serit { padding: 74px 24px 116px; display: grid; place-items: center; background: var(--kagit); }
.lokasyon { background: var(--sut); }
.giris-metin { position: relative; text-align: center; color: var(--murekkep); padding: 0 26px; }
.isimler {
  font-family: var(--baslik-yazi); font-weight: 300; font-style: italic;
  font-size: clamp(48px, 13vw, 108px); line-height: 1.05; margin: 0;
}
.isimler .ve { font-style: normal; font-size: 0.42em; opacity: 0.7; }
.giris-tarih { font-size: 13px; letter-spacing: 0.3em; text-transform: uppercase; margin: 0 0 8px; }
.giris-yer { font-size: 12px; letter-spacing: 0.2em; color: var(--zeytin); margin: 0; }
.kaydir-ipucu {
  position: absolute; bottom: 30px; font-size: 9px; letter-spacing: 0.34em;
  text-transform: uppercase; color: var(--zeytin); opacity: 0.9;
}

.serit-yazi {
  position: relative; color: var(--murekkep); text-align: center; padding: 0 30px;
  font-family: var(--baslik-yazi); font-style: italic;
  font-size: clamp(22px, 4.4vw, 38px); max-width: 20ch; margin: 0;
}

/* Bölümler ---------------------------------------------------------- */
.bolum { max-width: 1020px; margin: 0 auto; padding: 78px 26px; }
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
/* iki sedef tane, iki nokta üst üste işaretinin yerine */
.sayim-ayrac {
  display: flex; flex-direction: column; justify-content: center; gap: clamp(7px, 1.6vw, 12px);
  margin-top: clamp(12px, 3vw, 24px);
}
.sayim-ayrac .inci-tane { width: clamp(9px, 1.9vw, 14px); height: clamp(9px, 1.9vw, 14px); }
.mutlu-gun { font-family: var(--baslik-yazi); font-size: 34px; font-style: italic; }

.ikili { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
.ikili-metin p { margin: 0 0 16px; max-width: 46ch; }

.program { list-style: none; margin: 0 auto; padding: 0; max-width: 620px; }
.program li {
  position: relative;
  display: grid; grid-template-columns: 96px 1fr; gap: 2px 26px;
  padding: 22px 0; border-top: 1px solid rgba(224,213,190,0.95);
}
.program li::before {
  content: ''; position: absolute; left: 0; top: -7px; width: 14px; height: 14px; border-radius: 50%;
  background: radial-gradient(circle at 34% 28%, #FFFFFF 0%, #FCFAF5 45%, #EDE6D6 100%);
  box-shadow: 0 1px 2px rgba(150,132,100,0.22);
  box-shadow: 0 1px 2px rgba(43,46,39,0.18);
}
.program li:last-child { border-bottom: 1px solid rgba(224,213,190,0.95); }
.program { position: relative; border-top: 2px solid rgba(190,175,145,0.85); padding-top: 3px; }
.program::after {
  content: ''; position: absolute; left: 0; right: 0; bottom: -4px;
  height: 2px; background: rgba(190,175,145,0.85);
}
.program-saat {
  font-family: var(--baslik-yazi); font-size: 24px; grid-row: span 2;
  color: var(--zeytin); font-variant-numeric: tabular-nums;
}
.program-baslik { font-size: 17px; }
.program-detay { font-size: 13px; color: var(--zeytin); }

.lokasyon { position: relative; padding: 92px 0 0; display: grid; place-items: center; text-align: center; }
.lokasyon-metin { position: relative; color: var(--murekkep); padding: 0 26px; max-width: 560px; }
.lokasyon-ad {
  font-family: var(--baslik-yazi); font-weight: 300; font-style: italic;
  font-size: clamp(34px, 7vw, 60px); margin: 0 0 18px;
}
.lokasyon-alt { font-size: 15px; margin: 0 0 30px; color: var(--zeytin); }

/* Form -------------------------------------------------------------- */
.katilim { max-width: 640px; text-align: center; }
/* form ortalanır; etiketler ve girilen metin de ortalı durur ki sayfanın
   simetrisi bozulmasın */
.form { text-align: center; margin: 30px auto 0; max-width: 440px; }
.alan-etiket { text-align: center; }
.form input, .form textarea { text-align: center; padding: 13px 6px; }
.form textarea { text-align: center; resize: vertical; }

/* kişi sayısı sayacı */
.sayac-alan { margin-bottom: 26px; }
.sayac {
  display: flex; align-items: center; justify-content: center; gap: 22px;
  padding: 6px 0;
}
.sayac-dugme {
  width: 42px; height: 42px; border-radius: 50%; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--govde-yazi); font-size: 19px; line-height: 1;
  color: var(--zeytin); background: #FFFFFF;
  border: 1px solid rgba(214,202,178,0.95);
  transition: background 200ms ease, color 200ms ease, border-color 200ms ease;
}
.sayac-dugme:hover:not(:disabled) { background: var(--zeytin); color: #FFFFFF; border-color: var(--zeytin); }
.sayac-dugme:disabled { opacity: 0.35; cursor: default; }
.sayac-deger {
  min-width: 52px; text-align: center;
  font-family: var(--baslik-yazi); font-weight: 300; font-size: 34px;
  font-variant-numeric: tabular-nums; color: var(--murekkep);
}
.form-satir { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.alan { display: block; margin-bottom: 22px; }
.alan-etiket {
  display: block; font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--zeytin); margin-bottom: 8px;
}
.form input, .form textarea {
  width: 100%; padding: 12px 0; font-family: inherit; font-size: 16px; color: var(--murekkep);
  background: transparent; border: 0; border-bottom: 1px solid rgba(214,202,178,0.95);
  border-radius: 0; transition: border-color 220ms ease;
}
.form input:focus, .form textarea:focus { border-bottom-color: var(--zeytin); }
.form input:disabled { opacity: 0.35; }
.secim { border: 0; padding: 0; margin: 0 0 24px; }
.secim-kutulari { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.secim-kutu {
  padding: 16px; font-family: inherit; font-size: 13px; letter-spacing: 0.06em; cursor: pointer;
  background: transparent; color: var(--murekkep);
  border: 1px solid rgba(214,202,178,0.95); transition: background 220ms ease, color 220ms ease, border-color 220ms ease;
}
.secim-kutu:hover { border-color: var(--zeytin); }
.secim-kutu-aktif { background: var(--zeytin); color: var(--kagit); border-color: var(--zeytin); }
.tuzak { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; }

.ana-buton {
  display: inline-block; padding: 16px 36px; font-family: inherit;
  font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; text-decoration: none;
  color: var(--sut); background: var(--zeytin); border: 0; cursor: pointer;
  transition: background 240ms ease;
}
.ana-buton:hover { background: var(--murekkep); }
.ana-buton:disabled { opacity: 0.55; cursor: progress; }
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
  background: var(--kagit-koyu); color: var(--zeytin); text-align: center;
  padding: 74px 20px 44px; font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase;
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
.sayim-etiket, .kaydir-ipucu { font-size: 10px; }

.baslik,
.mutlu-gun,
.form-tamam-baslik,
.program-saat,
.sayim-sayi,
.isimler,
.lokasyon-ad,
.etiket-adi,
.serit-yazi {
  font-family: var(--baslik-yazi);
  font-weight: 300;
  font-style: normal;
  line-height: 1.15;
}
.isimler, .lokasyon-ad, .etiket-adi, .serit-yazi { font-style: italic; }

.isimler { font-size: clamp(48px, 13vw, 108px); line-height: 1.02; }
.lokasyon-ad, .etiket-adi { font-size: clamp(34px, 7vw, 60px); }
.baslik { font-size: clamp(30px, 5vw, 46px); }
.serit-yazi { font-size: clamp(24px, 4.4vw, 38px); }
.mutlu-gun, .form-tamam-baslik { font-size: clamp(24px, 4vw, 32px); }
.sayim-sayi { font-size: clamp(38px, 9vw, 66px); line-height: 1; }
.program-saat { font-size: 24px; }

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
  .serpme:nth-of-type(n + 3) { display: none; }
  .kose-susu { width: 28px; height: 28px; }
  .serit-cerceve { padding: 38px 26px; }
  .serpme { opacity: 0.28 !important; }
  .filiz { width: 60px; height: 60px; }
  .z-ayrac-motif { width: 104px; }
  .zambak-sirasi { height: clamp(70px, 11vh, 100px); }
  .dantel-cerceve { padding: 34px 20px; }
  .ikili { grid-template-columns: 1fr; gap: 32px; }
    .form-satir, .secim-kutulari { grid-template-columns: 1fr; }
  .form-satir { gap: 0; }
  .secim-kutulari { gap: 10px; }
  .bolum { padding: 54px 22px; }
  .serit { padding: 52px 20px 88px; }
  .program li { grid-template-columns: 72px 1fr; gap: 2px 18px; }
}

@media (prefers-reduced-motion: reduce) {
  .sayfa *, .sayfa *::before, .sayfa *::after {
    transition-duration: 1ms !important; animation: none !important;
  }
  .belir { opacity: 1; transform: none; }
}
`;
