// Escenas animadas del carrusel de la portada.
// Cada juego que tenga banner.media = 'scene' usa aquí su propio lenguaje visual
// (colores, tipografía e iconos del juego), no el de la web.
//
// Una escena devuelve { logo, media, bg, fonts }:
//   logo  → HTML que sustituye al nombre del juego en el texto de la diapositiva
//   media → HTML de la parte visual (derecha en escritorio, arriba en móvil)
//   bg    → capa decorativa de fondo de toda la diapositiva
//   fonts → familias de Google Fonts que necesita la escena

// ---------- Power Square ----------
// Iconos copiados del propio juego (ICON en Power Square.html)
const PS_ICON = {
  skull: '<path fill="currentColor" fill-rule="evenodd" d="M12 2.5c-4.7 0-8.5 3.5-8.5 8 0 2.6 1.3 4.9 3.2 6.3V19c0 1.4 1.1 2.5 2.5 2.5h5.6c1.4 0 2.5-1.1 2.5-2.5v-2.2c1.9-1.4 3.2-3.7 3.2-6.3 0-4.5-3.8-8-8.5-8zM6.6 11.2a2.1 2.1 0 1 0 4.2 0a2.1 2.1 0 1 0-4.2 0zM13.2 11.2a2.1 2.1 0 1 0 4.2 0a2.1 2.1 0 1 0-4.2 0zM12 13.9l-1.1 1.9h2.2zM10.05 18.4h.9v3.1h-.9zM13.05 18.4h.9v3.1h-.9z"/>',
  shield: '<path fill="currentColor" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" d="M12 3.6l6.6 2.5v5c0 4-2.7 7.5-6.6 9.3-3.9-1.8-6.6-5.3-6.6-9.3v-5z"/>',
  star: '<path fill="currentColor" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" d="M12 3.6l2.5 5.2 5.7.8-4.1 4 1 5.6-5.1-2.7-5.1 2.7 1-5.6-4.1-4 5.7-.8z"/>',
  eye: '<path fill="currentColor" fill-rule="evenodd" d="M1.8 12S5.5 5.2 12 5.2 22.2 12 22.2 12 18.5 18.8 12 18.8 1.8 12 1.8 12zM8.2 12a3.8 3.8 0 1 0 7.6 0a3.8 3.8 0 1 0-7.6 0zM10.4 12a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0-3.2 0z"/>',
  bomb: '<circle cx="10.5" cy="14" r="7.2" fill="currentColor"/><path d="M15.4 8.6l2.3-2.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><circle cx="19.4" cy="4.4" r="2" fill="currentColor"/>',
  crown: '<path fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M4.5 13.5L3 4.5l5.5 4L12 2.5l3.5 6 5.5-4-1.5 9z"/>',
};
const psIcon = (name, vb = '0 0 24 24') => `<svg viewBox="${vb}" aria-hidden="true">${PS_ICON[name]}</svg>`;

// Tablero de 5×5: S calavera, * estrella, H escudo, E ojo; el resto muestra puntos
// (tantos como calaveras alrededor, igual que en el juego)
const BOARD = [
  '..S..',
  '....E',
  'H....',
  '.S.*.',
  '....S',
];
const SPECIAL = { '*': 'star', H: 'shield', E: 'eye' };
// Posición de los puntos en la rejilla 3×3 de cada casilla (PIPS del juego)
const PIPS = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8] };
const TAP = [2, 2]; // casilla que "toca" el jugador

