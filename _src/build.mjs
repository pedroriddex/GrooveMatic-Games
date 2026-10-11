// Genera la web estática de Groove Matic en /dist.
// Uso: node _src/build.mjs
import { mkdirSync, rmSync, writeFileSync, cpSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { site, langs, t } from './data/site.mjs';
import { games } from './data/games.mjs';
import { scenes } from './scenes.mjs';

// Políticas de privacidad de cada juego (_src/data/privacy/<nombre>.mjs)
const policies = Object.fromEntries(await Promise.all(games.filter(g => g.privacy).map(async g => [g.slug, (await import(`./data/privacy/${g.privacy}.mjs`)).default])));
const privacyUrl = (g, lang = 'en') => lang === 'es' ? `/es/privacidad/${g.privacy}` : `/${g.privacy}/privacy.html`; // la inglesa es la URL fija de las tiendas

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'dist');
const VERSION = Date.now().toString(36);

// ---------- rutas ----------
const SLUGS = {
  en: { games: 'games', studio: 'about', contact: 'contact', privacy: 'privacy' },
  es: { games: 'juegos', studio: 'estudio', contact: 'contacto', privacy: 'privacidad' },
};
function url(lang, page, slug) {
  const p = t[lang].prefix, s = SLUGS[lang];
  if (page === 'home') return p || '/';
  if (page === 'game') return `${p}/${s.games}/${slug}`;
  return `${p}/${s[page]}`;
}
// Cada página es una carpeta con index.html: /games/power-square → games/power-square/index.html
const file = (lang, page, slug) => (url(lang, page, slug).replace(/^\//, '') + '/index.html').replace(/^\//, '');
const altFor = (page, slug) => Object.fromEntries(langs.map(l => [l, url(l, page, slug)]));

// ---------- utilidades ----------
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Todo enlace a otra web se abre en pestaña nueva (target="_blank" + rel="noopener")
const external = html => html.replace(/<a\b([^>]*?)href="(https?:\/\/(?!groovematicgames\.com)[^"]+)"([^>]*)>/g, (m, pre, href, post) => {
  const attrs = pre + post;
  return `<a${pre}href="${href}"${post}${/target=/.test(attrs) ? '' : ' target="_blank"'}${/rel=/.test(attrs) ? '' : ' rel="noopener"'}>`;
});
const write = (rel, html) => { const fp = join(OUT, rel); mkdirSync(dirname(fp), { recursive: true }); writeFileSync(fp, rel.endsWith('.html') ? external(html) : html); };
const pick = (obj, lang) => (obj && (obj[lang] || obj.all)) || [];
const coverStyle = g => (g.coverBg ? ` style="background:${g.coverBg}"` : '');

// ---------- iconos de plataforma y tienda ----------
const ICONS = {
  desktop: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M9 20h6M12 16v4"/>',
  tablet: '<rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M11 18h2"/>',
  mobile: '<rect x="7" y="3" width="10" height="18" rx="2.5"/><path d="M11 18h2"/>',
  googleplay: '<path d="M5.6 3.6 18.8 11a1.1 1.1 0 0 1 0 2L5.6 20.4a1 1 0 0 1-1.5-.9V4.5a1 1 0 0 1 1.5-.9Z"/><path d="M4.4 4 14.6 14.2M4.4 20l10.2-10.2"/>',
  appstore: '<path fill="currentColor" stroke="none" d="M16.4 12.7c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9-.7 0-1.8-.9-3-.8-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.3 0 2.1-1.1 2.8-2.3.9-1.3 1.3-2.6 1.3-2.6s-2.5-1-2.5-3.8ZM14.1 5.8c.6-.8 1.1-1.9 1-3-.9 0-2.1.6-2.7 1.4-.6.7-1.1 1.8-1 2.9 1 .1 2.1-.5 2.7-1.3Z"/>',
};
const icon = name => `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[name]}</svg>`;
const DEVICE_ORDER = ['desktop', 'tablet', 'mobile'];
const devicesOf = g => DEVICE_ORDER.filter(d => (g.platforms || []).includes(d));
const storesOf = g => Object.keys(g.stores || {});

