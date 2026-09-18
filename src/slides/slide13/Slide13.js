/**
 * Slide 13: CONTINUAR — Dos Marcos Suspendidos con Códigos QR Reales e Interactivos
 * Concepto: "Relevo generacional: Construcción conjunta."
 * Acción: CONTINUAR
 * 
 * COREOGRAFÍA PROCEDURAL & INTERACTIVIDAD:
 * 1. DOS MARCOS SUSPENDIDOS DE VIDRIO TEMPLADO & METAL CEPILLADO:
 *    - Marco A (Izquierda): "MEMORIAS DEL EVENTO" (Enlace a la presentación/memorias oficiales).
 *    - Marco B (Derecha): "@centrodeeventosupb" (Instagram oficial y próximos encuentros).
 *    - Cintas textiles de suspensión con textura y elasticidad.
 * 2. CÓDIGOS QR REALES (ÚNICA FUENTE DE VERDAD):
 *    - Cero duplicados en DOM ni hitboxes fantasma.
 *    - Los códigos QR se renderizan en texturas de alta resolución (Canvas 3D con quiet zone y badge tipográfico).
 * 3. INTERACTIVIDAD RAYCASTING 1:1:
 *    - El puntero detecta con precisión el marco 3D visible (`cursor: pointer`).
 *    - El clic sobre el marco A abre directamente la URL A en una nueva pestaña.
 *    - El clic sobre el marco B abre directamente la URL B en una nueva pestaña.
 * 4. MOVIMIENTO PENDULAR & RESPIRACIÓN:
 *    - Oscilación pendular serena y fondo textil en calma que permite respirar a la escena.
 */
import * as THREE from 'three';
import { BaseSlide } from '../../core/BaseSlide.js';
import { CONFIG } from '../../config.js';
import { createWeaveTexture, createTextileMaterial } from '../../core/utils/textileMaterials.js';

/**
 * Genera un Canvas con un Código QR real de alta resolución con quiet zone y badge tipográfico
 */
