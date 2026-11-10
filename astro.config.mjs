// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import { readFileSync, existsSync } from "node:fs";
import { site } from "./src/site.config.ts";
import { isProductionBuild } from "./src/lib/env.ts";

import { patchCssModules } from "vite-css-modules";

import { sharedViteConfig } from "./vite.shared.ts";
import { rehypeFootnotePopovers } from "./src/lib/rehype-footnote-popovers.ts";

export default defineConfig({
  site: site.url,
  trailingSlash: "never",
  build: { format: "file" },
  redirects: { "/article": "/articles/ram-and-notes" },
  markdown: {
    processor: unified({
      remarkPlugins: [
        function sitePlaceholders() {
          return (tree) => {
            /** @param {string} value */
            const replace = (value) =>
              value
                .replaceAll("{{contactEmail}}", site.contactEmail)
                .replaceAll("{{publisherName}}", site.publisherName);
            /** @typedef {{type: string, value?: string, url?: string, children?: ContentNode[]}} ContentNode */
            /** @param {ContentNode} node */
            const visit = (node) => {
              if (typeof node.value === "string") node.value = replace(node.value);
              if (typeof node.url === "string") node.url = replace(node.url);
              if (node.children) node.children.forEach(visit);
            };
            visit(tree);
          };
        },
      ],
      rehypePlugins: [rehypeFootnotePopovers],
      remarkRehype: { footnoteLabel: "Notes", footnoteLabelProperties: {} },
    }),
  },
  integrations: [
    {
      name: "validate-publisher",
      hooks: {
        "astro:build:start": () => {
          if (
            isProductionBuild &&
            (!site.publisherName.trim() || /^(TODO|TBD)$/i.test(site.publisherName.trim()))
          ) {
            throw new Error(
              "Set publisherName in src/site.config.ts before building for production.",
            );
          }
        },
      },
    },
    sitemap({
      filter: (url) => {
        const path = new URL(url).pathname;
        if (["/support/thanks", "/404"].includes(path)) return false;
        const sources = [`./src/content/pages${path}.md`, `./src/content${path}.md`]
          .map((source) => new URL(source, import.meta.url))
          .filter((source) => existsSync(source));
        return !sources.some((source) => /^draft:\s*true\s*$/m.test(readFileSync(source, "utf8")));
      },
    }),
  ],
  vite: {
    ...sharedViteConfig,
    plugins: [
      patchCssModules({
        generateSourceTypes: true,
        declarationMap: true,
      }),
    ],
  },
});
