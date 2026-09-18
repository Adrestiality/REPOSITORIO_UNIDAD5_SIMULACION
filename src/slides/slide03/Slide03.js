/**
 * Slide 03: ENCUENTRO - Pieza Textil Cerrada que Abre sus Costuras al Mundo
 * Concepto: "Los eventos no llegaron a la Universidad. La Universidad decidió encontrarse con el mundo."
 * Metáfora: CERRADO → ABRIR UNA COSTURA → DESPLEGAR → ENCONTRARSE CON EL EXTERIOR (INTERIOR → EXTERIOR).
 * 
 * COREOGRAFÍA PROCEDURAL & COMPOSICIÓN EDITORIAL INDEPENDIENTE:
 * 1. ZONA TEXTIL DEDICADA A LA DERECHA (X = 4.8):
 *    - Deja el 45% izquierdo del canvas 100% despejado y protegido para los textos en Español y Portugués.
 * 2. FARDO TEXTIL DE GRAN ESCALA (LONA MARFIL, SEDA CYAN Y CORAL):
 *    - Al abrirse, el dosel superior se arquea hacia el cielo (top-right).
 *    - El panel frontal se desdobla hacia la explanada inferior.
 *    - Las alas laterales se expanden revelando forros de seda de alto brillo.
 * 3. CINTAS INTERIORES VIVAS:
 *    - Se proyectan hacia el horizonte superior e inferior derecho sin invadir el cuadrante de texto.
 */
import * as THREE from 'three';
import { BaseSlide } from '../../core/BaseSlide.js';
import { createPatchworkTexture, createTextileMaterial, createWeaveTexture } from '../../core/utils/textileMaterials.js';

export class Slide03 extends BaseSlide {
  constructor() {
    super('universidad-mundo', 'Pieza Textil que se Abre al Mundo');
    this.needleMesh = null;
    this.seamThread = null;
    this.frontFlap = null;
    this.topCanopy = null;
    this.leftWing = null;
    this.rightWing = null;
    this.innerRibbonA = null;
    this.innerRibbonB = null;
    this.basePosMap = new Map();
    this.segW = 32;
    this.segH = 24;
  }

