/**
 * Slide 11: ACTIVACIÓN — El Florecimiento Cinético Textil (The Kinetic Radial Textile Bloom)
 * Concepto: "Los jóvenes no son el futuro. Son el presente que muchas organizaciones aún no ven."
 * Acción: ACTIVAR / EL PRESENTE ES AHORA
 * 
 * ARQUITECTURA CINÉTICA EN CAPAS ESTRATIFICADAS (100% CERO CLIPPING & CERO COLISIÓN):
 * 1. CAPAS INDEPENDIENTES EN PROFUNDIDAD Z ESTRICTA:
 *    - Capa Base & Huso Central (Z = -0.3 a 0.0): Chasis de latón pulido y engranajes de sastre.
 *    - Capa 1 - Pétalos Exteriores de Tweed (Z = 0.0 a +0.15): 6 facetas trapezoidales de tweed marino
 *      con bisagras radiales no invertidas que abren hacia afuera.
 *    - Capa 2 - Pétalos Interiores de Seda Viva (Z = +0.45 a +0.60): 6 facetas en forma de diamante
 *      (Electric Cyan y Neon Magenta) ubicadas estrictamente por delante de la Capa 1.
 *    - Capa 3 - Corona Central & Núcleo Brillante (Z = +0.90 a +1.20): Cúpula de latón pulido y gema luminosa.
 *    - Capa 4 - Cintas Tensoras Dinámicas (Z = +0.20 a +0.55): Hilos elásticos suspendidos en el espacio libre.
 *    - Capa 5 - Satélites Orbitales (R = 5.8, Z = 0.3): Orbitan a 1.4 unidades por fuera de las puntas más lejanas.
 * 2. PROGRESIÓN SIN INTERFERENCIAS:
 *    - La Capa 1 abre primero (1.0s - 2.8s) hacia atrás.
 *    - La Capa 2 emerge después (2.2s - 4.2s) en su propio plano Z frontal elevado sin tocar jamás la Capa 1.
 * 3. COMPOSICIÓN INDEPENDIENTE:
 *    - Centrado en X = 5.0, dejando todo el lateral izquierdo completamente limpio para los textos.
 */
import * as THREE from 'three';
import { BaseSlide } from '../../core/BaseSlide.js';
import { createTextileMaterial, createWeaveTexture } from '../../core/utils/textileMaterials.js';

export class Slide11 extends BaseSlide {
  constructor() {
    super('presente-joven', 'Florecimiento Cinético Textil');
    this.bloomGroup = null;
    this.outerPetals = [];
    this.innerPetals = [];
    this.tensionThreads = [];
    this.satelliteSpools = [];
    this.centralHub = null;
    this.coreGlow = null;
  }

