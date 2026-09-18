/**
 * Slide 04: TRENZAR — Academia + Industria + Ciudad (Tres Fuerzas)
 * Concepto: "Academia + Industria + Ciudad se trenzan en una sola cuerda"
 * Acción: TRENZAR
 * 
 * COREOGRAFÍA PROCEDURAL & COMPOSICIÓN EDITORIAL:
 * 1. ZONA FOTOGRÁFICA HERO DEDICADA:
 *    - Fotografía arquitectónica (`slide04_academia_industria.jpg`) montada en bisel pizarra en el cuadrante superior derecho.
 * 2. TRES OBJETOS DE ORIGEN CON IDENTIDAD TEXTIL (EN ZONA FRONTAL DESPEJADA):
 *    - ACADEMIA: Retazo textil azul cobalto/marfil con pespunte perimetral y textura espiguilla.
 *    - INDUSTRIA: Carrete artesanal de madera torneada con alma de latón e hilo enrollado mostaza.
 *    - CIUDAD: Fragmento textil coral/cyan con cuadrícula de costura urbana.
 * 3. TRENZADO TRIDIMENSIONAL DE 3 CABOS:
 *    - Los hilos nacen de sus respectivos objetos y se entrelazan en una trenza voluminosa y táctil
 *      que fluye verticalmente por el flanco de la composición sin tapar las caras ni el texto.
 */
import * as THREE from 'three';
import { BaseSlide } from '../../core/BaseSlide.js';
import { createTextileMaterial, createWeaveTexture, createPatchworkTexture } from '../../core/utils/textileMaterials.js';

export class Slide04 extends BaseSlide {
  constructor() {
    super('academia-industria-ciudad', 'Tres Fuerzas - Objetos de Origen & Trenza');
    this.sourceObjects = [];
    this.braidStrands = [];
    this.photoFrame = null;
    this.strandSteps = 70;
  }

