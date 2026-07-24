export const wedding = {
  bride: "Özge",

  groom: "Emir",

  heroTitle:
    "Ailelerimizin mutluluğu ile hayatımızın en özel gününü birlikte kutlamak için sizi aramızda görmekten büyük mutluluk duyarız.",

  date: new Date("2026-09-20T18:30:00"),

  timezone: "Europe/Istanbul",

  hashtag: "#OzgeEmir",

  music: "/music/romantic.mp3",

  venue: "A11 Hotel Bosphorus",

  address:
    "Sultantepe, Paşalimanı Cad. No:10, Üsküdar / İstanbul",

  phone: "+90 216 711 11 11",

  googleMaps:
    "https://www.google.com/maps/dir//A11+Hotel+Bosphorus,+Sultantepe,+Pa%C5%9Faliman%C4%B1+Cad.+No:10,+34550+%C3%9Csk%C3%BCdar%2F%C4%B0stanbul,+T%C3%BCrkiye/@25.0905084,55.1486213,14z/data=!4m8!4m7!1m0!1m5!1m1!1s0x14cab7e569daacb9:0xb642cfd916dc9d51!2m2!1d29.0172863!2d41.0288161?entry=ttu&g_ep=EgoyMDI2MDcyMS4wIKXMDSoASAFQAw%3D%3D",

  language: "tr",

  weather: false,

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
      label: "Geri Sayım",
    },
    {
      id: "details",
      label: "Bilgiler",
    },
    {
      id: "schedule",
      label: "Program",
    },
    {
      id: "venue",
      label: "Mekan",
    },
    {
      id: "rsvp",
      label: "Katılım",
    },
    {
      id: "gallery",
      label: "Galeri",
    },
  ],

  schedule: [
    {
      time: "17:30",
      title: "Misafir Karşılama",
      description: "Karşılama ve ikramlar.",
    },

    {
      time: "18:30",
      title: "Nikâh Töreni",
      description: "Hayatımızın en özel anı.",
    },

    {
      time: "19:15",
      title: "Kokteyl",
      description: "Canlı müzik eşliğinde kokteyl.",
    },

    {
      time: "20:00",
      title: "Akşam Yemeği",
      description: "Yemek servisi başlayacaktır.",
    },

    {
      time: "21:30",
      title: "Pasta Kesimi",
      description: "Bu özel anı birlikte paylaşacağız.",
    },

    {
      time: "22:00",
      title: "İlk Dans",
      description: "İlk dansımız.",
    },

    {
      time: "22:30",
      title: "Kutlama",
      description: "Gece boyunca müzik ve eğlence.",
    },
  ],

  details: [
    {
      icon: "🤍",
      title: "Kıyafet",
      description: "Resmî / Şık Davet",
    },

    {
      icon: "🚗",
      title: "Vale",
      description: "Ücretsiz vale hizmeti bulunmaktadır.",
    },

    {
      icon: "🕠",
      title: "Varış",
      description:
        "Lütfen tören başlamadan en az 30 dakika önce salonda olun.",
    },

    {
      icon: "🥂",
      title: "Kokteyl",
      description:
        "Nikâh töreninin ardından kokteyl düzenlenecektir.",
    },

    {
      icon: "📵",
      title: "Telefonlar",
      description:
        "Nikâh boyunca telefon kullanımını minimumda tutmanızı rica ederiz.",
    },

    {
      icon: "🎁",
      title: "Hediye",
      description:
        "En güzel hediyeniz bu özel günümüzde yanımızda olmanızdır.",
    },
  ],

  social: {
    instagram: "#OzgeEmir",

    brideInstagram: "",

    groomInstagram: "",
  },

  seo: {
    title: "Özge & Emir | Düğün Davetiyesi",

    description:
      "20 Eylül 2026 tarihinde A11 Hotel Bosphorus'ta gerçekleşecek düğünümüze davetlisiniz.",

    keywords: [
      "Özge",
      "Emir",
      "Düğün",
      "Düğün Davetiyesi",
      "İstanbul",
      "Üsküdar",
      "A11 Hotel Bosphorus",
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
