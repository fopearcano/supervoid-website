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
      <img class="brand-logo" src="/assets/supervoid-logo-bw-2-transparent.png" alt="Supervoid Editions logo">
    </div>
    <footer class="footer">
      <a href="/about" data-panel="about">About</a><i aria-hidden="true"></i><a href="/privacy" data-panel="privacy">Privacy</a>
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

const defaultSocialUrls = {
  telegram: 'https://t.me/supervoid_editions',
  instagram: 'https://www.instagram.com/supervoid.editions/'
};

const newsletterEndpoint = (() => {
  try {
    const url = new URL(window.SUPERVOID_LOOPS_FORM_URL);
    const isLoopsForm = url.protocol === 'https:'
      && url.hostname === 'app.loops.so'
      && url.pathname.startsWith('/api/newsletter-form/');
    return isLoopsForm ? url.href : null;
  } catch {
    return null;
  }
})();

function home() {
  const telegram = safeSocialUrl(window.SUPERVOID_TELEGRAM_URL || defaultSocialUrls.telegram, 't.me');
  const instagram = safeSocialUrl(window.SUPERVOID_INSTAGRAM_URL || defaultSocialUrls.instagram, 'instagram.com');
  const formDisabled = newsletterEndpoint ? '' : ' disabled';
  return `<main class="home">
    <section class="hero">
      <div class="masthead">
        <h1 aria-label="Supervoid"><span aria-hidden="true">S</span><span aria-hidden="true">U</span><span aria-hidden="true">P</span><span aria-hidden="true">E</span><span aria-hidden="true">R</span><span aria-hidden="true">V</span><span aria-hidden="true">O</span><span aria-hidden="true">I</span><span aria-hidden="true">D</span></h1>
        <div class="edition">/<em>editions</em></div>
      </div>
      <a class="catalogue-link" href="/catalogue">Books for distant minds</a>
      <section class="signup" aria-labelledby="signup-title">
        <h2 id="signup-title">Join the transmissions</h2>
        <form id="newsletter-form"${newsletterEndpoint ? ` action="${newsletterEndpoint}" method="post"` : ' aria-label="Newsletter signup currently unavailable"'}>
          <label class="sr-only" for="email">Your email address</label>
          <input id="email" type="email" name="email" placeholder="your email here, please" required autocomplete="email"${formDisabled}>
          <button aria-label="Join the transmissions" type="submit"${formDisabled}>
            <svg class="spiral-submit" aria-hidden="true" focusable="false" viewBox="0 0 44 44">
              <path d="M5 22c0-11 8-17.5 18.5-16.5C34 6.5 39.3 16.6 36.1 26 33.2 34.5 24.4 39 16.2 35.8 9 33 6.1 25.4 9.1 18.8c2.6-5.7 9-8 14.3-5.5 4.6 2.2 6.2 7.6 3.7 11.7-2.1 3.5-6.6 4.6-9.6 2.2-2.5-2-2.7-5.7-.6-7.9 1.7-1.8 4.5-1.8 6.2-.2"/>
              <path d="M18.2 16.8 23.1 19.1 20.8 24.1"/>
            </svg>
          </button>
        </form>
        ${newsletterEndpoint ? '<p class="form-message" aria-live="polite"></p>' : ''}
      </section>
      <nav class="socials" aria-label="Social media">
        ${social('Telegram', telegram)}<b aria-hidden="true"></b>
        ${social('Instagram', instagram)}
      </nav>
    </section>
    <p class="depth-motto">Black has depth</p>
    ${footer}
  </main>`;
}

function topbar() {
  return `<header class="topbar">
    <a href="/" class="wordmark">Supervoid <em>/ editions</em></a>
    <a href="/" class="back-link" aria-label="Return to home">
      <svg aria-hidden="true" focusable="false" viewBox="0 0 56 28">
        <path d="M50 14.8c-10.5-.8-21.4-1.5-31.8-.2-4.2.5-7.8 1.4-11.4 3.1"/>
        <path d="M15.6 8.1c-2.8 3.7-5.6 6.9-9.2 9.8 4.2 1.1 8.2 3.1 11.6 5.8"/>
      </svg>
    </a>
  </header>`;
}