  buildScene() {
    this.basePosMap.clear();

    // Centro del pabellón textil en el cuadrante derecho
    const pavilionCenter = new THREE.Vector3(4.8, -0.2, 0);

    // =========================================================================
    // 1. MATERIALES TEXTILES
    // =========================================================================
    const matOuterCanvas = createTextileMaterial({
      color: 0xfbf9f5,
      sheenColor: 0xffffff,
      roughness: 0.65,
      map: createWeaveTexture({ size: 128, type: 'plain', density: 16 }),
      bumpScale: 0.04
    });

    const matInnerCyan = createTextileMaterial({
      color: 0x08a9dd,
      sheenColor: 0xbae6fd,
      roughness: 0.35,
      clearcoat: 0.85,
      map: createPatchworkTexture({ baseColor: '#08a9dd', accentColor: '#38bdf8', pattern: 'stripes' }),
      bumpScale: 0.03
    });

    const matInnerCoral = createTextileMaterial({
      color: 0xf43f5e,
      sheenColor: 0xfecdd3,
      roughness: 0.35,
      clearcoat: 0.85,
      map: createPatchworkTexture({ baseColor: '#f43f5e', accentColor: '#fb7185', pattern: 'dots' }),
      bumpScale: 0.03
    });

    const matGoldSilk = createTextileMaterial({
      color: 0xf59e0b,
      sheenColor: 0xfef08a,
      roughness: 0.3,
      clearcoat: 0.9,
      bumpScale: 0.02
    });

    const seamLineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85
    });

    // =========================================================================
    // 2. CAPAS TEXTILES DEL FARDO (ESCALA GRANDE Y GENEROSA)
    // =========================================================================

    // A) PANEL FRONTAL
    const frontW = 7.8;
    const frontH = 6.4;
    const frontGeo = new THREE.PlaneGeometry(frontW, frontH, this.segW, this.segH);
    this.basePosMap.set('front', frontGeo.attributes.position.array.slice());
    this.frontFlap = new THREE.Mesh(frontGeo, matOuterCanvas);
    this.frontFlap.position.copy(pavilionCenter).add(new THREE.Vector3(0, 0, 1.8));
    this.group.add(this.frontFlap);

    const frontEdge = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(frontW, frontH)), seamLineMat);
    this.frontFlap.add(frontEdge);

    // B) DOSEL SUPERIOR (Techo tensado arqueado)
    const topW = 9.2;
    const topH = 8.0;
    const topGeo = new THREE.PlaneGeometry(topW, topH, this.segW, this.segH);
    this.basePosMap.set('top', topGeo.attributes.position.array.slice());
    this.topCanopy = new THREE.Mesh(topGeo, matGoldSilk);
    this.topCanopy.position.copy(pavilionCenter).add(new THREE.Vector3(0, 2.6, 0.5));
    this.topCanopy.rotation.x = -Math.PI / 3;
    this.group.add(this.topCanopy);

    // C) ALA LATERAL IZQUIERDA (Se despliega hacia la izquierda controlada)
    const wingW = 6.8;
    const wingH = 8.4;
    const leftGeo = new THREE.PlaneGeometry(wingW, wingH, this.segW, this.segH);
    this.basePosMap.set('left', leftGeo.attributes.position.array.slice());
    this.leftWing = new THREE.Mesh(leftGeo, matInnerCyan);
    this.leftWing.position.copy(pavilionCenter).add(new THREE.Vector3(-2.6, 0, 0.8));
    this.group.add(this.leftWing);

    // D) ALA LATERAL DERECHA (Se despliega hacia la derecha)
    const rightGeo = new THREE.PlaneGeometry(wingW, wingH, this.segW, this.segH);
    this.basePosMap.set('right', rightGeo.attributes.position.array.slice());
    this.rightWing = new THREE.Mesh(rightGeo, matInnerCoral);
    this.rightWing.position.copy(pavilionCenter).add(new THREE.Vector3(2.6, 0, 0.8));
    this.group.add(this.rightWing);

    // =========================================================================
    // 3. CINTAS INTERIORES QUE SE PROYECTAN AL EXTERIOR (HACIA LA DERECHA)
    // =========================================================================
    const ribbonGeoA = new THREE.BufferGeometry();
    this.innerRibbonA = new THREE.Mesh(ribbonGeoA, matInnerCyan);
    this.group.add(this.innerRibbonA);

    const ribbonGeoB = new THREE.BufferGeometry();
    this.innerRibbonB = new THREE.Mesh(ribbonGeoB, matInnerCoral);
    this.group.add(this.innerRibbonB);

    // =========================================================================
    // 4. AGUJA & HILO DE TENSIÓN DE COSTURA
    // =========================================================================
    const needleGroup = new THREE.Group();
    const needleMat = new THREE.MeshPhysicalMaterial({
      color: 0xf1f5f9,
      metalness: 0.95,
      roughness: 0.1,
      clearcoat: 1.0
    });
    const nBody = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.08, 2.6, 12), needleMat);
    const nTip = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.7, 12), needleMat);
    nTip.position.set(0, -1.65, 0);
    needleGroup.add(nBody, nTip);
    needleGroup.position.copy(pavilionCenter).add(new THREE.Vector3(0, 5.0, 3.5));
    this.needleMesh = needleGroup;
    this.group.add(this.needleMesh);

    // Hilo de tensión de costura frontal
    const threadMat = new THREE.MeshPhysicalMaterial({
      color: 0xff3366,
      roughness: 0.2,
      emissive: 0xff3366,
      emissiveIntensity: 0.5
    });
    const initThreadPts = [
      pavilionCenter.clone().add(new THREE.Vector3(0, 3.2, 2.0)),
      pavilionCenter.clone().add(new THREE.Vector3(0, 0, 2.0)),
      pavilionCenter.clone().add(new THREE.Vector3(0, -3.2, 2.0))
    ];
    this.seamThread = new THREE.Mesh(
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3(initThreadPts), 20, 0.06, 8, false),
      threadMat
    );
    this.group.add(this.seamThread);

    this.group.rotation.x = 0.05;
    this.group.rotation.y = -0.06;
  }

  update(deltaTime) {
    super.update(deltaTime);

    const t = this.time;
    const pavilionCenter = new THREE.Vector3(4.8, -0.2, 0);

    const tensionProgress = Math.min(1.0, Math.max(0, (t - 0.8) / 1.4));
    const unfoldProgress = Math.min(1.0, Math.max(0, (t - 2.2) / 3.4));

    const isTensing = t >= 1.0 && t < 2.2;
    const tensionJitter = isTensing ? Math.sin(t * 36.0) * 0.04 : 0;

    const easeUnfold = unfoldProgress < 0.7
      ? Math.pow(unfoldProgress / 0.7, 2) * 1.06
      : 1.06 - Math.sin((unfoldProgress - 0.7) / 0.3 * Math.PI * 0.5) * 0.06;

    // 1. Aguja y tracción de hilo
    if (this.needleMesh) {
      if (t < 1.0) {
        this.needleMesh.position.copy(pavilionCenter).add(new THREE.Vector3(0, 5.0, 3.5));
        this.needleMesh.visible = false;
      } else if (t < 2.3) {
        this.needleMesh.visible = true;
        const nProg = (t - 1.0) / 1.3;
        const curY = THREE.MathUtils.lerp(3.5, 0.0, nProg);
        const curZ = THREE.MathUtils.lerp(3.0, 4.6, nProg) + tensionJitter;
        this.needleMesh.position.copy(pavilionCenter).add(new THREE.Vector3(0, curY, curZ));
        this.needleMesh.rotation.z = Math.sin(t * 10.0) * 0.25;
      } else {
        this.needleMesh.position.y += deltaTime * 6.0;
        this.needleMesh.position.z += deltaTime * 2.0;
        if (this.needleMesh.position.y > 14.0) {
          this.needleMesh.visible = false;
        }
      }
    }

    // Desvanecer hilo de costura
    if (this.seamThread) {
      if (t < 2.2) {
        const pullZ = 2.0 + tensionProgress * 2.4;
        const pts = [
          pavilionCenter.clone().add(new THREE.Vector3(0, 3.2, 2.0)),
          pavilionCenter.clone().add(new THREE.Vector3(0, 0, pullZ)),
          pavilionCenter.clone().add(new THREE.Vector3(0, -3.2, 2.0))
        ];
        this.seamThread.geometry.dispose();
        this.seamThread.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 20, 0.06, 8, false);
      } else {
        this.seamThread.material.opacity = Math.max(0, 1.0 - (t - 2.2) * 2.0);
        if (this.seamThread.material.opacity <= 0) {
          this.seamThread.visible = false;
        }
      }
    }

    // 2. PANEL FRONTAL: Desdoble hacia abajo
    if (this.frontFlap) {
      const initPos = pavilionCenter.clone().add(new THREE.Vector3(0, 0, 1.8));
      const targetPos = pavilionCenter.clone().add(new THREE.Vector3(0, -4.4, 3.8));
      this.frontFlap.position.lerpVectors(initPos, targetPos, Math.min(1.0, easeUnfold));
      this.frontFlap.rotation.x = THREE.MathUtils.lerp(0, 1.35, easeUnfold);

      const pos = this.frontFlap.geometry.attributes.position.array;
      const base = this.basePosMap.get('front');
      const count = pos.length / 3;

      for (let i = 0; i < count; i++) {
        const bx = base[i * 3];
        const by = base[i * 3 + 1];
        const wave = Math.sin(bx * 0.7 + t * 2.5) * Math.cos(by * 0.6 + t * 2.0) * (0.35 * easeUnfold);
        pos[i * 3] = bx;
        pos[i * 3 + 1] = by;
        pos[i * 3 + 2] = wave;
      }
      this.frontFlap.geometry.attributes.position.needsUpdate = true;
      this.frontFlap.geometry.computeVertexNormals();
    }

    // 3. DOSEL SUPERIOR: Elevación arqueada
    if (this.topCanopy) {
      const initPos = pavilionCenter.clone().add(new THREE.Vector3(0, 2.6, 0.5));
      const targetPos = pavilionCenter.clone().add(new THREE.Vector3(0, 4.8, -0.5));
      this.topCanopy.position.lerpVectors(initPos, targetPos, Math.min(1.0, easeUnfold));
      this.topCanopy.rotation.x = THREE.MathUtils.lerp(-Math.PI / 3, -0.4, easeUnfold);

      const pos = this.topCanopy.geometry.attributes.position.array;
      const base = this.basePosMap.get('top');
      const count = pos.length / 3;

      for (let i = 0; i < count; i++) {
        const bx = base[i * 3];
        const by = base[i * 3 + 1];
        const domeArch = (1.0 - (bx * bx) / 22.0) * (1.2 * easeUnfold);
        const flutter = Math.sin(bx * 0.5 + t * 3.0) * (0.2 * easeUnfold);
        pos[i * 3] = bx;
        pos[i * 3 + 1] = by + domeArch * 0.3;
        pos[i * 3 + 2] = domeArch + flutter;
      }
      this.topCanopy.geometry.attributes.position.needsUpdate = true;
      this.topCanopy.geometry.computeVertexNormals();
    }

    // 4. ALAS LATERALES (Despliegue ordenado sin invadir la izquierda)
    if (this.leftWing) {
      const initPos = pavilionCenter.clone().add(new THREE.Vector3(-2.6, 0, 0.8));
      const targetPos = pavilionCenter.clone().add(new THREE.Vector3(-4.8, 0.2, 0.2));
      this.leftWing.position.lerpVectors(initPos, targetPos, Math.min(1.0, easeUnfold));
      this.leftWing.rotation.y = THREE.MathUtils.lerp(0, -0.6, easeUnfold);

      const pos = this.leftWing.geometry.attributes.position.array;
      const base = this.basePosMap.get('left');
      const count = pos.length / 3;

      for (let i = 0; i < count; i++) {
        const bx = base[i * 3];
        const by = base[i * 3 + 1];
        const billow = Math.sin(by * 0.8 + t * 2.8) * (0.32 * easeUnfold);
        pos[i * 3] = bx;
        pos[i * 3 + 1] = by;
        pos[i * 3 + 2] = billow;
      }
      this.leftWing.geometry.attributes.position.needsUpdate = true;
      this.leftWing.geometry.computeVertexNormals();
    }

    if (this.rightWing) {
      const initPos = pavilionCenter.clone().add(new THREE.Vector3(2.6, 0, 0.8));
      const targetPos = pavilionCenter.clone().add(new THREE.Vector3(5.8, 0.2, 0.2));
      this.rightWing.position.lerpVectors(initPos, targetPos, Math.min(1.0, easeUnfold));
      this.rightWing.rotation.y = THREE.MathUtils.lerp(0, 0.65, easeUnfold);

      const pos = this.rightWing.geometry.attributes.position.array;
      const base = this.basePosMap.get('right');
      const count = pos.length / 3;

      for (let i = 0; i < count; i++) {
        const bx = base[i * 3];
        const by = base[i * 3 + 1];
        const billow = Math.cos(by * 0.8 + t * 2.8) * (0.32 * easeUnfold);
        pos[i * 3] = bx;
        pos[i * 3 + 1] = by;
        pos[i * 3 + 2] = billow;
      }
      this.rightWing.geometry.attributes.position.needsUpdate = true;
      this.rightWing.geometry.computeVertexNormals();
    }

    // 5. CINTAS INTERIORES QUE SE PROYECTAN AL EXTERIOR (ZONA DERECHA/CENTRO-DERECHA)
    if (this.innerRibbonA && this.innerRibbonB && easeUnfold > 0.05) {
      const rProg = Math.min(1.0, easeUnfold);
      const segs = 32;

      // Cinta Cyan proyectándose hacia arriba a la derecha
      const ptsA = [];
      for (let s = 0; s <= segs; s++) {
        const u = (s / segs) * rProg;
        const x = THREE.MathUtils.lerp(pavilionCenter.x, pavilionCenter.x - 3.5, u) + Math.sin(u * Math.PI * 2 + t * 3.0) * 0.35;
        const y = THREE.MathUtils.lerp(pavilionCenter.y, 4.4, u) + Math.cos(u * Math.PI * 2 + t * 2.5) * 0.3;
        const z = THREE.MathUtils.lerp(0.5, 3.2, u) + Math.sin(u * Math.PI * 3 + t * 3.2) * 0.3;
        ptsA.push(new THREE.Vector3(x, y, z));
      }

      // Cinta Coral proyectándose hacia abajo a la derecha
      const ptsB = [];
      for (let s = 0; s <= segs; s++) {
        const u = (s / segs) * rProg;
        const x = THREE.MathUtils.lerp(pavilionCenter.x, pavilionCenter.x + 6.5, u) + Math.cos(u * Math.PI * 2 + t * 3.0) * 0.35;
        const y = THREE.MathUtils.lerp(pavilionCenter.y, -3.8, u) + Math.sin(u * Math.PI * 2 + t * 2.5) * 0.3;
        const z = THREE.MathUtils.lerp(0.5, 3.2, u) + Math.cos(u * Math.PI * 3 + t * 3.2) * 0.3;
        ptsB.push(new THREE.Vector3(x, y, z));
      }

      if (ptsA.length >= 2) {
        this.innerRibbonA.geometry.dispose();
        this.innerRibbonA.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ptsA), segs, 0.14, 8, false);
        this.innerRibbonA.visible = true;
      }
      if (ptsB.length >= 2) {
        this.innerRibbonB.geometry.dispose();
        this.innerRibbonB.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ptsB), segs, 0.14, 8, false);
        this.innerRibbonB.visible = true;
      }
    } else {
      if (this.innerRibbonA) this.innerRibbonA.visible = false;
      if (this.innerRibbonB) this.innerRibbonB.visible = false;
    }

    this.group.rotation.y = -0.06 + Math.sin(t * 0.1) * 0.03;
    this.group.rotation.x = 0.05 + Math.cos(t * 0.08) * 0.02;
  }
}


