/**
 * Textile Materials & Procedural Texture Generators
 * Genera texturas táctiles de alta definición para Three.js:
 * - Tramas de tejido (algodón, lino, espiga, pana, seda)
 * - Pespuntes, costuras y bordados
 * - Bump maps y normal maps de fibra textil
 */
import * as THREE from 'three';

/**
 * Crea una textura procedural de trama textil (urdimbre y trama entrelazadas)
 */
export function createWeaveTexture({ size = 256, type = 'plain', density = 16 } = {}) {
  const canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
  if (!canvas) {
    // Fallback DataTexture en entornos sin DOM
    const data = new Uint8Array(size * size * 4);
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 180; data[i + 1] = 180; data[i + 2] = 180; data[i + 3] = 255;
    }
    const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    tex.needsUpdate = true;
    return tex;
  }

  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, size, size);

  const step = size / density;

  for (let y = 0; y < size; y += step) {
    for (let x = 0; x < size; x += step) {
      const isWarp = (Math.floor(x / step) + Math.floor(y / step)) % 2 === 0;

      if (type === 'herringbone') {
        // Espiga
        const row = Math.floor(y / step);
        const col = Math.floor(x / step);
        const pattern = (row % 4 < 2) ? (col % 2 === 0) : (col % 2 !== 0);
        ctx.fillStyle = pattern ? '#a0a0a0' : '#606060';
        ctx.fillRect(x, y, step, step);
      } else if (type === 'corduroy') {
        // Pana / Canesú
        const col = Math.floor(x / (step * 0.75));
        const val = (col % 2 === 0) ? 200 : 90;
        ctx.fillStyle = `rgb(${val},${val},${val})`;
        ctx.fillRect(x, y, step, step);
      } else {
        // Tejido liso (Plain weave) con micro-sombras de hilo
        const light = isWarp ? 170 : 110;
        ctx.fillStyle = `rgb(${light},${light},${light})`;
        ctx.fillRect(x + 1, y + 1, step - 2, step - 2);

        // Brillo en el centro del filamento
        ctx.fillStyle = `rgba(255,255,255,0.25)`;
        if (isWarp) {
          ctx.fillRect(x + step * 0.25, y, step * 0.5, step);
        } else {
          ctx.fillRect(x, y + step * 0.25, step, step * 0.5);
        }
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Crea una textura de patrón para retazos (Patchwork)
 */
export function createPatchworkTexture({
  baseColor = '#f43f5e',
  accentColor = '#ffffff',
  pattern = 'stripes',
  size = 512
} = {}) {
  const canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
  if (!canvas) {
    const data = new Uint8Array(size * size * 4);
    const c = new THREE.Color(baseColor);
    for (let i = 0; i < data.length; i += 4) {
      data[i] = c.r * 255; data[i + 1] = c.g * 255; data[i + 2] = c.b * 255; data[i + 3] = 255;
    }
    const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    tex.needsUpdate = true;
    return tex;
  }

  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Fondo
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = accentColor;
  ctx.strokeStyle = accentColor;

  if (pattern === 'stripes') {
    ctx.lineWidth = 14;
    for (let x = -size; x < size * 2; x += 36) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + size, size);
      ctx.stroke();
    }
  } else if (pattern === 'dots') {
    const spacing = 32;
    for (let y = spacing / 2; y < size; y += spacing) {
      for (let x = spacing / 2; x < size; x += spacing) {
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (pattern === 'grid') {
    ctx.lineWidth = 4;
    const spacing = 48;
    for (let x = 0; x < size; x += spacing) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, size); ctx.stroke();
    }
    for (let y = 0; y < size; y += spacing) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(size, y); ctx.stroke();
    }
  } else if (pattern === 'houndstooth') {
    const step = 48;
    for (let y = 0; y < size; y += step) {
      for (let x = 0; x < size; x += step) {
        if ((Math.floor(x / step) + Math.floor(y / step)) % 2 === 0) {
          ctx.fillRect(x, y, step / 2, step / 2);
          ctx.fillRect(x + step / 2, y + step / 2, step / 2, step / 2);
        }
      }
    }
  }

  // Añadir micro-grano textil por encima
  ctx.fillStyle = 'rgba(0,0,0,0.06)';
  for (let i = 0; i < size * 16; i++) {
    const rx = Math.random() * size;
    const ry = Math.random() * size;
    ctx.fillRect(rx, ry, 1.5, 1.5);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Crea un material físico textil de alto realismo con sheen y microfibra
 */
export function createTextileMaterial({
  color = 0xf43f5e,
  sheenColor = 0xffffff,
  roughness = 0.65,
  metalness = 0.05,
  clearcoat = 0.1,
  map = null,
  bumpMap = null,
  bumpScale = 0.04,
  side = THREE.DoubleSide
} = {}) {
  const bump = bumpMap || createWeaveTexture({ size: 128, type: 'plain', density: 16 });

  return new THREE.MeshPhysicalMaterial({
    color,
    roughness,
    metalness,
    clearcoat,
    clearcoatRoughness: 0.3,
    sheen: 1.0,
    sheenColor: new THREE.Color(sheenColor),
    sheenRoughness: 0.5,
    bumpMap: bump,
    bumpScale,
    map,
    side
  });
}