// Fila compacta de iconos (tarjetas): dispositivos y, separadas, las tiendas
function platformIcons(g, lang) {
  const L = t[lang], devs = devicesOf(g), sts = storesOf(g);
  if (!devs.length && !sts.length) return '';
  const label = [...devs.map(d => L.devices[d]), ...sts.map(s => L.stores[s])].join(', ');
  return `<span class="plats" role="img" aria-label="${esc(label)}">${devs.map(d => `<span title="${L.devices[d]}">${icon(d)}</span>`).join('')}${sts.length ? `<i class="plats-sep"></i>${sts.map(s => `<span title="${L.stores[s]}">${icon(s)}</span>`).join('')}` : ''}</span>`;
}

// ---------- piezas comunes ----------
function header(lang, page, alt) {
  const L = t[lang], other = lang === 'en' ? 'es' : 'en';
  const link = p => `<a href="${url(lang, p)}"${page === p || (p === 'games' && page === 'game') ? ' aria-current="page"' : ''}>${L.nav[p]}</a>`;
  return `<a class="skip" href="#main">${L.skip}</a>
<header class="site-header">
  <div class="wrap header-in">
    <a class="brand" href="${url(lang, 'home')}" aria-label="Groove Matic Games">
      <img class="logo-full" src="/brand/logotipo-papel.svg" alt="groovematic" width="120" height="36">
      <img class="logo-mark" src="/brand/simbolo-papel.svg" alt="" width="30" height="30">
    </a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="${L.menu}"><i></i><i></i></button>
    <nav class="nav" id="site-nav" aria-label="Main">
      ${link('games')}${link('studio')}${link('contact')}
      <a class="lang" href="${alt[other]}" hreflang="${other}" lang="${other}" data-curtain>${other.toUpperCase()}</a>
    </nav>
  </div>
</header>`;
}

function footer(lang) {
  const L = t[lang], year = new Date().getFullYear();
  const social = site.social.map(s => `<a href="${s.url}" target="_blank" rel="noopener">${s.name}</a>`).join('');
  return `<footer class="site-footer">
  <div class="wrap footer-in">
    <img src="/brand/logotipo-papel.svg" alt="groovematic" width="110" height="33" loading="lazy">
    <nav class="footer-nav">
      <a href="${url(lang, 'games')}">${L.nav.games}</a>
      <a href="${url(lang, 'studio')}">${L.nav.studio}</a>
      <a href="${url(lang, 'contact')}">${L.nav.contact}</a>
      ${social}
      <a href="${url(lang, 'privacy')}">${L.footer.privacy}</a>
    </nav>
  </div>
  <div class="wrap footer-base">© ${year} Groove Matic Games. ${L.footer.rights}</div>
</footer>`;
}

function layout({ lang, page, alt, title, desc, body, image, jsonld, fonts = [] }) {
  const L = t[lang];
  const canonical = site.url + alt[lang];
  const og = site.url + (image || '/brand/og.png');
  const ga = site.analyticsId ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${site.analyticsId}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${site.analyticsId}');</script>` : '';
  return `<!doctype html>
<html lang="${L.htmlLang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
${langs.map(l => `<link rel="alternate" hreflang="${l}" href="${site.url + alt[l]}">`).join('\n')}
<link rel="alternate" hreflang="x-default" href="${site.url + alt.en}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Groove Matic Games">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${og}">
<meta property="og:locale" content="${lang === 'es' ? 'es_ES' : 'en_US'}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0F0E13">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700${fonts.map(f => '&family=' + f).join('')}&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/main.css?v=${VERSION}">
<script>try{var s=sessionStorage,h=document.documentElement,f=!s.getItem('gm-seen');if(f)h.classList.add('first-visit');if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&(f||s.getItem('gm-pt')))h.classList.add('pt-in');s.setItem('gm-seen','1')}catch(e){}</script>
<script defer src="/js/main.js?v=${VERSION}"></script>
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ''}
${ga}
</head>
<body class="page-${page}">
${header(lang, page, alt)}
<main id="main">
${body}
</main>
${footer(lang)}
<div class="pt" id="pt" aria-hidden="true"></div>
</body>
</html>
`;
}