function psBoard() {
  const cells = [];
  for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) {
    const k = BOARD[r][c];
    let n = 0;
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) if ((dr || dc) && BOARD[r + dr]?.[c + dc] === 'S') n++;
    // Orden de apertura: onda desde la casilla tocada; las calaveras salen al final
    const dist = Math.max(Math.abs(r - TAP[0]), Math.abs(c - TAP[1])) + Math.abs(r - TAP[0]) * .15 + c * .04;
    let face;
    if (k === 'S') face = `<span class="ps-face ps-skull">${psIcon('skull')}</span>`;
    else if (SPECIAL[k]) face = `<span class="ps-face ps-${SPECIAL[k]}">${psIcon(SPECIAL[k])}</span>`;
    else face = `<span class="ps-face ps-open">${n ? `<span class="ps-pips">${Array.from({ length: 9 }, (_, i) => `<i${PIPS[n].includes(i) ? ' class="on"' : ''}></i>`).join('')}</span>` : ''}</span>`;
    cells.push({ html: `<div class="ps-tile${k === 'S' ? ' is-skull' : ''}${r === TAP[0] && c === TAP[1] ? ' is-tap' : ''}" style="--n:${r * 5 + c}" data-o="${k === 'S' ? 99 : dist.toFixed(2)}"><span class="ps-in"><span class="ps-face ps-closed"></span>${face}</span></div>` });
  }
  return `<div class="ps-board" data-ps-board>${cells.map(c => c.html).join('')}<span class="ps-ring" aria-hidden="true"></span></div>`;
}

// Fichas sueltas de fondo, como en el arte del juego
const FLOAT = [
  // [tipo, icono, x %, y %, giro, escala]
  ['tile', '', 1, -6, -10, 1.0], ['open', '2', 4, 88, 8, .9], ['skull', 'skull', 90, 6, 12, .85],
  ['shield', 'shield', 96, 58, -8, .8], ['sun', 'star', 80, 92, 14, .75], ['tile', '', 44, 98, -16, .65],
  ['eye', 'eye', 52, -4, 6, .7], ['bomb', 'bomb', -3, 40, 10, .75],
];
function psFloaters() {
  return `<div class="ps-floaters" aria-hidden="true">${FLOAT.map(([kind, ico, x, y, rot, sc], i) => {
    const inner = ico && ico !== '2' ? psIcon(ico) : ico === '2' ? '<span class="ps-pips"><i class="on"></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i class="on"></i></span>' : '';
    return `<span class="ps-float ps-f-${kind}" style="--x:${x}%;--y:${y}%;--r:${rot}deg;--s:${sc};--i:${i}">${inner}</span>`;
  }).join('')}</div>`;
}

function psLogo(name) {
  const letters = [['P', 'tile'], ['O', 'sun'], ['W', 'shield'], ['E', 'skull'], ['R', 'eye']];
  return `<span class="ps-logo" role="img" aria-label="${name}">
    <span class="ps-word">${letters.map(([ch, tone], i) => `<span class="ps-letter ps-l-${tone}" style="--i:${i}">${i === 0 ? `<span class="ps-crown">${psIcon('crown', '0 0 24 16')}</span>` : ''}${ch}</span>`).join('')}</span>
    <span class="ps-square">SQUARE</span>
  </span>`;
}

// ---------- Derrape! ----------
// El icono de la app cobra vida. Colores del juego (variables --ground, --road, --coral… de Derrape!.html).
// Coche visto desde arriba, morro hacia arriba. tone: color de carrocería; stripe: franjas de carreras.
function drCar(cls, tone, { stripe = false, police = false } = {}) {
  const body = police ? '#F7EEDF' : tone;
  return `<svg class="${cls}" viewBox="0 0 40 72" aria-hidden="true">
    <rect x="2" y="2" width="36" height="68" rx="12" fill="${body}"/>
    ${police ? '<rect x="2" y="20" width="36" height="30" fill="#221E33"/>' : ''}
    <rect x="7" y="17" width="26" height="13" rx="5" fill="#221E33" opacity="${police ? 1 : .62}"/>
    <rect x="9" y="47" width="22" height="8" rx="4" fill="#221E33" opacity="${police ? 1 : .45}"/>
    ${stripe ? '<rect x="17" y="3" width="6" height="12" fill="#F7EEDF"/><rect x="17" y="32" width="6" height="13" fill="#F7EEDF"/><rect x="17" y="57" width="6" height="12" fill="#F7EEDF"/>' : ''}
    <rect x="6" y="3" width="7" height="4" rx="2" fill="#FFD7A8"/><rect x="27" y="3" width="7" height="4" rx="2" fill="#FFD7A8"/>
    ${police ? '<rect class="dr-siren dr-red" x="6" y="33" width="13" height="6" rx="2" fill="#FF5A4E"/><rect class="dr-siren dr-blue" x="21" y="33" width="13" height="6" rx="2" fill="#4FC3F7"/>' : ''}
  </svg>`;
}

