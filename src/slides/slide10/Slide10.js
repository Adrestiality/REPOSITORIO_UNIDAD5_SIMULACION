/**
 * Slide 10: COSER JUNTOS — Dos Piezas de Tela Unidas por Botones y Costura Viva
 * Concepto: "El crecimiento no ocurre cuando una generación reemplaza a otra. Ocurre cuando trabajan juntas."
 * Acción: COSER JUNTOS
 * 
 * COREOGRAFÍA PROCEDURAL & COMPOSICIÓN LIMPIA (SIN FOTOGRAFÍA DE FONDO):
 * 1. COMPOSICIÓN LIMPIA Y DEDICADA A LA DERECHA (X = 5.2):
 *    - La fotografía anterior fue eliminada para permitir una composición textil limpia, monumental y libre de interferencias.
 *    - Deja todo el espacio izquierdo despejado para el texto en Español y Portugués.
 * 2. DOS GRANDES CAMINOS TEXTILES (TWEED & SEDA CORAL):
 *    - Camino A (Experiencia: Tweed marino estructurado con pespunte perimetral).
 *    - Camino B (Nueva Generación: Seda coral/cyan con rayas).
 * 3. REACCIÓN EN CADENA DE CINCO BOTONES & COSTURA FÍSICA:
 *    - Botón 1 (Arriba): Rebote elástico $\to$ aguja perfora $\to$ hilo tira $\to$ la parte superior se pinza y junta.
 *    - Botón 2 (Abajo): Cierra la base con tensión.
 *    - Botones 3 y 4 (Intermedios): Ajustan los tramos medios.
 *    - Botón 5 (Centro): Sella la unión total.
 * 4. FUSIÓN TEXTIL TOTAL:
 *    - La brecha desaparece: las dos telas forman UNA SOLA SUPERFICIE TEXTIL HÍBRIDA UNIFICADA.
 */
import * as THREE from 'three';
import { BaseSlide } from '../../core/BaseSlide.js';
import { createPatchworkTexture, createTextileMaterial } from '../../core/utils/textileMaterials.js';

export class Slide10 extends BaseSlide {
  constructor() {
    super('trabajan-juntas', 'Dos Caminos de Tela Unidos por Botones');
    this.clothA = null;
    this.clothB = null;
    this.basePosA = null;
    this.basePosB = null;
    this.buttons = [];
    this.needleMesh = null;
    this.acrobaticThread = null;
    this.segW = 50;
    this.segH = 35;
  }

