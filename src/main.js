const icon = (name) => {
  const icons = {
    telegram: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="m21 4-3 16-6-4.5L9 18l1-5 8-6-10 5-5-2z"/></svg>',
    instagram: '<svg class="instagram-icon" aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>'
  };
  return icons[name];
};

const footer = `
  <footer class="footer">
    <a href="/about">About</a><i aria-hidden="true"></i><a href="/privacy">Privacy notice</a>
  </footer>`;

const safeSocialUrl = (value, hostname) => {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || ![hostname, `www.${hostname}`].includes(url.hostname)) return null;
    return url.href;
  } catch {
    return null;
  }
};

const social = (name, url) => url
  ? `<a href="${url}" aria-label="${name}" rel="noopener noreferrer" target="_blank">${icon(name.toLowerCase())}</a>`
  : `<span class="social-icon" role="img" aria-label="${name} — link coming soon">${icon(name.toLowerCase())}</span>`;

const newsletterEndpoint = (() => {
  try {
    const url = new URL(window.SUPERVOID_LOOPS_FORM_URL);
    return url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
})();

function home() {
  const telegram = safeSocialUrl(window.SUPERVOID_TELEGRAM_URL, 't.me');
  const instagram = safeSocialUrl(window.SUPERVOID_INSTAGRAM_URL, 'instagram.com');
  return `<main class="home">
    <div class="space-background has-uploaded-background" aria-hidden="true"></div>
    <section class="hero">
      <div class="eyebrow"><span></span>Books for<br>Distant minds</div>
      <h1>Supervoid</h1>
      <div class="edition">/ editions</div>
      <a class="catalogue-link" href="/catalogue"><span></span>Catalogue</a>
      <section class="signup" aria-labelledby="signup-title">
        <h2 id="signup-title">Join the transmissions</h2>
        <form id="newsletter-form">
          <label class="sr-only" for="email">Your email address</label>
          <input id="email" type="email" name="email" placeholder="your email address" required autocomplete="email">
          <button aria-label="Join the transmissions" type="submit">→</button>
        </form>
        <p class="form-message" aria-live="polite"></p>
      </section>
      <nav class="socials" aria-label="Social media">
        ${social('Telegram', telegram)}<b aria-hidden="true"></b>
        ${social('Instagram', instagram)}
      </nav>
    </section>
    <div class="brand-mark has-uploaded-logo">
      <img class="brand-logo" src="/assets/supervoid-logo-01.png" alt="Supervoid Editions logo">
    </div>
    ${footer}
  </main>`;
}

function topbar() {
  return '<header class="topbar"><a href="/" class="wordmark">Supervoid <em>/ editions</em></a><a href="/">Return to the void</a></header>';
}

function catalogue() {
  return `<main class="catalogue-page">
    <div class="space-background has-uploaded-background" aria-hidden="true"></div>
    ${topbar()}
    <section class="catalogue-intro"><p>Books for distant minds</p><h1>Catalogue</h1><div class="rule"></div><p class="catalogue-note">A preview of publications in development. Titles and release dates will be announced here.</p></section>
    <section class="books" aria-label="Supervoid catalogue">
      <article class="book featured"><div class="cover"><span>Supervoid</span><strong>Transmission<br>001</strong><small>In development</small></div><div class="book-copy"><p>SV / 001</p><h2>First transmission</h2><p class="description">Our first publication is in development. Details will appear here when it is ready to be announced.</p><span class="book-status">Coming soon</span></div></article>
      <article class="book coming"><div class="cover"><span>Supervoid</span><strong>Transmission<br>002</strong><small>To be announced</small></div><div class="book-copy"><p>SV / 002</p><h2>Further signals</h2><p class="description">Future publications will be revealed here.</p><span class="book-status">To be announced</span></div></article>
    </section>
    ${footer}
  </main>`;
}

function informationPage(title, body) {
  return `<main class="catalogue-page info-page">
    <div class="space-background has-uploaded-background" aria-hidden="true"></div>
    ${topbar()}
    <section class="catalogue-intro"><p>Supervoid Editions</p><h1>${title}</h1><div class="rule"></div></section>
    <div class="information-copy">${body}</div>
    ${footer}
  </main>`;
}

function about() {
  return informationPage('About', `
    <p>Supervoid Editions is a publishing project for books for distant minds. The catalogue offers a preview of publications in development.</p>
    <p>More details will appear as titles are announced.</p>
    <p><a href="/catalogue">Explore the catalogue <span aria-hidden="true">→</span></a></p>`);
}

function privacy() {
  const newsletterDetails = newsletterEndpoint
    ? '<p>If you subscribe to the newsletter, the email address you submit is sent to the configured mailing service to process your subscription. This website does not keep a separate copy of it.</p>'
    : '<p>Newsletter sign-ups are currently unavailable. The form does not send or store an email address.</p>';
  return informationPage('Privacy notice', `
    <p>This website does not run analytics or advertising trackers, and it does not set cookies.</p>
    ${newsletterDetails}
    <p>The site loads typefaces from Google Fonts. Your browser contacts Google when it requests those font files. The hosting provider may also process standard access logs needed to serve the website.</p>
    ${newsletterEndpoint ? '' : '<p>This notice will be updated with the mailing provider and contact details before subscriptions open.</p>'}`);
}

const path = window.location.pathname.replace(/\/+$/, '') || '/';
const pages = { '/': home, '/catalogue': catalogue, '/about': about, '/privacy': privacy };
document.querySelector('#app').innerHTML = (pages[path] || home)();
const pageTitles = { '/catalogue': 'Catalogue', '/about': 'About', '/privacy': 'Privacy notice' };
if (pageTitles[path]) document.title = `${pageTitles[path]} | Supervoid Editions`;

const form = document.querySelector('#newsletter-form');
if (form) {
  const message = form.nextElementSibling;
  const button = form.querySelector('button');

  if (!newsletterEndpoint) {
    form.querySelector('input').disabled = true;
    button.disabled = true;
    message.textContent = 'Newsletter sign-ups will open soon.';
  } else {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = new FormData(form).get('email');
      button.disabled = true;
      message.textContent = 'Transmitting…';

      try {
        const response = await fetch(newsletterEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        if (!response.ok) throw new Error('Transmission failed');
        message.textContent = 'Signal received. Welcome to the void.';
        form.reset();
      } catch {
        message.textContent = 'The signal was lost. Please try again.';
      } finally {
        button.disabled = false;
      }
    });
  }
}
