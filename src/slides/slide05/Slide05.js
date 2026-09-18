/**
 * Slide 05: IMPACTAR — Aguja de Impacto & Bordado Artesanal
 * Concepto: "Los eventos nunca fueron el objetivo. El impacto, sí."
 * Acción: IMPACTAR
 * 
 * COREOGRAFÍA PROCEDURAL & COMPOSICIÓN EDITORIAL:
 * 1. BASTIDOR DE MADERA Y TELA TENSADA (X = 5.2):
 *    - Deja todo el lateral izquierdo completamente libre para el texto en Español y Portugués.
 * 2. CINEMÁTICA DE AGUJA EXAGERADA (12 Principios de Animación):
 *    - Anticipación marcada: La aguja se retrae, vibra acumulando tensión interna.
 *    - Aceleración fulminante: Se proyecta hacia el centro del lienzo a gran velocidad.
 *    - Impacto & Penetración física: Perfora la tela generando deformación cónica y arrugas de tracción.
 *    - Rebote elástico & Follow-through.
 * 3. TRANSFORMACIÓN ARTESANAL PERMANENTE:
 *    - El impacto hace florecer una corona de auténticas puntadas de costura en cruz y nudos franceses perlados.
 *    - Cero planos de colores abstractos.
 */
import * as THREE from 'three';
import { BaseSlide } from '../../core/BaseSlide.js';
import { createTextileMaterial, createWeaveTexture } from '../../core/utils/textileMaterials.js';

export class Slide05 extends BaseSlide {
  constructor() {
    super('impacto', 'Aguja de Impacto & Bordado Artesanal');
    this.canvasMesh = null;
    this.canvasBasePos = null;
    this.needleMesh = null;
    this.threadMesh = null;
    this.embroideredStitches = [];
    this.frenchKnots = [];
    this.segW = 60;
    this.segH = 45;
  }