function card(g, lang) {
  const L = t[lang], x = g[lang];
  return `<a class="game-card status-${g.status}" href="${url(lang, 'game', g.slug)}" data-status="${g.status}">
  <div class="cover fit-${g.coverFit}"${coverStyle(g)}><img src="${g.cover}" alt="" loading="lazy"></div>
  <div class="card-body">
    <h3>${esc(g.name)}</h3>
    ${x.short ? `<p>${esc(x.short)}</p>` : ''}
    <div class="card-foot"><span class="badge">${L.status[g.status]}</span>${platformIcons(g, lang)}</div>
  </div>
</a>`;
}

// ---------- portada ----------
// Divide un texto en letras para animarlas (aria-label en el contenedor conserva el texto)
const letters = str => str.split(' ').map(w => `<span class="lw" aria-hidden="true">${[...w].map(ch => `<span class="ch">${esc(ch)}</span>`).join('')}</span>`).join(' ')
  .replace(/<span class="ch">/g, (() => { let n = 0; return () => `<span class="ch" style="--i:${n++}">`; })());
function slide(g, lang, i) {
  const L = t[lang], x = g[lang], b = g.banner, imgs = pick(b.images, lang);
  const scene = b.media === 'scene' ? scenes[b.scene] : null;
  const media = scene ? scene.media(lang) : b.media === 'phones'
    ? `<div class="phones">${imgs.map(src => `<img src="${src}" alt="" ${i ? 'loading="lazy"' : ''}>`).join('')}</div>`
    : `<img class="shot" src="${imgs[0]}" alt="${esc(g.name)}" ${i ? 'loading="lazy"' : 'fetchpriority="high"'}>`;
  const primary = b.dark ? 'btn-dark' : 'btn-light';
  const play = g.embed
    ? `<a class="btn ${primary}" href="${url(lang, 'game', g.slug)}#play" data-curtain>${L.banner.play}</a>`
    : g.links?.itch ? `<a class="btn ${primary}" href="${g.links.itch}" target="_blank" rel="noopener">${L.game.itch} ↗</a>` : '';
  return `<article class="slide${b.dark ? ' on-light' : ''}${scene ? ` scene-${b.scene}` : ''}${i === 0 ? ' active' : ''}" style="--slide-bg:${b.bg}" data-slide aria-roledescription="slide" aria-label="${esc(g.name)}"${i ? ' aria-hidden="true"' : ''}>
  ${scene && scene.bg ? scene.bg(lang) : ''}
  <div class="slide-copy">
    <span class="badge">${L.status[g.status]}</span>
    <h2 aria-label="${esc(g.name)}"${scene ? ' class="has-logo"' : ''}>${scene ? scene.logo(g) : letters(g.name)}</h2>
    <p>${esc(x.tagline)}</p>
    <div class="actions">${play}<a class="btn ${play ? (b.dark ? 'btn-outline-dark' : 'btn-outline') : (b.dark ? 'btn-dark' : 'btn-light')}" href="${url(lang, 'game', g.slug)}">${L.banner.see}</a></div>
  </div>
  <div class="slide-media ${b.media}">${media}</div>
</article>`;
}

