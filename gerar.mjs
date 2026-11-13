// Gera o README.md do perfil e as imagens em assets/ a partir de perfil.json.
// Uso: node gerar.mjs   (edite só o perfil.json; nunca os arquivos gerados)
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";

const aqui = (arq) => new URL(arq, import.meta.url);
const p = JSON.parse(readFileSync(aqui("./perfil.json"), "utf8"));
const C = p.cores;
const TIT = "Impact, Haettenschweiler, 'Arial Narrow Bold', 'Franklin Gothic Bold', sans-serif";
const TXT = "'Segoe UI', Helvetica, Arial, sans-serif";
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const n = (v) => Math.round(v * 10) / 10;

// Sorteio com semente fixa: a paisagem sai igual toda vez que o script roda.
function sorteio(semente) {
  let a = semente;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function quebrar(texto, max) {
  const linhas = [""];
  for (const palavra of String(texto).split(/\s+/)) {
    const atual = linhas[linhas.length - 1];
    if (atual && (atual + " " + palavra).length > max) linhas.push(palavra);
    else linhas[linhas.length - 1] = atual ? atual + " " + palavra : palavra;
  }
  return linhas;
}

function palmeira(x, y, altura, inclina, cor) {
  const tx = x + inclina, ty = y - altura, L = altura * 0.62;
  const tronco = `<path d="M${x} ${y} Q${n(x + inclina * 0.1)} ${n(y - altura * 0.6)} ${tx} ${ty}" stroke="${cor}" stroke-width="${n(altura * 0.045)}" stroke-linecap="round" fill="none"/>`;
  const folhas = [-172, -150, -122, -90, -58, -30, -8].map((graus, i) => {
    const a = (graus * Math.PI) / 180, comp = L * (i === 3 ? 0.75 : 1);
    const ex = tx + comp * Math.cos(a), ey = ty + comp * Math.sin(a) + comp * 0.42;
    const cx = tx + comp * 0.5 * Math.cos(a), cy = ty + comp * 0.5 * Math.sin(a) - comp * 0.22;
    return `<path d="M${tx} ${ty} Q${n(cx)} ${n(cy)} ${n(ex)} ${n(ey)} Q${n(cx)} ${n(cy + comp * 0.2)} ${tx} ${ty}Z" fill="${cor}"/>`;
  });
  return tronco + folhas.join("");
}

function banner() {
  const W = 1200, H = 400, CHAO = 312, solX = 840, solY = 250, solR = 132;
  const r = sorteio(6);
  const escuro = C.silhueta;

  const estrelas = Array.from({ length: 46 }, () => {
    const x = n(r() * W), y = n(r() * 170), raio = n(0.6 + r() * 1.3), atraso = n(r() * 4);
    return `<circle cx="${x}" cy="${y}" r="${raio}" fill="#fff" opacity=".8"><animate attributeName="opacity" values=".15;.9;.15" dur="${n(2.5 + r() * 3)}s" begin="${atraso}s" repeatCount="indefinite"/></circle>`;
  }).join("");

  const faixas = Array.from({ length: 7 }, (_, i) => `<rect x="${solX - solR}" y="${solY + 8 + i * 19}" width="${solR * 2}" height="${3 + i * 2}" fill="#000"/>`).join("");

  let predios = "", x = 0;
  while (x < W) {
    const larg = 26 + Math.floor(r() * 46), alt = 22 + Math.floor(r() * (x > 560 && x < 1010 ? 118 : 66));
    predios += `<rect x="${x}" y="${CHAO - alt}" width="${larg}" height="${alt}" fill="${escuro}"/>`;
    for (let jy = CHAO - alt + 8; jy < CHAO - 8; jy += 12)
      for (let jx = x + 5; jx < x + larg - 6; jx += 9)
        if (r() < 0.1) predios += `<rect x="${jx}" y="${jy}" width="3" height="4" fill="${C.sol}" opacity=".45"/>`;
    x += larg + (r() < 0.25 ? 6 : 0);
  }

  const reflexos = Array.from({ length: 9 }, (_, i) => {
    const larg = 200 - i * 17, y = CHAO + 9 + i * 9;
    return `<rect x="${solX - larg / 2}" y="${y}" width="${larg}" height="2.4" rx="1.2" fill="${C.sol}" opacity="${n(0.5 - i * 0.045)}"><animate attributeName="width" values="${larg};${larg - 26};${larg}" dur="${3 + (i % 3)}s" repeatCount="indefinite"/><animate attributeName="x" values="${solX - larg / 2};${solX - larg / 2 + 13};${solX - larg / 2}" dur="${3 + (i % 3)}s" repeatCount="indefinite"/></rect>`;
  }).join("");

  const nome = String(p.nome).toUpperCase();
  const tamanho = Math.min(104, Math.floor(650 / Math.max(nome.length * 0.52, 1)));

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(p.nome)} · ${esc(p.titulo)}">
<defs>
  <linearGradient id="ceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.ceu[0]}"/><stop offset=".45" stop-color="${C.ceu[1]}"/><stop offset=".78" stop-color="${C.ceu[2]}"/><stop offset="1" stop-color="${C.ceu[3]}"/></linearGradient>
  <linearGradient id="sol" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.sol}"/><stop offset="1" stop-color="${C.destaque}"/></linearGradient>
  <linearGradient id="agua" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.ceu[1]}"/><stop offset="1" stop-color="${C.fundo}"/></linearGradient>
  <radialGradient id="brilho"><stop offset="0" stop-color="${C.sol}" stop-opacity=".3"/><stop offset="1" stop-color="${C.sol}" stop-opacity="0"/></radialGradient>
  <mask id="corte"><circle cx="${solX}" cy="${solY}" r="${solR}" fill="#fff"/>${faixas}</mask>
  <clipPath id="quadro"><rect width="${W}" height="${H}" rx="18"/></clipPath>