  buildScene() {
    this.embroideredStitches = [];
    this.frenchKnots = [];

    // Centro del bastidor textil ubicado en el cuadrante derecho
    const clothCenter = new THREE.Vector3(5.2, 0, 0);

    // =========================================================================
    // 1. LIENZO TEXTIL TENSADO EN BASTIDOR DE MADERA
    // =========================================================================
    const clothW = 14.5;
    const clothH = 11.2;
    const geo = new THREE.PlaneGeometry(clothW, clothH, this.segW, this.segH);
    this.canvasBasePos = geo.attributes.position.array.slice();

    const canvasMat = createTextileMaterial({
      color: 0xfbf9f5,
      sheenColor: 0xffffff,
      roughness: 0.65,
      map: createWeaveTexture({ size: 256, type: 'plain', density: 20 }),
      bumpScale: 0.04
    });

    this.canvasMesh = new THREE.Mesh(geo, canvasMat);
    this.canvasMesh.position.copy(clothCenter);
    this.group.add(this.canvasMesh);

    const hoopMat = new THREE.MeshPhysicalMaterial({
      color: 0x475569,
      roughness: 0.4,
      metalness: 0.6,
      clearcoat: 0.8
    });

    const bThick = 0.35;
    const borderDepth = 0.5;
    const topBar = new THREE.Mesh(new THREE.BoxGeometry(clothW + bThick * 2, bThick, borderDepth), hoopMat);
    topBar.position.set(0, clothH / 2 + bThick / 2, 0);
    const botBar = new THREE.Mesh(new THREE.BoxGeometry(clothW + bThick * 2, bThick, borderDepth), hoopMat);
    botBar.position.set(0, -clothH / 2 - bThick / 2, 0);
    const leftBar = new THREE.Mesh(new THREE.BoxGeometry(bThick, clothH, borderDepth), hoopMat);
    leftBar.position.set(-clothW / 2 - bThick / 2, 0, 0);
    const rightBar = new THREE.Mesh(new THREE.BoxGeometry(bThick, clothH, borderDepth), hoopMat);
    rightBar.position.set(clothW / 2 + bThick / 2, 0, 0);

    this.canvasMesh.add(topBar, botBar, leftBar, rightBar);

    // =========================================================================
    // 2. AGUJA DE IMPACTO EN ACERO PULIDO Y CABEZA DE LATÓN
    // =========================================================================
    const needleGroup = new THREE.Group();
    const needleMat = new THREE.MeshPhysicalMaterial({
      color: 0xf1f5f9,
      metalness: 0.95,
      roughness: 0.08,
      clearcoat: 1.0
    });
    const brassMat = new THREE.MeshPhysicalMaterial({
      color: 0xdfb76c,
      metalness: 0.9,
      roughness: 0.15,
      clearcoat: 1.0
    });

    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.20, 5.8, 16), needleMat);
    const point = new THREE.Mesh(new THREE.ConeGeometry(0.10, 1.5, 16), needleMat);
    point.position.set(0, -3.65, 0);
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.38, 16, 16), brassMat);
    cap.position.set(0, 3.1, 0);

    needleGroup.add(shaft, point, cap);
    needleGroup.position.set(clothCenter.x, 4.0, 10.0);
    needleGroup.rotation.x = Math.PI / 2.8;
    this.group.add(needleGroup);
    this.needleMesh = needleGroup;

    // Hilo coral con follow-through
    const threadMat = new THREE.MeshPhysicalMaterial({
      color: 0xe11d48,
      roughness: 0.25,
      metalness: 0.2,
      clearcoat: 0.9,
      sheen: 1.0,
      sheenColor: new THREE.Color(0xfef08a),
      emissive: 0xe11d48,
      emissiveIntensity: 0.4
    });

    const initCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(clothCenter.x, 8.0, 14.0),
      new THREE.Vector3(clothCenter.x + 0.8, 6.0, 12.0),
      new THREE.Vector3(clothCenter.x, 4.0, 10.0)
    ]);
    const threadGeo = new THREE.TubeGeometry(initCurve, 30, 0.08, 8, false);
    this.threadMesh = new THREE.Mesh(threadGeo, threadMat);
    this.group.add(this.threadMesh);

    // =========================================================================
    // 3. PUNTADAS BORDADAS & NUDOS ARTESANALES TRAS EL IMPACTO
    // =========================================================================
    const stitchColors = [0x0284c7, 0xe11d48, 0xd97706, 0x059669];
    const totalStitches = 16;

    for (let s = 0; s < totalStitches; s++) {
      const angle = (s / totalStitches) * Math.PI * 2;
      const radius = 1.3 + (s % 2) * 1.6;
      const sx = Math.cos(angle) * radius;
      const sy = Math.sin(angle) * radius;

      const col = stitchColors[s % stitchColors.length];
      const sMat = new THREE.MeshPhysicalMaterial({
        color: col,
        roughness: 0.3,
        metalness: 0.2,
        clearcoat: 0.9,
        sheen: 1.0,
        sheenColor: new THREE.Color(col),
        emissive: new THREE.Color(col),
        emissiveIntensity: 0.25
      });

      const crossGroup = new THREE.Group();
      const arm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.55, 8), sMat);
      arm1.rotation.z = Math.PI / 4;
      const arm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.55, 8), sMat);
      arm2.rotation.z = -Math.PI / 4;
      crossGroup.add(arm1, arm2);
      crossGroup.position.set(clothCenter.x + sx, clothCenter.y + sy, 0.06);
      crossGroup.scale.set(0.001, 0.001, 0.001);
      this.group.add(crossGroup);

      this.embroideredStitches.push({
        group: crossGroup,
        delay: 1.4 + (s / totalStitches) * 1.2
      });
    }

    const knotCount = 8;
    for (let k = 0; k < knotCount; k++) {
      const angle = (k / knotCount) * Math.PI * 2 + Math.PI / knotCount;
      const kRadius = 3.8;
      const kx = Math.cos(angle) * kRadius;
      const ky = Math.sin(angle) * kRadius;

      const knotMat = new THREE.MeshPhysicalMaterial({
        color: 0xdfb76c,
        metalness: 0.85,
        roughness: 0.2,
        clearcoat: 1.0
      });
      const knotMesh = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), knotMat);
      knotMesh.position.set(clothCenter.x + kx, clothCenter.y + ky, 0.08);
      knotMesh.scale.set(0.001, 0.001, 0.001);
      this.group.add(knotMesh);

      this.frenchKnots.push({
        mesh: knotMesh,
        delay: 2.2 + k * 0.14
      });
    }

    this.group.rotation.x = 0.05;
    this.group.rotation.y = -0.05;
  }

  update(deltaTime) {
    super.update(deltaTime);

    const t = this.time;
    const clothCenter = new THREE.Vector3(5.2, 0, 0);

    const impactTime = 1.2;
    const activeTime = Math.max(0, t - impactTime);

    let needleY = 4.0;
    let needleZ = 10.0;
    let needleRotX = Math.PI / 2.8;

    if (t < 0.9) {
      const prep = t / 0.9;
      const tremble = Math.sin(t * 38.0) * 0.08;
      needleZ = 10.0 + Math.sin(prep * Math.PI) * 2.2;
      needleY = 4.0 + prep * 1.6 + tremble;
      needleRotX = Math.PI / 2.8 + Math.sin(t * 24.0) * 0.05;
    } else if (t < 1.3) {
      const strike = (t - 0.9) / 0.4;
      const easeStrike = strike * strike * strike;
      needleZ = THREE.MathUtils.lerp(12.2, -1.8, easeStrike);
      needleY = THREE.MathUtils.lerp(5.6, 0.0, easeStrike);
      needleRotX = Math.PI / 2.0;
    } else if (t < 2.5) {
      const rebound = (t - 1.3) / 1.2;
      const easeRebound = Math.sin(rebound * Math.PI * 0.5);
      needleZ = THREE.MathUtils.lerp(-1.8, 3.4, easeRebound);
      needleY = THREE.MathUtils.lerp(0.0, 1.8, easeRebound);
      needleRotX = Math.PI / 2.4;
    } else {
      const hover = Math.sin(t * 1.5) * 0.12;
      needleZ = 3.4 + hover;
      needleY = 1.8;
      needleRotX = Math.PI / 2.4;
    }

    if (this.needleMesh) {
      this.needleMesh.position.set(clothCenter.x, needleY, needleZ);
      this.needleMesh.rotation.x = needleRotX;
    }

    if (this.canvasMesh) {
      const pos = this.canvasMesh.geometry.attributes.position.array;
      const base = this.canvasBasePos;
      const count = pos.length / 3;

      const strikeStrength = activeTime < 1.6
        ? Math.exp(-activeTime * 3.2) * Math.sin(activeTime * 16.0)
        : 0;

      for (let i = 0; i < count; i++) {
        const bx = base[i * 3];
        const by = base[i * 3 + 1];
        const r = Math.hypot(bx, by);

        const coneImpact = -Math.exp(-r * 0.5) * strikeStrength * 3.8;
        const radialWrinkles = Math.sin(r * 2.0 - activeTime * 7.0) * Math.exp(-r * 0.35) * strikeStrength * 1.4;
        const settlingFlutter = Math.sin(r * 0.7 + t * 2.0) * 0.08 * Math.min(1.0, activeTime / 2.0);

        pos[i * 3 + 2] = coneImpact + radialWrinkles + settlingFlutter;
      }
      this.canvasMesh.geometry.attributes.position.needsUpdate = true;
      this.canvasMesh.geometry.computeVertexNormals();
    }

    this.embroideredStitches.forEach((st) => {
      if (t >= st.delay) {
        const sProg = Math.min(1.0, (t - st.delay) / 0.5);
        const ease = sProg < 0.7
          ? Math.pow(sProg / 0.7, 2) * 1.18
          : 1.18 - Math.sin((sProg - 0.7) / 0.3 * Math.PI * 0.5) * 0.18;

        st.group.scale.set(ease, ease, ease);
      }
    });

    this.frenchKnots.forEach((knot) => {
      if (t >= knot.delay) {
        const kProg = Math.min(1.0, (t - knot.delay) / 0.4);
        const easeK = kProg < 0.7
          ? Math.pow(kProg / 0.7, 2) * 1.2
          : 1.2 - Math.sin((kProg - 0.7) / 0.3 * Math.PI * 0.5) * 0.2;

        knot.mesh.scale.set(easeK, easeK, easeK);
      }
    });

    if (this.threadMesh && this.needleMesh) {
      const needleEye = this.needleMesh.position.clone().add(new THREE.Vector3(0, 0.4, 0));
      const threadPoints = [
        new THREE.Vector3(clothCenter.x, 8.0, 14.0),
        new THREE.Vector3(clothCenter.x + 0.8 + Math.sin(t * 3.2) * 0.4, 6.0, 12.0),
        needleEye
      ];
      const dynamicThreadCurve = new THREE.CatmullRomCurve3(threadPoints);
      this.threadMesh.geometry.dispose();
      this.threadMesh.geometry = new THREE.TubeGeometry(dynamicThreadCurve, 30, 0.08, 8, false);
    }

    this.group.rotation.y = -0.05 + Math.sin(t * 0.1) * 0.025;
  }
}
