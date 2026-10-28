#!/usr/bin/env node
// spec2site — um sitefile.yaml, um site estático. Zero dependências.
// James-02 · Genesis Innovation · MIT

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

// ---------- parser YAML mínimo (subconjunto do sitefile) ----------
// Suporta: mapas aninhados por indentação, listas com "- ", strings
// (nuas ou entre aspas), números, booleanos e comentários em linha própria.
function parseEscalar(s) {
  s = s.trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) return s.slice(1, -1);
  if (s === 'true') return true;
  if (s === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
  return s;
}

function parseYAML(texto) {
  const linhas = [];
  for (const bruta of texto.split(/\r?\n/)) {
    const limpa = bruta.trim();
    if (!limpa || limpa.startsWith('#')) continue;
    linhas.push({ indent: bruta.length - bruta.trimStart().length, texto: limpa });
  }
  if (!linhas.length) throw new Error('sitefile vazio');

  let i = 0;

  function parseBloco() {
    return linhas[i].texto.startsWith('- ') || linhas[i].texto === '-' ? parseLista() : parseMapa();
  }

  function parseMapa() {
    const indent = linhas[i].indent;
    const obj = {};
    while (i < linhas.length && linhas[i].indent === indent && !linhas[i].texto.startsWith('- ')) {
      const m = linhas[i].texto.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
      if (!m) throw new Error(`linha não entendida: "${linhas[i].texto}"`);
      const chave = m[1];
      const resto = m[2].trim();
      i += 1;
      if (resto === '') {
        obj[chave] = i < linhas.length && linhas[i].indent > indent ? parseBloco() : null;
      } else {
        obj[chave] = parseEscalar(resto);
      }
    }
    return obj;
  }

  function parseLista() {
    const indent = linhas[i].indent;
    const arr = [];
    while (i < linhas.length && linhas[i].indent === indent && (linhas[i].texto.startsWith('- ') || linhas[i].texto === '-')) {
      const resto = linhas[i].texto.replace(/^-\s*/, '');
      const m = resto.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
      if (!m) {
        arr.push(parseEscalar(resto));
        i += 1;
        continue;
      }
      const chave = m[1];
      const valor = m[2].trim();
      const item = {};
      if (valor === '') {
        i += 1;
        item[chave] = i < linhas.length && linhas[i].indent > indent ? parseBloco() : null;
      } else {
        item[chave] = parseEscalar(valor);
        i += 1;
      }
      if (i < linhas.length && linhas[i].indent > indent) Object.assign(item, parseMapa());
      arr.push(item);
    }
    return arr;
  }

  const valor = parseBloco();
  if (i < linhas.length) throw new Error(`linha sobrando ou indentação estranha perto de: "${linhas[i].texto}"`);
  return valor;
}

// ---------- validação ----------
function validar(spec) {
  const erros = [];
  if (!spec.nome) erros.push('falta "nome"');
  if (!Array.isArray(spec.paginas) || !spec.paginas.length) erros.push('falta "paginas" (lista com ao menos uma página)');
  else {
    spec.paginas.forEach((p, n) => {
      if (!p.id) erros.push(`página ${n + 1}: falta "id"`);
      if (!p.titulo) erros.push(`página ${n + 1}: falta "titulo"`);
      if (!Array.isArray(p.blocos) || !p.blocos.length) erros.push(`página ${n + 1} (${p.id || '?'}): falta "blocos"`);
    });
  }
  if (erros.length) throw new Error('sitefile inválido: ' + erros.join('; '));
}

// ---------- render ----------
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const BLOCOS = {
  hero: (b) => `<section class="hero"><h1>${esc(b.titulo || '')}</h1>${b.texto ? `<p>${esc(b.texto)}</p>` : ''}${b.botao && b.link ? `<a class="btn" href="${esc(b.link)}">${esc(b.botao)}</a>` : ''}</section>`,
  texto: (b) => `<section class="secao">${b.titulo ? `<h2>${esc(b.titulo)}</h2>` : ''}${(b.paragrafos || []).map((p) => `<p>${esc(p)}</p>`).join('')}${b.texto ? `<p>${esc(b.texto)}</p>` : ''}</section>`,
  lista: (b) => `<section class="secao">${b.titulo ? `<h2>${esc(b.titulo)}</h2>` : ''}<div class="grid">${(b.itens || []).map((it) => `<article><h3>${esc(it.titulo || '')}</h3><p>${esc(it.texto || '')}</p></article>`).join('')}</div></section>`,
  contato: (b) => `<section class="secao contato">${b.titulo ? `<h2>${esc(b.titulo)}</h2>` : ''}${b.texto ? `<p>${esc(b.texto)}</p>` : ''}${b.link ? `<a class="btn" href="${esc(b.link)}">${esc(b.botao || 'Fale com a gente')}</a>` : ''}</section>`,
};