</defs>
<g clip-path="url(#quadro)">
  <rect width="${W}" height="${CHAO}" fill="url(#ceu)"/>
  ${estrelas}
  <circle cx="${solX}" cy="${solY}" r="${solR * 1.9}" fill="url(#brilho)"/>
  <circle cx="${solX}" cy="${solY}" r="${solR}" fill="url(#sol)" mask="url(#corte)"/>
  ${predios}
  <rect y="${CHAO}" width="${W}" height="${H - CHAO}" fill="url(#agua)"/>
  ${reflexos}
  ${palmeira(1090, H + 6, 300, -34, escuro)}
  ${palmeira(1168, H + 6, 215, 20, escuro)}
  ${palmeira(18, H + 6, 170, 22, escuro)}
  <text x="72" y="92" font-family="${TXT}" font-size="15" font-weight="700" letter-spacing="5" fill="${C.suave}">${esc(p.selo)}</text>
  <text x="77" y="${n(110 + tamanho * 0.86 + 5)}" font-family="${TIT}" font-size="${tamanho}" letter-spacing="2" fill="${C.destaque}">${esc(nome)}</text>
  <text x="72" y="${n(110 + tamanho * 0.86)}" font-family="${TIT}" font-size="${tamanho}" letter-spacing="2" fill="#fff">${esc(nome)}</text>
  <rect x="72" y="${n(128 + tamanho * 0.86)}" width="250" height="5" rx="2.5" fill="${C.destaque}"><animate attributeName="width" values="250;330;250" dur="5s" repeatCount="indefinite"/></rect>
  <text x="72" y="${n(168 + tamanho * 0.86)}" font-family="${TXT}" font-size="25" font-weight="700" letter-spacing="5" fill="${C.texto}">${esc(String(p.titulo).toUpperCase())}</text>
  <text x="72" y="${n(200 + tamanho * 0.86)}" font-family="${TXT}" font-size="18" fill="#fff" opacity=".9">${esc(p.frase)}</text>