function catalogue() {
  return `<main class="catalogue-page">
    ${topbar()}
    <section class="catalogue-intro" aria-labelledby="catalogue-title">
      <p>Read or die</p>
      <h1 id="catalogue-title">Catalogue</h1>
      <div class="rule" aria-hidden="true"></div>
    </section>
    <section class="books" aria-label="Forthcoming publications">
      <article class="book featured" aria-labelledby="book-title">
        <div class="cover">
          <span>Supervoid / Editions</span>
          <div class="cover-halo" aria-hidden="true"></div>
          <h2 id="book-title" class="cover-title" aria-label="QDMT, Quella Dannatissima Macchina del Tempo, or That Bloody Time Machine">
            <span class="cover-title-italian" lang="it"><span class="cover-title-abbr">QDMT</span><span class="cover-title-long">Quella Dannatissima<br>Macchina del Tempo</span></span>
            <span class="cover-title-or">or</span>
            <span class="cover-title-english" lang="en">That Bloody<br>Time Machine</span>
          </h2>
          <small>Forthcoming</small>
        </div>
        <div class="book-copy">
          <p>Forthcoming</p>
          <p class="description">First publication is taking shape. Its release date will be shared soon... as soon as an artist wakes up from his/her dream... stay tuned!</p>
        </div>
      </article>
    </section>
    ${footer}
  </main>`;
}

function aboutContent() {
  return `
    <p>Supervoid Editions is a publishing project for books and graphic novels.</p>
    <p>More will be announced soon.</p>`;
}

function privacyContent() {
  return `
    <p><strong>Last updated: 28 September 2026</strong></p>
    <h3>Controller and contact</h3>
    <p>Supervoid Editions is the data controller for personal data collected through this website. Privacy requests may be sent through the official <a href="https://t.me/supervoid_editions" rel="noopener noreferrer" target="_blank">Telegram</a> or <a href="https://www.instagram.com/supervoid.editions/" rel="noopener noreferrer" target="_blank">Instagram</a> account.</p>
    <h3>Newsletter</h3>
    <p>When you join the newsletter, Supervoid Editions collects the email address you provide in order to send news about publications, forthcoming titles and occasional project updates. Processing is based on your consent under Article 6(1)(a) of the GDPR. Providing an email address is optional, and it is not sold.</p>
    <p>Your email address is sent directly to <a href="https://loops.so/privacy" rel="noopener noreferrer" target="_blank">Loops</a> (Astrodon Corporation), which processes subscriber data on behalf of Supervoid Editions for contact management and email delivery. Loops is based in the United States and describes its international-transfer safeguards in its <a href="https://loops.so/dpa" rel="noopener noreferrer" target="_blank">Data Processing Agreement</a>.</p>
    <h3>Retention and withdrawal</h3>
    <p>Your email address is retained while you remain subscribed. You may withdraw consent at any time through the unsubscribe link in a newsletter or by contacting Supervoid Editions. After withdrawal, the address will be deleted or retained only as necessary to record and respect the opt-out or meet a legal obligation. Withdrawal does not affect processing carried out before it. Technical request data is retained by the relevant service providers under their own policies.</p>
    <h3>Website data</h3>
    <p>This website does not use analytics or advertising trackers and does not set its own cookies. It is hosted through <a href="https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection" rel="noopener noreferrer" target="_blank">GitHub Pages</a>, which logs visitors’ IP addresses for security. The site also requests typefaces from <a href="https://developers.google.com/fonts/faq/privacy" rel="noopener noreferrer" target="_blank">Google Fonts</a>, so your browser sends technical request data, including your IP address, to Google. This processing supports the operation, security and presentation of the site and is based on the legitimate interests of Supervoid Editions under Article 6(1)(f) of the GDPR.</p>
    <h3>Your rights</h3>
    <p>Subject to the conditions of applicable law, you may request access to, rectification or erasure of your personal data, restriction of processing, data portability, or object to processing. You may withdraw consent at any time. No solely automated decisions or profiling are carried out by Supervoid Editions.</p>
    <p>You may also lodge a complaint with the <a href="https://www.garanteprivacy.it/diritti/come-agire-per-tutelare-i-tuoi-dati-personali/reclamo" rel="noopener noreferrer" target="_blank">Garante per la protezione dei dati personali</a> or another competent supervisory authority.</p>`;
}

const panelContent = {
  about: { title: 'About', body: aboutContent },
  privacy: { title: 'Privacy', body: privacyContent }
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
    : path === '/privacy' ? 'Privacy'
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
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ email }).toString()
      });
      const result = await response.json().catch(() => null);
      if (response.status === 429) {
        message.textContent = 'Too many signals. Please try again in a little while.';
        return;
      }
      if (!response.ok || result?.success !== true) throw new Error('Transmission failed');
      message.textContent = 'Signal received. Welcome to the void.';
      form.reset();
    } catch {
      message.textContent = 'The signal was lost. Please try again.';
    } finally {
      button.disabled = false;
    }
  });
}