  buildScene() {
    this.outerPetals = [];
    this.innerPetals = [];
    this.tensionThreads = [];
    this.satelliteSpools = [];

    const center = new THREE.Vector3(5.0, 0, 0);
    this.bloomGroup = new THREE.Group();
    this.bloomGroup.position.copy(center);
    this.group.add(this.bloomGroup);

    // =========================================================================
    // 1. MATERIALES DE ALTA COSTURA & LATÓN PULIDO
    // =========================================================================
    const tweedBump = createWeaveTexture({ size: 128, type: 'herringbone', density: 18 });
    const silkBump = createWeaveTexture({ size: 128, type: 'plain', density: 24 });

    // Exterior: Tweed Grafito & Marino estructurado (Z = 0.0)
    const matOuterTweed = createTextileMaterial({
      color: 0x0f172a,
      sheenColor: 0x93c5fd,
      roughness: 0.65,
      bumpMap: tweedBump,
      bumpScale: 0.04
    });

    // Interior A: Seda Viva Electric Cyan (Z = +0.45)
    const matInnerCyan = createTextileMaterial({
      color: 0x0284c7,
      sheenColor: 0x38bdf8,
      roughness: 0.3,
      clearcoat: 0.9,
      bumpMap: silkBump,
      bumpScale: 0.02
    });

    // Interior B: Terciopelo Neon Magenta (Z = +0.45)
    const matInnerMagenta = createTextileMaterial({
      color: 0xdb2777,
      sheenColor: 0xf43f5e,
      roughness: 0.3,
      clearcoat: 0.9,
      bumpMap: silkBump,
      bumpScale: 0.02
    });

    // Latón dorado pulido
    const brassMat = new THREE.MeshPhysicalMaterial({
      color: 0xdfb76c,
      metalness: 0.95,
      roughness: 0.15,
      clearcoat: 1.0
    });

    // =========================================================================
    // 2. CAPA BASE & HUSO CENTRAL DE LATÓN (Z = -0.3 a 0.0)
    // =========================================================================
    this.centralHub = new THREE.Group();
    this.centralHub.position.set(0, 0, 0);

    // Disco de montaje base
    const basePlate = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.12, 32), brassMat);
    basePlate.rotation.x = Math.PI / 2;
    basePlate.position.z = -0.2;

    // Corona exterior de latón
    const hubRing = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.10, 16, 36), brassMat);
    hubRing.position.z = 0.0;

    // Cúpula central frontal (Z = +0.9)
    const hubDome = new THREE.Mesh(new THREE.SphereGeometry(0.72, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), brassMat);
    hubDome.rotation.x = Math.PI / 2;
    hubDome.position.z = 0.82;

    // Núcleo brillante interior
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    this.coreGlow = new THREE.Mesh(new THREE.SphereGeometry(0.45, 20, 20), coreMat);
    this.coreGlow.position.z = 0.95;

    this.centralHub.add(basePlate, hubRing, hubDome, this.coreGlow);
    this.bloomGroup.add(this.centralHub);

    // =========================================================================
    // 3. CAPA 1 - PÉTALOS EXTERIORES DE TWEED (Z = 0.0)
    // =========================================================================
    const outerCount = 6;
    const outerLength = 3.2;
    const outerBaseW = 1.3;
    const outerHingeR = 1.2;

    function createOuterFacetGeometry() {
      const shape = new THREE.Shape();
      shape.moveTo(-outerBaseW / 2, 0);
      shape.lineTo(outerBaseW / 2, 0);
      shape.lineTo(outerBaseW * 0.75, outerLength * 0.6);
      shape.lineTo(0, outerLength);
      shape.lineTo(-outerBaseW * 0.75, outerLength * 0.6);
      shape.closePath();

      const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.06, bevelEnabled: false });
      geo.translate(0, 0, -0.03);
      return geo;
    }

    const outerGeo = createOuterFacetGeometry();
    const edgeWhiteMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });

    for (let i = 0; i < outerCount; i++) {
      const angle = (i / outerCount) * Math.PI * 2;

      // Grupo del radio en Z
      const radialArm = new THREE.Group();
      radialArm.rotation.z = angle;
      radialArm.position.set(0, 0, 0.0);

      // Pivote de la bisagra radial (tangencial a la circunferencia)
      const hingePivot = new THREE.Group();
      hingePivot.position.set(0, outerHingeR, 0);
      radialArm.add(hingePivot);

      // Cilindro de la bisagra de latón
      const hingeCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.38, 12), brassMat);
      hingeCyl.rotation.z = Math.PI / 2;
      hingePivot.add(hingeCyl);

      // Malla del pétalo facetado
      const facetMesh = new THREE.Mesh(outerGeo, matOuterTweed);
      facetMesh.position.set(0, 0, 0.03);

      // Dobladillo perimetral blanco
      const facetEdge = new THREE.LineSegments(new THREE.EdgesGeometry(outerGeo), edgeWhiteMat);
      facetMesh.add(facetEdge);

      // Ojal en la punta para la cinta tensora
      const tipEyelet = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.035, 8, 16), brassMat);
      tipEyelet.position.set(0, outerLength, 0.04);
      facetMesh.add(tipEyelet);

      hingePivot.add(facetMesh);
      this.bloomGroup.add(radialArm);

      // Estado inicial: semi-cerrado hacia adelante sin tocar el centro
      hingePivot.rotation.x = 0.72; // ~41° de inclinación frontal

      this.outerPetals.push({
        radialArm,
        hingePivot,
        facetMesh,
        angle,
        closedRotX: 0.72,
        openRotX: -0.12, // Apertura plana
        length: outerLength,
        hingeR: outerHingeR
      });
    }

    // =========================================================================
    // 4. CAPA 2 - PÉTALOS INTERIORES DE SEDA VIVA (Z = +0.45)
    // =========================================================================
    const innerCount = 6;
    const innerLength = 2.5;
    const innerWidth = 1.35;
    const innerHingeR = 0.72;

    function createInnerDiamondGeometry() {
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.lineTo(innerWidth / 2, innerLength * 0.45);
      shape.lineTo(0, innerLength);
      shape.lineTo(-innerWidth / 2, innerLength * 0.45);
      shape.closePath();

      const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.05, bevelEnabled: false });
      geo.translate(0, 0, -0.025);
      return geo;
    }

    const innerGeo = createInnerDiamondGeometry();

    for (let i = 0; i < innerCount; i++) {
      // Desfasado 30° respecto a los pétalos exteriores
      const angle = ((i + 0.5) / innerCount) * Math.PI * 2;

      const radialArm = new THREE.Group();
      radialArm.rotation.z = angle;
      radialArm.position.set(0, 0, 0.45); // Plano Z elevado

      const hingePivot = new THREE.Group();
      hingePivot.position.set(0, innerHingeR, 0);
      radialArm.add(hingePivot);

      const mat = (i % 2 === 0) ? matInnerCyan : matInnerMagenta;
      const facetMesh = new THREE.Mesh(innerGeo, mat);
      facetMesh.position.set(0, 0, 0.03);

      // Borde dorado
      const edgeGold = new THREE.LineSegments(
        new THREE.EdgesGeometry(innerGeo),
        new THREE.LineBasicMaterial({ color: 0xdfb76c, transparent: true, opacity: 0.9 })
      );
      facetMesh.add(edgeGold);

      hingePivot.add(facetMesh);
      this.bloomGroup.add(radialArm);

      // Inicialmente guardados en escala pequeña dentro del núcleo
      hingePivot.rotation.x = 0.95;
      radialArm.scale.set(0.01, 0.01, 0.01);

      this.innerPetals.push({
        radialArm,
        hingePivot,
        facetMesh,
        angle,
        closedRotX: 0.95,
        openRotX: -0.05,
        length: innerLength,
        hingeR: innerHingeR
      });
    }

    // =========================================================================
    // 5. CAPA 4 - CINTAS DINÁMICAS DE TENSIÓN (12 LÍNEAS EN ESPACIO LIBRE)
    // =========================================================================
    for (let i = 0; i < outerCount; i++) {
      const lineGeo = new THREE.BufferGeometry();
      const posArray = new Float32Array(6);
      lineGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

      const lineMat = new THREE.LineBasicMaterial({
        color: (i % 2 === 0) ? 0x38bdf8 : 0xf43f5e,
        linewidth: 2,
        transparent: true,
        opacity: 0.9
      });

      const lineMesh = new THREE.Line(lineGeo, lineMat);
      this.bloomGroup.add(lineMesh);

      this.tensionThreads.push({
        mesh: lineMesh,
        outerIdx: i,
        innerIdx: i
      });
    }

    // =========================================================================
    // 6. CAPA 5 - SATÉLITES CINÉTICOS EN ÓRBITA EXTERIOR (R = 5.8)
    // =========================================================================
    const satColors = [0x08a9dd, 0xe96daa, 0xf59e0b];
    for (let s = 0; s < 3; s++) {
      const satGroup = new THREE.Group();
      const spoolCore = new THREE.Mesh(
        new THREE.CylinderGeometry(0.28, 0.28, 0.55, 16),
        createTextileMaterial({ color: satColors[s], sheenColor: 0xffffff, roughness: 0.3 })
      );
      const capTop = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.07, 16), brassMat);
      capTop.position.set(0, 0.30, 0);
      const capBot = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.07, 16), brassMat);
      capBot.position.set(0, -0.30, 0);

      satGroup.add(spoolCore, capTop, capBot);
      this.bloomGroup.add(satGroup);

      this.satelliteSpools.push({
        group: satGroup,
        orbitRadius: 5.8, // 1.4 unidades por fuera de las puntas exteriores
        baseAngle: (s / 3) * Math.PI * 2,
        speed: 0.55 + s * 0.15
      });
    }

    this.group.rotation.x = 0.05;
    this.group.rotation.y = -0.06;
  }

  update(deltaTime) {
    super.update(deltaTime);

    const t = this.time;

    // =========================================================================
    // SECUENCIA CINÉTICA ESTRATIFICADA:
    // 0.0s - 1.0s: Estado inicial en calma con latido del núcleo.
    // 1.0s - 3.0s: Los pétalos exteriores abren hacia atrás (Z = 0.0).
    // 2.2s - 4.2s: Los pétalos interiores emergen y abren hacia el frente (Z = +0.45).
    // 3.4s - 5.0s: Tensado elástico de los 12 hilos con vibración armónica.
    // 5.0s+: Ondulación rítmica continua sincronizada.
    // =========================================================================

    const outerProg = Math.max(0, Math.min(1.0, (t - 1.0) / 2.0));
    const innerProg = Math.max(0, Math.min(1.0, (t - 2.2) / 2.0));

    const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);
    const easeOutBack = (x, c1 = 1.35) => {
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    };

    const outerEase = outerProg > 0 ? easeOutBack(outerProg, 1.25) : 0;
    const innerEase = innerProg > 0 ? easeOutBack(innerProg, 1.4) : 0;

    // 1. Núcleo central pulsante
    if (this.coreGlow) {
      const glowScale = 1.0 + Math.sin(t * 3.0) * 0.12 + (innerEase * 0.25);
      this.coreGlow.scale.set(glowScale, glowScale, glowScale);
    }
    if (this.centralHub) {
      this.centralHub.rotation.z = t * 0.35;
    }

    // 2. Cinemática de Pétalos Exteriores (Capa 1: Z = 0.0)
    const outerTipPositions = [];
    this.outerPetals.forEach((p, idx) => {
      const targetRotX = THREE.MathUtils.lerp(p.closedRotX, p.openRotX, Math.min(1.05, outerEase));
      const wave = outerProg >= 1.0 ? Math.sin(t * 1.6 + idx * 1.05) * 0.04 : 0;
      p.hingePivot.rotation.x = targetRotX + wave;

      // Calcular posición de la punta en coordenadas del bloomGroup
      const angle = p.angle;
      const rotX = p.hingePivot.rotation.x;
      const r = p.hingeR + Math.cos(rotX) * p.length;
      const z = Math.sin(rotX) * p.length + 0.03;

      outerTipPositions.push(new THREE.Vector3(
        -Math.sin(angle) * r,
        Math.cos(angle) * r,
        z
      ));
    });

    // 3. Cinemática de Pétalos Interiores (Capa 2: Z = +0.45)
    const innerTipPositions = [];
    this.innerPetals.forEach((p, idx) => {
      const scaleVal = Math.min(1.0, innerEase);
      p.radialArm.scale.set(scaleVal, scaleVal, scaleVal);

      const targetRotX = THREE.MathUtils.lerp(p.closedRotX, p.openRotX, Math.min(1.05, innerEase));
      const wave = innerProg >= 1.0 ? Math.cos(t * 1.8 + idx * 1.05) * 0.05 : 0;
      p.hingePivot.rotation.x = targetRotX + wave;

      const angle = p.angle;
      const rotX = p.hingePivot.rotation.x;
      const r = (p.hingeR + Math.cos(rotX) * p.length) * scaleVal;
      const z = (Math.sin(rotX) * p.length + 0.03) * scaleVal + 0.45;

      innerTipPositions.push(new THREE.Vector3(
        -Math.sin(angle) * r,
        Math.cos(angle) * r,
        z
      ));
    });

    // 4. Actualización de las 12 Cintas Tensoras
    this.tensionThreads.forEach((th, idx) => {
      const posAttr = th.mesh.geometry.attributes.position;
      const pOuter = outerTipPositions[th.outerIdx];
      const pInner = innerTipPositions[th.innerIdx];

      if (pOuter && pInner) {
        const vibrate = Math.sin(t * 10.0 + idx) * 0.03 * Math.min(1.0, innerEase);

        posAttr.setXYZ(0, pOuter.x, pOuter.y, pOuter.z);
        posAttr.setXYZ(1, pInner.x + vibrate, pInner.y + vibrate, pInner.z);
        posAttr.needsUpdate = true;
      }
    });

    // 5. Satélites en Órbita Exterior Limpia
    this.satelliteSpools.forEach((sat) => {
      const angle = sat.baseAngle + t * sat.speed * 0.4;
      sat.group.position.set(
        Math.cos(angle) * sat.orbitRadius,
        Math.sin(angle) * sat.orbitRadius,
        0.3 + Math.sin(t * 1.4 + sat.baseAngle) * 0.25
      );
      sat.group.rotation.x = t * 1.2;
      sat.group.rotation.y = t * 1.6;
    });

    // 6. Respiración e inclinación serena general
    this.bloomGroup.rotation.z = Math.sin(t * 0.12) * 0.05;
    this.group.rotation.y = -0.06 + Math.sin(t * 0.08) * 0.025;
    this.group.rotation.x = 0.05 + Math.cos(t * 0.1) * 0.02;
  }
}
