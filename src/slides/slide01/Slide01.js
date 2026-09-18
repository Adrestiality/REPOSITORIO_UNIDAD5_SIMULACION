/**
 * Slide 01: RELEVO — Manta de Retazos (Patchwork) & Costura Prolija
 * Concepto: "RELEVO GENERACIONAL: LA VENTAJA QUE NADIE ESTÁ APROVECHANDO"
 * 
 * COREOGRAFÍA NARRATIVA & MOTION DESIGN:
 * - 4 retazos textiles de gran escala con texturas auténticas (Tweed grafito, Seda coral, Lino cyan, Algodón mostaza)
 *   más un parche romboidal central índigo.
 * - Cinemática de costura 100% física basada en principios de animación:
 *   1. Anticipación: La aguja apunta e inclina su punta hacia el punto de costura (Z > 0).
 *   2. Aceleración e impacto: Penetra limpiamente la tela; la punta cruza el plano a Z < 0.
 *   3. Inmersión y emergencia: Viaja bajo el plano textil y emerge en el siguiente extremo.
 *   4. Tensión y tracción de hilo: La aguja asciende tirando del hilo tenso; la tela responde elásticamente.
 *   5. Pespunte permanente en 3D: Deposita una puntada de relieve sin z-fighting.
 *   6. Cero colisiones erróneas, cero hilo flotante, cero clipping.
 */
import * as THREE from 'three';
import { BaseSlide } from '../../core/BaseSlide.js';
import { createPatchworkTexture, createTextileMaterial, createWeaveTexture } from '../../core/utils/textileMaterials.js';

export class Slide01 extends BaseSlide {
  constructor() {
    super('relevo-generacional', 'Patchwork Intergeneracional & Costura Prolija');
    this.patches = [];
    this.needleMesh = null;
    this.threadMesh = null;
    this.permanentStitches = [];
    this.stitchSequence = [];
    this.needleEyePos = new THREE.Vector3();
  }

