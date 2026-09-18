/**
 * Slide 08: EXPLORAR CAMINOS — Patrón de Costura & Exploración de Nuevas Rutas
 * Concepto: "La experiencia construye el camino. Las nuevas generaciones descubren nuevas rutas."
 * Acción: EXPLORAR CAMINOS
 * 
 * COREOGRAFÍA PROCEDURAL & MOTION DESIGN:
 * 1. LIENZO BASE DE PATRÓN DE SASTRE & PHOTO STAGE HERO (X = 4.8):
 *    - Lienzo de lino crema con marcas de tiza de patronaje.
 *    - Fotografía arquitectónica (`slide08_espacio_rutas.jpg`) montada como parche textil cosido en el cuadrante superior derecho.
 * 2. RUTA PRINCIPAL DE LA EXPERIENCIA:
 *    - Cordón estructural azul noche que marca el camino consolidado.
 * 3. CUATRO NUEVAS RUTAS EXPLORATORIAS:
 *    - La aguja ágil explora y traza 4 caminos vivos (Cyan, Coral, Ámbar, Esmeralda) que expanden las posibilidades del espacio.
 *    - Separación segura y holgada respecto al texto.
 */
import * as THREE from 'three';
import { BaseSlide } from '../../core/BaseSlide.js';
import { createTextileMaterial, createPatchworkTexture } from '../../core/utils/textileMaterials.js';

export class Slide08 extends BaseSlide {
  constructor() {
    super('nuevas-rutas', 'Patrón de Costura & Nuevas Rutas');
    this.canvasMesh = null;
    this.photoPatch = null;
    this.mainPathThread = null;
    this.branchRoutes = [];
    this.explorerNeedle = null;
  }