function drScene() {
  return `<div class="dr-tile">
    <div class="dr-road">
      <span class="dr-curb dr-curb-l"></span><span class="dr-curb dr-curb-r"></span><span class="dr-lines"></span>
      <span class="dr-traffic dr-t1">${drCar('', '#1E9E96')}</span>
      <span class="dr-traffic dr-t2">${drCar('', '#4FC3F7')}</span>
      <span class="dr-coin dr-c1"></span><span class="dr-coin dr-c2"></span>
      <span class="dr-player">
        <span class="dr-smoke"><i></i><i></i><i></i></span>
        ${drCar('dr-car', '#FF5A4E', { stripe: true })}
      </span>
      <span class="dr-cop">${drCar('dr-car', '', { police: true })}</span>
    </div>
  </div>`;
}

const DR_FLOAT = [
  // [tipo, x %, y %, giro, escala]
  ['coin', 6, 10, 0, 1], ['car-teal', 94, 14, 18, 1], ['coin', 88, 88, 0, .8],
  ['car-gold', 3, 80, -14, .9], ['coin', 48, 96, 0, .7], ['car-volt', 58, -2, 12, .8],
];
function drFloaters() {
  const tones = { 'car-teal': '#1E9E96', 'car-gold': '#F6C744', 'car-volt': '#4FC3F7' };
  return `<div class="dr-floaters" aria-hidden="true">${DR_FLOAT.map(([kind, x, y, r, sc], i) =>
    `<span class="dr-float dr-f-${kind.startsWith('car') ? 'car' : 'coin'}" style="--x:${x}%;--y:${y}%;--r:${r}deg;--s:${sc};--i:${i}">${kind.startsWith('car') ? drCar('', tones[kind]) : ''}</span>`).join('')}</div>`;
}

