# Supervoid Editions

A responsive, static landing page and catalogue for Supervoid Editions.
The site uses a deep blue-black CSS canvas and the transparent
`assets/supervoid-logo-bw-2-transparent.png` mark. The uploaded backgrounds,
earlier logos, and `source_main*.png` files remain design references
and are excluded from the deployable build.

## Local development

```bash
npm run dev
```

Visit `http://localhost:4173` on this computer. Both development and preview
servers listen on the local network by default, so another device on the same
network can visit `http://<this-computer's-LAN-IP>:4173`. Set `HOST` or `PORT`
to override either value. Build the deployable static site with `npm run build`,
then check it with `npm run preview`. The build creates entry points for `/`,
`/catalogue`, `/about`, and `/privacy`. The latter two URLs open panels over the
home page. Node.js 22 or later is required; no package installation is needed.

## Loops newsletter connection

Newsletter sign-ups use the Loops Form Endpoint assigned to
`window.SUPERVOID_LOOPS_FORM_URL` in `index.html` before `src/main.js` loads.
The site sends the email as URL-encoded form data and only shows success when
Loops returns `{ "success": true }`. To replace the form, update that endpoint
assignment with the new URL copied from Loops → Forms → Settings.

The social icons link to `https://t.me/supervoid_editions` and
`https://www.instagram.com/supervoid.editions/` by default. Set
`window.SUPERVOID_TELEGRAM_URL` or `window.SUPERVOID_INSTAGRAM_URL` before
`src/main.js` loads to override either HTTPS profile URL.

## Public deployment

GitHub Pages publishes the tracked `docs/` directory from `main` at
`https://supervoideditions.com`. Regenerate that directory after a site change:

```bash
npm run build:pages
```

The Pages build includes the custom-domain `CNAME` and disables Jekyll so the
static output is served unchanged. Commit the regenerated `docs/` files with
the corresponding source changes.
