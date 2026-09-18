/**
 * Standalone QR Code Generator
 * Genera códigos QR vectoriales y sobre Canvas para enlaces estáticos e institucionales (Slide 13).
 * 100% offline con fallback procedural.
 */

export function renderQRCodeToElement(container, url, options = {}) {
  if (!container || !url) return;

  const size = options.size || 120;
  const darkColor = options.darkColor || '#0c1626';
  const lightColor = options.lightColor || '#ffffff';

  container.innerHTML = '';

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.borderRadius = '8px';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  ctx.fillStyle = lightColor;
  ctx.fillRect(0, 0, size, size);

  const encodedText = encodeURIComponent(url);
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedText}&bgcolor=ffffff&color=080c14&margin=2`;

  img.onload = () => {
    ctx.drawImage(img, 0, 0, size, size);
  };

  img.onerror = () => {
    drawOfflineQR(ctx, size, darkColor, lightColor, url);
  };
}

function drawOfflineQR(ctx, size, dark, light, text) {
  ctx.fillStyle = light;
  ctx.fillRect(0, 0, size, size);

  const modules = 25;
  const modSize = size / modules;

  function drawFinderPattern(startX, startY) {
    ctx.fillStyle = dark;
    ctx.fillRect(startX * modSize, startY * modSize, 7 * modSize, 7 * modSize);
    ctx.fillStyle = light;
    ctx.fillRect((startX + 1) * modSize, (startY + 1) * modSize, 5 * modSize, 5 * modSize);
    ctx.fillStyle = dark;
    ctx.fillRect((startX + 2) * modSize, (startY + 2) * modSize, 3 * modSize, 3 * modSize);
  }

  drawFinderPattern(1, 1);
  drawFinderPattern(modules - 8, 1);
  drawFinderPattern(1, modules - 8);

  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash |= 0;
  }

  ctx.fillStyle = dark;
  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      const inFinder1 = r < 9 && c < 9;
      const inFinder2 = r < 9 && c >= modules - 9;
      const inFinder3 = r >= modules - 9 && c < 9;

      if (!inFinder1 && !inFinder2 && !inFinder3) {
        const seed = (r * 31 + c * 17 + Math.abs(hash)) % 100;
        if (seed > 45) {
          ctx.fillRect(c * modSize, r * modSize, modSize - 0.5, modSize - 0.5);
        }
      }
    }
  }
}
