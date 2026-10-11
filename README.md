# Groove Matic Games · web

Web oficial de [groovematicgames.com](https://groovematicgames.com). Sitio estático en inglés (`/`) y español (`/es`), generado sin dependencias.

## Estructura

- `_src/data/games.mjs` — catálogo de juegos (textos en EN/ES, estado, enlaces a tiendas, embed).
- `_src/data/site.mjs` — configuración (correo, redes, analítica) y todos los textos de la web.
- `_src/build.mjs` — plantillas y generación de `dist/`.
- `_src/static/` — CSS, JS, logo y favicons (se copian tal cual a `dist/`).
- `assets/games/` — juegos web embebidos (exportaciones de Construct). `assets/img/` — portadas y capturas.
- `power-square/privacy.html` — política de privacidad enlazada desde Google Play. **No cambiar la URL.**

## Uso

```
npm run build   # genera dist/
npm run dev     # genera y sirve en http://localhost:4420 (redirecciones como en Vercel)
```

Vercel ejecuta `node _src/build.mjs` y publica `dist/` (ver `vercel.json`, que también redirige las URLs de la web anterior).

## Añadir un juego

Añade una entrada a `_src/data/games.mjs` con `slug`, `name`, `status` (`out`, `play` o `soon`), portada y textos `en`/`es`.

- `platforms`: dispositivos para los que está pensado (`desktop`, `tablet`, `mobile`). Salen como iconos en la tarjeta y en la ficha.
- `stores`: `googleplay` / `appstore` con su enlace, o `null` si está previsto pero aún no publicado (sale como "pronto"). Si no va a estar en una tienda, no pongas la clave.
- `links.itch` / `links.web`: otros enlaces. `null` = "pronto".