  buildScene() {
    this.sourceObjects = [];
    this.braidStrands = [];

    // Zona editorial de la fotografía (Cuadrante Derecho)
    const photoCenter = new THREE.Vector3(5.4, 0.4, 0);

    // =========================================================================
    // 1. PHOTO STAGE 3D: FOTOGRAFÍA HERO DE LA CUMBRE
    // =========================================================================
    const frameGroup = new THREE.Group();
    frameGroup.position.copy(photoCenter);

    const photoW = 10.2;
    const photoH = 6.4;

    const frameMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e293b,
      roughness: 0.35,
      metalness: 0.85,
      clearcoat: 0.6
    });

    const borderThick = 0.22;
    const borderDepth = 0.3;
    const tBar = new THREE.Mesh(new THREE.BoxGeometry(photoW + borderThick * 2, borderThick, borderDepth), frameMat);
    tBar.position.set(0, photoH / 2 + borderThick / 2, 0);
    const bBar = new THREE.Mesh(new THREE.BoxGeometry(photoW + borderThick * 2, borderThick, borderDepth), frameMat);
    bBar.position.set(0, -photoH / 2 - borderThick / 2, 0);
    const lBar = new THREE.Mesh(new THREE.BoxGeometry(borderThick, photoH, borderDepth), frameMat);
    lBar.position.set(-photoW / 2 - borderThick / 2, 0, 0);
    const rBar = new THREE.Mesh(new THREE.BoxGeometry(borderThick, photoH, borderDepth), frameMat);
    rBar.position.set(photoW / 2 + borderThick / 2, 0, 0);

    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x0f172a, transparent: true, opacity: 0.35 });
    const backShadow = new THREE.Mesh(new THREE.PlaneGeometry(photoW + 0.6, photoH + 0.6), shadowMat);
    backShadow.position.set(0.15, -0.15, -0.06);

    frameGroup.add(tBar, bBar, lBar, rBar, backShadow);

    const photoMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    if (typeof document !== 'undefined') {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(
        './assets/slide04_academia_industria.jpg',
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          photoMat.map = tex;
          photoMat.needsUpdate = true;
        },
        undefined,
        () => { photoMat.color.setHex(0x1e293b); }
      );
    } else {
      photoMat.color.setHex(0x1e293b);
    }

    const photoMesh = new THREE.Mesh(new THREE.PlaneGeometry(photoW, photoH), photoMat);
    photoMesh.position.set(0, 0, 0.04);
    frameGroup.add(photoMesh);

    this.photoFrame = frameGroup;
    this.group.add(this.photoFrame);

    // =========================================================================
    // 2. TRES OBJETOS DE ORIGEN EN FLANCO DINÁMICO
    // =========================================================================

    // A) OBJETO ACADEMIA: Retazo textil cobalto
    const academiaGroup = new THREE.Group();
    const matAcademia = createTextileMaterial({
      color: 0x1d4ed8,
      sheenColor: 0x93c5fd,
      roughness: 0.5,
      map: createPatchworkTexture({ baseColor: '#1d4ed8', accentColor: '#3b82f6', pattern: 'houndstooth' }),
      bumpScale: 0.04
    });
    const patchAcademia = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.8), matAcademia);
    const stitchAcademia = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.PlaneGeometry(2.4, 1.8)),
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 })
    );
    stitchAcademia.position.z = 0.02;
    academiaGroup.add(patchAcademia, stitchAcademia);
    academiaGroup.position.set(-1.0, 4.2, 0.8);
    academiaGroup.rotation.z = 0.12;
    this.group.add(academiaGroup);

    // B) OBJETO INDUSTRIA: Carrete de madera torneada
    const industriaGroup = new THREE.Group();
    const woodMat = new THREE.MeshPhysicalMaterial({
      color: 0x475569,
      roughness: 0.35,
      metalness: 0.7,
      clearcoat: 0.8
    });
    const spoolThreadMat = createTextileMaterial({
      color: 0xd97706,
      sheenColor: 0xfef08a,
      roughness: 0.4,
      map: createWeaveTexture({ size: 128, type: 'corduroy', density: 16 }),
      bumpScale: 0.04
    });
    const spoolTop = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.2, 16), woodMat);
    spoolTop.position.set(0, 0.7, 0);
    const spoolBot = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.2, 16), woodMat);
    spoolBot.position.set(0, -0.7, 0);
    const spoolCore = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 1.2, 16), spoolThreadMat);
    industriaGroup.add(spoolTop, spoolBot, spoolCore);
    industriaGroup.position.set(1.4, 4.5, 0.7);
    industriaGroup.rotation.z = -0.2;
    industriaGroup.rotation.x = 0.3;
    this.group.add(industriaGroup);

    // C) OBJETO CIUDAD: Fragmento textil coral
    const ciudadGroup = new THREE.Group();
    const matCiudad = createTextileMaterial({
      color: 0xe11d48,
      sheenColor: 0x0284c7,
      roughness: 0.45,
      map: createPatchworkTexture({ baseColor: '#e11d48', accentColor: '#f43f5e', pattern: 'grid' }),
      bumpScale: 0.04
    });
    const patchCiudad = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 2.5), matCiudad);
    const stitchCiudad = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.PlaneGeometry(2.1, 2.5)),
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 })
    );
    stitchCiudad.position.z = 0.02;
    ciudadGroup.add(patchCiudad, stitchCiudad);
    ciudadGroup.position.set(-2.6, 1.8, 0.8);
    ciudadGroup.rotation.z = -0.15;
    this.group.add(ciudadGroup);

    this.sourceObjects = [
      { group: academiaGroup, origin: new THREE.Vector3(-1.0, 4.2, 0.8), color: 0x1d4ed8 },
      { group: industriaGroup, origin: new THREE.Vector3(1.4, 4.5, 0.7), color: 0xd97706 },
      { group: ciudadGroup, origin: new THREE.Vector3(-2.6, 1.8, 0.8), color: 0xe11d48 }
    ];

    // =========================================================================
    // 3. TRES HEBRAS & TRENZADO DE TRES CABOS ESCULPIDO
    // =========================================================================
    const strandMaterials = [
      createTextileMaterial({ color: 0x1d4ed8, sheenColor: 0x93c5fd, roughness: 0.4, bumpScale: 0.05 }),
      createTextileMaterial({ color: 0xd97706, sheenColor: 0xfef08a, roughness: 0.4, bumpScale: 0.05 }),
      createTextileMaterial({ color: 0xe11d48, sheenColor: 0x38bdf8, roughness: 0.4, bumpScale: 0.05 })
    ];

    for (let k = 0; k < 3; k++) {
      const dummyGeo = new THREE.BufferGeometry();
      const mesh = new THREE.Mesh(dummyGeo, strandMaterials[k]);
      this.group.add(mesh);

      this.braidStrands.push({
        mesh,
        mat: strandMaterials[k],
        idx: k,
        phase: (k / 3) * Math.PI * 2
      });
    }

    this.group.rotation.x = 0.05;
    this.group.rotation.y = -0.06;
  }

  update(deltaTime) {
    super.update(deltaTime);

    const t = this.time;
    const braidAxisCenter = new THREE.Vector3(-0.4, -1.8, 0.9);

    const convergeProgress = Math.min(1.0, Math.max(0, (t - 1.0) / 3.0));
    const braidProgress = Math.min(1.0, Math.max(0, (t - 3.0) / 3.0));

    const easeBraid = braidProgress * braidProgress * (3 - 2 * braidProgress);

    this.sourceObjects.forEach((so, idx) => {
      const bob = Math.sin(t * 1.6 + idx * 1.3) * 0.08;
      so.group.position.y = so.origin.y + bob;
      so.group.rotation.y = Math.sin(t * 1.2 + idx) * 0.06;
    });

    this.braidStrands.forEach((strand) => {
      const k = strand.idx;
      const origin = this.sourceObjects[k].origin;
      const pts = [];

      for (let s = 0; s <= this.strandSteps; s++) {
        const u = s / this.strandSteps;

        let initX = origin.x;
        let initY = THREE.MathUtils.lerp(origin.y, -6.8, u);
        let initZ = origin.z;

        if (k === 0) {
          initX += Math.sin(u * Math.PI * 2 + t * 2.2) * 1.2 * (1 - easeBraid);
          initZ += Math.sin(u * Math.PI * 3 + t * 2.0) * 0.5 * (1 - easeBraid);
        } else if (k === 1) {
          initX += Math.cos(u * Math.PI * 2.5 + t * 2.0) * 1.0 * (1 - easeBraid);
          initZ += Math.cos(u * Math.PI * 2 + t * 2.5) * 0.6 * (1 - easeBraid);
        } else {
          initX += Math.sin(u * Math.PI * 1.8 + t * 2.4) * 1.3 * (1 - easeBraid);
          initZ += Math.sin(u * Math.PI * 2.2 + t * 1.8) * 0.7 * (1 - easeBraid);
        }

        const turns = 3.6;
        const braidAngle = (u * Math.PI * 2 * turns) + (t * 1.8) + strand.phase;
        const braidRadius = 0.62 * easeBraid;

        const targetBraidX = braidAxisCenter.x + Math.sin(braidAngle) * (braidRadius * 1.35);
        const targetBraidY = THREE.MathUtils.lerp(origin.y - 1.2, -6.8, u);
        const targetBraidZ = braidAxisCenter.z + Math.cos(braidAngle * 2.0) * (braidRadius * 0.75);

        const curX = THREE.MathUtils.lerp(initX, targetBraidX, easeBraid);
        const curY = THREE.MathUtils.lerp(initY, targetBraidY, easeBraid);
        const curZ = THREE.MathUtils.lerp(initZ, targetBraidZ, easeBraid);

        const fiberJitter = Math.sin(u * 28.0 + k * 5.0) * 0.02 * easeBraid;

        pts.push(new THREE.Vector3(curX + fiberJitter, curY, curZ + fiberJitter));
      }

      const curve = new THREE.CatmullRomCurve3(pts);
      strand.mesh.geometry.dispose();
      strand.mesh.geometry = new THREE.TubeGeometry(curve, this.strandSteps, 0.22, 10, false);
    });

    if (this.photoFrame) {
      this.photoFrame.position.y = 0.4 + Math.sin(t * 1.2) * 0.05;
    }

    this.group.rotation.y = -0.06 + Math.sin(t * 0.1) * 0.025;
  }
}
