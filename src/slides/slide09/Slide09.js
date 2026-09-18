/**
 * Slide 09: ENCUENTRO DE COMPATIBILIDAD — Dos Piezas Textiles Complementarias que se Entrelazan
 * Concepto: "Una visión. Dos generaciones."
 * Acción: ENCONTRAR COMPATIBILIDAD
 * 
 * COREOGRAFÍA PROCEDURAL CAUSA → EFECTO (CERO BOTONES, CERO AGUJAS, CERO PLANOS ABSTRACTOS):
 * 1. DOS PIEZAS TEXTILES ESCULTÓRICAS CON IDENTIDAD Y FORMA COMPLEMENTARIA:
 *    - PIEZA A (Experiencia): Banda de tweed marino estructurado con pestañas de ensamble arquitectónicas y dobladillo marfil.
 *      Comportamiento solemne, con inercia, firmeza y estabilidad.
 *    - PIEZA B (Nueva Generación): Banda de seda coral y cyan con alojamientos complementarios que coinciden con A.
 *      Comportamiento ágil, flexible, elástico y reactivo.
 * 2. PROGRESIÓN DRAMÁTICA:
 *    - 0.0s - 1.5s [Anticipación]: Las dos piezas respiran con su propia física en cuadrantes opuestos.
 *    - 1.5s - 3.4s [Aproximación]: A desciende con peso; B asciende y orienta sus bordes buscando encaje.
 *    - 3.4s - 5.0s [Contacto & Reacción]: El contacto físico genera una ola de flexión en B (squash & stretch textil).
 *    - 5.0s - 6.8s [Adaptación & Interlocking]: Las pestañas de A se deslizan y encajan en los vanos de B.
 *    - 6.8s+ [Resultado / Settle]: Las dos piezas forman una única superficie armónica viva y unificada.
 * 3. COMPOSICIÓN DEDICADA A LA DERECHA (X = 5.0):
 *    - Textos en Español y Portugués cuentan con su propio espacio libre a la izquierda.
 */
import * as THREE from 'three';
import { BaseSlide } from '../../core/BaseSlide.js';
import { createTextileMaterial, createPatchworkTexture, createWeaveTexture } from '../../core/utils/textileMaterials.js';

export class Slide09 extends BaseSlide {
  constructor() {
    super('vision-generaciones', 'Encuentro Textil Intergeneracional');
    this.pieceA = null;
    this.pieceB = null;
    this.basePosA = null;
    this.basePosB = null;
    this.connectorPins = [];
    this.segW = 60;
    this.segH = 40;
  }

