import fs from 'fs';
import zlib from 'zlib';

function getObjectStream(pdfBuf, objNum) {
  const str = pdfBuf.toString('latin1');
  const target = `${objNum} 0 obj`;
  const objIdx = str.indexOf(target);
  if (objIdx === -1) return null;

  const streamIdx = str.indexOf('stream', objIdx);
  if (streamIdx === -1) return null;

  let start = streamIdx + 6;
  if (pdfBuf[start] === 0x0d && pdfBuf[start + 1] === 0x0a) start += 2;
  else if (pdfBuf[start] === 0x0a || pdfBuf[start] === 0x0d) start += 1;

  const endIdx = str.indexOf('endstream', start);
  if (endIdx === -1) return null;

  const slice = pdfBuf.slice(start, endIdx);
  try {
    return zlib.inflateSync(slice).toString('latin1');
  } catch (e) {
    try {
      return zlib.inflateRawSync(slice).toString('latin1');
    } catch (err) {
      return slice.toString('latin1');
    }
  }
}

function parseStreamToSvgElements(streamStr) {
  const stateStack = [];
  let curMatrix = [1, 0, 0, 1, 0, 0];
  let curFill = '#0f172a';
  let curStroke = 'none';
  let curLineWidth = 1;

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

  const elements = [];
  let currentD = '';
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  function updateBounds(x, y) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }

  const tokens = streamStr.trim().split(/\s+/);
  let i = 0;
  while (i < tokens.length) {
    const tok = tokens[i];
    if (tok === 'q') {
      stateStack.push({ matrix: [...curMatrix], fill: curFill, stroke: curStroke, lw: curLineWidth });
      i++;
    } else if (tok === 'Q') {
      if (stateStack.length) {
        const s = stateStack.pop();
        curMatrix = s.matrix;
        curFill = s.fill;
        curStroke = s.stroke;
        curLineWidth = s.lw;
      }
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
      currentD += ` M ${p.x.toFixed(3)} ${p.y.toFixed(3)}`;
      updateBounds(p.x, p.y);
      i++;
    } else if (tok === 'l') {
      const y = parseFloat(tokens[i - 1]);
      const x = parseFloat(tokens[i - 2]);
      const p = applyMatrix({ x, y }, curMatrix);
      currentD += ` L ${p.x.toFixed(3)} ${p.y.toFixed(3)}`;
      updateBounds(p.x, p.y);
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
      currentD += ` C ${p1.x.toFixed(3)} ${p1.y.toFixed(3)}, ${p2.x.toFixed(3)} ${p2.y.toFixed(3)}, ${p3.x.toFixed(3)} ${p3.y.toFixed(3)}`;
      updateBounds(p1.x, p1.y);
      updateBounds(p2.x, p2.y);
      updateBounds(p3.x, p3.y);
      i++;
    } else if (tok === 'v') {
      const y3 = parseFloat(tokens[i - 1]);
      const x3 = parseFloat(tokens[i - 2]);
      const y2 = parseFloat(tokens[i - 3]);
      const x2 = parseFloat(tokens[i - 4]);
      const p2 = applyMatrix({ x: x2, y: y2 }, curMatrix);
      const p3 = applyMatrix({ x: x3, y: y3 }, curMatrix);
      currentD += ` S ${p2.x.toFixed(3)} ${p2.y.toFixed(3)}, ${p3.x.toFixed(3)} ${p3.y.toFixed(3)}`;
      updateBounds(p2.x, p2.y);
      updateBounds(p3.x, p3.y);
      i++;
    } else if (tok === 'y') {
      const y3 = parseFloat(tokens[i - 1]);
      const x3 = parseFloat(tokens[i - 2]);
      const y1 = parseFloat(tokens[i - 3]);
      const x1 = parseFloat(tokens[i - 4]);
      const p1 = applyMatrix({ x: x1, y: y1 }, curMatrix);
      const p3 = applyMatrix({ x: x3, y: y3 }, curMatrix);
      currentD += ` C ${p1.x.toFixed(3)} ${p1.y.toFixed(3)}, ${p3.x.toFixed(3)} ${p3.y.toFixed(3)}`;
      updateBounds(p1.x, p1.y);
      updateBounds(p3.x, p3.y);
      i++;
    } else if (tok === 're') {
      const h = parseFloat(tokens[i - 1]);
      const w = parseFloat(tokens[i - 2]);
      const y = parseFloat(tokens[i - 3]);
      const x = parseFloat(tokens[i - 4]);
      const p1 = applyMatrix({ x, y }, curMatrix);
      const p2 = applyMatrix({ x: x + w, y }, curMatrix);
      const p3 = applyMatrix({ x: x + w, y: y + h }, curMatrix);
      const p4 = applyMatrix({ x, y: y + h }, curMatrix);
      currentD += ` M ${p1.x.toFixed(3)} ${p1.y.toFixed(3)} L ${p2.x.toFixed(3)} ${p2.y.toFixed(3)} L ${p3.x.toFixed(3)} ${p3.y.toFixed(3)} L ${p4.x.toFixed(3)} ${p4.y.toFixed(3)} Z`;
      i++;
    } else if (tok === 'h') {
      currentD += ' Z';
      i++;
    } else if (tok === 'f' || tok === 'f*' || tok === 'F') {
      if (currentD.trim()) {
        elements.push({ type: 'path', d: currentD.trim(), fill: curFill, stroke: 'none' });
        currentD = '';
      }
      i++;
    } else if (tok === 's' || tok === 'S') {
      if (currentD.trim()) {
        elements.push({ type: 'path', d: currentD.trim(), fill: 'none', stroke: curStroke, strokeWidth: curLineWidth });
        currentD = '';
      }
      i++;
    } else if (tok === 'b' || tok === 'B' || tok === 'b*' || tok === 'B*') {
      if (currentD.trim()) {
        elements.push({ type: 'path', d: currentD.trim(), fill: curFill, stroke: curStroke, strokeWidth: curLineWidth });
        currentD = '';
      }
      i++;
    } else if (tok === 'n' || tok === 'W' || tok === 'W*') {
      currentD = '';
      i++;
    } else if (tok === 'rg') {
      const b = Math.round(parseFloat(tokens[i - 1]) * 255);
      const g = Math.round(parseFloat(tokens[i - 2]) * 255);
      const r = Math.round(parseFloat(tokens[i - 3]) * 255);
      curFill = `rgb(${r},${g},${b})`;
      i++;
    } else if (tok === 'RG') {
      const b = Math.round(parseFloat(tokens[i - 1]) * 255);
      const g = Math.round(parseFloat(tokens[i - 2]) * 255);
      const r = Math.round(parseFloat(tokens[i - 3]) * 255);
      curStroke = `rgb(${r},${g},${b})`;
      i++;
    } else if (tok === 'k') {
      const k = parseFloat(tokens[i - 1]);
      const y = parseFloat(tokens[i - 2]);
      const m = parseFloat(tokens[i - 3]);
      const c = parseFloat(tokens[i - 4]);
      const r = Math.round(255 * (1 - c) * (1 - k));
      const g = Math.round(255 * (1 - m) * (1 - k));
      const b = Math.round(255 * (1 - y) * (1 - k));
      curFill = `rgb(${r},${g},${b})`;
      i++;
    } else if (tok === 'K') {
      const k = parseFloat(tokens[i - 1]);
      const y = parseFloat(tokens[i - 2]);
      const m = parseFloat(tokens[i - 3]);
      const c = parseFloat(tokens[i - 4]);
      const r = Math.round(255 * (1 - c) * (1 - k));
      const g = Math.round(255 * (1 - m) * (1 - k));
      const b = Math.round(255 * (1 - y) * (1 - k));
      curStroke = `rgb(${r},${g},${b})`;
      i++;
    } else if (tok === 'scn') {
      const b = Math.round(parseFloat(tokens[i - 1]) * 255);
      const g = Math.round(parseFloat(tokens[i - 2]) * 255);
      const r = Math.round(parseFloat(tokens[i - 3]) * 255);
      if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
        curFill = `rgb(${r},${g},${b})`;
      }
      i++;
    } else if (tok === 'w') {
      curLineWidth = parseFloat(tokens[i - 1]) || 1;
      i++;
    } else {
      i++;
    }
  }

  return { elements, bounds: { minX, minY, maxX, maxY } };
}