function css(spec) {
  const cor = /^#[0-9a-fA-F]{3,8}$/.test(String(spec.tema && spec.tema.cor ? spec.tema.cor : '')) ? spec.tema.cor : '#a05c2c';
  return `
  :root { --cor: ${cor}; --tinta: #1c1917; --fundo: #faf7f2; --cartao: #ffffff; --borda: #e7e0d8; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: system-ui, -apple-system, 'Segoe UI', sans-serif; color: var(--tinta); background: var(--fundo); line-height: 1.6; }
  header { position: sticky; top: 0; background: rgba(250, 247, 242, 0.92); backdrop-filter: blur(8px); border-bottom: 1px solid var(--borda); }
  nav { max-width: 960px; margin: 0 auto; display: flex; gap: 24px; align-items: center; padding: 16px 24px; flex-wrap: wrap; }
  nav .marca { font-weight: 700; color: var(--cor); margin-right: auto; text-decoration: none; }
  nav a { color: var(--tinta); text-decoration: none; opacity: 0.75; }
  nav a:hover { opacity: 1; }
  nav a.ativo { color: var(--cor); opacity: 1; font-weight: 600; }
  main { max-width: 960px; margin: 0 auto; padding: 0 24px; }
  .hero { padding: 96px 0 80px; max-width: 720px; }
  .hero h1 { font-size: clamp(32px, 6vw, 56px); line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 20px; }
  .hero p { font-size: 20px; opacity: 0.8; margin-bottom: 28px; }
  .btn { display: inline-block; background: var(--cor); color: #fff; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: 600; }
  .btn:hover { filter: brightness(1.1); }
  .secao { padding: 48px 0; }
  .secao h2 { font-size: 28px; margin-bottom: 20px; letter-spacing: -0.01em; }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; }
  .grid article { background: var(--cartao); border: 1px solid var(--borda); border-radius: 14px; padding: 24px; }
  .grid h3 { margin-bottom: 8px; }
  .grid p { opacity: 0.8; }
  .contato { text-align: center; background: var(--cartao); border: 1px solid var(--borda); border-radius: 18px; padding: 56px 24px; margin: 48px 0; }
  footer { border-top: 1px solid var(--borda); margin-top: 48px; padding: 32px 24px; text-align: center; opacity: 0.6; font-size: 14px; }
  @media (max-width: 600px) { .hero { padding: 64px 0 48px; } }
  `;
}

function paginaHTML(spec, pagina, arquivoDe) {
  const navItens = spec.paginas.map((p) => `<a href="${arquivoDe(p)}"${p === pagina ? ' class="ativo"' : ''}>${esc(p.titulo)}</a>`).join('');
  const corpo = (pagina.blocos || [])
    .map((b) => (BLOCOS[b.tipo] ? BLOCOS[b.tipo](b) : `<!-- bloco desconhecido: ${esc(b.tipo)} -->`))
    .join('\n');
  return `<!doctype html>
<html lang="${esc(spec.idioma || 'pt-BR')}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(pagina.titulo)} — ${esc(spec.nome)}</title>
<meta name="description" content="${esc(spec.descricao || '')}">
<meta property="og:title" content="${esc(pagina.titulo)} — ${esc(spec.nome)}">
<meta property="og:description" content="${esc(spec.descricao || '')}">
<meta property="og:type" content="website">
<style>${css(spec)}</style>
</head>
<body>
<header><nav><a class="marca" href="${arquivoDe(spec.paginas[0])}">${esc(spec.nome)}</a>${navItens}</nav></header>
<main>
${corpo}
</main>
<footer>${esc(spec.nome)} · feito com <a href="https://github.com/thiagopatzdorf/spec2site">spec2site</a></footer>
</body>
</html>`;
}

// ---------- CLI ----------
const [arquivo, ...args] = process.argv.slice(2);
if (!arquivo || arquivo === '--help' || arquivo === '-h') {
  console.log('spec2site v0.1.0 — um sitefile.yaml, um site estático.');
  console.log('uso: node gerar.mjs <sitefile.yaml> [--saida pasta]');
  process.exit(arquivo ? 0 : 1);
}

let saida = 'dist';
const idxSaida = args.indexOf('--saida');
if (idxSaida !== -1 && args[idxSaida + 1]) saida = args[idxSaida + 1];

let spec;
try {
  spec = parseYAML(readFileSync(arquivo, 'utf8'));
} catch (e) {
  console.error('erro lendo o sitefile:', e.message);
  process.exit(1);
}
try {
  validar(spec);
} catch (e) {
  console.error(e.message);
  process.exit(1);
}

const home = spec.paginas.find((p) => p.id === 'inicio') || spec.paginas[0];
const arquivoDe = (p) => (p === home ? 'index.html' : `${esc(p.id)}.html`);

mkdirSync(saida, { recursive: true });
const gerados = [];
for (const p of spec.paginas) {
  const nome = arquivoDe(p);
  writeFileSync(join(saida, nome), paginaHTML(spec, p, arquivoDe));
  gerados.push(nome);
}
writeFileSync(join(saida, 'robots.txt'), 'User-agent: *\nAllow: /\n');
console.log(`spec2site v0.1.0 — ${gerados.length} página(s) em ${saida}/: ${gerados.join(', ')}`);
