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

function ZambakMuhru({ boyut = 96 }) {
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
      <circle className="muhur-goze" cx="0" cy="0" r="4.5" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Dantel — kenar ve madalyon süslemeleri                               */
/* ------------------------------------------------------------------ */

/** Tarak biçimli dantel kenar. yon="ust" yukarı, yon="alt" aşağı bakar. */
function DantelKenar({ yon = "ust", sinif = "" }) {
  return <div className={`dantel dantel-${yon} ${sinif}`} aria-hidden="true" />;
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
            <circle className="ayrac-nokta" cx="0" cy="-15" r="1.5" />
          </g>
        ))}
        <circle className="ayrac-goze" cx="0" cy="0" r="3.5" />
      </svg>
      <span className="ayrac-cizgi" />
    </div>
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
          <DantelKenar yon="alt" sinif="kart-dantel kart-dantel-ust" />
          <span className="kart-koordinat">39°50′ K → 41°01′ K</span>
          <p className="kart-isim">Özge & Emir</p>
          <span className="kart-tarih">20 . 09 . 2026</span>
          <DantelKenar yon="ust" sinif="kart-dantel kart-dantel-alt" />
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
          {i > 0 && <span className="sayim-ayrac">:</span>}
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

function Belir({ children, className = "", as: Etiket = "div", id }) {
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
    <Etiket id={id} ref={ref} className={`belir ${gorundu ? "belir-acik" : ""} ${className}`}>
      {children}
    </Etiket>
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
  const [form, setForm] = useState(BOS_FORM);
  const [durum, setDurum] = useState("bekliyor");
  const [hataMetni, setHataMetni] = useState("");

  const degistir = useCallback((alan, deger) => {
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
    } catch (hata) {
      setDurum("hata");
      setHataMetni(
        hata.message === "Failed to fetch"
          ? "Sunucuya ulaşılamadı. Yayındaki sitede tekrar deneyin."
          : hata.message
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
          onChange={(e) => degistir("adSoyad", e.target.value)}
        />
      </label>

      <div className="form-satir">
        <label className="alan">
          <span className="alan-etiket">E‑posta</span>
          <input
            type="email"
            value={form.eposta}
            autoComplete="email"
            onChange={(e) => degistir("eposta", e.target.value)}
          />
        </label>
        <label className="alan">
          <span className="alan-etiket">Telefon (isteğe bağlı)</span>
          <input
            type="tel"
            value={form.telefon}
            autoComplete="tel"
            onChange={(e) => degistir("telefon", e.target.value)}
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
          onChange={(e) => degistir("kisiSayisi", Number(e.target.value))}
        />
      </label>

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
            <p className="giris-tarih">20 Eylül 2026 · Pazar · 18.30</p>
            <p className="giris-yer">A11 Hotel Bosphorus, Üsküdar</p>
          </div>
          <span className="kaydir-ipucu">aşağı kaydırın</span>
          <DantelKenar yon="ust" sinif="foto-dantel" />
        </header>

        {/* — Geri sayım — */}
        <Belir as="section" className="bolum orta">
          <p className="ust-etiket">Mutlu güne son</p>
          <GeriSayim />
          <DantelAyrac />
        </Belir>

        {/* — Hikâye: Bozcaada — */}
        <Belir as="section" className="bolum ikili">
          <figure className="ikili-gorsel">
            <img src={FOTO.bozcaada} alt="Bozcaada'da denize inen taş sokak" />
            <figcaption>Bozcaada, eylül</figcaption>
          </figure>
          <div className="ikili-metin">
            <span className="koordinat">39°50′ K · 26°04′ D — Bozcaada</span>
            <h2 className="baslik">Bozcaada'da başladı</h2>
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
          <h2 className="baslik orta-baslik">20 Eylül 2026</h2>
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
          <DantelKenar yon="ust" sinif="foto-dantel" />
          <div className="lokasyon-metin">
            <p className="ust-etiket acik">Lokasyon</p>
            <h2 className="lokasyon-ad">A11 Hotel Bosphorus</h2>
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
        <Belir as="section" id="rsvp" className="bolum katilim">
          <div className="dantel-cerceve">
            <p className="ust-etiket">Lütfen katılım durumunuzu bildiriniz</p>
            <KatilimFormu />
          </div>
        </Belir>

        {/* — Paylaşım — */}
        <Belir as="section" className="bolum orta paylas">
          <DantelAyrac />
          <h2 className="etiket-adi">#OzgeEmir</h2>
          <p className="paylas-alt">
            Çektiğiniz her kareyi bu etiketle paylaşın; gece bitince hepsini bir araya
            toplayacağız.
          </p>
        </Belir>

        <footer className="alt">Özge &amp; Emir · 20 Eylül 2026 · İstanbul</footer>
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
  background: var(--kagit);
  color: var(--murekkep);
  font-family: 'Jost', system-ui, sans-serif;
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
  background: #F1EBDF;
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
  font-family: 'Cormorant Garamond', Georgia, serif; font-style: italic; font-weight: 300;
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
.muhur-goze { fill: var(--adacayi); }

.sahne-ipucu {
  position: relative; margin-top: 46px;
  font-size: 10px; letter-spacing: 0.36em; text-transform: uppercase; color: var(--zeytin);
  animation: nefes 2600ms ease-in-out infinite;
}
.asama-1 .sahne-ipucu, .asama-2 .sahne-ipucu, .asama-3 .sahne-ipucu { opacity: 0; }
@keyframes nefes { 0%, 100% { opacity: 0.45; } 50% { opacity: 1; } }

/* Dantel ------------------------------------------------------------ */
/* Tarak kenar: krem yarım daireler + üzerinde ajur delikleri */
.dantel {
  position: absolute; left: 0; right: 0; height: 24px; z-index: 6; pointer-events: none;
  background-repeat: repeat-x;
  background-size: 24px 24px, 24px 24px, 100% 3px;
}
.dantel-ust {
  bottom: 0;
  background-image:
    radial-gradient(circle at 12px 24px, transparent 6.6px, rgba(141,155,128,0.55) 7px, rgba(141,155,128,0.55) 7.9px, transparent 8.3px),
    radial-gradient(circle at 12px 24px, var(--kagit) 11px, transparent 11.4px),
    linear-gradient(var(--kagit), var(--kagit));
  background-position: bottom, bottom, bottom;
}
.dantel-alt {
  top: 0; transform: scaleY(-1);
  background-image:
    radial-gradient(circle at 12px 24px, transparent 6.6px, rgba(141,155,128,0.55) 7px, rgba(141,155,128,0.55) 7.9px, transparent 8.3px),
    radial-gradient(circle at 12px 24px, var(--kagit) 11px, transparent 11.4px),
    linear-gradient(var(--kagit), var(--kagit));
  background-position: bottom, bottom, bottom;
}
.foto-dantel { height: 26px; }
.foto-dantel-ust { top: 0; bottom: auto; }

/* Dantel madalyon ayracı */
.ayrac { display: flex; align-items: center; justify-content: center; gap: 18px; margin: 46px auto 0; max-width: 420px; }
.ayrac-cizgi { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, rgba(141,155,128,0.6), transparent); }
.ayrac-halka { fill: none; stroke: var(--adacayi); stroke-width: 0.8; stroke-dasharray: 2 3.4; }
.ayrac-yaprak { fill: rgba(141,155,128,0.16); stroke: var(--adacayi); stroke-width: 0.8; }
.ayrac-nokta { fill: var(--adacayi); }
.ayrac-goze { fill: none; stroke: var(--adacayi); stroke-width: 0.9; }

/* Dantel çerçeve — katılım formunun etrafı */
.dantel-cerceve {
  position: relative; padding: 46px 34px;
  border: 1px solid rgba(141,155,128,0.45);
  background:
    radial-gradient(circle at 12px 12px, rgba(141,155,128,0.35) 1.4px, transparent 1.6px) 0 0 / 24px 24px,
    rgba(255,255,255,0.35);
}
.dantel-cerceve::before {
  content: ''; position: absolute; inset: 7px;
  border: 1px dashed rgba(141,155,128,0.5); pointer-events: none;
}

/* Zarf üzerindeki dantel şeritler */
.kart-dantel { position: absolute; height: 16px; background-size: 16px 16px, 16px 16px, 100% 2px; }
.kart-dantel-ust { top: 0; }
.kart-dantel-alt { bottom: 0; }

/* İçerik ------------------------------------------------------------ */
.icerik { opacity: 0; transition: opacity 1100ms ease 400ms; }
.icerik-acik { opacity: 1; }

.koordinat, .ust-etiket {
  display: block; font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase;
  color: var(--zeytin); margin: 0 0 16px;
}
.koordinat.acik, .ust-etiket.acik { color: rgba(243,239,230,0.85); }
.baslik {
  font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 300;
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
  font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 300; font-style: italic;
  font-size: clamp(48px, 13vw, 108px); line-height: 1.05; margin: 0;
}
.isimler .ve { font-style: normal; font-size: 0.42em; opacity: 0.7; }
.ince-cizgi { width: 64px; height: 1px; background: rgba(243,239,230,0.6); margin: 24px auto; }
.giris-tarih { font-size: 13px; letter-spacing: 0.3em; text-transform: uppercase; margin: 0 0 8px; }
.giris-yer { font-size: 12px; letter-spacing: 0.2em; opacity: 0.8; margin: 0; }
.kaydir-ipucu {
  position: absolute; bottom: 30px; font-size: 9px; letter-spacing: 0.34em;
  text-transform: uppercase; color: var(--kagit); opacity: 0.75;
}

.serit { position: relative; height: 62vh; min-height: 340px; display: grid; place-items: center; }
.serit-yazi {
  position: relative; color: var(--kagit); text-align: center; padding: 0 30px;
  font-family: 'Cormorant Garamond', Georgia, serif; font-style: italic;
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
  font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 300;
  font-size: clamp(38px, 9vw, 66px); line-height: 1; font-variant-numeric: tabular-nums;
}
.sayim-etiket { font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase; color: var(--zeytin); margin-top: 8px; }
.sayim-ayrac { font-family: 'Cormorant Garamond', Georgia, serif; font-size: clamp(30px, 7vw, 52px); color: var(--adacayi); }
.mutlu-gun { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 34px; font-style: italic; }

.ikili { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
.ikili p { margin: 0 0 16px; max-width: 44ch; }
.ikili-gorsel { margin: 0; }
.ikili-gorsel img { width: 100%; height: 500px; object-fit: cover; display: block; }
.ikili-gorsel figcaption {
  font-size: 10px; letter-spacing: 0.26em; text-transform: uppercase;
  color: var(--zeytin); margin-top: 12px;
}

.program { list-style: none; margin: 0 auto; padding: 0; max-width: 620px; }
.program li {
  display: grid; grid-template-columns: 96px 1fr; gap: 2px 26px;
  padding: 22px 0; border-top: 1px solid rgba(141,155,128,0.4);
}
.program li:last-child { border-bottom: 1px solid rgba(141,155,128,0.4); }
.program-saat {
  font-family: 'Cormorant Garamond', Georgia, serif; font-size: 24px; grid-row: span 2;
  color: var(--zeytin); font-variant-numeric: tabular-nums;
}
.program-baslik { font-size: 17px; }
.program-detay { font-size: 13px; color: var(--zeytin); }

.lokasyon { position: relative; min-height: 88vh; display: grid; place-items: center; text-align: center; }
.lokasyon-metin { position: relative; color: var(--kagit); padding: 0 26px; max-width: 560px; }
.lokasyon-ad {
  font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 300; font-style: italic;
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
  font-family: 'Cormorant Garamond', Georgia, serif; font-style: italic;
  font-size: 30px; margin: 16px 0 10px;
}
.form-tamam-alt { max-width: 42ch; margin: 0 auto; font-size: 15px; }

/* Paylaşım ve alt --------------------------------------------------- */
.etiket-adi {
  font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 300; font-style: italic;
  font-size: clamp(40px, 10vw, 76px); margin: 14px 0 14px;
}
.paylas-alt { max-width: 40ch; margin: 0 auto; font-size: 15px; }
.alt {
  background: var(--murekkep); color: rgba(243,239,230,0.75); text-align: center;
  padding: 36px 20px; font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase;
}

/* Küçük ekranlar ---------------------------------------------------- */
@media (max-width: 780px) {
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
