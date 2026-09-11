# EggBrain Radio

Personal site for indie products and writing.

- **Work** — project pages (`src/content/work`)
- **Words** — essays and notes (`src/content/words`)
- Stack: [Astro](https://astro.build) → static output for **Cloudflare Pages**

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

Output directory: `dist/`

## Cloudflare Pages

1. Connect this GitHub repo in Cloudflare Pages.
2. Framework preset: **Astro** (or set build command `npm run build`, output `dist`).
3. Node version: `22` or newer.
4. After the first deploy, attach your custom domain.

## Content

Create Markdown files with frontmatter:

```bash
# New project
src/content/work/my-app.md

# New post
src/content/words/my-note.md
```

Site metadata lives in `src/consts.ts`. Update `site` in `astro.config.mjs` when the real domain is ready.
