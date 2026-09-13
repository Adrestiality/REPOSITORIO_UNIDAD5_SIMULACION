/**
 * Slide 10: Autoensamblaje y Formación del Cerebro 3D (Evolución Interacción 2)
 * Concepto: "El crecimiento no ocurre cuando una generación reemplaza a otra. Ocurre cuando trabajan juntas."
 * Toma los puntos congelados de las dos poblaciones (A: Cyan / B: Magenta) de Slide 9
 * y los transforma en un Cerebro 3D anatómicamente reconocible:
 * - Hemisferio Izquierdo: Población A (Cyan #08a9dd, Experiencia)
 * - Hemisferio Derecho: Población B (Magenta #f7353f, Juventud)
 * - Conexiones intra-hemisféricas (circunvoluciones y surcos)
 * - Puentes inter-hemisféricos vivos (Cuerpo Calloso)
 * - Impulsos sinápticos y respiración orgánica
 */
import * as THREE from 'three';
import { BaseSimulation } from './BaseSimulation.js';

export class Slide10Simulation extends BaseSimulation {
  constructor() {
    super('trabajan-juntas', 'Cerebro 3D Interconectado');
    this.pointsPerHemisphere = 120;
    this.totalPoints = this.pointsPerHemisphere * 2;
    this.particles = [];
    this.pulses = [];
    this.morphProgress = 0; // 0: dispersión inicial -> 1: cerebro formado
  }