function home(lang) {
  const L = t[lang];
  const banner = games.filter(g => g.banner);
  const released = games.filter(g => g.status !== 'soon');
  const soon = games.filter(g => g.status === 'soon');
  const body = `
<h1 class="sr-only">Groove Matic Games</h1>
<section class="banner" data-banner aria-roledescription="carousel" aria-label="${L.home.games}">
  <div class="wrap">
    <div class="slides">${banner.map((g, i) => slide(g, lang, i)).join('')}</div>
    ${banner.length > 1 ? `<div class="banner-nav">
      <div class="dots">${banner.map((g, i) => `<button type="button" class="dot${i === 0 ? ' on' : ''}" data-goto="${i}" aria-label="${L.banner.goto} ${esc(g.name)}"><span></span></button>`).join('')}</div>
      <div class="arrows">
        <button type="button" class="arrow" data-prev aria-label="${L.banner.prev}">←</button>
        <button type="button" class="arrow" data-next aria-label="${L.banner.next}">→</button>
      </div>
    </div>` : ''}
  </div>
</section>

<div class="marquee" aria-hidden="true">
  ${[0, 1].map(r => `<div class="marquee-row" data-marquee="${r ? -1 : 1}"><div class="marquee-track">${Array(4).fill(games.map(g => `<span>${esc(g.name)}</span><i></i>`).join('')).join('')}</div></div>`).join('')}
</div>

${released.length > 1 ? `<section class="catalog">
  <div class="wrap">
    <div class="section-head"><h2>${L.home.games}</h2><a class="link-arrow" href="${url(lang, 'games')}">${L.home.all} →</a></div>
    <div class="game-grid">${released.map(g => card(g, lang)).join('')}</div>
  </div>
</section>` : ''}

${soon.length ? `<section class="soon">
  <div class="wrap">
    <div class="section-head"><h2>${L.home.soon}</h2></div>
    <ul class="soon-list">${soon.map(g => `<li><a href="${url(lang, 'game', g.slug)}"><img src="${g.cover}" alt="" loading="lazy"><span>${esc(g.name)}</span></a></li>`).join('')}</ul>
  </div>
</section>` : ''}`;
  const fonts = [...new Set(banner.map(g => g.banner.media === 'scene' && scenes[g.banner.scene].fonts).filter(Boolean))];
  return layout({
    lang, page: 'home', alt: altFor('home'), title: L.meta.home.title, desc: L.meta.home.desc, body, fonts,
    jsonld: { '@context': 'https://schema.org', '@type': 'Organization', name: site.name, url: site.url, logo: site.url + '/brand/icon-512.png', sameAs: site.social.map(s => s.url) },
  });
}

// ---------- catálogo ----------
function gamesPage(lang) {
  const L = t[lang];
  const order = ['out', 'play', 'soon'];
  const sorted = [...games].sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status));
  const body = `
<section class="page-head">
  <div class="wrap">
    <h1>${L.nav.games}</h1>
    ${new Set(games.map(g => g.status)).size > 1 ? `<div class="filters" data-filters>
      ${['all', ...['out', 'play', 'soon'].filter(k => games.some(g => g.status === k))].map((k, i) => `<button class="chip${i === 0 ? ' on' : ''}" type="button" data-filter="${k}" aria-pressed="${i === 0}">${L.filters[k]}</button>`).join('')}
    </div>` : ''}
  </div>
</section>
<section class="catalog catalog-full">
  <div class="wrap"><div class="game-grid">${sorted.map(g => card(g, lang)).join('')}</div></div>
</section>`;
  return layout({ lang, page: 'games', alt: altFor('games'), title: L.meta.games.title, desc: L.meta.games.desc, body });
}

