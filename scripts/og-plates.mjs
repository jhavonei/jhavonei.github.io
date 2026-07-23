import { Resvg } from '@resvg/resvg-js';
import { mkdirSync, writeFileSync } from 'node:fs';

const routes = [
  ['index', 'THE SPECIMEN', 'DOC.001'],
  ['work', 'WORK', 'DOC.002 · FIG.01'],
  ['notes', 'FIELD NOTES', 'DOC.003 · FIG.02'],
  ['author', 'THE AUTHOR', 'DOC.004 · FIG.03'],
  ['correspondence', 'CORRESPONDENCE', 'DOC.005 · FIG.04'],
  ['repository', 'REPOSITORY', 'DOC.006 · FIG.05']
];

const plate = (title, doc) => `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#0a0a0a"/>
  ${Array.from({ length: 24 }, (_, x) => Array.from({ length: 13 }, (_, y) =>
    `<circle cx="${60 + x * 46}" cy="${60 + y * 42}" r="1.4" fill="#c8c8c4" opacity="0.12"/>`).join('')).join('')}
  <line x1="60" y1="120" x2="1140" y2="120" stroke="#c8c8c4" stroke-opacity="0.34"/>
  <line x1="60" y1="520" x2="1140" y2="520" stroke="#c8c8c4" stroke-opacity="0.34"/>
  <text x="60" y="100" font-family="monospace" font-size="30" letter-spacing="6" fill="#efefec">JHAVONEI</text>
  <text x="1140" y="100" text-anchor="end" font-family="monospace" font-size="30" letter-spacing="6" fill="#c8c8c4">2026</text>
  <text x="60" y="360" font-family="monospace" font-size="86" letter-spacing="14" fill="#efefec">${title}</text>
  <text x="60" y="560" font-family="monospace" font-size="22" letter-spacing="5" fill="#c8c8c4">${doc} · GROWN IN THE DARK · READ IN THE LIGHT</text>
  <text x="1140" y="560" text-anchor="end" font-family="monospace" font-size="22" letter-spacing="5" fill="#c8c8c4">JHAVONEI.ME</text>
</svg>`;

mkdirSync('static/og', { recursive: true });
for (const [slug, title, doc] of routes) {
  const png = new Resvg(plate(title, doc), { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  writeFileSync(`static/og/${slug}.png`, png);
}
console.log(`og-plates: wrote ${routes.length} plates`);
