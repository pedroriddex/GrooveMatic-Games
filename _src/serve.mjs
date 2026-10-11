// Servidor local que imita a Vercel: redirecciones de vercel.json, trailingSlash:false, índices de carpeta y 404.html.
// Uso: node _src/serve.mjs [puerto]
import { createServer } from 'node:http';
import { readFileSync, statSync, existsSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const PORT = +(process.argv[2] || process.env.PORT || 4420);
const cfg = JSON.parse(readFileSync(join(ROOT, 'vercel.json'), 'utf8'));
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.xml': 'application/xml', '.txt': 'text/plain', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.m4a': 'audio/mp4', '.wasm': 'application/wasm', '.woff2': 'font/woff2', '.woff': 'font/woff' };

const rules = cfg.redirects.map(r => {
  const keys = [];
  const re = new RegExp('^' + r.source.replace(/\./g, '\\.').replace(/:(\w+)/g, (_, k) => (keys.push(k), '([^/]+?)')) + '$');
  return { re, keys, dest: r.destination };
});
const isFile = p => { try { return statSync(p).isFile(); } catch { return false; } };

createServer((req, res) => {
  let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  for (const r of rules) {
    const m = path.match(r.re);
    if (m) { let d = r.dest; r.keys.forEach((k, i) => (d = d.replace(':' + k, m[i + 1]))); res.writeHead(308, { Location: d }); return res.end(); }
  }
  if (path.length > 1 && path.endsWith('/')) { res.writeHead(308, { Location: path.slice(0, -1) }); return res.end(); }
  const candidates = [join(DIST, path), join(DIST, path, 'index.html')];
  const fp = candidates.find(isFile);
  if (!fp) { console.log('404', path); res.writeHead(404, { 'Content-Type': TYPES['.html'] }); return res.end(existsSync(join(DIST, '404.html')) ? readFileSync(join(DIST, '404.html')) : 'Not found'); }
  res.writeHead(200, { 'Content-Type': TYPES[extname(fp).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  res.end(readFileSync(fp));
}).listen(PORT, () => console.log(`http://localhost:${PORT}`));
