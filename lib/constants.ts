export const wedding = {
  bride: "Özge",

  groom: "Emir",

  heroTitle:
    "Together with our families, we warmly invite you to celebrate the beginning of our forever.",

  date: new Date("2026-09-20T18:30:00"),

  timezone: "Asia/Dubai",

  hashtag: "#OzgeEmir",

  music: "/music/romantic.mp3",

  venue: "Rixos Premium Dubai",

  address: "Rixos Premium Dubai, Jumeirah Beach Residence, Dubai, UAE",

  googleMaps:
    "https://maps.google.com/?q=Rixos+Premium+Dubai",

  language: "en",

  weather: true,

  intro: true,

  gallery: [
    "/images/gallery/1.jpg",
    "/images/gallery/2.jpg",
    "/images/gallery/3.jpg",
    "/images/gallery/4.jpg",
    "/images/gallery/5.jpg",
    "/images/gallery/6.jpg",
    "/images/gallery/7.jpg",
    "/images/gallery/8.jpg",
  ],

  navigation: [
    {
      id: "countdown",
      label: "Countdown",
    },
    {
      id: "details",
      label: "Details",
    },
    {
      id: "schedule",
      label: "Schedule",
    },
    {
      id: "venue",
      label: "Venue",
    },
    {
      id: "rsvp",
      label: "RSVP",
    },
    {
      id: "gallery",
      label: "Gallery",
    },
  ],

  schedule: [
    {
      time: "17:30",
      title: "Guest Arrival",
      description:
        "Welcome drinks and guest reception.",
    },

    {
      time: "18:30",
      title: "Wedding Ceremony",
      description:
        "Our ceremony begins.",
    },

    {
      time: "19:15",
      title: "Cocktail Hour",
      description:
        "Cocktails, music and canapés.",
    },

    {
      time: "20:00",
      title: "Dinner",
      description:
        "Dinner will be served.",
    },

    {
      time: "21:30",
      title: "Cake Cutting",
      description:
        "Join us for our wedding cake.",
    },

    {
      time: "22:00",
      title: "First Dance",
      description:
        "Our first dance together.",
    },

    {
      time: "22:30",
      title: "Party",
      description:
        "Let's celebrate all night.",
    },
  ],

  details: [
    {
      icon: "👗",
      title: "Dress Code",
      description:
        "Formal • Black Tie Optional",
    },

    {
      icon: "🚗",
      title: "Parking",
      description:
        "Complimentary valet parking is available.",
    },

    {
      icon: "🕠",
      title: "Arrival",
      description:
        "Please arrive at least 30 minutes before the ceremony.",
    },

    {
      icon: "🥂",
      title: "Cocktail",
      description:
        "Cocktail hour follows immediately after the ceremony.",
    },

    {
      icon: "📵",
      title: "Unplugged Ceremony",
      description:
        "We kindly ask you to enjoy the ceremony without phones.",
    },

    {
      icon: "🎁",
      title: "Gift",
      description:
        "Your presence is the greatest gift we could ask for.",
    },
  ],

  social: {
    instagram: "",

    brideInstagram: "",

    groomInstagram: "",
  },

  seo: {
    title: "Özge & Emir | Wedding Invitation",

    description:
      "Join us as we celebrate our wedding.",

    keywords: [
      "Wedding",
      "Invitation",
      "Özge",
      "Emir",
      "Dubai",
    ],
  },

  colors: {
    gold: "#B89B5E",

    goldLight: "#E5CF99",

    goldDark: "#8B6A32",

    ivory: "#FCFBF8",

    cream: "#F8F5EF",
  },
} as const;
