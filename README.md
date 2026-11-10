# RAMnotes website

The static Astro site for the RAMnotes macOS app, at https://ramnotes.com. Cloudflare Workers serves the files. There is no Worker script, no web font, no UI framework, and no cookie. The site follows the system light or dark theme.

## Commands

Use Bun and Node 22.22 or later. Run `bun install` first.

| Command                       | What it does                                                                                           |
| ----------------------------- | ------------------------------------------------------------------------------------------------------ |
| `bun run dev -- --background` | Starts the dev server in the background. Use `bunx astro dev status`, `stop`, or `logs` to control it. |
| `bun run check`               | Runs all checks: oxlint, Stylelint, Oxfmt, Astro types, and text contrast.                             |
| `bun run format`              | Formats the source files.                                                                              |
| `bun run build`               | Builds a preview into `dist/`.                                                                         |
| `bun run preview`             | Builds and serves the site through Wrangler.                                                           |
| `bun run deploy`              | Builds for production and deploys.                                                                     |
| `bun run qa:env`              | Checks the production and preview build output.                                                        |
| `bun run test:e2e`            | Runs Playwright tests against the built site on Wrangler (port 8787).                                  |

Run `bun run check` before each commit. No pre-commit hook runs it for you.

When you change CSS Module classes, run `bun run build` before `bun run check`. The build makes the class declarations that the type check reads.

## Where things are

| Path                    | Contents                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------ |
| `src/pages/`            | Routes only.                                                                               |
| `src/features/home/`    | Home page body: word notes, note tour, note list, FAQ.                                     |
| `src/features/support/` | Support page body and support form.                                                        |
| `src/features/article/` | Article page body for help and articles.                                                   |
| `src/shared/ui/`        | Components that more than one page uses, plus the header and footer.                       |
| `src/shared/lib/`       | Client helpers shared by features: menus, callouts, arrow hover.                           |
| `src/shared/tones.ts`   | Note tint names and order, as in the app menu.                                             |
| `src/layouts/`          | The base layout and the Markdown page layout.                                              |
| `src/content/pages/`    | Help and privacy, in Markdown.                                                             |
| `src/content/articles/` | Articles, in Markdown.                                                                     |
| `src/shared/styles/`    | Global styles and CSS variables in `vars/`.                                                |
| `src/site.config.ts`    | Domain, support email, publisher, download links, and public service keys.                 |
| `src/lib/env.ts`        | Decides if a build is production or preview.                                               |
| `scripts/`              | Contrast and build environment checks.                                                     |
| `docs/design/`          | [Brand assets](docs/design/brand-assets.md) and [screenshots](docs/design/screenshots.md). |

Do not put components with a CSS Module in `src/pages/`. Their generated declaration files become routes.

## Styles

`AGENTS.md` has the CSS Modules rules. Each component has its own `.module.css` file next to it.

The tone colors and alphas in `src/shared/styles/vars/colors.css` match the app. If a contrast check fails, change the text color, not the tone alpha.

## Content

The privacy page uses `{{publisherName}}` and `{{contactEmail}}`. A remark plugin replaces them with values from `site.config.ts`.

A page or article with `draft: true` shows a notice, gets `noindex`, and is not in the sitemap. The sitemap also leaves out `/support/thanks` and `/404`.

## Production and preview builds

`src/lib/env.ts` uses these rules:

1. If `SITE_ENV` is set, the build is production only when it is `production`.
2. If `SITE_ENV` is not set, the build is production only when `WORKERS_CI_BRANCH` is `main`.
3. All other builds are previews. A plain `bun run build` is a preview.

A production build allows crawling in `robots.txt`, lists the sitemap, and adds the Cloudflare Web Analytics beacon. A preview build has `Disallow: /` and `noindex`, and has no analytics.

## Deployment

GitHub Actions validates pushes and pull requests. A push to `main` deploys the validated build to Cloudflare using the `production` environment.

Deployment requires the `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` GitHub Actions secrets. Keep their values out of the repository.

Cloudflare Workers Builds can also provide branch previews when connected to the repository. Its build environment supplies `WORKERS_CI_BRANCH`.

`wrangler.jsonc` serves HTML without a trailing slash and uses the custom 404 page. `public/_headers` sets the security headers and long caching for `/_astro/*`.

A Cloudflare Redirect Rule sends `www.ramnotes.com` to `ramnotes.com` with a 301 status.

## Support form

The form sends to Web3Forms. The access key in `site.config.ts` is public. If you remove the key, the form cannot send.

Without JavaScript, the form posts and then goes to `/support/thanks`. With JavaScript, the form sends with `fetch` and shows the result on the page. The form keeps the typed text after each result.

## Configuration

`src/site.config.ts` contains the publisher name, contact email, download URLs, and public Web3Forms and analytics identifiers. An empty `appStoreUrl` displays "Coming soon".

Local environment files and Cloudflare state are ignored by Git. Use `.env.example` or `.dev.vars.example` for examples without credentials.

## Maintenance

`bunx wrangler deploy --config maintenance/wrangler.jsonc` replaces the site with the maintenance Worker. Run `bun run deploy` from the repository root to restore the site.

## Editors

`.vscode/` and `.zed/` have editor settings. See [.zed/README.md](.zed/README.md) for Zed.