  buildScene() {
    this.buttons = [];

    // Centro del área de unión textil en el cuadrante derecho
    const rightCenter = new THREE.Vector3(5.2, 0, 0);
    const clothW = 8.6;
    const clothH = 13.0;

    // =========================================================================
    // 1. CAMINO A (EXPERIENCIA: TWEED ESTRUCTURADO MARINO & MARFIL)
    // =========================================================================
    const geoA = new THREE.PlaneGeometry(clothW, clothH, this.segW, this.segH);
    this.basePosA = geoA.attributes.position.array.slice();

    const matA = createTextileMaterial({
      color: 0x0f172a,
      sheenColor: 0x93c5fd,
      roughness: 0.65,
      map: createPatchworkTexture({ baseColor: '#0f172a', accentColor: '#1e293b', pattern: 'houndstooth' }),
      bumpScale: 0.04
    });

    this.clothA = new THREE.Mesh(geoA, matA);
    this.clothA.position.set(-4.8, 0, 0.4).add(rightCenter);
    this.group.add(this.clothA);

    const edgeA = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.PlaneGeometry(clothW, clothH)),
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.75 })
    );
    edgeA.position.z = 0.015;
    this.clothA.add(edgeA);

    // =========================================================================
    // 2. CAMINO B (NUEVA GENERACIÓN: SEDA CORAL & CYAN CON RAYAS)
    // =========================================================================
    const geoB = new THREE.PlaneGeometry(clothW, clothH, this.segW, this.segH);
    this.basePosB = geoB.attributes.position.array.slice();

    const matB = createTextileMaterial({
      color: 0xe11d48,
      sheenColor: 0x0284c7,
      roughness: 0.35,
      clearcoat: 0.85,
      map: createPatchworkTexture({ baseColor: '#e11d48', accentColor: '#fb7185', pattern: 'stripes' }),
      bumpScale: 0.03
    });

    this.clothB = new THREE.Mesh(geoB, matB);
    this.clothB.position.set(4.8, 0, 0.4).add(rightCenter);
    this.group.add(this.clothB);

    const edgeB = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.PlaneGeometry(clothW, clothH)),
      new THREE.LineBasicMaterial({ color: 0x0284c7, transparent: true, opacity: 0.85 })
    );
    edgeB.position.z = 0.015;
    this.clothB.add(edgeB);

    // =========================================================================
    // 3. CINCO BOTONES ARTESANALES DE COSTURA INTERGENERACIONAL
    // =========================================================================
    const buttonList = [
      { id: 'b1_top',    y: 4.6,  color: 0xdfb76c, delay: 1.2, size: 0.72 },
      { id: 'b2_bot',    y: -4.6, color: 0x0284c7, delay: 2.6, size: 0.72 },
      { id: 'b3_midtop', y: 2.3,  color: 0xd97706, delay: 4.0, size: 0.74 },
      { id: 'b4_midbot', y: -2.3, color: 0x059669, delay: 5.2, size: 0.74 },
      { id: 'b5_center', y: 0.0,  color: 0xf8fafc, delay: 6.4, size: 0.86 }
    ];

    buttonList.forEach((bl) => {
      const btnGroup = new THREE.Group();
      btnGroup.position.set(0, bl.y, 0.8).add(rightCenter);
      btnGroup.scale.set(0.001, 0.001, 0.001);

      const bMat = new THREE.MeshPhysicalMaterial({
        color: bl.color,
        roughness: 0.18,
        metalness: 0.85,
        clearcoat: 1.0
      });

      const bRim = new THREE.Mesh(new THREE.TorusGeometry(bl.size, 0.11, 16, 32), bMat);
      const bDisc = new THREE.Mesh(new THREE.CylinderGeometry(bl.size, bl.size, 0.12, 32), bMat);
      bDisc.rotation.x = Math.PI / 2;
      btnGroup.add(bRim, bDisc);

      // 4 orificios de costura
      const hMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
      const offsets = [
        [-bl.size * 0.35, bl.size * 0.35],
        [bl.size * 0.35, bl.size * 0.35],
        [-bl.size * 0.35, -bl.size * 0.35],
        [bl.size * 0.35, -bl.size * 0.35]
      ];
      offsets.forEach(([hx, hy]) => {
        const h = new THREE.Mesh(new THREE.CircleGeometry(bl.size * 0.13, 12), hMat);
        h.position.set(hx, hy, 0.07);
        btnGroup.add(h);
      });

      this.group.add(btnGroup);

      this.buttons.push({
        group: btnGroup,
        bl
      });
    });

    // =========================================================================
    // 4. AGUJA ACROBÁTICA & HILO DE UNIÓN VIVO
    // =========================================================================
    const needleGroup = new THREE.Group();
    const needleMat = new THREE.MeshPhysicalMaterial({ color: 0xf1f5f9, metalness: 0.95, roughness: 0.08, clearcoat: 1.0 });
    const nBody = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.09, 2.8, 12), needleMat);
    const nTip = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.7, 12), needleMat);
    nTip.position.set(0, -1.75, 0);
    needleGroup.add(nBody, nTip);
    needleGroup.position.set(11, 8, 4);
    this.group.add(needleGroup);
    this.needleMesh = needleGroup;

    const threadMat = new THREE.MeshPhysicalMaterial({
      color: 0xe11d48,
      roughness: 0.25,
      emissive: 0xe11d48,
      emissiveIntensity: 0.45
    });

    const initCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(11, 8, 4),
      new THREE.Vector3(8, 5, 2),
      rightCenter.clone().add(new THREE.Vector3(0, 0, 0.8))
    ]);
    this.acrobaticThread = new THREE.Mesh(new THREE.TubeGeometry(initCurve, 30, 0.065, 8, false), threadMat);
    this.group.add(this.acrobaticThread);

    this.group.rotation.x = 0.05;
    this.group.rotation.y = -0.05;
  }

  update(deltaTime) {
    super.update(deltaTime);

    const t = this.time;
    const rightCenter = new THREE.Vector3(5.2, 0, 0);

    // 1. Progresión acumulada de los 5 botones
    const bProgValues = this.buttons.map((b) => {
      const prog = Math.min(1.0, Math.max(0, (t - b.bl.delay) / 1.3));
      return prog * prog * (3 - 2 * prog);
    });

    const totalClosure = bProgValues.reduce((sum, v) => sum + v, 0) / this.buttons.length;

    // 2. Animación de rebote elástico de los Botones (Overshoot)
    let needleTarget = new THREE.Vector3(11, 8, 4);

    this.buttons.forEach((btn) => {
      const bl = btn.bl;
      if (t >= bl.delay) {
        const p = Math.min(1.0, (t - bl.delay) / 0.85);
        const bounce = p < 0.65
          ? Math.pow(p / 0.65, 2) * 1.25
          : 1.25 - Math.sin((p - 0.65) / 0.35 * Math.PI * 0.5) * 0.25;

        btn.group.scale.set(bounce, bounce, bounce);

        if (p < 1.0) {
          const dive = Math.sin(p * Math.PI * 4) * 0.85;
          needleTarget.set(rightCenter.x, bl.y, 0.9 - dive);
        }
      }
    });

    if (this.needleMesh) {
      this.needleMesh.position.lerp(needleTarget, 0.22);
    }

    // 3. Deformación física elástica en las dos telas que se aproximan y fusionan
    if (this.clothA) {
      const pos = this.clothA.geometry.attributes.position.array;
      const base = this.basePosA;
      const count = pos.length / 3;

      for (let i = 0; i < count; i++) {
        const bx = base[i * 3];
        const by = base[i * 3 + 1];

        const normY = (by + 6.5) / 13.0;
        const btnIndex = Math.min(4, Math.floor(normY * 5));
        const localClosure = bProgValues[btnIndex];

        const shiftX = (bx > 0) ? (localClosure * 2.2) : 0;
        const wrinkleZ = (bx > 0) ? Math.sin(by * 1.8 + t * 2.5) * (0.32 * localClosure) : 0;
        const ambientDrape = Math.sin(bx * 0.4 + by * 0.4 + t * 1.4) * (0.12 * totalClosure);

        pos[i * 3] = bx + shiftX;
        pos[i * 3 + 1] = by;
        pos[i * 3 + 2] = wrinkleZ + ambientDrape;
      }
      this.clothA.geometry.attributes.position.needsUpdate = true;
      this.clothA.geometry.computeVertexNormals();

      this.clothA.position.x = -4.8 + (totalClosure * 1.4) + rightCenter.x;
    }

    if (this.clothB) {
      const pos = this.clothB.geometry.attributes.position.array;
      const base = this.basePosB;
      const count = pos.length / 3;

      for (let i = 0; i < count; i++) {
        const bx = base[i * 3];
        const by = base[i * 3 + 1];

        const normY = (by + 6.5) / 13.0;
        const btnIndex = Math.min(4, Math.floor(normY * 5));
        const localClosure = bProgValues[btnIndex];

        const shiftX = (bx < 0) ? (-localClosure * 2.2) : 0;
        const wrinkleZ = (bx < 0) ? Math.cos(by * 1.8 - t * 2.8) * (0.38 * localClosure) : 0;
        const ambientDrape = Math.sin(bx * 0.4 + by * 0.4 + t * 1.4) * (0.12 * totalClosure);

        pos[i * 3] = bx + shiftX;
        pos[i * 3 + 1] = by;
        pos[i * 3 + 2] = wrinkleZ + ambientDrape;
      }
      this.clothB.geometry.attributes.position.needsUpdate = true;
      this.clothB.geometry.computeVertexNormals();

      this.clothB.position.x = 4.8 - (totalClosure * 1.4) + rightCenter.x;
    }

    // 4. Hilo acrobático que sigue a la aguja
    if (this.acrobaticThread && this.needleMesh) {
      const pts = [
        this.needleMesh.position.clone(),
        new THREE.Vector3().lerpVectors(this.needleMesh.position, rightCenter, 0.4).add(new THREE.Vector3(Math.sin(t * 4) * 0.4, 0.4, 0.4)),
        new THREE.Vector3().lerpVectors(this.needleMesh.position, rightCenter, 0.8).add(new THREE.Vector3(-Math.cos(t * 3) * 0.3, -0.3, 0.3)),
        rightCenter.clone().add(new THREE.Vector3(0, 0, 0.4))
      ];
      const dynCurve = new THREE.CatmullRomCurve3(pts);
      this.acrobaticThread.geometry.dispose();
      this.acrobaticThread.geometry = new THREE.TubeGeometry(dynCurve, 30, 0.065, 8, false);
    }

    this.group.rotation.y = -0.05 + Math.sin(t * 0.1) * 0.025;
  }
}
