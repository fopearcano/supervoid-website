const icon = (name) => {
  const icons = {
    telegram: '<svg viewBox="0 0 24 24"><path d="m21 4-3 16-6-4.5L9 18l1-5 8-6-10 5-5-2z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>'
  };
  return icons[name];
};

const footer = `
  <footer class="footer">
    <a href="/about">About</a><i></i><a href="/privacy">Privacy notice</a>
  </footer>`;

function home() {
  return `<main class="home">
    <div class="space-background" aria-hidden="true"></div>
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
        <a href="#" aria-label="Telegram">${icon('telegram')}</a><b></b>
        <a href="#" aria-label="Instagram">${icon('instagram')}</a>
      </nav>
    </section>
    <a class="brand-mark" href="/" aria-label="Supervoid home">
      <img class="brand-logo" alt="Supervoid Editions logo">
      <span class="orbit orbit-one"></span><span class="orbit orbit-two"></span>
      <span class="book-mark"><i></i><b></b></span><span class="void-mark"></span>
    </a>
    ${footer}
  </main>`;
}

function catalogue() {
  return `<main class="catalogue-page">
    <div class="space-background" aria-hidden="true"></div>
    <header class="topbar"><a href="/" class="wordmark">Supervoid <em>/ editions</em></a><a href="/">Return to the void</a></header>
    <section class="catalogue-intro"><p>Books for distant minds</p><h1>Catalogue</h1><div class="rule"></div></section>
    <section class="books" aria-label="Supervoid catalogue">
      <article class="book featured"><div class="cover"><span>Supervoid</span><strong>Transmission<br>001</strong><small>A field guide to the unknown</small></div><div class="book-copy"><p>SV / 001</p><h2>The Distant Mind</h2><p class="description">A voyage through ideas at the furthest edge of human imagination. The first transmission from Supervoid Editions.</p><a href="mailto:hello@supervoid.editions">Enquire <span>→</span></a></div></article>
      <article class="book coming"><div class="cover"><span>Supervoid</span><strong>Transmission<br>002</strong><small>Arriving from beyond</small></div><div class="book-copy"><p>SV / 002</p><h2>Second Signal</h2><p class="description">The next book is moving through the dark. Join the transmissions to be the first to receive it.</p><a href="/#signup-title">Notify me <span>→</span></a></div></article>
    </section>
    ${footer}
  </main>`;
}

const path = window.location.pathname.replace(/\/$/, '') || '/';
document.querySelector('#app').innerHTML = path === '/catalogue' ? catalogue() : home();

const firstAvailableAsset = (paths, onLoad) => {
  const tryPath = (index) => {
    if (index >= paths.length) return;
    const image = new Image();
    image.onload = () => onLoad(paths[index]);
    image.onerror = () => tryPath(index + 1);
    image.src = paths[index];
  };
  tryPath(0);
};

const isMobile = window.matchMedia('(max-width: 700px)').matches;
const backgroundStem = isMobile ? 'mobile' : 'desktop';
const backgroundBaseNames = [
  `background-${backgroundStem}`,
  `${backgroundStem}-background`,
  `supervoid-background-${backgroundStem}`,
  `supervoid-${backgroundStem}`,
  `bg-${backgroundStem}`,
  backgroundStem,
  isMobile ? 'background_mobile' : 'background_desktop',
  isMobile ? 'background mobile' : 'background desktop',
  ...(!isMobile ? ['background-destop', 'destop-background', 'destop'] : [])
];
const imageExtensions = ['webp', 'avif', 'png', 'jpg', 'jpeg'];
const backgroundNames = backgroundBaseNames.flatMap((name) =>
  imageExtensions.flatMap((extension) => [
    `${name}.${extension}`,
    `${name}.${extension.toUpperCase()}`,
    `${name.replace(/(^|[-_ ])\w/g, (letter) => letter.toUpperCase())}.${extension}`
  ])
);

firstAvailableAsset(backgroundNames.map((name) => `/assets/${name}`), (url) => {
  document.querySelectorAll('.space-background').forEach((background) => {
    background.style.setProperty('--uploaded-background', `url("${url}")`);
    background.classList.add('has-uploaded-background');
  });
});

const logo = document.querySelector('.brand-logo');
if (logo) {
  firstAvailableAsset(
    imageExtensions.flatMap((extension) => [
      `/assets/supervoid-logo-01.${extension}`,
      `/assets/Supervoid-logo-01.${extension}`,
      `/assets/SUPERVOID-LOGO-01.${extension}`,
      `/assets/supervoid_logo_01.${extension}`
    ]),
    (url) => {
      logo.src = url;
      logo.parentElement.classList.add('has-uploaded-logo');
    }
  );
}

const form = document.querySelector('#newsletter-form');
form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const message = form.nextElementSibling;
  const endpoint = window.SUPERVOID_LOOPS_FORM_URL;
  const email = new FormData(form).get('email');
  const button = form.querySelector('button');
  button.disabled = true;
  message.textContent = 'Transmitting…';

  try {
    if (endpoint) {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!response.ok) throw new Error('Transmission failed');
    }
    message.textContent = 'Signal received. Welcome to the void.';
    form.reset();
  } catch {
    message.textContent = 'The signal was lost. Please try again.';
  } finally {
    button.disabled = false;
  }
});
