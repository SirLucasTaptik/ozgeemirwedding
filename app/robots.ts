import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },

    sitemap:
      "https://ozgeemirwedding.com.tr/sitemap.xml",

    host:
      "https://ozgeemirwedding.com.tr",
  };
}
