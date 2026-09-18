/**
 * Slide 06: BORDAR — Telar & Bordado Colectivo Comunitario
 * Concepto: "Un evento trae personas. Una comunidad trae transformación."
 * Acción: BORDAR
 * 
 * COREOGRAFÍA PROCEDURAL & COMPOSICIÓN EDITORIAL PROTAGÓNICA:
 * 1. BASTIDOR DE TELAR PERIMETRAL DE GRAN FORMATO (X = 5.0):
 *    - Abraza la fotografía heroica (`slide06_comunidad_prensa.jpg`) en una composición monumental.
 * 2. CUATRO AGUJAS ARTESANALES SIMULTÁNEAS:
 *    - 4 agujas independientes (Cyan, Coral, Mostaza, Esmeralda) bordan en tiempo real esquinas y bordes.
 * 3. HILOS VIBRANTES & PUNTADAS EN CRUZ VISIBLES:
 *    - Los hilos conectan desde los carretes de madera torneada hacia las esquinas enmarcando la foto.
 *    - Zona de texto 100% protegida en la mitad izquierda.
 */
import * as THREE from 'three';
import { BaseSlide } from '../../core/BaseSlide.js';
import { createTextileMaterial } from '../../core/utils/textileMaterials.js';

export class Slide06 extends BaseSlide {
  constructor() {
    super('comunidad', 'Telar & Bordado Colectivo');
    this.photoFrame = null;
    this.embroideryNeedles = [];
    this.collectiveStitches = [];
    this.loomHoop = null;
    this.spools = [];
  }

