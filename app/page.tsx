// app/page.tsx
export default function Page() {
  return (
    <main>
      {/* Hero */}
      <section className="hero">
        <div className="overlay" />
        <div className="heroContent">
          <p className="eyebrow">Wedding Invitation</p>
          <h1>Özge &amp; Emir</h1>

          <div className="divider">
            <span />
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 21s-6.7-4.35-9.33-8.02C.4 9.77 2.05 5.5 6.07 5.5c2.22 0 3.6 1.32 4.43 2.58.83-1.26 2.2-2.58 4.43-2.58 4.02 0 5.67 4.27 3.4 7.48C18.7 16.65 12 21 12 21z"
              />
            </svg>
            <span />
          </div>

          <h2>20 September 2026</h2>

          <p className="venue">
            A11 Hotel Bosphorus
            <br />
            Üsküdar · İstanbul
          </p>

          <a href="#rsvp" className="primaryButton">
            RSVP
          </a>
        </div>

        <div className="scroll">Scroll</div>
      </section>

      {/* Story */}
      <section className="section reveal">
        <div className="container narrow">
          <span className="sectionLabel">Our Story</span>

          <h2>Bizim hikâyemiz Bozcaada'da başladı.</h2>

          <p>
            Hayatımızın en güzel yolculuğunun yeni bölümünü, en sevdiklerimizle
            birlikte kutlamak istiyoruz.
          </p>
        </div>
      </section>

      {/* Countdown */}
      <section className="section countdown reveal">
        <div className="container">
          <span className="sectionLabel">Countdown</span>

          <div className="countGrid">
            <Countdown />
          </div>
        </div>
      </section>

      {/* Venue */}
      <section className="section venueSection reveal">
        <div className="container">
          <div className="card">
            <span className="sectionLabel">Venue</span>

            <h2>A11 Hotel Bosphorus</h2>

            <p>Üsküdar, İstanbul</p>

            <a
              href="https://maps.google.com/?q=A11+Hotel+Bosphorus+Uskudar"
              target="_blank"
              className="secondaryButton"
            >
              Open Google Maps
            </a>
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section id="rsvp" className="section reveal">
        <div className="container">
          <div className="card formCard">
            <span className="sectionLabel">RSVP</span>

            <form>
              <input placeholder="Ad Soyad" />
              <input placeholder="Telefon" />
              <select>
                <option>Katılıyorum</option>
                <option>Katılamıyorum</option>
              </select>

              <textarea
                placeholder="Mesajınız"
                rows={5}
              />

              <button>Gönder</button>
            </form>
          </div>
        </div>
      </section>

      {/* Instagram */}
      <section className="section reveal">
        <div className="container narrow center">
          <span className="sectionLabel">Instagram</span>

          <h2>#OzgeVeEmir2026</h2>

          <p>
            Bu özel günü birlikte ölümsüzleştirelim.
          </p>
        </div>
      </section>

      <footer>
        <div className="goldLine" />
        <p>We can't wait to celebrate with you.</p>
      </footer>
    </main>
  );
}

function Countdown() {
  return (
    <>
      <Box value="00" label="Days" />
      <Box value="00" label="Hours" />
      <Box value="00" label="Minutes" />
      <Box value="00" label="Seconds" />
    </>
  );
}

function Box({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="countCard">
      <h3>{value}</h3>
      <span>{label}</span>
    </div>
  );
}