</g>
</svg>`;
}

function tituloSecao(numero, titulo) {
  const W = 1200, H = 84;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(titulo)}">
<rect x=".75" y=".75" width="${W - 1.5}" height="${H - 1.5}" rx="14" fill="${C.painel}" stroke="${C.borda}" stroke-width="1.5"/>
<rect x="32" y="${H - 14}" width="54" height="4" rx="2" fill="${C.destaque}"/>
<text x="32" y="57" font-family="${TIT}" font-size="46" fill="${C.destaque}">${String(numero).padStart(2, "0")}</text>
<text x="112" y="57" font-family="${TIT}" font-size="42" letter-spacing="3" fill="${C.texto}">${esc(String(titulo).toUpperCase())}</text>
${[0, 1, 2, 3, 4].map((i) => `<path transform="translate(${W - 190 + i * 32} 28) scale(1.15)" d="M12 0l3.5 8 8.5 .8-6.5 5.7 2 8.5L12 18.4 4.5 23l2-8.5L0 8.8 8.5 8z" fill="${i < numero ? C.destaque : C.suave}" opacity="${i < numero ? 0.9 : 0.25}"/>`).join("")}
</svg>`;
}

function pilulas(itens, W, xInicial, yInicial, tamanhoFonte, cor) {
  let x = xInicial, y = yInicial, svg = "";
  const alt = tamanhoFonte + 18;
  for (const item of itens) {
    const larg = Math.round(String(item).length * tamanhoFonte * 0.6 + 30);
    if (x + larg > W - xInicial) { x = xInicial; y += alt + 12; }
    svg += `<rect x="${x}" y="${y}" width="${larg}" height="${alt}" rx="${alt / 2}" fill="none" stroke="${C.borda}" stroke-width="1.5"/><text x="${x + larg / 2}" y="${y + alt / 2 + tamanhoFonte * 0.35}" text-anchor="middle" font-family="${TXT}" font-size="${tamanhoFonte}" font-weight="600" fill="${cor}">${esc(item)}</text>`;
    x += larg + 12;
  }
  return { svg, fim: y + alt };
}

function tecnologias() {
  const W = 1200, { svg, fim } = pilulas(p.tecnologias, W, 30, 26, 21, C.texto), H = fim + 26;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(p.tecnologias.join(", "))}">
<rect x=".75" y=".75" width="${W - 1.5}" height="${H - 1.5}" rx="14" fill="${C.painel}" stroke="${C.borda}" stroke-width="1.5"/>${svg}</svg>`;
}

function cartao(proj, i) {
  const W = 590, H = 250, linhas = quebrar(proj.descricao, 74).slice(0, 4);
  const { svg: tags } = pilulas(proj.tags ?? [], W, 26, 176, 13, C.suave);
  const temLink = Boolean(proj.link);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(proj.nome)}: ${esc(proj.descricao)}">
<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="16" fill="${C.painel}" stroke="${C.borda}" stroke-width="2"/>
<text x="26" y="40" font-family="${TXT}" font-size="13" font-weight="700" letter-spacing="4" fill="${C.destaque}">MISSÃO ${String(i + 1).padStart(2, "0")}</text>
<text x="26" y="82" font-family="${TIT}" font-size="36" letter-spacing="1" fill="${C.texto}">${esc(String(proj.nome).toUpperCase())}</text>
${linhas.map((l, j) => `<text x="26" y="${112 + j * 20}" font-family="${TXT}" font-size="15" fill="${C.suave}">${esc(l)}</text>`).join("")}
${tags}
<text x="${W - 26}" y="${H - 22}" text-anchor="end" font-family="${TXT}" font-size="14" font-weight="700" letter-spacing="2" fill="${temLink ? C.destaque : C.suave}" opacity="${temLink ? 1 : 0.6}">${esc(temLink ? p.textoBotaoProjeto + " ↗" : p.textoSemLink)}</text>
</svg>`;
}