// 1. Convert Forum UPB Logo (obj 8)
const forumBuf = fs.readFileSync('public/assets/media_1789328754955.pdf');
const forumStream = getObjectStream(forumBuf, 8);
if (forumStream) {
  const parsed = parseStreamToSvgElements(forumStream);
  const pad = 4;
  const minX = 39.99;
  const maxX = 572.01;
  const minY = 352.0;
  const maxY = 438.0;
  const width = (maxX - minX) + pad * 2;
  const height = (maxY - minY) + pad * 2;
  const vbX = (minX - pad).toFixed(2);
  const vbY = (-maxY - pad).toFixed(2);

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vbX} ${vbY} ${width.toFixed(2)} ${height.toFixed(2)}">\n`;
  svg += '  <g transform="scale(1, -1)">\n';
  for (const el of parsed.elements) {
    svg += `    <path d="${el.d}" fill="${el.fill}" stroke="${el.stroke || 'none'}" stroke-width="${el.strokeWidth || 1}" />\n`;
  }
  svg += '  </g>\n</svg>\n';
  fs.writeFileSync('public/assets/logo_forum_centro_eventos.svg', svg);
  console.log('Saved official logo_forum_centro_eventos.svg');
}

// 2. Convert UPB 90 Años Logo (obj 10 - Page 1)
const upbBuf = fs.readFileSync('public/assets/media_1789328755016.pdf');
const upbStream = getObjectStream(upbBuf, 10);
if (upbStream) {
  const parsed = parseStreamToSvgElements(upbStream);
  const pad = 8;
  const minX = 27.5;
  const maxX = 783.4;
  const minY = 119.5;
  const maxY = 492.9;
  const width = (maxX - minX) + pad * 2;
  const height = (maxY - minY) + pad * 2;
  const vbX = (minX - pad).toFixed(2);
  const vbY = (-maxY - pad).toFixed(2);

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vbX} ${vbY} ${width.toFixed(2)} ${height.toFixed(2)}">\n`;
  svg += '  <g transform="scale(1, -1)">\n';
  for (const el of parsed.elements) {
    svg += `    <path d="${el.d}" fill="${el.fill}" stroke="${el.stroke || 'none'}" stroke-width="${el.strokeWidth || 1}" />\n`;
  }
  svg += '  </g>\n</svg>\n';
  fs.writeFileSync('public/assets/logo_upb_90_anos.svg', svg);
  console.log('Saved official logo_upb_90_anos.svg');
}
