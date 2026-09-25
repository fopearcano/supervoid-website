const icon = (name) => {
  const icons = {
    telegram: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="m21 4-3 16-6-4.5L9 18l1-5 8-6-10 5-5-2z"/></svg>',
    instagram: '<svg class="instagram-icon" aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>'
  };
  return icons[name];
};

const footer = `
  <div class="site-footer">
    <div class="brand-mark has-uploaded-logo">
      <img class="brand-logo" src="/assets/supervoid-logo-bw.png" alt="Supervoid Editions logo">
    </div>
    <footer class="footer">
      <a href="/about" data-panel="about">About</a><i aria-hidden="true"></i><a href="/privacy" data-panel="privacy">Privacy notice</a>
    </footer>
  </div>`;

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
  const formDisabled = newsletterEndpoint ? '' : ' disabled';
  return `<main class="home">
    <section class="hero">
      <div class="eyebrow"><span></span>Books for<br>Distant minds</div>
      <h1>Supervoid</h1>
      <div class="edition">/ editions</div>
      <a class="catalogue-link" href="/catalogue"><span></span>Catalogue</a>
      <section class="signup" aria-labelledby="signup-title">
        <h2 id="signup-title">Join the transmission</h2>
        <form id="newsletter-form"${newsletterEndpoint ? '' : ' aria-label="Newsletter signup currently unavailable"'}>
          <label class="sr-only" for="email">Your email address</label>
          <input id="email" type="email" name="email" required autocomplete="email"${formDisabled}>
          <button aria-label="Join the transmission" type="submit"${formDisabled}>→</button>
        </form>
        ${newsletterEndpoint ? '<p class="form-message" aria-live="polite"></p>' : ''}
      </section>
      <nav class="socials" aria-label="Social media">
        ${social('Telegram', telegram)}<b aria-hidden="true"></b>
        ${social('Instagram', instagram)}
      </nav>
    </section>
    ${footer}
  </main>`;
}

function topbar() {
  return '<header class="topbar"><a href="/" class="wordmark">Supervoid <em>/ editions</em></a><a href="/">Return to the void</a></header>';
}

function catalogue() {
  return `<main class="catalogue-page">
    ${topbar()}
    <section class="catalogue-intro" aria-labelledby="catalogue-title">
      <p>Books for distant minds</p>
      <h1 id="catalogue-title">Catalogue</h1>
      <div class="rule" aria-hidden="true"></div>
      <p class="catalogue-note">A space for the publications to come. Titles, covers, and release details will appear here as they are confirmed.</p>
    </section>
    <section class="books" aria-label="Forthcoming publications">
      <article class="book featured">
        <div class="cover" aria-label="Cover artwork pending">
          <span>Supervoid / Editions</span>
          <div class="cover-halo" aria-hidden="true"></div>
          <strong>Cover<br>pending</strong>
          <small>In development</small>
        </div>
        <div class="book-copy">
          <p>Forthcoming</p>
          <h2>In development</h2>
          <p class="description">Our first publication is taking shape. Its title, artwork, and release date will be shared when they are ready.</p>
          <span class="book-status">Details to follow</span>
        </div>
      </article>
    </section>
    ${footer}
  </main>`;
}

function aboutContent() {
  return `
    <p>Supervoid Editions is a publishing project for books for distant minds. Its first publication is in development.</p>
    <p>More details will appear as titles are announced.</p>
    <p><a href="/catalogue">Explore the catalogue <span aria-hidden="true">→</span></a></p>`;
}

function privacyContent() {
  const newsletterDetails = newsletterEndpoint
    ? '<p>If you subscribe to the newsletter, the email address you submit is sent to the configured mailing service to process your subscription. This website does not keep a separate copy of it.</p>'
    : '<p>Newsletter signups are currently unavailable. The form does not send or store an email address.</p>';
  return `
    <p>This website does not run analytics or advertising trackers, and it does not set cookies.</p>
    ${newsletterDetails}
    <p>The site may load typefaces from Google Fonts. Your browser contacts Google when it requests those font files. The hosting provider may also process standard access logs needed to serve the website.</p>
    ${newsletterEndpoint ? '' : '<p>This notice will be updated with the mailing provider and contact details before subscriptions open.</p>'}`;
}

const panelContent = {
  about: { title: 'About', body: aboutContent },
  privacy: { title: 'Privacy notice', body: privacyContent }
};

const dialogMarkup = `
  <dialog id="information-dialog" class="information-dialog" aria-labelledby="dialog-title">
    <div class="dialog-inner">
      <button class="dialog-close" type="button" aria-label="Close panel">×</button>
      <p class="dialog-kicker">Supervoid Editions</p>
      <h2 id="dialog-title" class="dialog-title"></h2>
      <div class="dialog-rule" aria-hidden="true"></div>
      <div class="information-copy" id="dialog-copy"></div>
    </div>
  </dialog>`;

const currentPath = () => window.location.pathname.replace(/\/+$/, '') || '/';
const initialPath = currentPath();
const app = document.querySelector('#app');
app.innerHTML = (initialPath === '/catalogue' ? catalogue : home)() + dialogMarkup;

const dialog = document.querySelector('#information-dialog');
const dialogTitle = dialog.querySelector('#dialog-title');
const dialogCopy = dialog.querySelector('#dialog-copy');
let modalReturnPath = initialPath === '/catalogue' ? '/catalogue' : '/';

function setPageTitle(path) {
  const title = path === '/catalogue' ? 'Catalogue'
    : path === '/about' ? 'About'
    : path === '/privacy' ? 'Privacy notice'
    : null;
  document.title = title ? `${title} | Supervoid Editions` : 'Supervoid Editions';
}

function showPanel(name, pushHistory) {
  const panel = panelContent[name];
  if (!panel) return;
  const panelPath = `/${name}`;
  if (pushHistory) {
    modalReturnPath = currentPath();
    window.history.pushState({ infoPanel: panelPath, returnPath: modalReturnPath }, '', panelPath);
  }
  dialogTitle.textContent = panel.title;
  dialogCopy.innerHTML = panel.body();
  setPageTitle(panelPath);
  if (!dialog.open) dialog.showModal();
}

document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-panel]');
  if (!trigger || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  showPanel(trigger.dataset.panel, true);
});

dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  const rect = dialog.getBoundingClientRect();
  const outside = event.clientX < rect.left || event.clientX > rect.right
    || event.clientY < rect.top || event.clientY > rect.bottom;
  if (outside) dialog.close();
});

dialog.addEventListener('close', () => {
  const path = currentPath();
  if (path === '/about' || path === '/privacy') {
    if (window.history.state?.infoPanel === path) window.history.back();
    else window.history.replaceState(null, '', modalReturnPath);
  }
  setPageTitle(currentPath());
});

window.addEventListener('popstate', () => {
  const path = currentPath();
  if (path === '/about' || path === '/privacy') {
    modalReturnPath = window.history.state?.returnPath || (initialPath === '/catalogue' ? '/catalogue' : '/');
    showPanel(path.slice(1), false);
  } else if (dialog.open) {
    dialog.close();
  }
  setPageTitle(path);
});

if (initialPath === '/about' || initialPath === '/privacy') {
  // A direct panel URL always has the home page beneath it and closes to /.
  window.history.replaceState(null, '', window.location.href);
  showPanel(initialPath.slice(1), false);
} else {
  setPageTitle(initialPath);
}

const form = document.querySelector('#newsletter-form');
if (form && newsletterEndpoint) {
  const message = form.nextElementSibling;
  const button = form.querySelector('button');
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
