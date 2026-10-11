// Configuración y textos de la web, en inglés (por defecto) y español (/es).

export const site = {
  url: 'https://groovematicgames.com',
  name: 'Groove Matic Games',
  email: 'groovematicgames@gmail.com',
  // Datos legales de las políticas de privacidad. Sin ellos, el build avisa y la página muestra "pendiente".
  legal: {
    controller: 'Pedro José Reyes Rodríguez', // persona física; Groove Matic Games es solo el nombre con el que publica
    email: 'groovematicgames@gmail.com',
  },
  analyticsId: 'G-5LSTEQXQ9Q',
  social: [
    { name: 'LinkedIn', url: 'https://www.linkedin.com/company/101177361/' },
  ],
};

export const langs = ['en', 'es'];

export const t = {
  en: {
    htmlLang: 'en',
    prefix: '',
    nav: { games: 'Games', studio: 'About', contact: 'Contact' },
    skip: 'Skip to content',
    menu: 'Menu',
    meta: {
      home: { title: 'Groove Matic Games', desc: 'Puzzle, logic and reflex games for mobile and the browser. Play Power Square, Infinite Solar and more.' },
      games: { title: 'Games — Groove Matic', desc: 'All Groove Matic games. Some of them you can play for free right here.' },
      studio: { title: 'About — Groove Matic', desc: 'We design, code and score the games of Groove Matic.' },
      contact: { title: 'Contact — Groove Matic', desc: 'Get in touch with Groove Matic Games.' },
      notFound: { title: 'Page not found — Groove Matic', desc: '' },
    },
    banner: { see: 'See game', play: 'Play now', prev: 'Previous game', next: 'Next game', goto: 'Go to' },
    home: { games: 'Games', soon: 'Coming soon', all: 'All games' },
    status: { out: 'Out now', play: 'Free in browser', soon: 'Coming soon' },
    devices: { desktop: 'Computer', tablet: 'Tablet', mobile: 'Phone' },
    stores: { googleplay: 'Google Play', appstore: 'App Store' },
    filters: { all: 'All', out: 'Out now', play: 'Free in browser', soon: 'Coming soon' },
    game: {
      back: 'All games',
      play: 'Play', close: 'Close', fullscreen: 'Full screen',
      features: 'Features',
      shots: 'Screenshots',
      itch: 'Play on itch.io', web: 'Website', soon: 'soon',
      platforms: 'Platforms',
      inDev: 'In development.',
      privacy: 'Privacy policy',
      more: 'More games',
    },
    studio: {
      title: 'About',
      lead: 'Groove Matic is our playground. Where we let our creativity run free in the form of video games.',
      valuesTitle: 'What we care about',
      values: [
        ['Simplicity', 'Simple games with powerful mechanics. Because less is often more.'],
        ['Games in motion', 'Music, animation, sound. Every game we make is made with special care.'],
        ['Our grain of sand', 'Every game is a concept. Focused on our players having fun, always trying to bring something new.'],
        ['Deep games', 'In our games there’s always something hidden, something you haven’t found yet. Countless details made for replaying.'],
      ],
      meTitle: 'About us',
      me: [
        'We’ve spent years designing and building websites, online shops and interfaces for all kinds of clients, from multinationals to freelancers. That taught us to think about the person on the other side of the screen.',
        'We started making games as kids, to play with friends. They were simple games, but we were hooked. Groove Matic is what happened when that hobby became a job.',
      ],
      signature: '',
      contact: 'Write to us',
    },
    contact: {
      title: 'Contact',
      lead: 'Press, collaborations or feedback about a game.',
      noEmail: 'Write to us on LinkedIn while we set up our email.',
    },
    footer: { privacy: 'Privacy', rights: 'All rights reserved.' },
    notFound: { title: 'Page not found.', back: 'Back home' },
    privacy: { title: 'Privacy', lead: 'Each game has its own privacy policy.', updated: 'Last updated' },
  },

  es: {
    htmlLang: 'es',
    prefix: '/es',
    nav: { games: 'Juegos', studio: 'Estudio', contact: 'Contacto' },
    skip: 'Saltar al contenido',
    menu: 'Menú',
    meta: {
      home: { title: 'Groove Matic Games', desc: 'Juegos de puzle, lógica y reflejos para móvil y navegador. Juega a Power Square, Infinite Solar y más.' },
      games: { title: 'Juegos — Groove Matic', desc: 'Todos los juegos de Groove Matic. Algunos se juegan gratis aquí mismo.' },
      studio: { title: 'Estudio — Groove Matic', desc: 'Diseñamos, programamos y ponemos música a los juegos de Groove Matic.' },
      contact: { title: 'Contacto — Groove Matic', desc: 'Contacta con Groove Matic Games.' },
      notFound: { title: 'Página no encontrada — Groove Matic', desc: '' },
    },
    banner: { see: 'Ver juego', play: 'Jugar ahora', prev: 'Juego anterior', next: 'Juego siguiente', goto: 'Ir a' },
    home: { games: 'Juegos', soon: 'Próximamente', all: 'Todos los juegos' },
    status: { out: 'Publicado', play: 'Gratis en el navegador', soon: 'Próximamente' },
    devices: { desktop: 'Ordenador', tablet: 'Tablet', mobile: 'Móvil' },
    stores: { googleplay: 'Google Play', appstore: 'App Store' },
    filters: { all: 'Todos', out: 'Publicados', play: 'Gratis en el navegador', soon: 'Próximamente' },
    game: {
      back: 'Todos los juegos',
      play: 'Jugar', close: 'Cerrar', fullscreen: 'Pantalla completa',
      features: 'Incluye',
      shots: 'Capturas',
      itch: 'Jugar en itch.io', web: 'Web', soon: 'pronto',
      platforms: 'Plataformas',
      inDev: 'En desarrollo.',
      privacy: 'Política de privacidad',
      more: 'Más juegos',
    },
    studio: {
      title: 'Estudio',
      lead: 'Groove Matic es nuestro patio de recreo. Donde damos rienda suelta a nuestra creatividad en forma de videojuegos.',
      valuesTitle: 'Lo que nos importa',
      values: [
        ['Simplicidad', 'Videojuegos simples pero con mecánicas potentes. Porque muchas veces menos es más.'],
        ['Juegos en movimiento', 'Música, animaciones, sonidos. Cada videojuego que desarrollamos lleva un cariño especial.'],
        ['Nuestro granito', 'Cada juego es un concepto. Centrados en la diversión de nuestros jugadores, buscando aportar algo nuevo.'],
        ['Juegos profundos', 'En nuestros juegos, siempre hay algo oculto, algo que aún no has encontrado. Infinidad de detalles pensados para rejugar.'],
      ],
      meTitle: 'Sobre nosotros',
      me: [
        'Llevamos años diseñando y programando webs, tiendas online e interfaces para todo tipo de clientes, desde multinacionales hasta autónomos. Eso nos enseñó a pensar en la persona que está al otro lado de la pantalla.',
        'Empezamos a hacer juegos de pequeños, para jugar con los amigos. Eran juegos sencillos, pero nos engancharon. Groove Matic es lo que pasó cuando esa afición se convirtió en trabajo.',
      ],
      signature: '',
      contact: 'Escríbenos',
    },
    contact: {
      title: 'Contacto',
      lead: 'Prensa, colaboraciones u opiniones sobre un juego.',
      noEmail: 'Escríbenos por LinkedIn mientras preparamos el correo.',
    },
    footer: { privacy: 'Privacidad', rights: 'Todos los derechos reservados.' },
    notFound: { title: 'Página no encontrada.', back: 'Volver al inicio' },
    privacy: { title: 'Privacidad', lead: 'Cada juego tiene su propia política de privacidad.', updated: 'Última actualización' },
  },
};
