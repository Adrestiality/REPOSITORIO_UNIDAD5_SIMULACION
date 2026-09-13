/**
 * Slide 11: Perturbación y Sincronización de Kuramoto
 * Concepto: "Los jóvenes no son el futuro. Son el presente que muchas organizaciones aún no ven."
 * Inspiración: Modelo de Kuramoto de osciladores acoplados por fase, propagación de perturbación
 * y emergencia de un nuevo orden sincrónico colectivo.
 */
import * as THREE from 'three';
import { BaseSimulation } from './BaseSimulation.js';

export class Slide11Simulation extends BaseSimulation {
  constructor() {
    super('presente-joven', 'Sincronización de Kuramoto');
    this.oscillatorCount = 80;
    this.oscillators = [];
    this.couplingK = 2.4; // Fuerza de acoplamiento de Kuramoto
    this.perturbationTimer = 0;
  }

  buildScene() {
    this.oscillators = [];
    const positions = new Float32Array(this.oscillatorCount * 3);
    const colors = new Float32Array(this.oscillatorCount * 3);

    // Malla toroidal/esferoide de osciladores acoplados
    for (let i = 0; i < this.oscillatorCount; i++) {
      const u = Math.random() * Math.PI * 2;
      const v = (Math.random() - 0.5) * Math.PI;
      const r = 9.0 + (Math.random() - 0.5) * 2.5;

      const x = r * Math.cos(v) * Math.cos(u);
      const y = r * Math.sin(v) * 0.8;
      const z = r * Math.cos(v) * Math.sin(u);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      this.oscillators.push({
        pos: new THREE.Vector3(x, y, z),
        phase: Math.random() * Math.PI * 2,
        naturalFreq: 1.2 + (Math.random() - 0.5) * 0.6,
        neighbors: [],
        amplitude: 1.0
      });
    }

    // Identificar vecinos espaciales para acoplamiento de Kuramoto
    const linePositions = [];
    const maxDistSq = 6.5 * 6.5;

    for (let i = 0; i < this.oscillatorCount; i++) {
      for (let j = i + 1; j < this.oscillatorCount; j++) {
        const dSq = this.oscillators[i].pos.distanceToSquared(this.oscillators[j].pos);
        if (dSq < maxDistSq) {
          this.oscillators[i].neighbors.push(j);
          this.oscillators[j].neighbors.push(i);
          linePositions.push(
            this.oscillators[i].pos.x, this.oscillators[i].pos.y, this.oscillators[i].pos.z,
            this.oscillators[j].pos.x, this.oscillators[j].pos.y, this.oscillators[j].pos.z
          );
        }
      }
    }

    // Líneas de acoplamiento de fase
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x08a9dd,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending
    });
    this.couplingLines = new THREE.LineSegments(lineGeo, lineMat);
    this.group.add(this.couplingLines);

    // Puntos de osciladores
    const pointGeo = new THREE.BufferGeometry();
    pointGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pointMat = new THREE.PointsMaterial({
      size: 1.3,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });
    this.pointMesh = new THREE.Points(pointGeo, pointMat);
    this.group.add(this.pointMesh);
  }

  update(deltaTime) {
    super.update(deltaTime);
    if (!this.pointMesh) return;

    this.perturbationTimer += deltaTime;

    // Inyección periódica de perturbación (cada 6.5 segundos)
    if (this.perturbationTimer > 6.5) {
      this.perturbationTimer = 0;
      // Perturbar un grupo local de osciladores con desfase abrupto
      const focalIndex = Math.floor(Math.random() * this.oscillatorCount);
      const focalPos = this.oscillators[focalIndex].pos;

      for (let i = 0; i < this.oscillatorCount; i++) {
        const dist = this.oscillators[i].pos.distanceTo(focalPos);
        if (dist < 8.0) {
          this.oscillators[i].phase += Math.PI * (1.2 - dist / 8.0);
          this.oscillators[i].amplitude = 2.2;
        }
      }
    }

    const positions = this.pointMesh.geometry.attributes.position.array;
    const colors = this.pointMesh.geometry.attributes.color.array;

    const colSync = new THREE.Color(0x08a9dd); // Azul sincronizado
    const colPerturb = new THREE.Color(0xf7353f); // Rojo perturbación
    const colPeak = new THREE.Color(0xffffff);

    // Dinámica diferencial de Kuramoto: dθ_i/dt = ω_i + (K/N) Σ sin(θ_j - θ_i)
    for (let i = 0; i < this.oscillatorCount; i++) {
      const osc = this.oscillators[i];
      let couplingSum = 0;

      for (const neighborIdx of osc.neighbors) {
        const neighborPhase = this.oscillators[neighborIdx].phase;
        couplingSum += Math.sin(neighborPhase - osc.phase);
      }

      const neighborCount = Math.max(1, osc.neighbors.length);
      const phaseVel = osc.naturalFreq + (this.couplingK / neighborCount) * couplingSum;
      osc.phase = (osc.phase + phaseVel * deltaTime) % (Math.PI * 2);

      // Atenuación de amplitud de perturbación hacia estado basal
      osc.amplitude = Math.max(1.0, osc.amplitude - deltaTime * 0.8);

      // Desplazamiento radial armónico según la fase
      const wave = Math.cos(osc.phase);
      const radialOffset = wave * 0.8 * osc.amplitude;
      const normal = osc.pos.clone().normalize();
      const currentPos = osc.pos.clone().add(normal.multiplyScalar(radialOffset));

      positions[i * 3] = currentPos.x;
      positions[i * 3 + 1] = currentPos.y;
      positions[i * 3 + 2] = currentPos.z;

      // Color dependiente de la fase e intensidad de perturbación
      const phaseNorm = (wave + 1) * 0.5; // 0..1
      let c = colSync.clone().lerp(colPeak, phaseNorm * 0.6);
      if (osc.amplitude > 1.2) {
        c = c.lerp(colPerturb, (osc.amplitude - 1.0) / 1.2);
      }

      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    this.pointMesh.geometry.attributes.position.needsUpdate = true;
    this.pointMesh.geometry.attributes.color.needsUpdate = true;

    this.group.rotation.y = this.time * 0.08;
    this.group.rotation.x = Math.sin(this.time * 0.04) * 0.12;
  }
}