  buildScene() {
    this.embroideryNeedles = [];
    this.collectiveStitches = [];
    this.spools = [];

    const photoCenter = new THREE.Vector3(5.0, 0, 0);

    // =========================================================================
    // 1. PHOTO STAGE HERO: FOTOGRAFÍA DE COMUNIDAD (GRAN FORMATO)
    // =========================================================================
    const frameGroup = new THREE.Group();
    frameGroup.position.copy(photoCenter).add(new THREE.Vector3(0, 0, -0.3));

    const photoW = 11.6;
    const photoH = 7.4;

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
        './assets/slide06_comunidad_prensa.jpg',
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
    // 2. BASTIDOR DE TELAR PERIMETRAL EXPANDIDO
    // =========================================================================
    const hoopMat = new THREE.MeshPhysicalMaterial({
      color: 0x475569,
      roughness: 0.35,
      metalness: 0.7,
      clearcoat: 0.8
    });
    const hoopW = photoW + 3.2;
    const hoopH = photoH + 2.8;
    const hoopFrame = new THREE.Mesh(
      new THREE.RingGeometry(hoopW / 2 - 0.22, hoopW / 2 + 0.22, 48),
      hoopMat
    );
    hoopFrame.position.copy(photoCenter).add(new THREE.Vector3(0, 0, -0.4));
    hoopFrame.scale.set(1.0, hoopH / hoopW, 1.0);
    this.loomHoop = hoopFrame;
    this.group.add(this.loomHoop);

    // Carretes artesanales de suministro
    const spoolCoords = [
      new THREE.Vector3(-photoW / 2 - 1.4, photoH / 2 + 1.2, 0.8).add(photoCenter),
      new THREE.Vector3(photoW / 2 + 1.4, -photoH / 2 - 1.2, 0.8).add(photoCenter)
    ];

    spoolCoords.forEach((pos, idx) => {
      const spool = new THREE.Group();
      const topDisk = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.16, 16), hoopMat);
      topDisk.position.set(0, 0.65, 0);
      const botDisk = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.16, 16), hoopMat);
      botDisk.position.set(0, -0.65, 0);
      const coreMat = createTextileMaterial({ color: idx === 0 ? 0x0284c7 : 0xe11d48, roughness: 0.4 });
      const core = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 1.1, 16), coreMat);
      spool.add(topDisk, botDisk, core);
      spool.position.copy(pos);
      this.group.add(spool);
      this.spools.push(spool);
    });

    // =========================================================================
    // 3. CUATRO AGUJAS ARTESANALES PROTAGÓNICAS
    // =========================================================================
    const needleProfiles = [
      { id: 'n_cyan',    color: 0x0284c7, startPos: new THREE.Vector3(-photoW / 2 - 0.6, photoH / 2 + 0.6, 2.5).add(photoCenter), delay: 0.8, stitchCorner: 'top_left' },
      { id: 'n_coral',   color: 0xe11d48, startPos: new THREE.Vector3(photoW / 2 + 0.6, -photoH / 2 - 0.6, 2.5).add(photoCenter), delay: 1.6, stitchCorner: 'bot_right' },
      { id: 'n_gold',    color: 0xd97706, startPos: new THREE.Vector3(photoW / 2 + 0.6, photoH / 2 + 0.6, 2.5).add(photoCenter), delay: 2.4, stitchCorner: 'top_right' },
      { id: 'n_emerald', color: 0x059669, startPos: new THREE.Vector3(-photoW / 2 - 0.6, -photoH / 2 - 0.6, 2.5).add(photoCenter), delay: 3.2, stitchCorner: 'bot_left' }
    ];

    const steelMat = new THREE.MeshPhysicalMaterial({
      color: 0xf1f5f9,
      metalness: 0.95,
      roughness: 0.1,
      clearcoat: 1.0
    });

    needleProfiles.forEach((np, nIdx) => {
      const nGroup = new THREE.Group();
      const nBody = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.09, 2.4, 10), steelMat);
      const nTip = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.6, 10), steelMat);
      nTip.position.set(0, -1.45, 0);
      nGroup.add(nBody, nTip);
      nGroup.position.copy(np.startPos);
      nGroup.rotation.z = Math.PI / 4 + nIdx * 0.4;
      this.group.add(nGroup);

      const threadMat = new THREE.MeshPhysicalMaterial({
        color: np.color,
        roughness: 0.3,
        sheen: 1.0,
        emissive: np.color,
        emissiveIntensity: 0.35
      });
      const dummyLine = new THREE.Mesh(
        new THREE.TubeGeometry(new THREE.LineCurve3(np.startPos, np.startPos.clone().add(new THREE.Vector3(0, 1, 0))), 8, 0.065, 6, false),
        threadMat
      );
      this.group.add(dummyLine);

      this.embroideryNeedles.push({
        group: nGroup,
        threadMesh: dummyLine,
        threadMat,
        np,
        nIdx
      });
    });

    // =========================================================================
    // 4. PUNTADAS DEL TAPIZ COLECTIVO
    // =========================================================================
    const cornerConfigs = [
      { corner: 'top_left',  origin: new THREE.Vector3(-photoW / 2 + 0.3, photoH / 2 - 0.3, 0.08).add(photoCenter), dir: new THREE.Vector2(1, -1), color: 0x0284c7, delay: 1.0 },
      { corner: 'bot_right', origin: new THREE.Vector3(photoW / 2 - 0.3, -photoH / 2 + 0.3, 0.08).add(photoCenter), dir: new THREE.Vector2(-1, 1), color: 0xe11d48, delay: 1.8 },
      { corner: 'top_right', origin: new THREE.Vector3(photoW / 2 - 0.3, photoH / 2 - 0.3, 0.08).add(photoCenter), dir: new THREE.Vector2(-1, -1), color: 0xd97706, delay: 2.6 },
      { corner: 'bot_left',  origin: new THREE.Vector3(-photoW / 2 + 0.3, -photoH / 2 + 0.3, 0.08).add(photoCenter), dir: new THREE.Vector2(1, 1), color: 0x059669, delay: 3.4 }
    ];

    cornerConfigs.forEach((cc) => {
      const stitchesInCorner = 9;
      for (let s = 0; s < stitchesInCorner; s++) {
        const row = Math.floor(s / 3);
        const col = s % 3;
        const px = cc.origin.x + (col * 0.95 * cc.dir.x) + (Math.random() - 0.5) * 0.06;
        const py = cc.origin.y + (row * 0.95 * cc.dir.y) + (Math.random() - 0.5) * 0.06;

        const sMat = new THREE.MeshPhysicalMaterial({
          color: cc.color,
          roughness: 0.35,
          sheen: 1.0,
          emissive: cc.color,
          emissiveIntensity: 0.25
        });

        const cross = new THREE.Group();
        const arm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.58, 6), sMat);
        arm1.rotation.z = Math.PI / 4 + (Math.random() - 0.5) * 0.1;
        const arm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.58, 6), sMat);
        arm2.rotation.z = -Math.PI / 4 + (Math.random() - 0.5) * 0.1;
        cross.add(arm1, arm2);
        cross.position.set(px, py, 0.08);
        cross.scale.set(0.001, 0.001, 0.001);
        this.group.add(cross);

        this.collectiveStitches.push({
          group: cross,
          targetPos: new THREE.Vector3(px, py, 0.08),
          delay: cc.delay + s * 0.18,
          corner: cc.corner
        });
      }
    });

    this.group.rotation.x = 0.05;
    this.group.rotation.y = -0.06;
  }

  update(deltaTime) {
    super.update(deltaTime);

    const t = this.time;

    this.spools.forEach((sp, idx) => {
      sp.rotation.y += deltaTime * (1.6 + idx * 0.6);
    });

    this.embroideryNeedles.forEach((en) => {
      const { group, threadMesh, np, nIdx } = en;

      if (t >= np.delay) {
        group.visible = true;
        threadMesh.visible = true;

        const cornerStitches = this.collectiveStitches.filter(s => s.corner === np.stitchCorner);
        const activeStitch = cornerStitches.find(s => t >= s.delay && t < s.delay + 0.3) || cornerStitches[cornerStitches.length - 1];

        if (activeStitch) {
          const stitchDive = Math.sin(t * 12.0 + nIdx) * 0.4;
          const curTarget = activeStitch.targetPos.clone().add(new THREE.Vector3(0, 0, 0.6 - stitchDive));
          group.position.lerp(curTarget, 0.2);
          group.rotation.z = Math.PI / 4 + Math.sin(t * 8.0) * 0.2;

          const pts = [
            np.startPos,
            new THREE.Vector3().lerpVectors(np.startPos, group.position, 0.5).add(new THREE.Vector3(Math.sin(t * 3.0) * 0.3, 0.3, 0.4)),
            group.position
          ];
          threadMesh.geometry.dispose();
          threadMesh.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 16, 0.055, 6, false);
        }
      } else {
        group.visible = false;
        threadMesh.visible = false;
      }
    });

    this.collectiveStitches.forEach((st) => {
      if (t >= st.delay) {
        const sProg = Math.min(1.0, (t - st.delay) / 0.45);
        const ease = sProg < 0.7
          ? Math.pow(sProg / 0.7, 2) * 1.15
          : 1.15 - Math.sin((sProg - 0.7) / 0.3 * Math.PI * 0.5) * 0.15;

        st.group.scale.set(ease, ease, ease);
      }
    });

    if (this.photoFrame) {
      this.photoFrame.position.y = Math.sin(t * 1.2) * 0.05;
    }

    this.group.rotation.y = -0.06 + Math.sin(t * 0.1) * 0.025;
  }
}