// ---------- ficha ----------
function gamePage(g, lang) {
  const L = t[lang], x = g[lang], shots = pick(g.shots, lang);
  const btns = [];
  if (g.embed) btns.push(`<button class="btn btn-light" type="button" data-play>${L.game.play} ▶</button>`);
  if ('itch' in g.links) btns.push(g.links.itch ? `<a class="btn ${btns.length ? 'btn-outline' : 'btn-light'}" href="${g.links.itch}" target="_blank" rel="noopener">${L.game.itch}</a>` : `<span class="btn btn-soon">itch.io · ${L.game.soon}</span>`);
  for (const st of storesOf(g)) {
    const href = g.stores[st], label = t[lang].stores[st];
    btns.push(href
      ? `<a class="btn ${btns.length ? 'btn-outline' : 'btn-light'}" href="${href}" target="_blank" rel="noopener">${icon(st)}${label}</a>`
      : `<span class="btn btn-soon">${icon(st)}${label} · ${L.game.soon}</span>`);
  }
  if (g.links.web) btns.push(`<a class="btn ${btns.length ? 'btn-outline' : 'btn-light'}" href="${g.links.web}" target="_blank" rel="noopener">${L.game.web} ↗</a>`);
  const more = games.filter(o => o.slug !== g.slug && o.status !== 'soon').slice(0, 3);
  const desc = [x.tagline, x.short].filter(Boolean).join(' ') || `${g.name} — Groove Matic Games`;

  const body = `
<article class="game">
  <section class="game-hero">
    <div class="wrap">
      <a class="back" href="${url(lang, 'games')}">← ${L.game.back}</a>
      <div class="game-hero-in">
        <div class="game-cover fit-${g.coverFit}"${coverStyle(g)}><img src="${g.cover}" alt="${esc(g.name)}"></div>
        <div class="game-intro">
          <span class="badge">${L.status[g.status]}</span>
          <h1>${esc(g.name)}</h1>
          ${x.tagline ? `<p class="game-tagline">${esc(x.tagline)}</p>` : ''}
          ${x.tags.length ? `<ul class="tags">${x.tags.map(tg => `<li>${esc(tg)}</li>`).join('')}</ul>` : ''}
          ${devicesOf(g).length ? `<ul class="devices" aria-label="${L.game.platforms}">${devicesOf(g).map(d => `<li>${icon(d)}${t[lang].devices[d]}</li>`).join('')}</ul>` : ''}
          ${btns.length ? `<div class="actions">${btns.join('')}</div>` : ''}
          ${g.status === 'soon' ? `<p class="note">${L.game.inDev}</p>` : ''}
          ${g.privacy ? `<a class="privacy-link" href="${privacyUrl(g, lang)}">${L.game.privacy}</a>` : ''}
        </div>
      </div>
    </div>
  </section>

  ${g.embed ? `<section class="player" id="play" data-player hidden>
    <div class="wrap">
      <div class="player-bar"><strong>${esc(g.name)}</strong>
        <span><button class="chip" type="button" data-fullscreen>${L.game.fullscreen}</button> <button class="chip" type="button" data-close>${L.game.close}</button></span></div>
      <div class="player-frame portrait"><iframe title="${esc(g.name)}" data-src="${g.embed}" allow="fullscreen; autoplay" allowfullscreen></iframe></div>
    </div>
  </section>` : ''}

  ${x.body.length ? `<section class="game-body">
    <div class="wrap game-body-in">
      <div class="prose">${x.body.map(p => `<p>${esc(p)}</p>`).join('')}</div>
      ${x.features.length ? `<div><h2 class="small-title">${L.game.features}</h2><ul class="features">${x.features.map(ft => `<li>${esc(ft)}</li>`).join('')}</ul></div>` : ''}
    </div>
  </section>` : ''}

  ${shots.length ? `<section class="shots">
    <div class="wrap"><h2 class="small-title">${L.game.shots}</h2></div>
    <div class="shot-rail ${g.shotShape}" tabindex="0">${shots.map((s, i) => `<img src="${s}" alt="${esc(g.name)} ${i + 1}" loading="lazy">`).join('')}</div>
  </section>` : ''}

  ${more.length ? `<section class="catalog more">
    <div class="wrap">
      <div class="section-head"><h2>${L.game.more}</h2><a class="link-arrow" href="${url(lang, 'games')}">${L.home.all} →</a></div>
      <div class="game-grid">${more.map(o => card(o, lang)).join('')}</div>
    </div>
  </section>` : ''}
</article>`;
  const ld = { '@context': 'https://schema.org', '@type': 'VideoGame', name: g.name, description: desc, url: site.url + url(lang, 'game', g.slug), image: site.url + g.cover, publisher: { '@type': 'Organization', name: site.name }, inLanguage: lang };
  return layout({ lang, page: 'game', alt: altFor('game', g.slug), title: `${g.name} — Groove Matic`, desc, body, image: g.cover.endsWith('.svg') ? null : g.cover, jsonld: ld });
}