  buildScene() {
    this.particles = [];
    this.pulses = [];
    this.morphProgress = 0;

    // Obtener puntos generados en Slide 9
    const existingPoints = this.stateManager ? this.stateManager.getPoints() : [];
    const groupAPoints = existingPoints.filter(p => p.group === 'A');
    const groupBPoints = existingPoints.filter(p => p.group === 'B');

    // Función matemática anatómica de corteza cerebral humana con circunvoluciones (gyri & sulci)
    const generateBrainTarget = (hemisphereSign, index, total) => {
      const u = (index / total) * Math.PI;
      const v = ((index % 14) / 14) * Math.PI - Math.PI / 2;

      // Geometría elipsoide modificada con lóbulos frontal, parietal, occipital y temporal
      const rX = 5.2 * Math.cos(v) * Math.sin(u) * (1 - 0.18 * Math.cos(2 * v));
      const rY = 6.2 * Math.sin(v) * (1 + 0.12 * Math.cos(u));
      const rZ = 8.5 * Math.cos(v) * Math.cos(u) + 1.2 * Math.sin(v);

      // Circunvoluciones y surcos corticales (gyri / sulci)
      const gyri = 0.45 * Math.sin(6 * u) * Math.cos(7 * v);

      const x = hemisphereSign * (1.1 + Math.abs(rX) + gyri);
      const y = rY + gyri;
      const z = rZ + gyri;

      return new THREE.Vector3(x, y, z);
    };

    const positions = new Float32Array(this.totalPoints * 3);
    const colors = new Float32Array(this.totalPoints * 3);

    const colA = new THREE.Color(0x08a9dd); // Cyan (Hemisferio Izquierdo)
    const colB = new THREE.Color(0xf7353f); // Magenta (Hemisferio Derecho)

    // Hemisferio Izquierdo - Población A
    for (let i = 0; i < this.pointsPerHemisphere; i++) {
      const targetBrain = generateBrainTarget(-1, i, this.pointsPerHemisphere);
      let startPos;

      if (groupAPoints.length > 0) {
        const seed = groupAPoints[i % groupAPoints.length];
        const jitter = (i >= groupAPoints.length) ? (Math.random() - 0.5) * 2.5 : 0;
        startPos = new THREE.Vector3(seed.x + jitter, seed.y + jitter, (seed.z || 0) + jitter);
      } else {
        startPos = new THREE.Vector3(-7.5 + (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 4);
      }

      positions[i * 3] = startPos.x;
      positions[i * 3 + 1] = startPos.y;
      positions[i * 3 + 2] = startPos.z;

      colors[i * 3] = colA.r;
      colors[i * 3 + 1] = colA.g;
      colors[i * 3 + 2] = colA.b;

      this.particles.push({
        id: `hemi_A_${i}`,
        start: startPos.clone(),
        target: targetBrain,
        current: startPos.clone(),
        hemisphere: -1,
        group: 'A',
        phase: Math.random() * Math.PI * 2,
        speed: 0.8 + Math.random() * 0.4
      });
    }

    // Hemisferio Derecho - Población B
    for (let i = 0; i < this.pointsPerHemisphere; i++) {
      const idx = this.pointsPerHemisphere + i;
      const targetBrain = generateBrainTarget(1, i, this.pointsPerHemisphere);
      let startPos;

      if (groupBPoints.length > 0) {
        const seed = groupBPoints[i % groupBPoints.length];
        const jitter = (i >= groupBPoints.length) ? (Math.random() - 0.5) * 2.5 : 0;
        startPos = new THREE.Vector3(seed.x + jitter, seed.y + jitter, (seed.z || 0) + jitter);
      } else {
        startPos = new THREE.Vector3(7.5 + (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 4);
      }

      positions[idx * 3] = startPos.x;
      positions[idx * 3 + 1] = startPos.y;
      positions[idx * 3 + 2] = startPos.z;

      colors[idx * 3] = colB.r;
      colors[idx * 3 + 1] = colB.g;
      colors[idx * 3 + 2] = colB.b;

      this.particles.push({
        id: `hemi_B_${i}`,
        start: startPos.clone(),
        target: targetBrain,
        current: startPos.clone(),
        hemisphere: 1,
        group: 'B',
        phase: Math.random() * Math.PI * 2,
        speed: 0.8 + Math.random() * 0.4
      });
    }

    // Puntos del Cerebro 3D
    const pointGeo = new THREE.BufferGeometry();
    pointGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pointMat = new THREE.PointsMaterial({
      size: 1.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    this.brainPoints = new THREE.Points(pointGeo, pointMat);
    this.group.add(this.brainPoints);

    // Conexiones sinápticas (Intra e Inter-hemisféricas / Cuerpo Calloso)
    const maxLineSegments = this.totalPoints * 5;
    const linePositions = new Float32Array(maxLineSegments * 6);
    const lineColors = new Float32Array(maxLineSegments * 6);

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    this.brainLines = new THREE.LineSegments(lineGeo, lineMat);
    this.group.add(this.brainLines);

    // Sistema de impulsos sinápticos
    this.createSynapticPulses();
  }

  createSynapticPulses() {
    this.pulseCount = 28;
    this.pulsePositions = new Float32Array(this.pulseCount * 3);
    this.pulseColors = new Float32Array(this.pulseCount * 3);

    for (let i = 0; i < this.pulseCount; i++) {
      // Impulsos que cruzan el cuerpo calloso o recorren la corteza
      const fromIdx = Math.floor(Math.random() * this.totalPoints);
      const toIdx = (fromIdx < this.pointsPerHemisphere)
        ? (this.pointsPerHemisphere + Math.floor(Math.random() * this.pointsPerHemisphere))
        : Math.floor(Math.random() * this.pointsPerHemisphere);

      this.pulses.push({
        fromIdx,
        toIdx,
        progress: Math.random(),
        speed: 0.4 + Math.random() * 0.6,
        isInterHemisphere: true
      });
    }

    const pulseGeo = new THREE.BufferGeometry();
    pulseGeo.setAttribute('position', new THREE.BufferAttribute(this.pulsePositions, 3));
    pulseGeo.setAttribute('color', new THREE.BufferAttribute(this.pulseColors, 3));

    const pulseMat = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });
    this.pulsePoints = new THREE.Points(pulseGeo, pulseMat);
    this.group.add(this.pulsePoints);
  }

  update(deltaTime) {
    super.update(deltaTime);
    if (!this.brainPoints || !this.brainLines) return;

    // Progresión suave de morfogénesis (0 a 1)
    this.morphProgress = Math.min(1.0, this.morphProgress + deltaTime * 0.45);
    const t = this.morphProgress;
    const smoothT = t * t * (3 - 2 * t); // Smoothstep

    const positions = this.brainPoints.geometry.attributes.position.array;
    const linePositions = this.brainLines.geometry.attributes.position.array;
    const lineColors = this.brainLines.geometry.attributes.color.array;

    const colA = new THREE.Color(0x08a9dd);
    const colB = new THREE.Color(0xf7353f);
    const colCallosum = new THREE.Color(0xffffff);

    // Morfado de nodos neuronales hacia el cerebro 3D
    for (let i = 0; i < this.totalPoints; i++) {
      const p = this.particles[i];
      const breathing = Math.sin(this.time * 1.6 + p.phase) * (0.12 * smoothT);
      const targetWithBreath = p.target.clone().addScalar(breathing);

      p.current.lerpVectors(p.start, targetWithBreath, smoothT);

      positions[i * 3] = p.current.x;
      positions[i * 3 + 1] = p.current.y;
      positions[i * 3 + 2] = p.current.z;
    }
    this.brainPoints.geometry.attributes.position.needsUpdate = true;

    // Dinámica de conexiones y cuerpo calloso
    let lineIdx = 0;
    const maxIntraDistSq = 4.2 * 4.2;
    const maxInterDistSq = 5.2 * 5.2;

    for (let i = 0; i < this.totalPoints; i++) {
      for (let j = i + 1; j < this.totalPoints; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];
        const dSq = p1.current.distanceToSquared(p2.current);

        const isSameHemi = p1.hemisphere === p2.hemisphere;
        const shouldConnect = (isSameHemi && dSq < maxIntraDistSq) || 
                              (!isSameHemi && dSq < maxInterDistSq && Math.abs(p1.current.y) < 3.8);

        if (shouldConnect && lineIdx < linePositions.length - 6) {
          linePositions[lineIdx] = p1.current.x;
          linePositions[lineIdx + 1] = p1.current.y;
          linePositions[lineIdx + 2] = p1.current.z;
          linePositions[lineIdx + 3] = p2.current.x;
          linePositions[lineIdx + 4] = p2.current.y;
          linePositions[lineIdx + 5] = p2.current.z;

          const col = !isSameHemi ? colCallosum : (p1.hemisphere === -1 ? colA : colB);
          for (let k = 0; k < 2; k++) {
            lineColors[lineIdx + k * 3] = col.r;
            lineColors[lineIdx + k * 3 + 1] = col.g;
            lineColors[lineIdx + k * 3 + 2] = col.b;
          }

          lineIdx += 6;
        }
      }
    }

    // Limpiar líneas sobrantes
    for (let k = lineIdx; k < linePositions.length; k++) {
      linePositions[k] = 0;
    }

    this.brainLines.geometry.attributes.position.needsUpdate = true;
    this.brainLines.geometry.attributes.color.needsUpdate = true;

    // Actualizar impulsos sinápticos
    if (this.pulsePoints && this.pulses.length > 0) {
      const pulsePos = this.pulsePoints.geometry.attributes.position.array;
      const pulseCol = this.pulsePoints.geometry.attributes.color.array;

      for (let i = 0; i < this.pulses.length; i++) {
        const pulse = this.pulses[i];
        pulse.progress += deltaTime * pulse.speed;
        if (pulse.progress >= 1.0) {
          pulse.progress = 0;
          pulse.fromIdx = Math.floor(Math.random() * this.totalPoints);
          pulse.toIdx = (pulse.fromIdx < this.pointsPerHemisphere)
            ? (this.pointsPerHemisphere + Math.floor(Math.random() * this.pointsPerHemisphere))
            : Math.floor(Math.random() * this.pointsPerHemisphere);
        }

        const p1 = this.particles[pulse.fromIdx];
        const p2 = this.particles[pulse.toIdx];
        const currentPos = new THREE.Vector3().lerpVectors(p1.current, p2.current, pulse.progress);

        pulsePos[i * 3] = currentPos.x;
        pulsePos[i * 3 + 1] = currentPos.y;
        pulsePos[i * 3 + 2] = currentPos.z;

        // Destello brillante blanco/cyan
        pulseCol[i * 3] = 0.95;
        pulseCol[i * 3 + 1] = 0.98;
        pulseCol[i * 3 + 2] = 1.0;
      }

      this.pulsePoints.geometry.attributes.position.needsUpdate = true;
      this.pulsePoints.geometry.attributes.color.needsUpdate = true;
    }

    // Rotación 3D majestuosa del cerebro
    this.group.rotation.y = this.time * 0.12;
    this.group.rotation.x = Math.sin(this.time * 0.06) * 0.1;
  }
}

