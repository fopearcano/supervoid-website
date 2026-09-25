# Supervoid Editions

A responsive, cinematic landing page and catalogue for Supervoid Editions.

The visual treatment is created entirely with HTML and CSS, so the repository
does not require binary image assets.

## Local development

```bash
npm run dev
```

Visit `http://localhost:4173`. Build the deployable static site with `npm run build`.

## Loops newsletter connection

Set `window.SUPERVOID_LOOPS_FORM_URL` to the public Loops form endpoint before
`src/main.js` loads. Until an endpoint is supplied, the form retains its full UI
and success state without sending subscriber data.