// ---------- estudio, contacto, 404 ----------
function studioPage(lang) {
  const L = t[lang], S = L.studio;
  const li = site.social.find(x => x.name === 'LinkedIn');
  const body = `
<section class="page-head studio-head">
  <div class="wrap">
    <h1>${S.title}</h1>
    <p class="studio-lead">${S.lead}</p>
    ${li ? `<div class="actions"><a class="btn btn-outline" href="${li.url}" target="_blank" rel="noopener">LinkedIn ↗</a></div>` : ''}
  </div>
</section>

<section class="values">
  <div class="wrap">
    <div class="section-head"><h2>${S.valuesTitle}</h2></div>
    <ol class="value-grid">
      ${S.values.map(([h, p], i) => `<li><span class="value-n">0${i + 1}</span><h3>${h}</h3><p>${p}</p></li>`).join('')}
    </ol>
  </div>
</section>

<section class="me">
  <div class="wrap me-in">
    <h2>${S.meTitle}</h2>
    <div class="me-text">
      ${S.me.map(p => `<p>${p}</p>`).join('')}
      ${S.signature ? `<p class="signature">${S.signature}</p>` : ''}
      <div class="actions">
        <a class="btn btn-light" href="${url(lang, 'contact')}">${S.contact}</a>
      </div>
    </div>
  </div>
</section>`;
  return layout({ lang, page: 'studio', alt: altFor('studio'), title: L.meta.studio.title, desc: L.meta.studio.desc, body });
}

function contactPage(lang) {
  const L = t[lang], C = L.contact;
  const li = site.social.find(s => s.name === 'LinkedIn');
  const main = site.email
    ? `<a class="mail" href="mailto:${site.email}">${site.email}</a>`
    : `<p class="lead">${C.noEmail}</p>${li ? `<div class="actions"><a class="btn btn-light" href="${li.url}" target="_blank" rel="noopener">LinkedIn ↗</a></div>` : ''}`;
  const body = `
<section class="page-head text-page">
  <div class="wrap narrow">
    <h1>${C.title}</h1>
    <p class="lead">${C.lead}</p>
    ${main}
  </div>
</section>`;
  return layout({ lang, page: 'contact', alt: altFor('contact'), title: L.meta.contact.title, desc: L.meta.contact.desc, body });
}

// Página índice: una política por juego
function privacyIndex(lang) {
  const L = t[lang], P = L.privacy;
  const list = games.filter(g => g.privacy);
  const body = `
<section class="page-head text-page">
  <div class="wrap narrow">
    <h1>${P.title}</h1>
    <p class="lead">${P.lead}</p>
    <ul class="policy-list">${list.map(g => `<li><a href="${privacyUrl(g, lang)}"><img src="${g.icon || g.cover}" alt="" width="44" height="44"><span>${esc(policies[g.slug][lang].title)}</span><span aria-hidden="true">→</span></a></li>`).join('')}</ul>
  </div>
</section>`;
  return layout({ lang, page: 'privacy', alt: altFor('privacy'), title: `${P.title} — Groove Matic`, desc: P.lead, body });
}

