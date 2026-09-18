/**
 * Slide 12: CONSTRUIR — Casa Textil de Patchwork con Geometría Limpia
 * Concepto: "El futuro no se hereda. Se construye."
 * Acción: CONSTRUIR
 * 
 * COREOGRAFÍA PROCEDURAL & GEOMETRÍA ARQUITECTÓNICA EXACTA:
 * 1. MESA DE PATRONAJE Y CORTE:
 *    - Los moldes textiles yacen planos sobre la cuadrícula milimétrica de trabajo.
 * 2. MUROS FRONTALES Y TRASEROS EN SILUETA DE CASA (PENTÁGONO CON GABLETE TRIANGULAR):
 *    - La silueta frontal y posterior es un pentágono exacto (base rectangular de altura H + gablete triangular de cumbrera).
 *    - El techo a dos aguas calza y se encuentra milimétricamente con los muros sin esquinas sobresalientes.
 * 3. COSTURA Y ELEVACIÓN ARTICULADA:
 *    - Las paredes se pliegan hacia arriba con rebote elástico.
 *    - Las 4 esquinas verticales se zipean con puntadas 3D permanentes.
 *    - Los dos faldones del techo se elevan y se unen en el caballete superior.
 *    - La aguja cose el caballete y se asienta.
 * 4. RESULTADO:
 *    - Una auténtica casa textil de patchwork con puerta arqueada, ventanas de madera, puntadas artesanales y volumen cálido.
 */
import * as THREE from 'three';
import { BaseSlide } from '../../core/BaseSlide.js';
import { createWeaveTexture, createTextileMaterial, createPatchworkTexture } from '../../core/utils/textileMaterials.js';

export class Slide12 extends BaseSlide {
  constructor() {
    super('futuro-construido', 'Casa Textil de Patchwork');
    this.tableGrid = null;
    this.needleMesh = null;
    this.threadLine = null;
    this.patternPanels = [];
    this.seamStitches = [];
  }