  buildScene() {
    this.connectorPins = [];
    const stageCenter = new THREE.Vector3(5.0, 0, 0);

    // =========================================================================
    // 1. PIEZA A: EXPERIENCIA (TWEED ESTRUCTURADO MARINO CON PESTAÑAS)
    // =========================================================================
    const widthA = 9.2;
    const heightA = 5.2;

    const geoA = new THREE.PlaneGeometry(widthA, heightA, this.segW, this.segH);
    this.basePosA = geoA.attributes.position.array.slice();

    const matA = createTextileMaterial({
      color: 0x0f172a,      // Azul noche sobrio
      sheenColor: 0x93c5fd, // Sheen lana fina
      roughness: 0.65,
      clearcoat: 0.25,
      map: createPatchworkTexture({ baseColor: '#0f172a', accentColor: '#1e293b', pattern: 'houndstooth' }),
      bumpScale: 0.04
    });

    this.pieceA = new THREE.Mesh(geoA, matA);
    // Posición inicial superior
    this.pieceA.position.copy(stageCenter).add(new THREE.Vector3(0, 4.4, 0.4));
    this.pieceA.rotation.set(0.12, 0.15, -0.08);
    this.group.add(this.pieceA);

    // Dobladillo de sastre blanco
    const edgeA = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.PlaneGeometry(widthA, heightA)),
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 })
    );
    edgeA.position.z = 0.02;
    this.pieceA.add(edgeA);

    // Tres marcadores de ensamblaje en latón cepillado en el borde de unión
    const brassHardwareMat = new THREE.MeshPhysicalMaterial({
      color: 0xdfb76c,
      metalness: 0.9,
      roughness: 0.15,
      clearcoat: 1.0
    });

    const tabOffsets = [-2.8, 0.0, 2.8];
    tabOffsets.forEach((tx) => {
      const tabGroup = new THREE.Group();
      tabGroup.position.set(tx, -heightA / 2, 0.04);

      // Pestaña de encaje textil sobresaliente
      const tabGeo = new THREE.BoxGeometry(1.6, 0.8, 0.12);
      const tabMesh = new THREE.Mesh(tabGeo, matA);
      tabMesh.position.set(0, -0.35, 0);

      // Aro de fijación
      const eyelet = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.06, 12, 24), brassHardwareMat);
      eyelet.position.set(0, -0.4, 0.06);

      tabGroup.add(tabMesh, eyelet);
      this.pieceA.add(tabGroup);
    });

    // =========================================================================
    // 2. PIEZA B: NUEVA GENERACIÓN (SEDA CORAL & CYAN CON ALOJAMIENTOS)
    // =========================================================================
    const widthB = 9.2;
    const heightB = 5.2;

    const geoB = new THREE.PlaneGeometry(widthB, heightB, this.segW, this.segH);
    this.basePosB = geoB.attributes.position.array.slice();

    const matB = createTextileMaterial({
      color: 0xe11d48,      // Coral vivo
      sheenColor: 0x0284c7, // Sheen cyan
      roughness: 0.35,
      clearcoat: 0.85,
      map: createPatchworkTexture({ baseColor: '#e11d48', accentColor: '#fb7185', pattern: 'stripes' }),
      bumpScale: 0.03
    });

    this.pieceB = new THREE.Mesh(geoB, matB);
    // Posición inicial inferior
    this.pieceB.position.copy(stageCenter).add(new THREE.Vector3(0, -4.4, 0.1));
    this.pieceB.rotation.set(-0.15, -0.2, 0.1);
    this.group.add(this.pieceB);

    const edgeB = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.PlaneGeometry(widthB, heightB)),
      new THREE.LineBasicMaterial({ color: 0x0284c7, transparent: true, opacity: 0.9 })
    );
    edgeB.position.z = 0.02;
    this.pieceB.add(edgeB);

    // Receptáculos de encaje complementarios en la Pieza B
    tabOffsets.forEach((tx) => {
      const pocketGroup = new THREE.Group();
      pocketGroup.position.set(tx, heightB / 2, 0.04);

      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.06, 12, 24), brassHardwareMat);
      ring.position.set(0, 0.1, 0.05);

      pocketGroup.add(ring);
      this.pieceB.add(pocketGroup);
    });

    this.group.rotation.x = 0.04;
    this.group.rotation.y = -0.05;
  }

  update(deltaTime) {
    super.update(deltaTime);

    const t = this.time;
    const stageCenter = new THREE.Vector3(5.0, 0, 0);

    // =========================================================================
    // COREOGRAFÍA CINÉTICA: CAUSA → CONTACTO → ADAPTACIÓN → ENLACE
    // =========================================================================
    // 0.0s - 1.4s: Anticipación y respiración independiente.
    // 1.4s - 3.5s: Aproximación con inercia hacia el plano de encuentro.
    // 3.5s - 5.2s: Contacto físico $\to$ deformación elástica de B adaptándose a A.
    // 5.2s - 7.0s: Interlocking completo $\to$ consolidación de la pieza híbrida.
    // 7.0s+: Respiración unificada.

    const moveProgress = Math.min(1.0, Math.max(0, (t - 1.4) / 2.2));
    const adaptProgress = Math.min(1.0, Math.max(0, (t - 3.4) / 2.2));
    const lockProgress = Math.min(1.0, Math.max(0, (t - 5.0) / 2.0));

    const easeMove = moveProgress < 0.7
      ? Math.pow(moveProgress / 0.7, 2) * 1.04
      : 1.04 - Math.sin((moveProgress - 0.7) / 0.3 * Math.PI * 0.5) * 0.04;

    const easeAdapt = adaptProgress * adaptProgress * (3 - 2 * adaptProgress);
    const easeLock = lockProgress * lockProgress * (3 - 2 * lockProgress);

    // 1. DINÁMICA DE LA PIEZA A (EXPERIENCIA: Descenso solemne y asentamiento estable)
    if (this.pieceA) {
      const initPosA = stageCenter.clone().add(new THREE.Vector3(0, 4.4, 0.4));
      const targetPosA = stageCenter.clone().add(new THREE.Vector3(0, 1.9, 0.16));
      this.pieceA.position.lerpVectors(initPosA, targetPosA, Math.min(1.0, easeMove));

      const initRotA = new THREE.Euler(0.12, 0.15, -0.08);
      const targetRotA = new THREE.Euler(0.02, 0.03, -0.01);
      this.pieceA.rotation.x = THREE.MathUtils.lerp(initRotA.x, targetRotA.x, easeMove);
      this.pieceA.rotation.y = THREE.MathUtils.lerp(initRotA.y, targetRotA.y, easeMove);
      this.pieceA.rotation.z = THREE.MathUtils.lerp(initRotA.z, targetRotA.z, easeMove);

      // Deformación de tela con cuerpo y dobladillo firme
      const pos = this.pieceA.geometry.attributes.position.array;
      const base = this.basePosA;
      const count = pos.length / 3;

      for (let i = 0; i < count; i++) {
        const bx = base[i * 3];
        const by = base[i * 3 + 1];

        const drape = Math.sin(bx * 0.35 + by * 0.25 + t * 1.5) * (0.16 * (1.0 - easeLock * 0.6));
        const settling = Math.sin(t * 1.8) * (0.04 * easeLock);

        pos[i * 3] = bx;
        pos[i * 3 + 1] = by;
        pos[i * 3 + 2] = drape + settling;
      }
      this.pieceA.geometry.attributes.position.needsUpdate = true;
      this.pieceA.geometry.computeVertexNormals();
    }

    // 2. DINÁMICA DE LA PIEZA B (NUEVA GENERACIÓN: Ascenso ágil, flexión de contacto y adaptación)
    if (this.pieceB) {
      const initPosB = stageCenter.clone().add(new THREE.Vector3(0, -4.4, 0.1));
      const targetPosB = stageCenter.clone().add(new THREE.Vector3(0, -1.9, 0.12));
      this.pieceB.position.lerpVectors(initPosB, targetPosB, Math.min(1.0, easeMove));

      const initRotB = new THREE.Euler(-0.15, -0.2, 0.1);
      const targetRotB = new THREE.Euler(-0.02, -0.03, 0.01);
      this.pieceB.rotation.x = THREE.MathUtils.lerp(initRotB.x, targetRotB.x, easeMove);
      this.pieceB.rotation.y = THREE.MathUtils.lerp(initRotB.y, targetRotB.y, easeMove);
      this.pieceB.rotation.z = THREE.MathUtils.lerp(initRotB.z, targetRotB.z, easeMove);

      // Deformación elástica de seda viva (Squash & Stretch al contactar, seguida de adaptación armónica)
      const pos = this.pieceB.geometry.attributes.position.array;
      const base = this.basePosB;
      const count = pos.length / 3;

      const contactPulse = adaptProgress > 0 && adaptProgress < 1.0
        ? Math.sin(adaptProgress * Math.PI) * 0.4
        : 0;

      for (let i = 0; i < count; i++) {
        const bx = base[i * 3];
        const by = base[i * 3 + 1];

        // Ondulaciones fluidas de seda
        const silkWaves = Math.cos(bx * 0.6 - by * 0.5 + t * 2.6) * (0.28 * (1.0 - easeLock * 0.5));
        // Onda elástica de impacto en el borde superior (by > 0)
        const edgeReaction = by > 0 ? (Math.sin(bx * 1.5 + t * 4.0) * contactPulse) : 0;
        // Amoldamiento suave de encaje
        const interlockingDrape = by > 0 ? (Math.sin(bx * 0.8) * 0.12 * easeLock) : 0;

        pos[i * 3] = bx;
        pos[i * 3 + 1] = by;
        pos[i * 3 + 2] = silkWaves + edgeReaction + interlockingDrape;
      }
      this.pieceB.geometry.attributes.position.needsUpdate = true;
      this.pieceB.geometry.computeVertexNormals();
    }

    this.group.rotation.y = -0.05 + Math.sin(t * 0.1) * 0.025;
    this.group.rotation.x = 0.04 + Math.cos(t * 0.08) * 0.02;
  }
}
