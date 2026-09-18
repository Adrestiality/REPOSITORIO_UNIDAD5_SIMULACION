import fs from 'fs';
import zlib from 'zlib';

const pdfBuf = fs.readFileSync('public/assets/media_1789328755016.pdf');
const str = pdfBuf.toString('latin1');
const target = '10 0 obj';
const idx = str.indexOf(target);
const streamIdx = str.indexOf('stream', idx);
let start = streamIdx + 6;
if (pdfBuf[start] === 0x0d && pdfBuf[start + 1] === 0x0a) start += 2;
else if (pdfBuf[start] === 0x0a || pdfBuf[start] === 0x0d) start += 1;
const endIdx = str.indexOf('endstream', start);
const slice = pdfBuf.slice(start, endIdx);
const decompressed = zlib.inflateSync(slice).toString('latin1');

const tokens = decompressed.trim().split(/\s+/);
let curMatrix = [1, 0, 0, 1, 0, 0];
const stateStack = [];

function applyMatrix(pt, m) {
  return {
    x: pt.x * m[0] + pt.y * m[2] + m[4],
    y: pt.x * m[1] + pt.y * m[3] + m[5]
  };
}

function multiplyMatrix(m1, m2) {
  return [
    m1[0] * m2[0] + m1[1] * m2[2],
    m1[0] * m2[1] + m1[1] * m2[3],
    m1[2] * m2[0] + m1[3] * m2[2],
    m1[2] * m2[1] + m1[3] * m2[3],
    m1[4] * m2[0] + m1[5] * m2[2] + m2[4],
    m1[4] * m2[1] + m1[5] * m2[3] + m2[5]
  ];
}

const paths = [];
let curD = '';

let i = 0;
while (i < tokens.length) {
  const tok = tokens[i];
  if (tok === 'q') {
    stateStack.push([...curMatrix]);
    i++;
  } else if (tok === 'Q') {
    if (stateStack.length) curMatrix = stateStack.pop();
    i++;
  } else if (tok === 'cm') {
    const f = parseFloat(tokens[i - 1]);
    const e = parseFloat(tokens[i - 2]);
    const d = parseFloat(tokens[i - 3]);
    const c = parseFloat(tokens[i - 4]);
    const b = parseFloat(tokens[i - 5]);
    const a = parseFloat(tokens[i - 6]);
    curMatrix = multiplyMatrix([a, b, c, d, e, f], curMatrix);
    i++;
  } else if (tok === 'm') {
    const y = parseFloat(tokens[i - 1]);
    const x = parseFloat(tokens[i - 2]);
    const p = applyMatrix({ x, y }, curMatrix);
    curD += ` M ${p.x.toFixed(3)} ${p.y.toFixed(3)}`;
    i++;
  } else if (tok === 'l') {
    const y = parseFloat(tokens[i - 1]);
    const x = parseFloat(tokens[i - 2]);
    const p = applyMatrix({ x, y }, curMatrix);
    curD += ` L ${p.x.toFixed(3)} ${p.y.toFixed(3)}`;
    i++;
  } else if (tok === 'c') {
    const y3 = parseFloat(tokens[i - 1]);
    const x3 = parseFloat(tokens[i - 2]);
    const y2 = parseFloat(tokens[i - 3]);
    const x2 = parseFloat(tokens[i - 4]);
    const y1 = parseFloat(tokens[i - 5]);
    const x1 = parseFloat(tokens[i - 6]);
    const p1 = applyMatrix({ x: x1, y: y1 }, curMatrix);
    const p2 = applyMatrix({ x: x2, y: y2 }, curMatrix);
    const p3 = applyMatrix({ x: x3, y: y3 }, curMatrix);
    curD += ` C ${p1.x.toFixed(3)} ${p1.y.toFixed(3)}, ${p2.x.toFixed(3)} ${p2.y.toFixed(3)}, ${p3.x.toFixed(3)} ${p3.y.toFixed(3)}`;
    i++;
  } else if (tok === 'h') {
    curD += ' Z';
    i++;
  } else if (tok === 'f' || tok === 'f*' || tok === 'F') {
    if (curD.trim()) {
      paths.push(curD.trim());
      curD = '';
    }
    i++;
  } else if (tok === 'n' || tok === 'W' || tok === 'W*') {
    curD = '';
    i++;
  } else {
    i++;
  }
}

const minX_p = 27.5;
const maxX_p = 783.4;
const minY_p = 119.5;
const maxY_p = 492.9;
const pad = 6;
const w = (maxX_p - minX_p) + pad * 2;
const h = (maxY_p - minY_p) + pad * 2;
const vbX = (minX_p - pad).toFixed(2);
const vbY = (-maxY_p - pad).toFixed(2);

let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vbX} ${vbY} ${w.toFixed(2)} ${h.toFixed(2)}" width="100%" height="100%">\n`;
svg += '  <g transform="scale(1, -1)" fill="currentColor">\n';
for (const p of paths) {
  svg += `    <path d="${p}" />\n`;
}
svg += '  </g>\n</svg>\n';

fs.writeFileSync('public/assets/logo_upb_90_anos.svg', svg);
console.log('Saved official logo_upb_90_anos.svg with', paths.length, 'paths');
