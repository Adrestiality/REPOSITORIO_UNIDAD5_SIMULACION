/**
 * Slide 07: CRECER — Crecimiento Rítmico Acelerado del Bordado & Confianza
 * Concepto: "El talento crece a la velocidad de la confianza."
 * Acción: CRECER
 * 
 * COREOGRAFÍA PROCEDURAL & APROVECHAMIENTO DEL CANVAS DERECHO:
 * 1. BASTIDOR DE BORDADO EXPANDIDO (X = 5.0, Radio = 6.0):
 *    - Aprovecha ampliamente el espacio derecho sin saturar y manteniendo la zona de texto despejada.
 * 2. CARRETE DE CONFIANZA & AGUJA ÁGIL:
 *    - Carrete en rotación acelerada que alimenta el hilo activo.
 * 3. CINCO FASES DE ACELERACIÓN RÍTMICA:
 *    - Florecimiento progresivo de 5 anillos concéntricos con dinamismo y acabado artesanal.
 */
import * as THREE from 'three';
import { BaseSlide } from '../../core/BaseSlide.js';
import { createTextileMaterial, createWeaveTexture } from '../../core/utils/textileMaterials.js';

export class Slide07 extends BaseSlide {
  constructor() {
    super('confianza', 'Carrete & Crecimiento Acelerado de Bordado');
    this.spool = null;
    this.hoopMesh = null;
    this.needleMesh = null;
    this.activeThread = null;
    this.growthRings = [];
    this.allStitches = [];
    this.frenchKnots = [];
  }