  buildScene() {
    this.branchRoutes = [];

    const rightCenter = new THREE.Vector3(4.8, 0, 0);

    // =========================================================================
    // 1. LIENZO BASE DE PATRÓN DE SASTRE
    // =========================================================================
    const canvasW = 20.0;
    const canvasH = 13.2;
    const canvasGeo = new THREE.PlaneGeometry(canvasW, canvasH, 40, 30);

    const canvasMat = createTextileMaterial({
      color: 0xfbf9f5,
      sheenColor: 0xffffff,
      roughness: 0.7,
      map: createPatchworkTexture({ baseColor: '#fbf9f5', accentColor: '#e2e8f0', pattern: 'grid' }),
      bumpScale: 0.03
    });

    this.canvasMesh = new THREE.Mesh(canvasGeo, canvasMat);
    this.canvasMesh.position.copy(rightCenter).add(new THREE.Vector3(0, 0, -0.6));
    this.group.add(this.canvasMesh);

    const bBorder = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.PlaneGeometry(canvasW, canvasH)),
      new THREE.LineBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.5 })
    );
    this.canvasMesh.add(bBorder);

    // =========================================================================
    // 2. PHOTO STAGE: PARCHE FOTOGRÁFICO HERO (X = +3.2)
    // =========================================================================
    const patchGroup = new THREE.Group();
    patchGroup.position.copy(rightCenter).add(new THREE.Vector3(3.2, 1.6, 0.08));

    const photoW = 9.2;
    const photoH = 5.8;

    const photoMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    if (typeof document !== 'undefined') {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(
        './assets/slide08_espacio_rutas.jpg',
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

    const photoPlane = new THREE.Mesh(new THREE.PlaneGeometry(photoW, photoH), photoMat);
    patchGroup.add(photoPlane);

    const stitchBorderGeo = new THREE.EdgesGeometry(new THREE.PlaneGeometry(photoW, photoH));
    const stitchBorderMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
    const stitchBorder = new THREE.LineSegments(stitchBorderGeo, stitchBorderMat);
    stitchBorder.position.z = 0.02;
    patchGroup.add(stitchBorder);

    this.photoPatch = patchGroup;
    this.group.add(this.photoPatch);

    // =========================================================================
    // 3. CAMINO PRINCIPAL (CORDÓN AZUL MARINO ESTRUCTURAL)
    // =========================================================================
    const mainPts = [
      new THREE.Vector3(-9.4, -4.8, 0.1).add(rightCenter),
      new THREE.Vector3(-5.2, -3.4, 0.15).add(rightCenter),
      new THREE.Vector3(-1.8, -1.8, 0.2).add(rightCenter),
      new THREE.Vector3(0.0, 0.0, 0.25).add(rightCenter)
    ];

    const mainCurve = new THREE.CatmullRomCurve3(mainPts);
    const mainThreadMat = createTextileMaterial({
      color: 0x0f172a,
      sheenColor: 0x93c5fd,
      roughness: 0.4,
      bumpScale: 0.04
    });
    const mainGeo = new THREE.TubeGeometry(mainCurve, 30, 0.18, 8, false);
    this.mainPathThread = new THREE.Mesh(mainGeo, mainThreadMat);
    this.group.add(this.mainPathThread);

    // Nódulo de bifurcación
    const hubMat = new THREE.MeshPhysicalMaterial({ color: 0xdfb76c, metalness: 0.9, roughness: 0.15, clearcoat: 1.0 });
    const hubMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.14, 16), hubMat);
    hubMesh.rotation.x = Math.PI / 2;
    hubMesh.position.copy(rightCenter).add(new THREE.Vector3(0, 0, 0.28));
    this.group.add(hubMesh);

    // =========================================================================
    // 4. CUATRO NUEVAS RUTAS DE EXPLORACIÓN
    // =========================================================================
    const routeProfiles = [
      {
        color: 0x0284c7,
        pts: [
          new THREE.Vector3(0, 0, 0.25).add(rightCenter),
          new THREE.Vector3(1.2, 3.4, 0.3).add(rightCenter),
          new THREE.Vector3(4.8, 4.8, 0.35).add(rightCenter),
          new THREE.Vector3(8.5, 4.4, 0.4).add(rightCenter)
        ],
        delay: 1.5,
        duration: 2.0
      },
      {
        color: 0xe11d48,
        pts: [
          new THREE.Vector3(0, 0, 0.25).add(rightCenter),
          new THREE.Vector3(1.8, -2.6, 0.3).add(rightCenter),
          new THREE.Vector3(6.2, -4.0, 0.35).add(rightCenter),
          new THREE.Vector3(9.0, -2.4, 0.4).add(rightCenter)
        ],
        delay: 2.8,
        duration: 2.0
      },
      {
        color: 0xd97706,
        pts: [
          new THREE.Vector3(0, 0, 0.25).add(rightCenter),
          new THREE.Vector3(-1.4, 2.2, 0.3).add(rightCenter),
          new THREE.Vector3(0.8, 1.2, 0.35).add(rightCenter),
          new THREE.Vector3(4.2, -0.6, 0.4).add(rightCenter)
        ],
        delay: 4.0,
        duration: 2.0
      },
      {
        color: 0x059669,
        pts: [
          new THREE.Vector3(0, 0, 0.25).add(rightCenter),
          new THREE.Vector3(2.8, -1.0, 0.3).add(rightCenter),
          new THREE.Vector3(6.8, 0.4, 0.35).add(rightCenter),
          new THREE.Vector3(9.4, 1.4, 0.4).add(rightCenter)
        ],
        delay: 5.2,
        duration: 2.0
      }
    ];

    routeProfiles.forEach((rp, idx) => {
      const mat = createTextileMaterial({
        color: rp.color,
        sheenColor: 0xffffff,
        roughness: 0.4,
        bumpScale: 0.04
      });

      const dummyGeo = new THREE.BufferGeometry();
      const mesh = new THREE.Mesh(dummyGeo, mat);
      this.group.add(mesh);

      this.branchRoutes.push({
        mesh,
        mat,
        rp,
        fullCurve: new THREE.CatmullRomCurve3(rp.pts),
        idx
      });
    });

    const needleMat = new THREE.MeshPhysicalMaterial({ color: 0xf1f5f9, metalness: 0.95, roughness: 0.1, clearcoat: 1.0 });
    const nGroup = new THREE.Group();
    const nBody = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.08, 1.8, 8), needleMat);
    const nTip = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.5, 8), needleMat);
    nTip.position.set(0, -1.15, 0);
    nGroup.add(nBody, nTip);
    nGroup.rotation.z = Math.PI / 4;
    this.explorerNeedle = nGroup;
    this.group.add(this.explorerNeedle);

    this.group.rotation.x = 0.05;
    this.group.rotation.y = -0.05;
  }

  update(deltaTime) {
    super.update(deltaTime);

    const t = this.time;
    const rightCenter = new THREE.Vector3(4.8, 0, 0);
    let activeNeedlePos = new THREE.Vector3(0, 0, 0.4).add(rightCenter);
    let isNeedleActive = false;

    this.branchRoutes.forEach((br) => {
      const rp = br.rp;
      if (t >= rp.delay) {
        const rProg = Math.min(1.0, (t - rp.delay) / rp.duration);
        const ease = rProg * rProg * (3 - 2 * rProg);

        const subPts = [];
        const segCount = Math.max(3, Math.floor(24 * Math.max(0.05, ease)));

        for (let s = 0; s <= segCount; s++) {
          const u = (s / 24) * ease;
          const pt = br.fullCurve.getPoint(Math.min(1.0, u));
          pt.z += Math.sin(u * Math.PI * 4 + t * 3.0 + br.idx) * 0.04;
          subPts.push(pt);
        }

        if (subPts.length >= 2) {
          const subCurve = new THREE.CatmullRomCurve3(subPts);
          br.mesh.geometry.dispose();
          br.mesh.geometry = new THREE.TubeGeometry(subCurve, segCount, 0.11, 8, false);

          if (rProg < 0.98 && !isNeedleActive) {
            activeNeedlePos.copy(subPts[subPts.length - 1]);
            activeNeedlePos.z += 0.25 + Math.sin(t * 12.0 + br.idx) * 0.12;
            isNeedleActive = true;
          }
        }
      }
    });

    if (this.explorerNeedle) {
      if (t < 1.4) {
        const mainProg = Math.min(1.0, t / 1.4);
        const mainCurve = this.mainPathThread.geometry.parameters.path;
        if (mainCurve) {
          const p = mainCurve.getPoint(mainProg);
          this.explorerNeedle.position.copy(p).add(new THREE.Vector3(0, 0, 0.25));
        }
      } else if (isNeedleActive) {
        this.explorerNeedle.position.lerp(activeNeedlePos, 0.22);
        this.explorerNeedle.visible = true;
      } else {
        this.explorerNeedle.visible = true;
        this.explorerNeedle.position.y += Math.sin(t * 1.5) * 0.005;
      }
    }

    if (this.photoPatch) {
      this.photoPatch.position.z = 0.08 + Math.sin(t * 1.4) * 0.03;
    }

    this.group.rotation.y = -0.05 + Math.sin(t * 0.1) * 0.025;
  }
}
