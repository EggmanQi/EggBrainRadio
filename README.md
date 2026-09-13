# EggBrain Radio

Personal site for indie products and writing.

- **Work** — project pages (`src/content/work`)
- **Words** — essays and notes (`src/content/words`)
- **Admin** — private online editor at `/admin/` ([Decap CMS](https://decapcms.org) → GitHub)
- Stack: [Astro](https://astro.build) → static output on **Cloudflare**

## Develop

```bash
npm install
npm run dev
```

### Write locally (no GitHub OAuth)

Terminal 1:

```bash
npm run dev
```

Terminal 2:

```bash
npm run cms
```

Open [http://localhost:4321/admin/](http://localhost:4321/admin/) — Decap talks to `decap-server` and writes Markdown into the repo.

## Build

```bash
npm run build
npm run preview
```

Output directory: `dist/`

## Cloudflare deploy

1. Connect this GitHub repo in Cloudflare (Pages / Workers + Assets).
2. Build: `npm run build` · Output: `dist` · Node: `22+`.
3. Ensure the `/functions` directory is deployed (needed for CMS login). Classic **Pages** picks it up automatically.

### Enable production writing (`/admin`)

1. GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**
   - Homepage URL: `https://eggbrainradio.eggmanqi.workers.dev` (or your custom domain)
   - Authorization callback URL: `https://eggbrainradio.eggmanqi.workers.dev/api/auth`
2. Copy **Client ID** and generate a **Client Secret**.
3. Cloudflare project → **Settings → Variables and Secrets**
   - `GITHUB_CLIENT_ID` = Client ID
   - `GITHUB_CLIENT_SECRET` = Client Secret (secret)
4. If your public URL changes, update `backend.base_url` in `public/admin/config.yml` to match, then redeploy.
5. Open `https://<your-domain>/admin/` → **Login with GitHub** (must be a collaborator/owner of `EggmanQi/EggBrainRadio`).

Saving a post commits to `main` and triggers a rebuild. Drafts use `draft: true` and stay off the public Words list.

Optional hardening: put Cloudflare Access on `/admin*` so only your email can open the CMS UI.

## Content without the CMS

```bash
# New project
src/content/work/my-app.md

# New post
src/content/words/my-note.md
```

Site metadata: `src/consts.ts`. Canonical site URL: `astro.config.mjs`.