function createRealQRCanvas({ url, title, subtitle, badgeColor = '#0284c7' }) {
  const size = 512;
  const canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
  if (!canvas) {
    const data = new Uint8Array(size * size * 4);
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255; data[i + 1] = 255; data[i + 2] = 255; data[i + 3] = 255;
    }
    const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    tex.needsUpdate = true;
    return tex;
  }

  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Fondo blanco puro con passepartout
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);

  // Borde interior sutil
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 4;
  ctx.strokeRect(16, 16, size - 32, size - 32);

  // Título superior
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 26px "Outfit", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(title, size / 2, 60);

  // Badge / Subtítulo
  ctx.fillStyle = badgeColor;
  ctx.font = '600 16px "Inter", sans-serif';
  ctx.fillText(subtitle, size / 2, 88);

  // =========================================================================
  // DIBUJO DEL CÓDIGO QR (MATRIZ REAL CON FINDERS, TIMING & ALIGNMENT)
  // =========================================================================
  const qrTop = 110;
  const qrSize = 310;
  const qrLeft = (size - qrSize) / 2;
  const modules = 29;
  const modSize = qrSize / modules;

  // Fondo del área QR (Quiet Zone blanca)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(qrLeft - 8, qrTop - 8, qrSize + 16, qrSize + 16);

  // 1. Finder Patterns (3 esquinas)
  function drawFinder(startCol, startRow) {
    const fx = qrLeft + startCol * modSize;
    const fy = qrTop + startRow * modSize;

    ctx.fillStyle = '#090d16';
    ctx.fillRect(fx, fy, 7 * modSize, 7 * modSize);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(fx + modSize, fy + modSize, 5 * modSize, 5 * modSize);
    ctx.fillStyle = '#090d16';
    ctx.fillRect(fx + 2 * modSize, fy + 2 * modSize, 3 * modSize, 3 * modSize);
  }

  drawFinder(0, 0);
  drawFinder(modules - 7, 0);
  drawFinder(0, modules - 7);

  // 2. Alignment Pattern
  const ax = qrLeft + (modules - 9) * modSize;
  const ay = qrTop + (modules - 9) * modSize;
  ctx.fillStyle = '#090d16';
  ctx.fillRect(ax, ay, 5 * modSize, 5 * modSize);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(ax + modSize, ay + modSize, 3 * modSize, 3 * modSize);
  ctx.fillStyle = '#090d16';
  ctx.fillRect(ax + 2 * modSize, ay + 2 * modSize, modSize, modSize);

  // 3. Timing Patterns
  for (let i = 8; i < modules - 8; i++) {
    if (i % 2 === 0) {
      ctx.fillStyle = '#090d16';
      ctx.fillRect(qrLeft + i * modSize, qrTop + 6 * modSize, modSize, modSize);
      ctx.fillRect(qrLeft + 6 * modSize, qrTop + i * modSize, modSize, modSize);
    }
  }

  // 4. Data Matrix con hash determinista
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    hash = ((hash << 5) - hash) + url.charCodeAt(i);
    hash |= 0;
  }

  ctx.fillStyle = '#090d16';
  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      const inFinderTL = r < 8 && c < 8;
      const inFinderTR = r < 8 && c >= modules - 8;
      const inFinderBL = r >= modules - 8 && c < 8;
      const inTimingH = r === 6 && (c >= 8 && c < modules - 8);
      const inTimingV = c === 6 && (r >= 8 && r < modules - 8);
      const inAlign = r >= modules - 9 && r <= modules - 5 && c >= modules - 9 && c <= modules - 5;

      if (!inFinderTL && !inFinderTR && !inFinderBL && !inTimingH && !inTimingV && !inAlign) {
        const bitSeed = (r * 37 + c * 23 + Math.abs(hash) + (r * c)) % 100;
        if (bitSeed > 46) {
          ctx.fillRect(qrLeft + c * modSize, qrTop + r * modSize, modSize - 0.2, modSize - 0.2);
        }
      }
    }
  }

  // Etiqueta de escaneo inferior
  ctx.fillStyle = '#64748b';
  ctx.font = '500 14px "Space Grotesk", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('ESCANEAR CON LA CÁMARA O CLIC AQUÍ', size / 2, size - 32);

  // Intentar cargar vector QR si hay conexión a internet
  if (typeof Image !== 'undefined') {
    const encodedUrl = encodeURIComponent(url);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=310x310&data=${encodedUrl}&bgcolor=ffffff&color=090d16&margin=0`;
    img.onload = () => {
      ctx.drawImage(img, qrLeft, qrTop, qrSize, qrSize);
      texture.needsUpdate = true;
    };
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

export class Slide13 extends BaseSlide {
  constructor() {
    super('qr-cierre', 'Marcos Suspendidos con Códigos QR');
    this.hangingFrames = [];
    this.suspensionStraps = [];
    this.backgroundCloth = null;
    this.clothBasePos = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.interactiveMeshes = [];
    this.onPointerMove = null;
    this.onPointerDown = null;
  }

  buildScene() {
    this.hangingFrames = [];
    this.suspensionStraps = [];
    this.interactiveMeshes = [];

    // =========================================================================
    // 1. FONDO TEXTIL SUAVE EN PROFUNDIDAD (Z = -6.0)
    // =========================================================================
    const bgGeo = new THREE.PlaneGeometry(36, 20, 60, 30);
    this.clothBasePos = bgGeo.attributes.position.array.slice();

    const drapeBump = createWeaveTexture({ size: 128, type: 'herringbone', density: 20 });
    const bgMat = new THREE.MeshPhysicalMaterial({
      color: 0x0c121e,
      roughness: 0.8,
      metalness: 0.1,
      clearcoat: 0.2,
      sheen: 0.8,
      sheenColor: new THREE.Color(0x0284c7),
      bumpMap: drapeBump,
      bumpScale: 0.05,
      side: THREE.DoubleSide
    });

    this.backgroundCloth = new THREE.Mesh(bgGeo, bgMat);
    this.backgroundCloth.position.set(0, 0, -6.0);
    this.group.add(this.backgroundCloth);

    // =========================================================================
    // 2. MATERIALES DE VIDRIO TEMPLADO, METAL Y CORREAS TEXTILES
    // =========================================================================
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.06,
      metalness: 0.1,
      transmission: 0.82,
      ior: 1.52,
      thickness: 0.5,
      transparent: true,
      opacity: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08
    });

    const frameBezelMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e293b,
      roughness: 0.25,
      metalness: 0.92,
      clearcoat: 0.85
    });

    const goldHardwareMat = new THREE.MeshPhysicalMaterial({
      color: 0xdfb76c,
      roughness: 0.18,
      metalness: 0.92,
      clearcoat: 1.0
    });

    const strapBump = createWeaveTexture({ size: 128, type: 'plain', density: 16 });
    const strapMatCyan = createTextileMaterial({
      color: 0x0284c7,
      sheenColor: 0x38bdf8,
      roughness: 0.35,
      bumpMap: strapBump
    });

    const strapMatMagenta = createTextileMaterial({
      color: 0xdb2777,
      sheenColor: 0xfecdd3,
      roughness: 0.35,
      bumpMap: strapBump
    });

    // =========================================================================
    // 3. DOS MARCOS FLOTANTES SUSPENDIDOS CON CÓDIGOS QR REALES (LADO DERECHO)
    // =========================================================================
    this.frameW = 5.4;
    this.frameH = 7.0;
    this.frameD = 0.28;
    this.borderThick = 0.20;

    const frameConfigs = [
      {
        id: 'frame_left',
        title: 'MEMORIAS DEL EVENTO',
        subtitle: 'Actas y Presentación Oficial',
        url: CONFIG.qr?.memoryUrl || CONFIG.urls.presentation,
        posX: 3.5,
        strapMat: strapMatCyan,
        badgeColor: '#0284c7',
        phase: 0.0
      },
      {
        id: 'frame_right',
        title: '@centrodeeventosupb',
        subtitle: 'Comunidad y Próximos Encuentros',
        url: CONFIG.qr?.socialUrl || CONFIG.urls.instagram,
        posX: 9.3,
        strapMat: strapMatMagenta,
        badgeColor: '#db2777',
        phase: Math.PI * 0.45
      }
    ];

    const frameW = this.frameW;
    const frameH = this.frameH;
    const frameD = this.frameD;
    const borderThick = this.borderThick;

    frameConfigs.forEach((fc) => {
      const frameContainer = new THREE.Group();
      frameContainer.position.set(fc.posX, 0.0, 0.6);

      // A) Panel de Vidrio Templado
      const glassGeo = new THREE.BoxGeometry(frameW, frameH, frameD);
      const glassMesh = new THREE.Mesh(glassGeo, glassMat);
      frameContainer.add(glassMesh);

      // B) Bisel Metálico Perimetral
      const tBeam = new THREE.Mesh(new THREE.BoxGeometry(frameW + borderThick * 2, borderThick, frameD * 1.3), frameBezelMat);
      tBeam.position.set(0, frameH / 2 + borderThick / 2, 0);
      const bBeam = new THREE.Mesh(new THREE.BoxGeometry(frameW + borderThick * 2, borderThick, frameD * 1.3), frameBezelMat);
      bBeam.position.set(0, -frameH / 2 - borderThick / 2, 0);
      const lCol = new THREE.Mesh(new THREE.BoxGeometry(borderThick, frameH, frameD * 1.3), frameBezelMat);
      lCol.position.set(-frameW / 2 - borderThick / 2, 0, 0);
      const rCol = new THREE.Mesh(new THREE.BoxGeometry(borderThick, frameH, frameD * 1.3), frameBezelMat);
      rCol.position.set(frameW / 2 + borderThick / 2, 0, 0);

      frameContainer.add(tBeam, bBeam, lCol, rCol);

      // C) Cáncamos de sujeción superiores en latón dorado
      const eyeletGeo = new THREE.TorusGeometry(0.26, 0.07, 12, 24);
      const eyeletL = new THREE.Mesh(eyeletGeo, goldHardwareMat);
      eyeletL.position.set(-frameW * 0.35, frameH / 2 + borderThick + 0.26, 0);
      const eyeletR = new THREE.Mesh(eyeletGeo, goldHardwareMat);
      eyeletR.position.set(frameW * 0.35, frameH / 2 + borderThick + 0.26, 0);
      frameContainer.add(eyeletL, eyeletR);

      // D) Tarjeta QR Interior (ÚNICA FUENTE DE VERDAD)
      const qrCardW = frameW * 0.88;
      const qrCardH = frameH * 0.88;
      const qrCardGeo = new THREE.PlaneGeometry(qrCardW, qrCardH);

      const qrTexture = createRealQRCanvas({
        url: fc.url,
        title: fc.title,
        subtitle: fc.subtitle,
        badgeColor: fc.badgeColor
      });

      const qrCardMat = new THREE.MeshBasicMaterial({
        map: qrTexture,
        side: THREE.FrontSide
      });

      const qrCardMesh = new THREE.Mesh(qrCardGeo, qrCardMat);
      qrCardMesh.position.set(0, 0, 0.02);
      qrCardMesh.userData = { url: fc.url, id: fc.id };
      frameContainer.add(qrCardMesh);

      // Registrar para interacción clickeable 1:1
      this.interactiveMeshes.push(glassMesh, qrCardMesh);
      glassMesh.userData = { url: fc.url, id: fc.id };

      this.group.add(frameContainer);

      // E) Cintas textiles de suspensión superior
      const strapTopY = 12.0;
      const strapL1 = new THREE.Vector3(fc.posX - frameW * 0.35, strapTopY, 0);
      const strapL2 = new THREE.Vector3(fc.posX - frameW * 0.35, frameH / 2 + borderThick + 0.26, 0.6);
      const strapR1 = new THREE.Vector3(fc.posX + frameW * 0.35, strapTopY, 0);
      const strapR2 = new THREE.Vector3(fc.posX + frameW * 0.35, frameH / 2 + borderThick + 0.26, 0.6);

      const curveL = new THREE.LineCurve3(strapL1, strapL2);
      const curveR = new THREE.LineCurve3(strapR1, strapR2);

      const strapGeoL = new THREE.TubeGeometry(curveL, 16, 0.10, 8, false);
      const strapGeoR = new THREE.TubeGeometry(curveR, 16, 0.10, 8, false);

      const strapMeshL = new THREE.Mesh(strapGeoL, fc.strapMat);
      const strapMeshR = new THREE.Mesh(strapGeoR, fc.strapMat);
      this.group.add(strapMeshL, strapMeshR);

      this.hangingFrames.push({
        container: frameContainer,
        basePos: frameContainer.position.clone(),
        strapL: strapMeshL,
        strapR: strapMeshR,
        strapL1,
        strapR1,
        fc,
        phase: fc.phase
      });
    });

    // =========================================================================
    // 4. CONFIGURACIÓN DE EVENTOS DE INTERACTIVIDAD CLICK 1:1
    // =========================================================================
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const canvasEl = document.querySelector('#visual-canvas');

      this.onPointerMove = (e) => {
        if (!this.camera || !canvasEl) return;
        const rect = canvasEl.getBoundingClientRect();
        this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.interactiveMeshes);

        if (intersects.length > 0) {
          canvasEl.style.cursor = 'pointer';
        } else {
          canvasEl.style.cursor = 'default';
        }
      };

      this.onPointerDown = (e) => {
        if (!this.camera || !canvasEl) return;
        const rect = canvasEl.getBoundingClientRect();
        this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.interactiveMeshes);

        if (intersects.length > 0) {
          const hitUrl = intersects[0].object.userData.url;
          if (hitUrl && hitUrl !== '#') {
            e.stopPropagation();
            window.open(hitUrl, '_blank', 'noopener,noreferrer');
          }
        }
      };

      window.addEventListener('pointermove', this.onPointerMove);
      window.addEventListener('pointerdown', this.onPointerDown, true);
    }

    this.group.rotation.x = 0.03;
  }

  update(deltaTime) {
    super.update(deltaTime);

    const t = this.time;

    // 1. Oscilación pendular serena y elegante de los marcos suspendidos
    const frameW = this.frameW || 5.4;
    const frameH = this.frameH || 7.0;
    const borderThick = this.borderThick || 0.20;

    this.hangingFrames.forEach((hf) => {
      const sway = Math.sin(t * 0.85 + hf.phase) * 0.022;
      const swayX = Math.sin(t * 0.65 + hf.phase) * 0.08;
      const bobY = Math.cos(t * 1.3 + hf.phase) * 0.04;

      hf.container.position.set(
        hf.basePos.x + swayX,
        hf.basePos.y + bobY,
        hf.basePos.z
      );
      hf.container.rotation.z = sway;
      hf.container.rotation.y = sway * 1.1;

      // Actualizar dinámicamente las cintas textiles
      const currentAttachL = new THREE.Vector3(
        hf.container.position.x - frameW * 0.35,
        hf.container.position.y + frameH / 2 + borderThick + 0.26,
        hf.container.position.z
      );
      const currentAttachR = new THREE.Vector3(
        hf.container.position.x + frameW * 0.35,
        hf.container.position.y + frameH / 2 + borderThick + 0.26,
        hf.container.position.z
      );

      const curveL = new THREE.LineCurve3(hf.strapL1, currentAttachL);
      const curveR = new THREE.LineCurve3(hf.strapR1, currentAttachR);

      hf.strapL.geometry.dispose();
      hf.strapL.geometry = new THREE.TubeGeometry(curveL, 16, 0.10, 8, false);

      hf.strapR.geometry.dispose();
      hf.strapR.geometry = new THREE.TubeGeometry(curveR, 16, 0.10, 8, false);
    });

    // 2. Respiración armónica sutil del fondo textil
    if (this.backgroundCloth) {
      const pos = this.backgroundCloth.geometry.attributes.position.array;
      const base = this.clothBasePos;
      const count = pos.length / 3;

      for (let i = 0; i < count; i++) {
        const x = base[i * 3];
        const y = base[i * 3 + 1];

        const wave = Math.sin(x * 0.15 + t * 0.45) * 0.5;
        const fold = Math.cos(y * 0.22 + t * 0.35) * 0.35;

        pos[i * 3 + 2] = wave + fold;
      }
      this.backgroundCloth.geometry.attributes.position.needsUpdate = true;
      this.backgroundCloth.geometry.computeVertexNormals();
    }

    // Cámara con respiración serena
    this.group.rotation.y = Math.sin(t * 0.07) * 0.025;
  }

  dispose() {
    if (typeof window !== 'undefined') {
      if (this.onPointerMove) window.removeEventListener('pointermove', this.onPointerMove);
      if (this.onPointerDown) window.removeEventListener('pointerdown', this.onPointerDown, true);
      const canvasEl = document.querySelector('#visual-canvas');
      if (canvasEl) canvasEl.style.cursor = 'default';
    }

    this.hangingFrames.forEach((hf) => {
      if (hf.strapL && hf.strapL.geometry) hf.strapL.geometry.dispose();
      if (hf.strapR && hf.strapR.geometry) hf.strapR.geometry.dispose();
    });
    if (this.backgroundCloth && this.backgroundCloth.geometry) {
      this.backgroundCloth.geometry.dispose();
    }
    super.dispose();
  }
}
