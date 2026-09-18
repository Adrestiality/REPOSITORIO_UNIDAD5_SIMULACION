/**
 * Slide 02: AUDITORIO - De la Toga Académica al Espacio de Encuentro
 * Concepto: "GRADUACIÓN → TOGA → TELÓN → AUDITORIO"
 * "El auditorio que conocemos para grados puede abrirse a algo mucho más grande."
 * 
 * COREOGRAFÍA PROCEDURAL & PHOTO STAGE HERO (CERO CLIPPING):
 * 1. PHOTO STAGE HERO EXPANDIDO:
 *    - Fotografía arquitectónica de gran formato (`slide02_grados.jpg`) con marco de bisel pizarra y sombra.
 * 2. TELONES DE TOGA ACADÉMICA (Z = +1.2):
 *    - Dos piezas de paño académico (azul noche con estola dorada) ubicadas estrictamente en Z = +1.2
 *      para erradicar al 100% cualquier posibilidad de clipping o intersección coplanar.
 * 3. AGUJA DE LIBERACIÓN:
 *    - La aguja desciende, perfora y libera la costura central dorada.
 * 4. APERTURA TEATRAL & ENMARCADO PERMANENTE:
 *    - Los telones se abren y se recogen lateralmente hacia los extremos exteriores con pliegues comprimidos.
 *    - La fotografía del auditorio queda totalmente despejada, luminosa y protagónica.
 */
import * as THREE from 'three';
import { BaseSlide } from '../../core/BaseSlide.js';
import { createTextileMaterial, createWeaveTexture } from '../../core/utils/textileMaterials.js';

export class Slide02 extends BaseSlide {
  constructor() {
    super('auditorio-grados', 'De la Toga Académica al Espacio de Encuentro');
    this.photoFrame = null;
    this.leftCurtain = null;
    this.rightCurtain = null;
    this.leftBasePos = null;
    this.rightBasePos = null;
    this.needleMesh = null;
    this.stitchThread = null;
    this.segW = 40;
    this.segH = 30;
  }

