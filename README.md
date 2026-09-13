# EggBrain Radio

Personal site for indie products and writing.

- **Work** — project pages (`src/content/work`)
- **Words** — essays and notes (`src/content/words`)
- **Admin** — private online editor at `/admin/` ([Decap CMS](https://decapcms.org) → GitHub)
- Stack: [Astro](https://astro.build) → **Cloudflare Workers** (static `dist/` + `worker/index.js` for OAuth)

## Develop

```bash
npm install
npm run dev
```

### Write locally (optional)

1. In `public/admin/config.yml`, temporarily uncomment `local_backend: true`.
2. Run two terminals:

```bash
npm run dev
npm run cms
```

3. Open [http://localhost:4321/admin/](http://localhost:4321/admin/).
4. Before deploying, comment `local_backend` out again (production must stay off).

Production `/admin` loads a self-hosted `decap-cms.js` (no CDN) and uses GitHub OAuth via `/api/auth`.

## Build

```bash
npm run build
npm run preview
```

Output directory: `dist/` (configured in `wrangler.toml` as assets)

## Cloudflare deploy

This project uses **Workers + Assets**, not classic Pages Functions.

1. Git-connected Worker project `eggbrainradio` builds with `npm run build`.
2. `wrangler.toml` publishes `./dist` as static assets and `worker/index.js` for `/api/*`.
3. Node: `22+`.

### Enable production writing (`/admin`)

1. GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**
   - Homepage URL: `https://eggbrainradio.eggmanqi.workers.dev` (or your custom domain)
   - Authorization callback URL: `https://eggbrainradio.eggmanqi.workers.dev/api/auth`
2. Copy **Client ID** and generate a **Client Secret**.
3. Cloudflare project → **Settings → Variables and Secrets** (Production)
   - `GITHUB_CLIENT_ID` = Client ID
   - `GITHUB_CLIENT_SECRET` = Client Secret (secret)
4. Redeploy after adding secrets.
5. Smoke-test: open `https://eggbrainradio.eggmanqi.workers.dev/api/auth`  
   - Should show “Completing GitHub sign-in…” or redirect to GitHub (not a browser “找不到网页”).
6. Open `/admin/` → **Login with GitHub** (account must have write access to `EggmanQi/EggBrainRadio`).

If your public URL changes, update `backend.base_url` in `public/admin/config.yml` and the OAuth App URLs, then redeploy.

Saving a post commits to `main` and triggers a rebuild. Drafts use `draft: true` and stay off the public Words list.

Optional hardening: Cloudflare Access on `/admin*`.

## Content without the CMS

```bash
# New project
src/content/work/my-app.md

# New post
src/content/words/my-note.md
```

Site metadata: `src/consts.ts`. Canonical site URL: `astro.config.mjs`.
