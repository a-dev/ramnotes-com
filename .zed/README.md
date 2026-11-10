# Zed setup

Open the RAMnotes repository root in Zed and run `bun install`.
Install the Astro, Oxc, TypeScript Language Server (`tsgo`), Stylelint,
and CSS Variables (LSP) extensions through `zed: extensions`.

## Languages and formatting

Astro supplies template diagnostics and completions. Astro files format on save
through the project-local Oxfmt executable, using Zed's external formatter with
`--stdin-filepath {buffer_path}`. This formats the full file, including HTML
and frontmatter. `.oxfmtrc.json` enables `astro: true`; `@astrojs/compiler-rs`
is an explicit development dependency. Oxfmt bundles its Astro/Prettier formatter,
so Zed's own Prettier integration remains disabled.

Install the Astro extension, reopen the project root, then save an `.astro` file
or run `editor: format`. The external formatter uses the installed project version
rather than an editor-managed binary. Run `bun run format` for the same formatting
from the CLI. External formatters operate on the full buffer, not a selection.
See [Zed's Astro support](https://zed.dev/docs/languages/astro) and
[Oxfmt Astro options](https://oxc.rs/docs/guide/usage/formatter/config-file-reference#astro).

Oxfmt formats JavaScript, TypeScript, JSON/JSONC, Markdown, YAML, HTML, and CSS
with `.oxfmtrc.json`. Oxlint provides JavaScript and TypeScript diagnostics and
`source.fixAll.oxc` fixes on format. Type-aware linting is not enabled; project
type checks run through `astro check`. The CLI also lints Astro script blocks.

Stylelint validates CSS and applies `source.fixAll.stylelint` on format. CSS
variable lookup reads `src/shared/styles/**/*.css`.
CSS Module class names stay kebab-case; Vite exposes camelCase keys to Astro.
Generated CSS Module declarations come from `bun run build` or the dev server.

## Tasks

Use `task: spawn` to run the tasks in `tasks.json`. They use existing package
scripts for development, linting, formatting, Astro checks, builds, Wrangler
preview, browser QA, and environment verification. Tasks save edited buffers
before running. Browser QA requires a running Wrangler preview on port 8787.
There are no unit test suites yet, so no Vitest tasks are offered.

Deployment remains an explicit `bun run deploy` command in the terminal.
See the root README for production configuration.

## Verification

CLI checks can verify the shared tool configurations. Extension installation,
save actions, completions, and diagnostics still need an interactive smoke check
in Zed. See [Zed language settings](https://zed.dev/docs/configuring-languages)
and [Zed tasks](https://zed.dev/docs/tasks).
