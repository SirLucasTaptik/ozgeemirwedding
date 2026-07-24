export const metadata: Metadata = {
  metadataBase: new URL("https://ozgeemirwedding.com.tr"),

  title: {
    default: "Özge & Emir | Wedding Invitation",
    template: "%s | Özge & Emir",
  },

  description:
    "Join us as we celebrate our wedding on 20 September 2026.",

  openGraph: {
    title: "Özge & Emir | Wedding Invitation",

    description:
      "Join us as we celebrate our wedding.",

    url: "https://ozgeemirwedding.com.tr",

    siteName: "Özge & Emir Wedding",

    locale: "en_US",

    type: "website",

    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Özge & Emir Wedding Invitation",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Özge & Emir Wedding",
    description: "Wedding Invitation",
    images: ["/og.jpg"],
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};