const missing = new Set();
function legal(html) {
  const email = site.legal?.email || site.email, controller = site.legal?.controller;
  if (!email) missing.add('site.legal.email');
  if (html.includes('{{CONTROLLER}}') && !controller) missing.add('site.legal.controller');
  return html
    .replace(/<a href="mailto:\{\{EMAIL\}\}">\{\{EMAIL\}\}<\/a>/g, email ? `<a href="mailto:${email}">${email}</a>` : '<mark>[correo pendiente]</mark>')
    .replace(/\{\{EMAIL\}\}/g, email || '[correo pendiente]')
    .replace(/\{\{CONTROLLER\}\}/g, controller || '<mark>[responsable pendiente]</mark>');
}

// Política de un juego, una página por idioma (el botón EN/ES de la cabecera pasa de una a otra)
function privacyPage(g, lang) {
  const P = policies[g.slug][lang], alt = { en: privacyUrl(g, 'en'), es: privacyUrl(g, 'es') };
  const body = `
<div class="wrap narrow policy-wrap">
  <section class="policy">
    <h1>${esc(P.title)}</h1>
    <p class="policy-meta">${t[lang].privacy.updated}: ${P.updated}${P.meta ? ' · ' + legal(P.meta) : ''}</p>
    <div class="policy-body">${legal(P.html)}</div>
  </section>
</div>`;
  return layout({ lang, page: 'privacy', alt, title: `${P.title} — Groove Matic`, desc: P.title, body });
}

function notFound() {
  const body = `<section class="page-head text-page"><div class="wrap narrow">${langs.map(lang => {
    const L = t[lang].notFound;
    return `<div lang="${lang}" class="nf"><h1>${L.title}</h1><a class="link-arrow" href="${url(lang, 'home')}">${L.back} →</a></div>`;
  }).join('')}</div></section>`;
  return layout({ lang: 'en', page: 'notfound', alt: { en: '/', es: '/es' }, title: t.en.meta.notFound.title, desc: '', body });
}

// ---------- build ----------
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync(join(ROOT, '_src/static'), OUT, { recursive: true });
// Solo se publican los recursos de los juegos que están en el catálogo
const used = new Set(games.flatMap(g => [g.cover, g.icon, ...Object.values(g.shots || {}).flat(), ...Object.values(g.banner?.images || {}).flat(), g.embed && dirname(g.embed)]).filter(Boolean));
const isUsed = rel => [...used].some(u => u === rel || u.startsWith(rel + '/') || rel.startsWith(u + '/'));
for (const dir of ['assets/img', 'assets/games']) {
  cpSync(join(ROOT, dir), join(OUT, dir), { recursive: true, filter: src => !src.endsWith('.DS_Store') && isUsed(src.slice(ROOT.length)) });
}

const pages = [];
for (const lang of langs) {
  for (const [p, render] of [['home', home], ['games', gamesPage], ['studio', studioPage], ['contact', contactPage], ['privacy', privacyIndex]]) {
    write(file(lang, p), render(lang));
    if (lang === 'en') pages.push(altFor(p));
  }
  for (const g of games) {
    write(file(lang, 'game', g.slug), gamePage(g, lang));
    if (lang === 'en') pages.push(altFor('game', g.slug));
  }
}
write('404.html', notFound());
for (const g of games.filter(x => x.privacy)) for (const lang of langs) write(privacyUrl(g, lang).replace(/^\//, '') + (lang === 'es' ? '/index.html' : ''), privacyPage(g, lang));
if (missing.size) console.warn(`⚠️  Políticas de privacidad incompletas: falta ${[...missing].join(' y ')} en _src/data/site.mjs`);

const entries = pages.flatMap(a => langs.map(l => `<url><loc>${site.url + a[l]}</loc>${langs.map(k => `<xhtml:link rel="alternate" hreflang="${k}" href="${site.url + a[k]}"/>`).join('')}</url>`));
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`);
write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);

console.log(`dist/ listo · ${games.length} ${games.length === 1 ? 'juego' : 'juegos'} × ${langs.length} idiomas`);