function botao(rotulo) {
  const W = Math.round(rotulo.length * 13 + 70), H = 54;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(rotulo)}">
<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="26" fill="${C.painel}" stroke="${C.destaque}" stroke-width="2"/>
<text x="${W / 2}" y="34" text-anchor="middle" font-family="${TXT}" font-size="18" font-weight="700" letter-spacing="2" fill="${C.destaque}">${esc(rotulo.toUpperCase())} ↗</text>
</svg>`;
}

// ---------------------------------------------------------------- arquivos --
if (existsSync(aqui("./assets/"))) rmSync(aqui("./assets/"), { recursive: true });
mkdirSync(aqui("./assets/"));
const gravar = (nome, conteudo) => writeFileSync(aqui("./assets/" + nome), conteudo);

gravar("banner.svg", banner());
const S = p.secoes;
gravar("secao-1.svg", tituloSecao(1, S.sobre));
gravar("secao-2.svg", tituloSecao(2, S.tecnologias));
gravar("secao-3.svg", tituloSecao(3, S.projetos));
gravar("secao-4.svg", tituloSecao(4, S.contatos));
gravar("tecnologias.svg", tecnologias());
p.projetos.forEach((proj, i) => gravar(`projeto-${i + 1}.svg`, cartao(proj, i)));
const contatos = p.contatos.filter((c) => c.link);
contatos.forEach((c, i) => gravar(`contato-${i + 1}.svg`, botao(c.rotulo)));

const img = (arq, alt, largura = "100%") => `<img src="assets/${arq}" width="${largura}" alt="${esc(alt)}">`;
const corpo = [
  `<p align="center">${img("banner.svg", `${p.nome} · ${p.titulo}`)}</p>`,
  `<p>${img("secao-1.svg", S.sobre)}</p>`,
  ...p.sobre.map((t) => `<p>${esc(t)}</p>`),
  `<p>${img("secao-2.svg", S.tecnologias)}</p>`,
  `<p>${img("tecnologias.svg", p.tecnologias.join(", "))}</p>`,
  `<p>${img("secao-3.svg", S.projetos)}</p>`,
  `<p>\n${p.projetos.map((proj, i) => {
    const cartaoImg = img(`projeto-${i + 1}.svg`, `${proj.nome}: ${proj.descricao}`, "49%");
    return proj.link ? `<a href="${esc(proj.link)}">${cartaoImg}</a>` : cartaoImg;
  }).join("\n")}\n</p>`,
  ...(contatos.length ? [
    `<p>${img("secao-4.svg", S.contatos)}</p>`,
    `<p align="center">\n${contatos.map((c, i) => `<a href="${esc(c.link)}"><img src="assets/contato-${i + 1}.svg" height="46" alt="${esc(c.rotulo)}"></a>`).join("\n")}\n</p>`,
  ] : []),
].join("\n\n");

writeFileSync(aqui("./README.md"), `<!-- Arquivo gerado por gerar.mjs a partir de perfil.json. Não edite aqui. -->\n\n${corpo}\n`);
writeFileSync(aqui("./previa.html"), `<!doctype html><meta charset="utf-8"><title>Prévia do perfil</title>
<body style="margin:0;background:#0d1117;color:#e6edf3;font:16px/1.5 'Segoe UI',Helvetica,Arial,sans-serif">
<div style="max-width:880px;margin:24px auto;padding:24px;border:1px solid #30363d;border-radius:8px">\n${corpo.replace(/src="assets\/([^"]+)"/g, (_, arq) => `src="data:image/svg+xml;base64,${readFileSync(aqui("./assets/" + arq)).toString("base64")}"`)}\n</div></body>\n`);
console.log(`Gerado: README.md, previa.html e ${p.projetos.length + contatos.length + 6} imagens em assets/.`);
