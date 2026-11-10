import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const articleIsDraft = /^draft:\s*true\s*$/m.test(
  readFileSync("src/content/articles/ram-and-notes.md", "utf8"),
);

for (const [name, settings, production] of [
  ["local", {}, false],
  ["branch preview", { WORKERS_CI_BRANCH: "feature" }, false],
  ["main", { WORKERS_CI_BRANCH: "main" }, true],
  ["local deploy", { SITE_ENV: "production" }, true],
  ["explicit preview", { SITE_ENV: "preview", WORKERS_CI_BRANCH: "main" }, false],
]) {
  const env = { ...process.env };
  delete env.SITE_ENV;
  delete env.WORKERS_CI_BRANCH;
  Object.assign(env, settings);
  const result = spawnSync(
    "bun",
    ["-e", 'import { isProductionBuild } from "./src/lib/env.ts"; console.log(isProductionBuild)'],
    { env, encoding: "utf8" },
  );
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.trim(), String(production), name);
}
for (const production of [true, false]) {
  const env = { ...process.env, SITE_ENV: production ? "production" : "preview" };
  const build = spawnSync("bun", ["run", "build"], { env, encoding: "utf8" });
  assert.equal(build.status, 0, build.stderr);
  const home = readFileSync("dist/index.html", "utf8");
  assert.equal(home.includes('name="robots" content="noindex"'), !production);
  const robots = readFileSync("dist/robots.txt", "utf8");
  assert.equal(robots.includes("Disallow: /"), !production);
  assert.equal(robots.includes("Sitemap:"), production);

  const tokenConfigured = !/analyticsToken:\s*""/.test(readFileSync("src/site.config.ts", "utf8"));
  assert.equal(home.includes("data-cf-beacon"), production && tokenConfigured);
  for (const page of ["404", "support/thanks"])
    assert.ok(
      readFileSync(`dist/${page}.html`, "utf8").includes('name="robots" content="noindex"'),
    );
  const sitemap = readFileSync("dist/sitemap-0.xml", "utf8");
  const article = readFileSync("dist/articles/ram-and-notes.html", "utf8");
  assert.equal(article.includes('name="robots" content="noindex"'), !production || articleIsDraft);
  assert.equal(sitemap.includes("/articles/ram-and-notes</loc>"), !articleIsDraft);
  for (const excluded of ["article", "404", "support/thanks"])
    assert.ok(!sitemap.includes(`/${excluded}</loc>`));
}
console.log(
  "Environment QA passed: five flag cases and production/preview output. Final dist is a preview build.",
);
