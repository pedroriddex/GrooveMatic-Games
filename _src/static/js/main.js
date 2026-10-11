// Groove Matic Games · interacción y movimiento de la web
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const SCALE = ['#FF4D4D', '#FF8A3D', '#FFD23F', '#3DDC84', '#2EC4F1', '#4D6BFF', '#A259FF'];
  const EASE = 'cubic-bezier(.7,0,.2,1)';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // ---------- Cortina de rejilla (transición de página y del banner) ----------
  // Rellena un contenedor con celdas redondeadas de colores de la escala.
  function grid(el, size) {
    const r = el.getBoundingClientRect();
    const cols = Math.max(4, Math.ceil(r.width / size)), rows = Math.max(2, Math.ceil(r.height / size));
    el.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    el.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    el.innerHTML = '';
    const cells = [];
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      const i = document.createElement('i');
      i.style.background = SCALE[(x + y * 2) % 7];
      i.dataset.k = x + y;
      el.appendChild(i);
      cells.push(i);
    }
    return { cells, span: cols + rows };
  }
  // dir 1: tapar · dir -1: destapar. Barre en diagonal, como un secuenciador.
  function sweep({ cells, span }, dir, total = 360) {
    const step = Math.min(22, (total - 220) / span);
    const frames = dir > 0
      ? [{ transform: 'scale(0)', borderRadius: '50%' }, { transform: 'scale(1.08)', borderRadius: '6%' }]
      : [{ transform: 'scale(1.08)', borderRadius: '6%' }, { transform: 'scale(0)', borderRadius: '50%' }];
    const anims = cells.map(c => c.animate(frames, { duration: 220, delay: +c.dataset.k * step, easing: EASE, fill: 'forwards' }));
    return Promise.all(anims.map(a => a.finished));
  }

  // Cortina a pantalla completa. Solo en momentos concretos:
  // primera visita de la sesión, enlaces con data-curtain (idioma, "Jugar ahora") y el botón "Jugar".
  const pt = $('#pt');
  const curtain = { cover: () => Promise.resolve(), uncover: () => Promise.resolve() };
  if (pt && !reduced) {
    let g = null;
    curtain.cover = async () => { g = grid(pt, 140); await sweep(g, 1, 400); };
    curtain.uncover = async (total = 420) => { if (!g) return; await sweep(g, -1, total); pt.innerHTML = ''; g = null; };

    const covered = document.documentElement.classList.contains('pt-in');
    let cameFromLink = false;
    try { cameFromLink = !!sessionStorage.getItem('gm-pt'); sessionStorage.removeItem('gm-pt'); } catch (e) {}
    if (covered) {
      g = grid(pt, 140);
      g.cells.forEach(c => { c.style.transform = 'scale(1.08)'; c.style.borderRadius = '6%'; });
      document.documentElement.classList.remove('pt-in');
      // En la primera visita se recoge más despacio, como una intro
      curtain.pending = () => curtain.uncover(cameFromLink ? 420 : 700);
    }
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href][data-curtain]');
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      try { sessionStorage.setItem('gm-pt', '1'); } catch (err) {}
      curtain.cover().then(() => { location.href = a.href; });
    });
    // Al volver con el botón atrás (bfcache), destapar
    addEventListener('pageshow', e => { if (e.persisted) { pt.innerHTML = ''; g = null; } });
  }

  // ---------- Cabecera: se esconde al bajar, vuelve al subir ----------
  const header = $('.site-header');
  let lastY = scrollY;
  const onScroll = () => {
    if (!header) return;
    const y = scrollY;
    header.classList.toggle('scrolled', y > 8);
    if (!reduced) header.classList.toggle('hide', y > 240 && y > lastY && !header.contains(document.activeElement));
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Menú del móvil ----------
  const menuBtn = $('.menu-btn');
  const setMenu = open => {
    document.documentElement.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', open);
    if (open) header.classList.remove('hide');
  };
  menuBtn?.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
  $$('.nav a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape' && menuBtn?.getAttribute('aria-expanded') === 'true') { setMenu(false); menuBtn.focus(); } });
  matchMedia('(min-width: 641px)').addEventListener('change', e => { if (e.matches && menuBtn) setMenu(false); });

  // ---------- Titulares palabra a palabra ----------
  function split(el) {
    let n = 0;
    el.innerHTML = el.textContent.trim().split(/\s+/).map(w => `<span class="w"><span class="wi" style="--i:${n++}">${w}</span></span>`).join(' ');
    el.classList.add('split');
  }

  // ---------- Aparición al hacer scroll ----------
  if (!reduced && 'IntersectionObserver' in window) {
    $$('.section-head h2, .page-head h1, .game-body .small-title, .shots .small-title').forEach(split);

    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.classList.add('in');
      io.unobserve(el);
      if (el.classList.contains('game-card')) {
        el.style.removeProperty('--rx');
        setTimeout(() => el.style.removeProperty('--d'), 900); // que el hover no herede el retardo
      }
    }), { rootMargin: '0px 0px -10% 0px' });

    $$('.split').forEach(el => io.observe(el));
    $$('.game-grid').forEach(gridEl => $$('.game-card', gridEl).forEach((c, i) => {
      c.classList.add('rv');
      c.style.setProperty('--d', `${(i % 3) * 55 + Math.floor(i / 3) * 25}ms`);
      c.style.setProperty('--rx', '14deg'); // entra inclinada y se endereza
      io.observe(c);
    }));
    $$('.soon-list, .features, .shot-rail').forEach(list => {
      [...list.children].forEach((li, i) => li.style.setProperty('--d', `${i * 45}ms`));
      io.observe(list);
    });
    $$('.prose, .me-text').forEach(el => { el.classList.add('rv'); io.observe(el); });
    $$('.value-grid li').forEach((el, i) => { el.classList.add('rv'); el.style.setProperty('--d', `${(i % 2) * 70}ms`); io.observe(el); });
  } else {
    $$('.soon-list, .features, .shot-rail').forEach(el => el.classList.add('in'));
  }

  // ---------- Tarjetas: inclinación 3D siguiendo el ratón ----------
  if (fine && !reduced) {
    $$('.game-card').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--ry', `${(px - .5) * 10}deg`);
        card.style.setProperty('--rx', `${(.5 - py) * 8}deg`);
      });
      card.addEventListener('pointerleave', () => { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); });
    });
  }

  // ---------- Cinta de nombres: velocidad ligada al scroll ----------
  const rows = $$('[data-marquee]');
  if (rows.length && !reduced) {
    let boost = 0, prevY = scrollY, x = 0, t0 = performance.now();
    addEventListener('scroll', () => { boost = Math.min(boost + Math.abs(scrollY - prevY) * .25, 40); prevY = scrollY; }, { passive: true });
    const tracks = rows.map(r => ({ el: $('.marquee-track', r), dir: +r.dataset.marquee }));
    const loop = now => {
      const dt = Math.min(now - t0, 50); t0 = now;
      boost *= .92;
      x += (0.045 + boost * .02) * dt;
      tracks.forEach(({ el, dir }) => {
        const w = el.scrollWidth / 4;
        const off = (x % w);
        el.style.transform = `translate3d(${dir > 0 ? -off : off - w}px,0,0)`;
      });
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  // ---------- Banner de juegos ----------
  const banner = $('[data-banner]');
  if (banner) {
    const slides = $$('[data-slide]', banner);
    const dots = $$('[data-goto]', banner);
    const DUR = 6500;
    let i = 0, timer = null, paused = false;
    banner.style.setProperty('--dur', DUR + 'ms');

    const activate = n => {
      i = n;
      slides.forEach((s, k) => { s.classList.toggle('active', k === i); s.setAttribute('aria-hidden', k !== i); s.inert = k !== i; });
      dots.forEach((d, k) => {
        d.classList.toggle('on', k === i);
        d.setAttribute('aria-current', k === i);
        const bar = $('span', d);
        bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = '';
      });
      schedule();
    };
    const show = n => {
      n = (n + slides.length) % slides.length;
      if (n !== i) activate(n);
    };
    const schedule = () => {
      clearTimeout(timer);
      if (!reduced && !paused && slides.length > 1) timer = setTimeout(() => show(i + 1), DUR);
    };
    const pause = on => { paused = on; banner.classList.toggle('paused', on); on ? clearTimeout(timer) : schedule(); };

    dots.forEach(d => d.addEventListener('click', () => show(+d.dataset.goto)));
    $('[data-prev]', banner)?.addEventListener('click', () => show(i - 1));
    $('[data-next]', banner)?.addEventListener('click', () => show(i + 1));
    // No se frena con el ratón; solo si se navega con el teclado (foco visible), por accesibilidad
    banner.addEventListener('focusin', e => { if (e.target.matches(':focus-visible')) pause(true); });
    banner.addEventListener('focusout', e => { if (!banner.contains(e.relatedTarget)) pause(false); });
    document.addEventListener('visibilitychange', () => pause(document.hidden));
    banner.addEventListener('keydown', e => { if (e.key === 'ArrowRight') show(i + 1); if (e.key === 'ArrowLeft') show(i - 1); });

    let x0 = null;
    banner.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    banner.addEventListener('touchend', e => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) show(i + (dx < 0 ? 1 : -1));
      x0 = null;
    });
    activate(0);
  }

  // ---------- Escena de Power Square: una partida que se juega sola ----------
  // Toque → las casillas se abren en onda → salen las calaveras → se tapa y vuelve a empezar.
  const wait = ms => new Promise(r => setTimeout(r, ms));
  $$('[data-ps-board]').forEach(board => {
    const slide = board.closest('[data-slide]');
    const tiles = $$('.ps-tile', board);
    const safe = tiles.filter(x => !x.classList.contains('is-skull')).sort((a, b) => a.dataset.o - b.dataset.o);
    const skulls = tiles.filter(x => x.classList.contains('is-skull'));
    if (reduced) { tiles.forEach(x => x.classList.add('open')); return; }
    let run = 0;
    const play = async id => {
      const alive = () => id === run && slide.classList.contains('active') && !document.hidden;
      await wait(1100);
      while (alive()) {
        board.classList.remove('tapping'); void board.offsetWidth; board.classList.add('tapping');
        await wait(260);
        safe.forEach(x => setTimeout(() => alive() && x.classList.add('open'), x.dataset.o * 95));
        await wait(safe.at(-1).dataset.o * 95 + 650);
        for (const x of skulls) { if (!alive()) break; x.classList.add('open'); await wait(220); }
        await wait(2200);
        [...tiles].reverse().forEach((x, i) => setTimeout(() => x.classList.remove('open'), i * 22));
        await wait(tiles.length * 22 + 900);
      }
    };
    const restart = () => { run++; tiles.forEach(x => x.classList.remove('open')); if (slide.classList.contains('active') && !document.hidden) play(run); };
    new MutationObserver(restart).observe(slide, { attributes: true, attributeFilter: ['class'] });
    document.addEventListener('visibilitychange', restart);
    restart();
  });

  // ---------- Filtros del catálogo ----------
  const filters = $('[data-filters]');
  if (filters) {
    const cards = $$('.catalog-full .game-card');
    filters.addEventListener('click', e => {
      const b = e.target.closest('[data-filter]');
      if (!b) return;
      $$('[data-filter]', filters).forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
      let n = 0;
      cards.forEach(c => {
        const show = b.dataset.filter === 'all' || c.dataset.status === b.dataset.filter;
        c.hidden = !show;
        if (show && !reduced) c.animate([{ opacity: 0, transform: 'translateY(30px) scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: 400, delay: n++ * 30, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' });
      });
    });
  }

  // ---------- Capturas: arrastrar con el ratón ----------
  $$('.shot-rail').forEach(rail => {
    if (!fine) return;
    let down = false, sx = 0, sl = 0, moved = false;
    rail.addEventListener('pointerdown', e => { down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft; });
    addEventListener('pointermove', e => {
      if (!down) return;
      const dx = e.clientX - sx;
      if (Math.abs(dx) > 4) { moved = true; rail.classList.add('dragging'); }
      rail.scrollLeft = sl - dx;
    });
    addEventListener('pointerup', () => { if (!down) return; down = false; rail.classList.remove('dragging'); });
    rail.addEventListener('click', e => { if (moved) e.preventDefault(); }, true);
  });

  // ---------- Juego embebido ----------
  // "Jugar": la cortina tapa, el juego carga detrás y se destapa listo.
  const player = $('[data-player]');
  const playBtn = $('[data-play]');
  if (player && playBtn) {
    const iframe = $('iframe', player);
    const frame = $('.player-frame', player);
    const load = () => new Promise(res => {
      if (iframe.src) return res();
      iframe.addEventListener('load', res, { once: true });
      setTimeout(res, 3000); // no esperar eternamente a juegos pesados
      iframe.src = iframe.dataset.src;
    });
    const reveal = () => {
      player.hidden = false;
      player.scrollIntoView({ block: 'start' });
    };
    const open = async () => {
      await curtain.cover();
      reveal();
      await load();
      await curtain.uncover();
      iframe.focus();
    };
    playBtn.addEventListener('click', open);
    $('[data-close]', player).addEventListener('click', () => {
      iframe.removeAttribute('src');
      player.hidden = true;
      playBtn.focus();
    });
    $('[data-fullscreen]', player).addEventListener('click', () => {
      (frame.requestFullscreen || frame.webkitRequestFullscreen || (() => {})).call(frame);
    });
    // Llegando desde "Jugar ahora" del banner: la página ya viene tapada
    if (location.hash === '#play') {
      const pending = curtain.pending;
      curtain.pending = null;
      reveal();
      load().then(() => pending && pending()).then(() => iframe.focus());
    }
  }

  if (curtain.pending) curtain.pending();
})();