  buildScene() {
    this.patternPanels = [];
    this.seamStitches = [];

    // Centro de la casa textil en el cuadrante derecho
    const houseCenter = new THREE.Vector3(4.8, -0.6, 0);

    // =========================================================================
    // 1. MESA DE PATRONAJE Y CORTE
    // =========================================================================
    const tableGeo = new THREE.PlaneGeometry(28, 20, 24, 20);
    const tableMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      roughness: 0.75,
      metalness: 0.1,
      clearcoat: 0.2
    });
    this.tableGrid = new THREE.Mesh(tableGeo, tableMat);
    this.tableGrid.rotation.x = -Math.PI / 2;
    this.tableGrid.position.copy(houseCenter).add(new THREE.Vector3(0, -3.8, 0));
    this.group.add(this.tableGrid);

    const gridHelper = new THREE.GridHelper(24, 24, 0x0284c7, 0x334155);
    gridHelper.position.copy(houseCenter).add(new THREE.Vector3(0, -3.78, 0));
    this.group.add(gridHelper);

    // =========================================================================
    // 2. MATERIALES TEXTILES DE PATCHWORK
    // =========================================================================
    const corduroyBump = createWeaveTexture({ size: 128, type: 'corduroy', density: 16 });

    const baseMat = createTextileMaterial({
      color: 0xfbf9f5,
      sheenColor: 0xffffff,
      roughness: 0.65,
      bumpScale: 0.03
    });

    const wallCyanMat = createTextileMaterial({
      color: 0x0284c7,
      sheenColor: 0x38bdf8,
      roughness: 0.45,
      map: createPatchworkTexture({ baseColor: '#0284c7', accentColor: '#0369a1', pattern: 'stripes' }),
      bumpScale: 0.04
    });

    const wallCoralMat = createTextileMaterial({
      color: 0xe11d48,
      sheenColor: 0xfecdd3,
      roughness: 0.45,
      map: createPatchworkTexture({ baseColor: '#e11d48', accentColor: '#be123c', pattern: 'grid' }),
      bumpScale: 0.04
    });

    const roofGoldMat = createTextileMaterial({
      color: 0xd97706,
      sheenColor: 0xfef08a,
      roughness: 0.35,
      clearcoat: 0.85,
      bumpMap: corduroyBump,
      bumpScale: 0.04
    });

    const frameWoodMat = new THREE.MeshPhysicalMaterial({
      color: 0xdfb76c,
      roughness: 0.3,
      metalness: 0.8,
      clearcoat: 0.9
    });

    // =========================================================================
    // 3. DIMENSIONES Y PIEZAS CON GEOMETRÍA ARQUITECTÓNICA EXACTA
    // =========================================================================
    const W = 7.6;              // Ancho de la casa
    const D = 6.0;              // Profundidad
    const H = 4.2;              // Altura de paredes laterales
    const peakH = 2.4;          // Altura del caballete del techo sobre la pared
    const roofAngle = Math.atan2(peakH, W / 2);
    const roofSlopeL = Math.sqrt(Math.pow(W / 2, 2) + Math.pow(peakH, 2));

    // A) SUELO BASE
    const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(W, 0.08, D), baseMat);
    baseMesh.position.copy(houseCenter).add(new THREE.Vector3(0, -3.72, 0));
    this.group.add(baseMesh);

    // B) MURO IZQUIERDO (Bisagra en X = -W/2)
    const wallLeftPivot = new THREE.Group();
    wallLeftPivot.position.copy(houseCenter).add(new THREE.Vector3(-W / 2, -3.72, 0));
    const wallLeftMesh = new THREE.Mesh(new THREE.BoxGeometry(0.08, H, D), wallCyanMat);
    wallLeftMesh.position.set(0, H / 2, 0);

    const winL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.4, 1.4), frameWoodMat);
    winL.position.set(0, H / 2, 0);
    wallLeftMesh.add(winL);

    wallLeftPivot.add(wallLeftMesh);
    wallLeftPivot.rotation.z = Math.PI / 2;
    this.group.add(wallLeftPivot);

    this.patternPanels.push({
      pivot: wallLeftPivot, axis: 'z', flatAngle: Math.PI / 2, foldedAngle: 0, tStart: 0.15, tEnd: 0.40
    });

    // C) MURO DERECHO (Bisagra en X = +W/2)
    const wallRightPivot = new THREE.Group();
    wallRightPivot.position.copy(houseCenter).add(new THREE.Vector3(W / 2, -3.72, 0));
    const wallRightMesh = new THREE.Mesh(new THREE.BoxGeometry(0.08, H, D), wallCyanMat);
    wallRightMesh.position.set(0, H / 2, 0);

    const winR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.4, 1.4), frameWoodMat);
    winR.position.set(0, H / 2, 0);
    wallRightMesh.add(winR);

    wallRightPivot.add(wallRightMesh);
    wallRightPivot.rotation.z = -Math.PI / 2;
    this.group.add(wallRightPivot);

    this.patternPanels.push({
      pivot: wallRightPivot, axis: 'z', flatAngle: -Math.PI / 2, foldedAngle: 0, tStart: 0.20, tEnd: 0.45
    });

    // Función auxiliar para crear la silueta pentagonal de la casa (Base rectangular + Triángulo de tejado)
    function createGableWallGeometry(w, h, pHeight, depth = 0.08) {
      const shape = new THREE.Shape();
      const hw = w / 2;
      shape.moveTo(-hw, 0);
      shape.lineTo(hw, 0);
      shape.lineTo(hw, h);
      shape.lineTo(0, h + pHeight);
      shape.lineTo(-hw, h);
      shape.closePath();

      const extrudeSettings = {
        depth: depth,
        bevelEnabled: false
      };
      const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      geo.center(); // Centrado
      return geo;
    }

    // D) MURO POSTERIOR PENTAGONAL (Bisagra en Z = -D/2)
    const wallBackPivot = new THREE.Group();
    wallBackPivot.position.copy(houseCenter).add(new THREE.Vector3(0, -3.72, -D / 2));

    const gableGeoBack = createGableWallGeometry(W, H, peakH, 0.08);
    const wallBackMesh = new THREE.Mesh(gableGeoBack, wallCoralMat);
    // El centro del pentágono queda a Y = (H + peakH * 0.4) / 2
    wallBackMesh.position.set(0, (H + peakH * 0.4) / 2, 0);

    // Ventana circular en la buhardilla
    const winBack = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.12, 16), frameWoodMat);
    winBack.rotation.x = Math.PI / 2;
    winBack.position.set(0, 0.4, 0);
    wallBackMesh.add(winBack);

    wallBackPivot.add(wallBackMesh);
    wallBackPivot.rotation.x = -Math.PI / 2;
    this.group.add(wallBackPivot);

    this.patternPanels.push({
      pivot: wallBackPivot, axis: 'x', flatAngle: -Math.PI / 2, foldedAngle: 0, tStart: 0.30, tEnd: 0.55
    });

    // E) MURO FRONTAL PENTAGONAL CON PUERTA (Bisagra en Z = +D/2)
    const wallFrontPivot = new THREE.Group();
    wallFrontPivot.position.copy(houseCenter).add(new THREE.Vector3(0, -3.72, D / 2));

    const gableGeoFront = createGableWallGeometry(W, H, peakH, 0.08);
    const wallFrontMesh = new THREE.Mesh(gableGeoFront, wallCoralMat);
    wallFrontMesh.position.set(0, (H + peakH * 0.4) / 2, 0);

    // Puerta arqueada de bienvenida
    const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.5, 0.12), frameWoodMat);
    doorFrame.position.set(0, -H / 2 + 1.25, 0.02);
    const doorHole = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.2, 0.14), new THREE.MeshBasicMaterial({ color: 0x0f172a }));
    doorHole.position.set(0, -H / 2 + 1.1, 0.02);
    wallFrontMesh.add(doorFrame, doorHole);

    wallFrontPivot.add(wallFrontMesh);
    wallFrontPivot.rotation.x = Math.PI / 2;
    this.group.add(wallFrontPivot);

    this.patternPanels.push({
      pivot: wallFrontPivot, axis: 'x', flatAngle: Math.PI / 2, foldedAngle: 0, tStart: 0.35, tEnd: 0.60
    });

    // F) TECHO IZQUIERDO (Bisagra en parte superior del muro izquierdo: X = -W/2, Y = H)
    const roofLeftPivot = new THREE.Group();
    roofLeftPivot.position.copy(houseCenter).add(new THREE.Vector3(-W / 2, -3.72 + H, 0));
    const roofLeftMesh = new THREE.Mesh(new THREE.BoxGeometry(roofSlopeL, 0.08, D * 1.06), roofGoldMat);
    roofLeftMesh.position.set(roofSlopeL / 2, 0, 0);
    roofLeftPivot.add(roofLeftMesh);
    roofLeftPivot.rotation.z = Math.PI / 2;
    this.group.add(roofLeftPivot);

    this.patternPanels.push({
      pivot: roofLeftPivot, axis: 'z', flatAngle: Math.PI / 2, foldedAngle: roofAngle, tStart: 0.58, tEnd: 0.82
    });

    // G) TECHO DERECHO (Bisagra en parte superior del muro derecho: X = +W/2, Y = H)
    const roofRightPivot = new THREE.Group();
    roofRightPivot.position.copy(houseCenter).add(new THREE.Vector3(W / 2, -3.72 + H, 0));
    const roofRightMesh = new THREE.Mesh(new THREE.BoxGeometry(roofSlopeL, 0.08, D * 1.06), roofGoldMat);
    roofRightMesh.position.set(-roofSlopeL / 2, 0, 0);
    roofRightPivot.add(roofRightMesh);
    roofRightPivot.rotation.z = -Math.PI / 2;
    this.group.add(roofRightPivot);

    this.patternPanels.push({
      pivot: roofRightPivot, axis: 'z', flatAngle: -Math.PI / 2, foldedAngle: -roofAngle, tStart: 0.62, tEnd: 0.85
    });

    // =========================================================================
    // 4. PUNTADAS EN CRUZ VISIBLES EN LAS 4 ESQUINAS VERTICALES
    // =========================================================================
    const stitchMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
    const cornerPositions = [
      { x: -W / 2, z: -D / 2, tStart: 0.44 },
      { x: W / 2,  z: -D / 2, tStart: 0.50 },
      { x: W / 2,  z: D / 2,  tStart: 0.56 },
      { x: -W / 2, z: D / 2,  tStart: 0.62 }
    ];

    const stitchCountPerCorner = 10;
    cornerPositions.forEach((cp) => {
      for (let s = 0; s < stitchCountPerCorner; s++) {
        const sy = -3.72 + (s / (stitchCountPerCorner - 1)) * H;
        const stitchMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.42, 6), stitchMat);
        stitchMesh.position.copy(houseCenter).add(new THREE.Vector3(cp.x, sy, cp.z));
        stitchMesh.rotation.z = (s % 2 === 0) ? Math.PI / 4 : -Math.PI / 4;
        stitchMesh.visible = false;
        this.group.add(stitchMesh);

        this.seamStitches.push({
          mesh: stitchMesh,
          tStart: cp.tStart + (s / stitchCountPerCorner) * 0.08
        });
      }
    });

    // =========================================================================
    // 5. AGUJA DE CONSTRUCCIÓN & HILO
    // =========================================================================
    const needleGroup = new THREE.Group();
    const needleMat = new THREE.MeshPhysicalMaterial({ color: 0xf1f5f9, metalness: 0.95, roughness: 0.1, clearcoat: 1.0 });
    const nShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.08, 3.2, 12), needleMat);
    const nTip = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.6, 12), needleMat);
    nTip.position.set(0, -1.9, 0);
    needleGroup.add(nShaft, nTip);
    needleGroup.position.copy(houseCenter).add(new THREE.Vector3(0, 5.0, 0));
    this.needleMesh = needleGroup;
    this.group.add(this.needleMesh);

    const initThreadPts = [
      houseCenter.clone().add(new THREE.Vector3(0, 8, 0)),
      houseCenter.clone().add(new THREE.Vector3(1, 6, 0)),
      houseCenter.clone().add(new THREE.Vector3(0, 5, 0))
    ];
    this.threadLine = new THREE.Mesh(
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3(initThreadPts), 24, 0.04, 6, false),
      new THREE.MeshBasicMaterial({ color: 0xd97706 })
    );
    this.group.add(this.threadLine);

    this.group.rotation.x = 0.12;
    this.group.rotation.y = -0.16;
  }

  update(deltaTime) {
    super.update(deltaTime);

    const t = this.time;
    const houseCenter = new THREE.Vector3(4.8, -0.6, 0);
    const buildDuration = 8.0;
    const progress = Math.max(0, Math.min(1.0, (t - 0.8) / buildDuration));

    const easeOutBack = (x) => {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    };

    // 1. Doblado secuencial de los paneles
    this.patternPanels.forEach((p) => {
      if (progress < p.tStart) {
        if (p.axis === 'z') p.pivot.rotation.z = p.flatAngle;
        if (p.axis === 'x') p.pivot.rotation.x = p.flatAngle;
      } else if (progress >= p.tEnd) {
        if (p.axis === 'z') p.pivot.rotation.z = p.foldedAngle;
        if (p.axis === 'x') p.pivot.rotation.x = p.foldedAngle;
      } else {
        const u = (progress - p.tStart) / (p.tEnd - p.tStart);
        const foldedU = easeOutBack(Math.min(1.0, u));
        const currentAngle = THREE.MathUtils.lerp(p.flatAngle, p.foldedAngle, Math.max(0, foldedU));

        if (p.axis === 'z') p.pivot.rotation.z = currentAngle;
        if (p.axis === 'x') p.pivot.rotation.x = currentAngle;
      }
    });

    // 2. Revelación de las puntadas de esquina
    this.seamStitches.forEach((st) => {
      st.mesh.visible = progress >= st.tStart;
      if (st.mesh.visible && progress < st.tStart + 0.05) {
        const pop = (progress - st.tStart) / 0.05;
        st.mesh.scale.setScalar(pop);
      }
    });

    // 3. Trayectoria de la aguja cosiendo
    if (this.needleMesh) {
      if (progress < 0.15) {
        const hoverX = Math.sin(t * 3.0) * 3.5;
        const hoverZ = Math.cos(t * 2.5) * 2.5;
        this.needleMesh.position.copy(houseCenter).add(new THREE.Vector3(hoverX, 2.0, hoverZ));
      } else if (progress < 0.65) {
        const stitchCycle = (t * 6.0) % 1.0;
        const needleBob = Math.sin(stitchCycle * Math.PI) * 1.0;
        const orbitAngle = progress * Math.PI * 4;
        const nx = Math.cos(orbitAngle) * 4.2;
        const nz = Math.sin(orbitAngle) * 3.4;
        const ny = -1.8 + (progress - 0.15) * 7.5 + needleBob;
        this.needleMesh.position.copy(houseCenter).add(new THREE.Vector3(nx, ny, nz));
      } else if (progress < 0.9) {
        // Cose el caballete superior
        const ridgeU = (progress - 0.65) / 0.25;
        const rz = THREE.MathUtils.lerp(-3.0, 3.0, ridgeU);
        const ry = 3.2 + Math.abs(Math.sin(t * 8.0)) * 0.6;
        this.needleMesh.position.copy(houseCenter).add(new THREE.Vector3(0, ry, rz));
      } else {
        this.needleMesh.position.copy(houseCenter).add(new THREE.Vector3(5.5, 0.5 + Math.sin(t * 1.5) * 0.1, 2.2));
      }
    }

    // 4. Hilo continuo
    if (this.threadLine && this.needleMesh) {
      const tipPt = this.needleMesh.position.clone().add(new THREE.Vector3(0, 3.0, 0));
      const midPt = tipPt.clone().add(new THREE.Vector3(1.0, 2.0, -0.6));
      const anchorPt = houseCenter.clone().add(new THREE.Vector3(0, 8.0, 0));

      const curve = new THREE.CatmullRomCurve3([anchorPt, midPt, tipPt]);
      this.threadLine.geometry.dispose();
      this.threadLine.geometry = new THREE.TubeGeometry(curve, 24, 0.035, 6, false);
    }

    if (progress >= 0.9) {
      const breath = Math.sin(t * 1.3) * 0.015;
      this.group.scale.set(1.0 + breath, 1.0 + breath, 1.0 + breath);
    }

    this.group.rotation.y = -0.16 + Math.sin(t * 0.12) * 0.04;
    this.group.rotation.x = 0.12 + Math.cos(t * 0.1) * 0.02;
  }
}
