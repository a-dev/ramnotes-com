import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

import { site } from "./site.config";

const schema = z.object({
  title: z.string(),
  description: z.string(),
  updated: z.coerce.date(),
  draft: z.boolean().optional(),
});
const pageLoader = glob({ pattern: "*.md", base: "./src/content/pages" });
const pages = defineCollection({
  loader: {
    ...pageLoader,
    load(context) {
      return pageLoader.load({
        ...context,
        generateDigest: (data) =>
          context.generateDigest({
            data,
            publisherName: site.publisherName,
            contactEmail: site.contactEmail,
          }),
      });
    },
  },
  schema,
});
const articles = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/articles" }),
  schema,
});
export const collections = { pages, articles };
