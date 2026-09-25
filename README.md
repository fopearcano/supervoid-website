# Supervoid Editions

A responsive, static landing page and catalogue for Supervoid Editions.
The site uses `assets/background.png`, `assets/background-mobile.png`, and
`assets/supervoid-logo-01.png`. The `source_main*.png` files are design references
and are excluded from the deployable build.

## Local development

```bash
npm run dev
```

Visit `http://localhost:4173`. Build the deployable static site with `npm run build`,
then check it with `npm run preview`. The build creates entry points for `/`,
`/catalogue`, `/about`, and `/privacy` for static hosting. Node.js 22 or later is
required; no package installation is needed.

## Loops newsletter connection

Newsletter sign-ups are disabled until `window.SUPERVOID_LOOPS_FORM_URL` is set
to a working HTTPS form endpoint before `src/main.js` loads. A configured form
only shows success after the endpoint responds successfully. Verify the endpoint
and update the privacy notice with the provider and contact details before
enabling sign-ups.

To activate social links, set `window.SUPERVOID_TELEGRAM_URL` to an HTTPS `t.me`
profile and `window.SUPERVOID_INSTAGRAM_URL` to an HTTPS `instagram.com` profile
before `src/main.js` loads. Without those values, the icons remain visible but
are not clickable.
