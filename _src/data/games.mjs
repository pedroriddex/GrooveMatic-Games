// Catálogo de juegos de Groove Matic.
//
// status:  'out' publicado · 'play' se juega aquí, en el navegador · 'soon' en desarrollo
// platforms: dispositivos para los que está pensado: 'desktop', 'tablet', 'mobile'.
// stores:  { googleplay, appstore }: enlace, o null si está previsto pero aún no publicado ("pronto").
//          Si el juego no va a estar en una tienda, no pongas esa clave.
// links:   otros enlaces (itch, web). null = "pronto".
// embed:   ruta al index.html del juego web; activa el botón "Jugar".
// coverBg: fondo de la portada si el dibujo no se ve sobre grafito.
// privacy: nombre del archivo en _src/data/privacy/; se publica en /<nombre>/privacy.html (URL estable para las tiendas).
// banner:  si existe, el juego sale en el banner de la portada (en este orden).
//          bg/dark: color de fondo y si el texto va oscuro. media: 'scene' (escena animada propia,
//          ver _src/scenes.mjs), 'landscape' o 'phones' (imágenes en banner.images).

const ps = '/assets/img/games/power-square';

export const games = [
  {
    slug: 'die-cut',
    name: 'Die Cut',
    status: 'out',
    cover: '/assets/img/games/die-cut/cover.jpg',
    coverFit: 'cover',
    // título, Hoja, tutorial, partida, tienda del buhonero, capitana Vela, jefe
    shots: { en: [1, 2, 3, 4, 5, 6, 7].map(i => `/assets/img/games/die-cut/shot-en-${i}.jpg`), es: [1, 2, 3, 4, 5, 6, 7].map(i => `/assets/img/games/die-cut/shot-es-${i}.jpg`) },
    shotShape: 'portrait',
    platforms: ['mobile', 'tablet'],
    stores: {},
    links: { itch: 'https://groove-matic-games.itch.io/die-cut' },
    banner: { bg: '#E2E9F3', dark: true, media: 'scene', scene: 'die-cut' },
    en: {
      tagline: 'Push. Corner. Go one floor deeper.',
      short: 'Turn-based tactics in a paper pit, where enemies tell you where they’ll strike.',
      tags: ['Tactics', 'Turn-based', 'Roguelike'],
      body: [
        'Every enemy marks the tile it will hit on its turn. You get one action to answer: step aside, raise your guard or shove it into a wall, into another enemy or down a pit.',
        'Go down floor by floor with six different heroes, from Blade, the reckless duelist, to Lantern, the steadfast cleric. Each one plays its own way and grows along three paths.',
      ],
      features: ['6 heroes, each with its own playstyle', 'Shoves, collisions and falls into the void', 'Enemies that warn you before they strike', 'Bosses with their own rules', 'Six zones: Atrium, Pond, Ember, Gloom, Void and Haven', 'Paper skins for every hero'],
    },
    es: {
      tagline: 'Empuja. Acorrala. Baja otra planta.',
      short: 'Táctica por turnos en un pozo de papel, donde los enemigos avisan dónde van a golpear.',
      tags: ['Táctica', 'Por turnos', 'Roguelike'],
      body: [
        'Cada enemigo marca la casilla que va a golpear en su turno. Tú tienes una acción para responder: apartarte, cubrirte o empujarlo contra un muro, contra otro enemigo o al vacío.',
        'Baja planta a planta con seis héroes distintos, desde Hoja, la duelista temeraria, hasta Candil, el clérigo tenaz. Cada uno juega a su manera y mejora por tres sendas.',
      ],
      features: ['6 héroes, cada uno con su forma de jugar', 'Empujones, choques y caídas al vacío', 'Enemigos que avisan antes de golpear', 'Jefes con sus propias reglas', 'Seis zonas: Atrio, Estanque, Brasa, Penumbra, Vacío y Remanso', 'Pieles de papel para cada héroe'],
    },
  },

  {
    slug: 'derrape',
    privacy: 'derrape',
    name: 'Derrape!',
    status: 'out',
    cover: '/assets/img/games/derrape/cover.jpg',
    coverFit: 'cover',
    icon: '/assets/img/games/derrape/icon.png',
    shots: { en: [1, 2, 3, 4, 5].map(i => `/assets/img/games/derrape/shot-en-${i}.jpg`), es: [1, 2, 3, 4, 5].map(i => `/assets/img/games/derrape/shot-es-${i}.jpg`) },
    shotShape: 'portrait',
    platforms: ['mobile', 'tablet'],
    stores: { googleplay: null, appstore: null },
    links: { itch: 'https://groove-matic-games.itch.io/derrape' },
    banner: { bg: '#2B2443', dark: false, media: 'scene', scene: 'derrape' },
    en: {
      tagline: 'Shave past traffic. Outrun the cops.',
      short: 'Arcade driving where every near miss multiplies your score.',
      tags: ['Arcade', 'Racing', 'Chase'],
      body: [
        'One half of the screen steers, the other brakes. Shave past cars to multiply your score, grab turbos and watch out for oil.',
        'Speed past a radar and the police will be on your tail. At three stars, run a roadblock and an armored truck drops from the sky.',
      ],
      features: ['23 vehicles, from a shopping cart to a tram', 'Every vehicle has its own special ability', 'Four stages: desert, lava fields, laurel forest and night', 'Daily challenge and 18 achievements', 'Global leaderboard', 'Right- or left-handed controls'],
    },
    es: {
      tagline: 'Roza el tráfico. Escapa de la poli.',
      short: 'Conducción arcade: cada coche que rozas multiplica tus puntos.',
      tags: ['Arcade', 'Carreras', 'Persecución'],
      body: [
        'Una mitad de la pantalla es el volante y la otra, el freno. Pasa rozando los coches para multiplicar los puntos, coge turbos y cuidado con el aceite.',
        'Si pasas rápido por un radar, tendrás a la poli detrás. Con tres estrellas de busca, sáltate un control y caerá del cielo un furgón blindado.',
      ],
      features: ['23 vehículos, del carrito del súper al tranvía', 'Cada vehículo con su habilidad especial', 'Cuatro tramos: desierto, malpaís, laurisilva y noche', 'Reto del día y 18 logros', 'Ranking mundial', 'Controles para diestros y zurdos'],
    },
  },

  {
    slug: 'power-square',
    privacy: 'power-square',
    name: 'Power Square',
    status: 'out',
    cover: `${ps}/cover.jpg`,
    coverFit: 'cover',
    shots: { en: [1, 2, 3, 4, 5].map(i => `${ps}/shot-en-${i}.jpg`), es: [1, 2, 3, 4, 5].map(i => `${ps}/shot-es-${i}.jpg`) },
    shotShape: 'landscape',
    platforms: ['desktop', 'tablet', 'mobile'],
    stores: { googleplay: null },
    links: { itch: 'https://groove-matic-games.itch.io/power-square' },
    banner: { bg: '#403A63', dark: false, media: 'scene', scene: 'power-square' },
    en: {
      tagline: 'Open tiles. Dodge skulls. Beat the boss.',
      short: 'Minesweeper with bosses, charms and online duels.',
      tags: ['Puzzle', 'Roguelite', '2 players'],
      body: [
        'Every tile you open shows how many skulls are around it. Read the board and keep your streak alive.',
        'Every five levels a boss turns up with its own trick. Between levels, spend your coins on charms that change the rules.',
      ],
      features: ['7 bosses', '6 modes, including a daily challenge', 'Duel on one phone or online', '13 skins with their own music', '10 languages'],
    },
    es: {
      tagline: 'Abre casillas. Esquiva calaveras. Tumba al jefe.',
      short: 'Un buscaminas con jefes, amuletos y duelos online.',
      tags: ['Puzle', 'Roguelite', '2 jugadores'],
      body: [
        'Cada casilla que abres te dice cuántas calaveras tiene alrededor. Lee el tablero y no rompas la racha.',
        'Cada cinco niveles aparece un jefe con su propio truco. Entre nivel y nivel, gasta tus monedas en amuletos que cambian las reglas.',
      ],
      features: ['7 jefes', '6 modos, con reto diario', 'Duelo en el mismo móvil u online', '13 skins con su propia música', '10 idiomas'],
    },
  },

];