  buildScene() {
    // Centro del Photo Stage desplazado a la derecha
    const photoCenter = new THREE.Vector3(4.5, 0, 0);

    // Escala grande y protagónica
    const photoW = 13.0;
    const photoH = 8.2;

    // =========================================================================
    // 1. PHOTO STAGE: MONTAJE ARQUITECTÓNICO HERO (Z = 0.0)
    // =========================================================================
    const frameGroup = new THREE.Group();
    frameGroup.position.copy(photoCenter);

    const frameMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e293b,
      roughness: 0.3,
      metalness: 0.85,
      clearcoat: 0.7
    });

    const borderThick = 0.25;
    const borderDepth = 0.35;
    const tBar = new THREE.Mesh(new THREE.BoxGeometry(photoW + borderThick * 2, borderThick, borderDepth), frameMat);
    tBar.position.set(0, photoH / 2 + borderThick / 2, 0);
    const bBar = new THREE.Mesh(new THREE.BoxGeometry(photoW + borderThick * 2, borderThick, borderDepth), frameMat);
    bBar.position.set(0, -photoH / 2 - borderThick / 2, 0);
    const lBar = new THREE.Mesh(new THREE.BoxGeometry(borderThick, photoH, borderDepth), frameMat);
    lBar.position.set(-photoW / 2 - borderThick / 2, 0, 0);
    const rBar = new THREE.Mesh(new THREE.BoxGeometry(borderThick, photoH, borderDepth), frameMat);
    rBar.position.set(photoW / 2 + borderThick / 2, 0, 0);

    // Sombra profunda
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x070b12, transparent: true, opacity: 0.45 });
    const backShadow = new THREE.Mesh(new THREE.PlaneGeometry(photoW + 0.8, photoH + 0.8), shadowMat);
    backShadow.position.set(0.2, -0.2, -0.06);

    frameGroup.add(tBar, bBar, lBar, rBar, backShadow);

    // Plano de la fotografía en Z = 0.05
    const photoMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide
    });

    if (typeof document !== 'undefined') {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(
        './assets/slide02_grados.jpg',
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          photoMat.map = tex;
          photoMat.needsUpdate = true;
        },
        undefined,
        () => {
          photoMat.color.setHex(0x1e293b);
        }
      );
    } else {
      photoMat.color.setHex(0x1e293b);
    }

    const photoPlane = new THREE.Mesh(new THREE.PlaneGeometry(photoW, photoH), photoMat);
    photoPlane.position.set(0, 0, 0.05);
    frameGroup.add(photoPlane);

    this.photoFrame = frameGroup;
    this.group.add(this.photoFrame);

    // =========================================================================
    // 2. TELONES DE TOGA / ESTOLA ACADÉMICA (Z = +1.15 — CERO CLIPPING)
    // =========================================================================
    const curtainW = 7.4;
    const curtainH = 9.4;

    const curtainMatLeft = createTextileMaterial({
      color: 0x0f172a,      // Azul noche académico
      sheenColor: 0x38bdf8, // Sheen cyan
      roughness: 0.55,
      clearcoat: 0.25,
      map: createWeaveTexture({ size: 128, type: 'plain', density: 16 }),
      bumpScale: 0.04
    });

    const curtainMatRight = createTextileMaterial({
      color: 0x0f172a,      // Azul noche académico
      sheenColor: 0xf43f5e, // Sheen coral
      roughness: 0.55,
      clearcoat: 0.25,
      map: createWeaveTexture({ size: 128, type: 'plain', density: 16 }),
      bumpScale: 0.04
    });

    const stoleMat = createTextileMaterial({
      color: 0xf59e0b,      // Oro ceremonial
      sheenColor: 0xfef08a,
      roughness: 0.25,
      clearcoat: 0.9,
      bumpScale: 0.02
    });

    // A) Telón Izquierdo
    const geoLeft = new THREE.PlaneGeometry(curtainW, curtainH, this.segW, this.segH);
    this.leftBasePos = geoLeft.attributes.position.array.slice();
    this.leftCurtain = new THREE.Mesh(geoLeft, curtainMatLeft);
    this.leftCurtain.position.set(photoCenter.x - curtainW / 2 + 0.1, photoCenter.y, 1.15);
    this.group.add(this.leftCurtain);

    const stoleLeft = new THREE.Mesh(new THREE.PlaneGeometry(0.4, curtainH), stoleMat);
    stoleLeft.position.set(curtainW / 2 - 0.2, 0, 0.025);
    this.leftCurtain.add(stoleLeft);

    // B) Telón Derecho
    const geoRight = new THREE.PlaneGeometry(curtainW, curtainH, this.segW, this.segH);
    this.rightBasePos = geoRight.attributes.position.array.slice();
    this.rightCurtain = new THREE.Mesh(geoRight, curtainMatRight);
    this.rightCurtain.position.set(photoCenter.x + curtainW / 2 - 0.1, photoCenter.y, 1.15);
    this.group.add(this.rightCurtain);

    const stoleRight = new THREE.Mesh(new THREE.PlaneGeometry(0.4, curtainH), stoleMat);
    stoleRight.position.set(-curtainW / 2 + 0.2, 0, 0.025);
    this.rightCurtain.add(stoleRight);

    // =========================================================================
    // 3. AGUJA DE LIBERACIÓN & HILO DORADO CENTRAL
    // =========================================================================
    const needleGroup = new THREE.Group();
    const needleMat = new THREE.MeshPhysicalMaterial({
      color: 0xf1f5f9,
      metalness: 0.95,
      roughness: 0.08,
      clearcoat: 1.0
    });
    const nBody = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.08, 2.6, 12), needleMat);
    const nTip = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.65, 12), needleMat);
    nTip.position.set(0, -1.6, 0);
    needleGroup.add(nBody, nTip);
    needleGroup.position.set(photoCenter.x, 6.5, 2.2);
    this.needleMesh = needleGroup;
    this.group.add(this.needleMesh);

    // Hilo dorado central
    const threadMat = new THREE.LineBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.95,
      linewidth: 3
    });
    const threadGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(photoCenter.x, 4.2, 1.25),
      new THREE.Vector3(photoCenter.x, -4.2, 1.25)
    ]);
    this.stitchThread = new THREE.Line(threadGeo, threadMat);
    this.group.add(this.stitchThread);

    this.group.rotation.x = 0.04;
    this.group.rotation.y = -0.05;
  }

  update(deltaTime) {
    super.update(deltaTime);

    const t = this.time;
    const photoCenter = new THREE.Vector3(4.5, 0, 0);
    const curtainW = 7.4;

    // Timeline:
    // 0.0s - 1.2s: Telones cerrados en reposo solemne.
    // 1.2s - 2.4s: Aguja desciende por la costura central liberando la unión.
    // 2.2s - 5.5s: Gran apertura lateral con drapeado teatral y pliegues recogidos hacia afuera.
    // 5.5s+: Telones recogidos a los costados enmarcando la fotografía nítida y protagónica.

    const openProgress = Math.min(1.0, Math.max(0, (t - 2.0) / 2.8));
    const easeOpen = openProgress < 0.7
      ? Math.pow(openProgress / 0.7, 2) * 1.05
      : 1.05 - Math.sin((openProgress - 0.7) / 0.3 * Math.PI * 0.5) * 0.05;

    // 1. Cinemática de la aguja
    if (this.needleMesh) {
      if (t < 1.1) {
        this.needleMesh.position.set(photoCenter.x, 6.5, 2.2);
        this.needleMesh.visible = false;
      } else if (t < 2.3) {
        this.needleMesh.visible = true;
        const nProg = (t - 1.1) / 1.2;
        const curY = THREE.MathUtils.lerp(5.0, -5.0, nProg);
        const curZ = 1.35 + Math.sin(nProg * Math.PI * 4) * 0.25;
        this.needleMesh.position.set(photoCenter.x, curY, curZ);
        this.needleMesh.rotation.z = Math.sin(t * 10.0) * 0.2;
      } else {
        this.needleMesh.position.y += deltaTime * 6.0;
        if (this.needleMesh.position.y > 12.0) {
          this.needleMesh.visible = false;
        }
      }
    }

    // Desvanecer hilo central
    if (this.stitchThread) {
      this.stitchThread.material.opacity = Math.max(0, 0.95 - openProgress * 1.6);
    }

    // 2. Apertura del Telón Izquierdo (se desplaza y se recoge a la izquierda)
    if (this.leftCurtain) {
      const closedX = photoCenter.x - curtainW / 2 + 0.1;
      const openedX = photoCenter.x - curtainW - 0.8;
      this.leftCurtain.position.x = THREE.MathUtils.lerp(closedX, openedX, Math.min(1.0, easeOpen));
      this.leftCurtain.position.z = 1.15; // Z constante, cero penetración

      const pos = this.leftCurtain.geometry.attributes.position.array;
      const base = this.leftBasePos;
      const count = pos.length / 3;

      for (let i = 0; i < count; i++) {
        const bx = base[i * 3];
        const by = base[i * 3 + 1];

        // Pliegues verticales de drapeado
        const foldFreq = 2.4 + easeOpen * 2.0;
        const foldAmp = 0.25 + (1.0 - easeOpen * 0.4) * 0.15;
        const pleats = Math.sin(bx * foldFreq + (1.0 - easeOpen) * 2.0) * foldAmp;

        const wave = Math.sin(by * 0.6 + t * 2.2) * (0.15 * (1.0 - openProgress));
        const breeze = Math.sin(bx * 0.8 + t * 1.4) * (0.06 * easeOpen);

        // Compresión horizontal al recogerse
        const compress = bx * (1.0 - easeOpen * 0.4);

        pos[i * 3] = compress;
        pos[i * 3 + 1] = by;
        // z siempre estrictamente positivo hacia el visor
        pos[i * 3 + 2] = Math.max(0.0, pleats + wave + breeze);
      }
      this.leftCurtain.geometry.attributes.position.needsUpdate = true;
      this.leftCurtain.geometry.computeVertexNormals();
    }

    // 3. Apertura del Telón Derecho (se desplaza y se recoge a la derecha)
    if (this.rightCurtain) {
      const closedX = photoCenter.x + curtainW / 2 - 0.1;
      const openedX = photoCenter.x + curtainW + 0.8;
      this.rightCurtain.position.x = THREE.MathUtils.lerp(closedX, openedX, Math.min(1.0, easeOpen));
      this.rightCurtain.position.z = 1.15;

      const pos = this.rightCurtain.geometry.attributes.position.array;
      const base = this.rightBasePos;
      const count = pos.length / 3;

      for (let i = 0; i < count; i++) {
        const bx = base[i * 3];
        const by = base[i * 3 + 1];

        const foldFreq = 2.4 + easeOpen * 2.0;
        const foldAmp = 0.25 + (1.0 - easeOpen * 0.4) * 0.15;
        const pleats = Math.cos(bx * foldFreq - (1.0 - easeOpen) * 2.0) * foldAmp;

        const wave = Math.cos(by * 0.6 + t * 2.2) * (0.15 * (1.0 - openProgress));
        const breeze = Math.cos(bx * 0.8 + t * 1.4) * (0.06 * easeOpen);

        const compress = bx * (1.0 - easeOpen * 0.4);

        pos[i * 3] = compress;
        pos[i * 3 + 1] = by;
        pos[i * 3 + 2] = Math.max(0.0, pleats + wave + breeze);
      }
      this.rightCurtain.geometry.attributes.position.needsUpdate = true;
      this.rightCurtain.geometry.computeVertexNormals();
    }

    // 4. Parallax y flotación serena del Photo Stage
    if (this.photoFrame) {
      const floatY = Math.sin(t * 1.2) * 0.05;
      this.photoFrame.position.y = floatY;
    }

    this.group.rotation.y = -0.05 + Math.sin(t * 0.1) * 0.025;
    this.group.rotation.x = 0.04 + Math.cos(t * 0.08) * 0.02;
  }
}