// ---------- Die Cut ----------
// El pozo de la pantalla de título: capas de papel recortado, Hoja en el borde
// y enemigos que caen al fondo (empujarlos a las simas es la gracia del juego).
// Colores de Die Cut.html (--bg, --hero, --foe, --ink…).
const DC_RINGS = [
  // [radio %, color, giro inicial, sentido]
  [42, '#A8DCCB', 4, 1], [34, '#EFB7A3', -8, -1], [26, '#4B4192', 10, 1], [18, '#2B2452', -6, -1], [10, '#18142C', 0, 1],
];
function dcPolygon(r, sides = 9, jitter = 0.06, seed = 1) {
  let pts = [], t = seed;
  for (let i = 0; i < sides; i++) {
    t = (t * 9301 + 49297) % 233280;
    const a = (i / sides) * Math.PI * 2, rr = r * (1 - jitter + (t / 233280) * jitter * 2);
    pts.push(`${(50 + rr * Math.cos(a)).toFixed(2)},${(50 + rr * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(' ');
}
// Pegatina con borde blanco troquelado. shape: square (héroe), pentagon, triangle, circle (enemigos)
function dcSticker(shape, fill, { blade = false, cls = '' } = {}) {
  const paths = {
    square: '<rect x="6" y="6" width="28" height="28" rx="9"/>',
    pentagon: '<path d="M20 5 34 15 29 33H11L6 15Z"/>',
    triangle: '<path d="M20 6 35 32H5Z"/>',
    circle: '<circle cx="20" cy="20" r="14"/>',
  };
  return `<svg class="dc-st ${cls}" viewBox="0 0 40 40" aria-hidden="true">
    <g fill="#fffdf8" stroke="#fffdf8" stroke-width="7" stroke-linejoin="round">${paths[shape]}</g>
    <g fill="${fill}">${paths[shape]}</g>
    <circle cx="16" cy="21" r="2.2" fill="#2d3558"/><circle cx="24" cy="21" r="2.2" fill="#2d3558"/>
    ${blade ? '<path class="dc-blade" d="M36 2 39 13 36 16 33 13Z" fill="#2d3558" stroke="#fffdf8" stroke-width="1.6" stroke-linejoin="round"/><rect x="32" y="15.5" width="8" height="2.2" rx="1" fill="#3a2a12"/>' : ''}
  </svg>`;
}
function dcScene() {
  const rings = DC_RINGS.map(([r, c, rot, dir], i) => `<polygon class="dc-ring" style="--r0:${rot}deg;--dir:${dir};--i:${i}" points="${dcPolygon(r, 9 + (i % 2), .07, i + 3)}" fill="${c}"/>`).join('');
  return `<div class="dc-pit">
    <svg class="dc-rings" viewBox="0 0 100 100" aria-hidden="true">
      <defs><filter id="dc-paper" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy=".6" stdDeviation=".8" flood-color="#1b1733" flood-opacity=".35"/></filter></defs>
      <pattern id="dc-grid" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M8 0H0V8" fill="none" stroke="#fffdf8" stroke-opacity=".55" stroke-width=".35"/></pattern>
      <rect x="1" y="2.2" width="98" height="98" rx="4" fill="#B7C6E2"/>
      <rect x="1" y="0" width="98" height="98" rx="4" fill="#D3DFF1"/>
      <rect x="1" y="0" width="98" height="98" rx="4" fill="url(#dc-grid)"/>
      <g filter="url(#dc-paper)" stroke="#fffdf8" stroke-width=".8" stroke-linejoin="round">${rings}</g>
      <g class="dc-eyes"><ellipse cx="46.5" cy="50" rx="2" ry="1.1" fill="#C78BFF"/><ellipse cx="53.5" cy="50" rx="2" ry="1.1" fill="#C78BFF"/></g>
    </svg>
    <span class="dc-foe dc-f1">${dcSticker('pentagon', '#F2788F')}</span>
    <span class="dc-foe dc-f2">${dcSticker('triangle', '#E5566F')}</span>
    <span class="dc-foe dc-f3">${dcSticker('circle', '#8E7CF0')}</span>
    <span class="dc-hero">${dcSticker('square', '#FFB84D', { blade: true })}</span>
  </div>`;
}
function dcLogo(name) {
  return `<span class="dc-logo" role="img" aria-label="${name}">
    <span class="dc-die">${[...'DIE'].map((c, i) => `<span style="--i:${i}">${c}</span>`).join('')}</span>
    <span class="dc-cut">${[...'CUT'].map((c, i) => `<span style="--i:${i + 3}">${c}</span>`).join('')}<span class="dc-snip" aria-hidden="true"><i></i><svg viewBox="0 0 48 24"><g fill="none" stroke="#2d3558" stroke-width="3" stroke-linecap="round"><circle cx="38" cy="6" r="5"/><circle cx="38" cy="18" r="5"/><path class="dc-b1" d="M33.5 8.5 4 16"/><path class="dc-b2" d="M33.5 15.5 4 8"/></g></svg></span></span>
  </span>`;
}
const DC_CONFETTI = [['#F2788F', 6, 12, 20], ['#FFB84D', 92, 18, -30], ['#35AD96', 88, 84, 45], ['#7C6CF0', 10, 86, -15], ['#FFB84D', 46, 4, 60], ['#F2788F', 60, 96, -40]];

export const scenes = {
  'die-cut': {
    fonts: 'Caprasimo',
    logo: g => dcLogo(g.name),
    media: () => dcScene(),
    bg: () => `<div class="dc-confetti" aria-hidden="true">${DC_CONFETTI.map(([c, x, y, r], i) => `<i style="--c:${c};--x:${x}%;--y:${y}%;--r:${r}deg;--i:${i}"></i>`).join('')}</div>`,
  },
  'derrape': {
    fonts: 'Bungee',
    logo: g => `<span class="dr-logo" role="img" aria-label="${g.name}">${[...'DERRAPE!'].map((ch, i) => `<span style="--i:${i}">${ch}</span>`).join('')}</span>`,
    media: () => drScene(),
    bg: () => drFloaters(),
  },
  'power-square': {
    fonts: 'Fredoka:wght@600',
    logo: g => psLogo(g.name),
    media: () => `<div class="ps-scene">${psBoard()}</div>`,
    bg: () => psFloaters(),
  },
};
