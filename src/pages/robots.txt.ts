import type { APIRoute } from "astro";

import { isProductionBuild } from "../lib/env";
import { site } from "../site.config";
export const GET: APIRoute = () =>
  new Response(
    isProductionBuild
      ? `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap-index.xml\n`
      : "User-agent: *\nDisallow: /\n",
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