  buildScene() {
    this.growthRings = [];
    this.allStitches = [];
    this.frenchKnots = [];

    const embroideryCenter = new THREE.Vector3(5.0, -0.2, 0);

    // =========================================================================
    // 1. BASTIDOR CIRCULAR DE BORDADO EXPANDIDO
    // =========================================================================
    const hoopRadius = 5.8;
    const hoopGeo = new THREE.RingGeometry(hoopRadius, hoopRadius + 0.38, 48);
    const woodHoopMat = new THREE.MeshPhysicalMaterial({
      color: 0x475569,
      roughness: 0.35,
      metalness: 0.7,
      clearcoat: 0.8,
      side: THREE.DoubleSide
    });
    this.hoopMesh = new THREE.Mesh(hoopGeo, woodHoopMat);
    this.hoopMesh.position.copy(embroideryCenter);
    this.group.add(this.hoopMesh);

    const canvasGeo = new THREE.CircleGeometry(hoopRadius, 48);
    const canvasMat = createTextileMaterial({
      color: 0xfbf9f5,
      sheenColor: 0xffffff,
      roughness: 0.65,
      map: createWeaveTexture({ size: 256, type: 'plain', density: 18 }),
      bumpScale: 0.03
    });
    const canvasMesh = new THREE.Mesh(canvasGeo, canvasMat);
    canvasMesh.position.set(0, 0, -0.05);
    this.hoopMesh.add(canvasMesh);

    const clampMat = new THREE.MeshPhysicalMaterial({ color: 0xdfb76c, metalness: 0.9, roughness: 0.15, clearcoat: 1.0 });
    const clampMesh = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.95, 0.45), clampMat);
    clampMesh.position.set(0, hoopRadius + 0.35, 0);
    this.hoopMesh.add(clampMesh);

    // =========================================================================
    // 2. CARRETE DE CONFIANZA & AGUJA DE ACERO PULIDO
    // =========================================================================
    const spoolGroup = new THREE.Group();
    const spoolWoodTop = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.25, 24), woodHoopMat);
    spoolWoodTop.position.set(0, 1.2, 0);
    const spoolWoodBot = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.25, 24), woodHoopMat);
    spoolWoodBot.position.set(0, -1.2, 0);
    const threadCoreMat = createTextileMaterial({ color: 0xd97706, sheenColor: 0xfef08a, roughness: 0.4 });
    const threadCore = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 2.1, 24), threadCoreMat);
    spoolGroup.add(spoolWoodTop, spoolWoodBot, threadCore);

    spoolGroup.position.set(11.2, 4.8, 2.0);
    spoolGroup.rotation.x = Math.PI / 4;
    spoolGroup.rotation.z = Math.PI / 6;
    this.group.add(spoolGroup);
    this.spool = spoolGroup;

    const needleGroup = new THREE.Group();
    const needleMat = new THREE.MeshPhysicalMaterial({
      color: 0xf1f5f9,
      metalness: 0.95,
      roughness: 0.08,
      clearcoat: 1.0
    });
    const nShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.09, 2.6, 10), needleMat);
    const nPoint = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.65, 10), needleMat);
    nPoint.position.set(0, -1.6, 0);
    needleGroup.add(nShaft, nPoint);
    needleGroup.position.set(embroideryCenter.x, embroideryCenter.y, 1.5);
    this.needleMesh = needleGroup;
    this.group.add(this.needleMesh);

    // =========================================================================
    // 3. ANILLOS DE CRECIMIENTO ACELERADO
    // =========================================================================
    const ringConfigs = [
      { count: 4,  radius: 1.0, color: 0xd97706, tStart: 0.8, duration: 1.0,  stitchSize: 0.65 },
      { count: 8,  radius: 2.0, color: 0x0284c7, tStart: 1.8, duration: 1.2,  stitchSize: 0.75 },
      { count: 16, radius: 3.2, color: 0xe11d48, tStart: 3.0, duration: 1.2,  stitchSize: 0.82 },
      { count: 24, radius: 4.3, color: 0x059669, tStart: 4.2, duration: 1.2,  stitchSize: 0.88 },
      { count: 32, radius: 5.2, color: 0xdb2777, tStart: 5.4, duration: 1.4,  stitchSize: 0.92 }
    ];

    ringConfigs.forEach((rc, rIdx) => {
      const ringStitches = [];
      const sMat = new THREE.MeshPhysicalMaterial({
        color: rc.color,
        roughness: 0.3,
        metalness: 0.2,
        clearcoat: 0.9,
        sheen: 1.0,
        sheenColor: new THREE.Color(rc.color),
        emissive: new THREE.Color(rc.color),
        emissiveIntensity: 0.3
      });

      for (let s = 0; s < rc.count; s++) {
        const angle = (s / rc.count) * Math.PI * 2 + (rIdx * 0.25);
        const x = Math.cos(angle) * rc.radius;
        const y = Math.sin(angle) * rc.radius;

        const stitchMesh = new THREE.Group();
        const a1 = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, rc.stitchSize, 6), sMat);
        a1.rotation.z = Math.PI / 4;
        const a2 = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, rc.stitchSize, 6), sMat);
        a2.rotation.z = -Math.PI / 4;
        stitchMesh.add(a1, a2);
        stitchMesh.position.set(x, y, 0.06);
        stitchMesh.scale.set(0.001, 0.001, 0.001);
        this.hoopMesh.add(stitchMesh);

        const delay = rc.tStart + (s / rc.count) * rc.duration;
        const stitchObj = {
          mesh: stitchMesh,
          worldTarget: new THREE.Vector3(x + embroideryCenter.x, y + embroideryCenter.y, 0.1),
          delay,
          rIdx,
          sIdx: s
        };

        ringStitches.push(stitchObj);
        this.allStitches.push(stitchObj);
      }

      this.growthRings.push(ringStitches);
    });

    const knotCount = 18;
    for (let k = 0; k < knotCount; k++) {
      const angle = (k / knotCount) * Math.PI * 2;
      const kx = Math.cos(angle) * 5.5;
      const ky = Math.sin(angle) * 5.5;

      const knotMat = new THREE.MeshPhysicalMaterial({
        color: 0xdfb76c,
        metalness: 0.9,
        roughness: 0.15,
        clearcoat: 1.0
      });
      const knot = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 10), knotMat);
      knot.position.set(kx, ky, 0.08);
      knot.scale.set(0.001, 0.001, 0.001);
      this.hoopMesh.add(knot);

      this.frenchKnots.push({
        mesh: knot,
        delay: 5.8 + (k / knotCount) * 1.2
      });
    }

    // =========================================================================
    // 4. HILO ACTIVO
    // =========================================================================
    const activeThreadMat = new THREE.MeshPhysicalMaterial({
      color: 0xe11d48,
      roughness: 0.2,
      metalness: 0.2,
      clearcoat: 0.95,
      sheen: 1.0,
      sheenColor: new THREE.Color(0xfef08a),
      emissive: 0xe11d48,
      emissiveIntensity: 0.4
    });

    const dummyCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(11.2, 4.8, 2.0),
      new THREE.Vector3(7.5, 2.0, 1.0),
      embroideryCenter.clone()
    ]);
    const activeGeo = new THREE.TubeGeometry(dummyCurve, 30, 0.075, 8, false);
    this.activeThread = new THREE.Mesh(activeGeo, activeThreadMat);
    this.group.add(this.activeThread);

    this.group.rotation.x = 0.05;
    this.group.rotation.y = -0.05;
  }

  update(deltaTime) {
    super.update(deltaTime);

    const t = this.time;
    const embroideryCenter = new THREE.Vector3(5.0, -0.2, 0);

    const spoolSpeed = 1.0 + Math.min(12.0, t * 2.2);
    if (this.spool) {
      this.spool.rotation.y += deltaTime * spoolSpeed;
    }

    let currentNeedleTarget = embroideryCenter.clone().add(new THREE.Vector3(0, 0, 0.8));

    this.allStitches.forEach((st) => {
      if (t >= st.delay) {
        const sProg = Math.min(1.0, (t - st.delay) / 0.35);
        const ease = sProg < 0.65
          ? Math.pow(sProg / 0.65, 2) * 1.2
          : 1.2 - Math.sin((sProg - 0.65) / 0.35 * Math.PI * 0.5) * 0.2;

        st.mesh.scale.set(ease, ease, ease);

        if (sProg < 1.0) {
          currentNeedleTarget.copy(st.worldTarget);
        }
      }
    });

    this.frenchKnots.forEach((knot) => {
      if (t >= knot.delay) {
        const kProg = Math.min(1.0, (t - knot.delay) / 0.35);
        const easeK = kProg < 0.7
          ? Math.pow(kProg / 0.7, 2) * 1.22
          : 1.22 - Math.sin((kProg - 0.7) / 0.3 * Math.PI * 0.5) * 0.22;

        knot.mesh.scale.set(easeK, easeK, easeK);
      }
    });

    if (this.needleMesh) {
      const stitchFrequency = 6.0 + Math.min(14.0, t * 2.5);
      const needleDive = Math.sin(t * stitchFrequency) * 0.35;
      const targetPos = currentNeedleTarget.clone().add(new THREE.Vector3(0, 0, 0.6 - needleDive));

      this.needleMesh.position.lerp(targetPos, 0.25);
      this.needleMesh.rotation.z = Math.PI / 4 + Math.sin(t * 8.0) * 0.25;
    }

    if (this.activeThread && this.spool && this.needleMesh) {
      const spoolPos = this.spool.position.clone();
      const needlePos = this.needleMesh.position.clone();
      const mid1 = new THREE.Vector3().lerpVectors(spoolPos, needlePos, 0.35)
        .add(new THREE.Vector3(Math.sin(t * 6.0) * 0.35, 0.5, 0.5));
      const mid2 = new THREE.Vector3().lerpVectors(spoolPos, needlePos, 0.7)
        .add(new THREE.Vector3(-Math.cos(t * 5.0) * 0.3, -0.3, 0.3));

      const dynCurve = new THREE.CatmullRomCurve3([spoolPos, mid1, mid2, needlePos]);
      this.activeThread.geometry.dispose();
      this.activeThread.geometry = new THREE.TubeGeometry(dynCurve, 24, 0.075, 8, false);
    }

    if (this.hoopMesh) {
      const bob = Math.sin(t * 1.4) * 0.06;
      this.hoopMesh.position.y = -0.2 + bob;
      this.hoopMesh.rotation.z = Math.sin(t * 0.8) * 0.03;
    }

    this.group.rotation.y = -0.05 + Math.sin(t * 0.1) * 0.025;
  }
}