  buildScene() {
    this.patches = [];
    this.permanentStitches = [];
    this.stitchSequence = [];

    // Centro del área textil desplazado a la derecha para dar holgura editorial al texto
    const quiltCenter = new THREE.Vector3(4.8, 0, 0);

    // =========================================================================
    // 1. CONFIGURACIÓN DE LOS RETAZOS (GEOMETRÍA LIMPIA, SIN COPLANARIDAD)
    // =========================================================================
    const pw = 6.2;
    const ph = 5.2;
    const gap = 0.08;

    const patchConfigs = [
      // Cuadrante 1: Top-Left (Tweed Grafito & Marfil - Experiencia)
      {
        id: 'tweed_tl',
        w: pw, h: ph,
        color: 0x334155,
        sheenCol: 0xf1f5f9,
        tex: createPatchworkTexture({ baseColor: '#334155', accentColor: '#cbd5e1', pattern: 'houndstooth' }),
        startPos: new THREE.Vector3(-14, 8, -4),
        targetPos: new THREE.Vector3(-pw / 2 - gap, ph / 2 + gap, 0.00).add(quiltCenter),
        startRot: new THREE.Euler(0.4, 0.6, -0.3),
        targetRot: new THREE.Euler(0, 0, 0),
        entryDelay: 0.15
      },
      // Cuadrante 2: Top-Right (Seda Coral / Magenta - Nueva Generación A)
      {
        id: 'silk_tr',
        w: pw, h: ph,
        color: 0xf43f5e,
        sheenCol: 0xffe4e6,
        tex: createPatchworkTexture({ baseColor: '#f43f5e', accentColor: '#fda4af', pattern: 'stripes' }),
        startPos: new THREE.Vector3(14, 8, 3),
        targetPos: new THREE.Vector3(pw / 2 + gap, ph / 2 + gap, 0.02).add(quiltCenter),
        startRot: new THREE.Euler(-0.5, -0.4, 0.5),
        targetRot: new THREE.Euler(0, 0, 0),
        entryDelay: 0.5
      },
      // Cuadrante 3: Bottom-Left (Lino Cyan - Nueva Generación B)
      {
        id: 'linen_bl',
        w: pw, h: ph,
        color: 0x08a9dd,
        sheenCol: 0xe0f2fe,
        tex: createPatchworkTexture({ baseColor: '#08a9dd', accentColor: '#bae6fd', pattern: 'grid' }),
        startPos: new THREE.Vector3(-14, -8, -2),
        targetPos: new THREE.Vector3(-pw / 2 - gap, -ph / 2 - gap, 0.01).add(quiltCenter),
        startRot: new THREE.Euler(0.6, -0.5, -0.4),
        targetRot: new THREE.Euler(0, 0, 0),
        entryDelay: 0.85
      },
      // Cuadrante 4: Bottom-Right (Algodón Mostaza con Lunares - Calidez & Encuentro)
      {
        id: 'cotton_br',
        w: pw, h: ph,
        color: 0xf59e0b,
        sheenCol: 0xfef3c7,
        tex: createPatchworkTexture({ baseColor: '#f59e0b', accentColor: '#fde68a', pattern: 'dots' }),
        startPos: new THREE.Vector3(14, -8, 2),
        targetPos: new THREE.Vector3(pw / 2 + gap, -ph / 2 - gap, 0.03).add(quiltCenter),
        startRot: new THREE.Euler(-0.3, 0.7, 0.2),
        targetRot: new THREE.Euler(0, 0, 0),
        entryDelay: 1.2
      },
      // Parche Central: Rombo Índigo de Unión
      {
        id: 'diamond_center',
        w: 3.6, h: 3.6,
        color: 0x2563eb,
        sheenCol: 0x93c5fd,
        tex: createWeaveTexture({ size: 128, type: 'plain', density: 16 }),
        startPos: new THREE.Vector3(0, 14, 4).add(quiltCenter),
        targetPos: new THREE.Vector3(0, 0, 0.07).add(quiltCenter),
        startRot: new THREE.Euler(0, 0, Math.PI / 4 + 0.8),
        targetRot: new THREE.Euler(0, 0, Math.PI / 4),
        entryDelay: 1.8
      }
    ];

    const seg = 24;
    patchConfigs.forEach((cfg) => {
      const geo = new THREE.PlaneGeometry(cfg.w, cfg.h, seg, seg);
      const basePos = geo.attributes.position.array.slice();

      const mat = createTextileMaterial({
        color: cfg.color,
        sheenColor: cfg.sheenCol,
        roughness: 0.55,
        clearcoat: 0.25,
        map: cfg.tex,
        bumpScale: 0.035
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(cfg.startPos);
      mesh.rotation.copy(cfg.startRot);
      this.group.add(mesh);

      // Dobladillo perimetral bordado fino
      const edgeGeo = new THREE.EdgesGeometry(new THREE.PlaneGeometry(cfg.w, cfg.h));
      const edgeMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
      });
      const edgeLine = new THREE.LineSegments(edgeGeo, edgeMat);
      edgeLine.position.z = 0.015;
      mesh.add(edgeLine);

      this.patches.push({
        mesh,
        basePos,
        cfg
      });
    });

    // =========================================================================
    // 2. SECUENCIA DE COSTURA FÍSICA Y PUNTADAS 3D
    // =========================================================================
    // Definición precisa de cada puntada: punto de entrada, punto de salida y timing
    this.stitchSequence = [
      // Costura vertical superior (entre Tweed y Seda)
      { in: new THREE.Vector3(0, 4.4, 0.05).add(quiltCenter), out: new THREE.Vector3(0, 3.6, 0.05).add(quiltCenter), tStart: 2.4, duration: 0.65 },
      { in: new THREE.Vector3(0, 3.2, 0.05).add(quiltCenter), out: new THREE.Vector3(0, 2.4, 0.05).add(quiltCenter), tStart: 3.1, duration: 0.65 },
      
      // Costura horizontal derecha (entre Seda y Algodón mostaza)
      { in: new THREE.Vector3(2.4, 0, 0.05).add(quiltCenter), out: new THREE.Vector3(3.4, 0, 0.05).add(quiltCenter), tStart: 3.8, duration: 0.65 },
      { in: new THREE.Vector3(4.0, 0, 0.05).add(quiltCenter), out: new THREE.Vector3(5.0, 0, 0.05).add(quiltCenter), tStart: 4.5, duration: 0.65 },
      
      // Costura vertical inferior (entre Lino y Algodón)
      { in: new THREE.Vector3(0, -2.4, 0.05).add(quiltCenter), out: new THREE.Vector3(0, -3.4, 0.05).add(quiltCenter), tStart: 5.2, duration: 0.65 },
      { in: new THREE.Vector3(0, -3.8, 0.05).add(quiltCenter), out: new THREE.Vector3(0, -4.6, 0.05).add(quiltCenter), tStart: 5.9, duration: 0.65 },
      
      // Costura horizontal izquierda (entre Tweed y Lino)
      { in: new THREE.Vector3(-2.4, 0, 0.05).add(quiltCenter), out: new THREE.Vector3(-3.4, 0, 0.05).add(quiltCenter), tStart: 6.6, duration: 0.65 },
      { in: new THREE.Vector3(-4.0, 0, 0.05).add(quiltCenter), out: new THREE.Vector3(-5.0, 0, 0.05).add(quiltCenter), tStart: 7.3, duration: 0.65 },
      
      // Costura perimetral del rombo central
      { in: new THREE.Vector3(0, 1.3, 0.10).add(quiltCenter), out: new THREE.Vector3(1.3, 0, 0.10).add(quiltCenter), tStart: 8.0, duration: 0.55 },
      { in: new THREE.Vector3(1.3, 0, 0.10).add(quiltCenter), out: new THREE.Vector3(0, -1.3, 0.10).add(quiltCenter), tStart: 8.6, duration: 0.55 },
      { in: new THREE.Vector3(0, -1.3, 0.10).add(quiltCenter), out: new THREE.Vector3(-1.3, 0, 0.10).add(quiltCenter), tStart: 9.2, duration: 0.55 },
      { in: new THREE.Vector3(-1.3, 0, 0.10).add(quiltCenter), out: new THREE.Vector3(0, 1.3, 0.10).add(quiltCenter), tStart: 9.8, duration: 0.55 }
    ];

    const stitchMat = new THREE.MeshPhysicalMaterial({
      color: 0x00f2fe,
      roughness: 0.2,
      metalness: 0.6,
      clearcoat: 1.0,
      emissive: 0x00f2fe,
      emissiveIntensity: 0.4
    });

    this.stitchSequence.forEach((seq) => {
      const mid = new THREE.Vector3().lerpVectors(seq.in, seq.out, 0.5);
      const len = seq.in.distanceTo(seq.out);
      const stitchGeo = new THREE.CylinderGeometry(0.045, 0.045, len, 8);
      const stitchMesh = new THREE.Mesh(stitchGeo, stitchMat);
      
      stitchMesh.position.copy(mid);
      // Orientar a lo largo del vector de entrada a salida
      const dir = new THREE.Vector3().subVectors(seq.out, seq.in).normalize();
      const up = new THREE.Vector3(0, 1, 0);
      stitchMesh.quaternion.setFromUnitVectors(up, dir);
      stitchMesh.visible = false;
      this.group.add(stitchMesh);

      this.permanentStitches.push({
        mesh: stitchMesh,
        seq,
        created: false
      });
    });

    // =========================================================================
    // 3. AGUJA DE COSTURA CON PROPORCIONES PRECISAS Y PUNTA AFILADA
    // =========================================================================
    const needleGroup = new THREE.Group();
    const needleMat = new THREE.MeshPhysicalMaterial({
      color: 0xf1f5f9,
      metalness: 0.98,
      roughness: 0.06,
      clearcoat: 1.0
    });

    // Cuerpo cilíndrico pulido (longitud 3.0)
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.08, 2.6, 16), needleMat);
    shaft.position.set(0, 1.3, 0);

    // Punta cónica penetrante (apunta en -Y local)
    const point = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.7, 16), needleMat);
    point.rotation.x = Math.PI;
    point.position.set(0, -0.35, 0);

    // Ojo de la aguja con orificio ovalado
    const eye = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.025, 8, 16), needleMat);
    eye.position.set(0, 2.55, 0);

    needleGroup.add(shaft, point, eye);
    needleGroup.position.set(12, 9, 6);
    this.needleMesh = needleGroup;
    this.group.add(this.needleMesh);

    // =========================================================================
    // 4. HILO CONTINUO CON TENSIÓN Y SEGUIMIENTO AL OJO
    // =========================================================================
    const threadMat = new THREE.MeshPhysicalMaterial({
      color: 0x00f2fe,
      roughness: 0.25,
      metalness: 0.2,
      clearcoat: 0.9,
      emissive: 0x00f2fe,
      emissiveIntensity: 0.35
    });

    const initCurve = new THREE.CatmullRomCurve3([
      quiltCenter.clone().add(new THREE.Vector3(0, 4.4, 0.05)),
      new THREE.Vector3(8, 7, 3),
      new THREE.Vector3(12, 9, 6)
    ]);
    const threadGeo = new THREE.TubeGeometry(initCurve, 32, 0.04, 8, false);
    this.threadMesh = new THREE.Mesh(threadGeo, threadMat);
    this.group.add(this.threadMesh);

    this.group.rotation.x = 0.05;
    this.group.rotation.y = -0.05;
  }

  update(deltaTime) {
    super.update(deltaTime);

    const t = this.time;
    const quiltCenter = new THREE.Vector3(4.8, 0, 0);

    // 1. Entrada fluida y elástica de los retazos
    this.patches.forEach((p) => {
      const cfg = p.cfg;
      if (t >= cfg.entryDelay) {
        const prog = Math.min(1.0, (t - cfg.entryDelay) / 1.6);
        const ease = prog < 0.7
          ? Math.pow(prog / 0.7, 2) * 1.03
          : 1.03 - Math.sin((prog - 0.7) / 0.3 * Math.PI * 0.5) * 0.03;

        p.mesh.position.lerpVectors(cfg.startPos, cfg.targetPos, Math.min(1.0, ease));
        p.mesh.rotation.x = THREE.MathUtils.lerp(cfg.startRot.x, cfg.targetRot.x, Math.min(1.0, ease));
        p.mesh.rotation.y = THREE.MathUtils.lerp(cfg.startRot.y, cfg.targetRot.y, Math.min(1.0, ease));
        p.mesh.rotation.z = THREE.MathUtils.lerp(cfg.startRot.z, cfg.targetRot.z, Math.min(1.0, ease));

        // Suave ondulación de drapeado al asentarse
        const pos = p.mesh.geometry.attributes.position.array;
        const base = p.basePos;
        const count = pos.length / 3;

        for (let k = 0; k < count; k++) {
          const bx = base[k * 3];
          const by = base[k * 3 + 1];
          const drape = Math.sin(bx * 0.4 + by * 0.4 + t * 1.6) * (0.06 * Math.min(1.0, ease));
          pos[k * 3 + 2] = drape;
        }
        p.mesh.geometry.attributes.position.needsUpdate = true;
      }
    });

    // 2. Cinemática física de la aguja (Preparación -> Perforación -> Inmersión -> Emergencia -> Tensión)
    let tipPos = new THREE.Vector3(12, 9, 6);
    let needleDir = new THREE.Vector3(0, -1, 0);
    let lastStitchAnchor = this.stitchSequence[0].in.clone();

    if (t < 2.4) {
      // Fase 0: Aproximación inicial de la aguja al primer punto de costura
      const u = Math.min(1.0, t / 2.4);
      const easeU = u * u * (3 - 2 * u);
      const targetPreStitch = this.stitchSequence[0].in.clone().add(new THREE.Vector3(0.5, 1.2, 2.5));
      tipPos.lerpVectors(new THREE.Vector3(12, 9, 6), targetPreStitch, easeU);
      needleDir.set(-0.2, -0.9, -0.3).normalize();
    } else if (t < 10.4) {
      // Búsqueda del ciclo de costura activo
      let currentCycle = null;
      let lastCompleted = null;

      for (let i = 0; i < this.stitchSequence.length; i++) {
        const seq = this.stitchSequence[i];
        if (t >= seq.tStart && t < seq.tStart + seq.duration) {
          currentCycle = { seq, idx: i, localT: (t - seq.tStart) / seq.duration };
          break;
        } else if (t >= seq.tStart + seq.duration) {
          lastCompleted = seq;
        }
      }

      if (lastCompleted) {
        lastStitchAnchor.copy(lastCompleted.out);
      }

      if (currentCycle) {
        const { seq, localT } = currentCycle;
        const pIn = seq.in;
        const pOut = seq.out;
        const stitchDir = new THREE.Vector3().subVectors(pOut, pIn).normalize();

        if (localT < 0.25) {
          // Fase 1: Anticipación y enfoque de la punta (Z = 1.8 -> 0.4 sobre pIn)
          const p = localT / 0.25;
          tipPos.set(
            pIn.x,
            pIn.y,
            THREE.MathUtils.lerp(1.8, 0.35, p)
          );
          needleDir.set(stitchDir.x * 0.3, stitchDir.y * 0.3, -0.95).normalize();
        } else if (localT < 0.50) {
          // Fase 2: Perforación limpia de la tela (Z pasa de 0.35 a -1.2 sumergiéndose limpiamente)
          const p = (localT - 0.25) / 0.25;
          const strikeEase = p * p;
          tipPos.set(
            pIn.x + stitchDir.x * (0.2 * p),
            pIn.y + stitchDir.y * (0.2 * p),
            THREE.MathUtils.lerp(0.35, -1.25, strikeEase)
          );
          needleDir.set(stitchDir.x * 0.6, stitchDir.y * 0.6, -0.8).normalize();
        } else if (localT < 0.75) {
          // Fase 3: Viaje subterráneo y re-emergencia en pOut (Z asciende de -1.25 a 0.8)
          const p = (localT - 0.50) / 0.25;
          tipPos.set(
            THREE.MathUtils.lerp(pIn.x, pOut.x, p),
            THREE.MathUtils.lerp(pIn.y, pOut.y, p),
            THREE.MathUtils.lerp(-1.25, 0.8, p)
          );
          needleDir.set(stitchDir.x * 0.4, stitchDir.y * 0.4, 0.9).normalize();
        } else {
          // Fase 4: Tracción y tensión del hilo (Z sube a 2.0 y tira con firmeza)
          const p = (localT - 0.75) / 0.25;
          const pullEase = Math.sin(p * Math.PI * 0.5);
          tipPos.set(
            pOut.x + (stitchDir.x * 0.3),
            pOut.y + (stitchDir.y * 0.3),
            THREE.MathUtils.lerp(0.8, 2.2, pullEase)
          );
          needleDir.set(0.1, 0.1, -0.98).normalize();
        }
      } else {
        // Pausa entre puntadas consecutivas
        const nextSeq = this.stitchSequence.find(s => s.tStart > t);
        if (nextSeq) {
          tipPos.copy(nextSeq.in).add(new THREE.Vector3(0, 0, 1.8));
          needleDir.set(0, 0, -1);
        }
      }
    } else {
      // Reposo final en la esquina superior derecha con presencia serena
      const restTarget = quiltCenter.clone().add(new THREE.Vector3(5.2, 4.4, 2.0));
      tipPos.copy(restTarget).add(new THREE.Vector3(0, Math.sin(t * 1.5) * 0.1, 0));
      needleDir.set(0.2, -0.4, -0.9).normalize();
      lastStitchAnchor.copy(this.stitchSequence[this.stitchSequence.length - 1].out);
    }

    // 3. Posicionamiento y orientación precisa de la aguja 3D
    if (this.needleMesh) {
      // needleMesh tiene su punta en local (0, -0.35, 0). Posicionamos el grupo para que la punta coincida con tipPos.
      this.needleMesh.position.copy(tipPos).add(new THREE.Vector3(0, 0.35, 0));

      const up = new THREE.Vector3(0, -1, 0);
      this.needleMesh.quaternion.setFromUnitVectors(up, needleDir);

      // Calcular la posición global del ojo de la aguja (en local Y = 2.55)
      this.needleEyePos.copy(this.needleMesh.position).add(
        needleDir.clone().multiplyScalar(-2.55)
      );
    }

    // 4. Activación visible de las puntadas depositadas
    this.permanentStitches.forEach((st) => {
      const isDone = t >= st.seq.tStart + (st.seq.duration * 0.7);
      st.mesh.visible = isDone;
      if (isDone && !st.created) {
        st.created = true;
        st.mesh.scale.set(1.15, 1.15, 1.15);
      } else if (st.created && st.mesh.scale.x > 1.0) {
        st.mesh.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    });

    // 5. Hilo continuo dinámico (Anclado a la última puntada -> Curva de tensión -> Ojo de la aguja)
    if (this.threadMesh && this.needleMesh) {
      const midPoint = new THREE.Vector3().lerpVectors(lastStitchAnchor, this.needleEyePos, 0.5);
      // Tensión elástica: menos arqueamiento cuanto más alta está la aguja
      const tensionSag = Math.sin(t * 4.0) * 0.15 + 0.25;
      midPoint.z += tensionSag;

      const dynamicThreadCurve = new THREE.CatmullRomCurve3([
        lastStitchAnchor,
        midPoint,
        this.needleEyePos
      ]);

      this.threadMesh.geometry.dispose();
      this.threadMesh.geometry = new THREE.TubeGeometry(dynamicThreadCurve, 28, 0.042, 8, false);
    }

    // Parallax sereno de cámara
    this.group.rotation.y = -0.05 + Math.sin(t * 0.1) * 0.025;
    this.group.rotation.x = 0.05 + Math.cos(t * 0.08) * 0.02;
  }
}
