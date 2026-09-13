/**
 * Slide 02: Actividad Eléctrica Latente
 * Concepto: "¿un gran auditorio solo para hacer grados?"
 * Inspiración: Potenciales basales en reposo, micro-señales ambientales que recorren la estructura.
 */
import * as THREE from 'three';
import { BaseSimulation } from './BaseSimulation.js';

export class Slide02Simulation extends BaseSimulation {
  constructor() {
    super('auditorio-grados', 'Actividad Latente');
    this.nodeCount = 75;
    this.nodes = [];
    this.signals = [];
    this.signalCount = 14;
  }

  buildScene() {
    this.nodes = [];
    const positions = new Float32Array(this.nodeCount * 3);
    const colors = new Float32Array(this.nodeCount * 3);

    const baseCol = new THREE.Color(0x08a9dd);
    const latentCol = new THREE.Color(0x223548);

    for (let i = 0; i < this.nodeCount; i++) {
      const u = Math.random() * Math.PI * 2;
      const v = (Math.random() - 0.5) * 16;
      const r = 10 + Math.sin(v * 0.4) * 3 + (Math.random() - 0.5) * 4;

      const x = Math.cos(u) * r;
      const y = v * 0.9;
      const z = Math.sin(u) * r * 0.7;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      colors[i * 3] = latentCol.r;
      colors[i * 3 + 1] = latentCol.g;
      colors[i * 3 + 2] = latentCol.b;

      this.nodes.push({
        pos: new THREE.Vector3(x, y, z),
        potential: 0.1 + Math.random() * 0.2,
        phase: Math.random() * Math.PI * 2,
        neighbors: []
      });
    }

    // Interconexiones de potencial basal
    const linePositions = [];
    const maxDistSq = 9 * 9;
    for (let i = 0; i < this.nodeCount; i++) {
      for (let j = i + 1; j < this.nodeCount; j++) {
        const dSq = this.nodes[i].pos.distanceToSquared(this.nodes[j].pos);
        if (dSq < maxDistSq) {
          this.nodes[i].neighbors.push(j);
          this.nodes[j].neighbors.push(i);
          linePositions.push(
            this.nodes[i].pos.x, this.nodes[i].pos.y, this.nodes[i].pos.z,
            this.nodes[j].pos.x, this.nodes[j].pos.y, this.nodes[j].pos.z
          );
        }
      }
    }

    // Malla de filamentos en reposo
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x08a9dd,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending
    });
    this.networkLines = new THREE.LineSegments(lineGeo, lineMat);
    this.group.add(this.networkLines);

    // Nodos
    const pointGeo = new THREE.BufferGeometry();
    pointGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pointMat = new THREE.PointsMaterial({
      size: 0.85,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    this.pointMesh = new THREE.Points(pointGeo, pointMat);
    this.group.add(this.pointMesh);

    // Señales viajeras (micro-pulsos eléctricos latentes)
    this.signals = [];
    const sigGeo = new THREE.BufferGeometry();
    const sigPos = new Float32Array(this.signalCount * 3);
    sigGeo.setAttribute('position', new THREE.BufferAttribute(sigPos, 3));
    const sigMat = new THREE.PointsMaterial({
      color: 0x00f2fe,
      size: 1.4,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    this.signalPoints = new THREE.Points(sigGeo, sigMat);
    this.group.add(this.signalPoints);

    for (let s = 0; s < this.signalCount; s++) {
      const fromNode = Math.floor(Math.random() * this.nodeCount);
      const neighbors = this.nodes[fromNode].neighbors;
      const toNode = neighbors.length > 0 ? neighbors[Math.floor(Math.random() * neighbors.length)] : fromNode;
      this.signals.push({
        from: fromNode,
        to: toNode,
        progress: Math.random(),
        speed: 0.3 + Math.random() * 0.4
      });
    }
  }

  update(deltaTime) {
    super.update(deltaTime);
    if (!this.pointMesh || !this.signalPoints) return;

    const colors = this.pointMesh.geometry.attributes.color.array;
    const baseCol = new THREE.Color(0x08a9dd);
    const latentCol = new THREE.Color(0x182430);
    const activeCol = new THREE.Color(0x00f2fe);

    // Onda sinusoidal sutil de potencial eléctrico basal
    for (let i = 0; i < this.nodeCount; i++) {
      const n = this.nodes[i];
      const oscillation = (Math.sin(this.time * 0.9 + n.phase) + 1) * 0.5;
      const c = latentCol.clone().lerp(baseCol, oscillation * 0.5);

      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    // Actualizar micro-señales viajeras
    const sigPositions = this.signalPoints.geometry.attributes.position.array;
    for (let s = 0; s < this.signalCount; s++) {
      const sig = this.signals[s];
      sig.progress += deltaTime * sig.speed;

      if (sig.progress >= 1) {
        sig.progress = 0;
        sig.from = sig.to;
        const neighbors = this.nodes[sig.from].neighbors;
        sig.to = neighbors.length > 0 ? neighbors[Math.floor(Math.random() * neighbors.length)] : sig.from;
      }

      const p1 = this.nodes[sig.from].pos;
      const p2 = this.nodes[sig.to].pos;
      const currentPos = p1.clone().lerp(p2, sig.progress);

      sigPositions[s * 3] = currentPos.x;
      sigPositions[s * 3 + 1] = currentPos.y;
      sigPositions[s * 3 + 2] = currentPos.z;

      // Excitar nodo de destino cuando la señal está cerca
      if (sig.progress > 0.8) {
        colors[sig.to * 3] = activeCol.r;
        colors[sig.to * 3 + 1] = activeCol.g;
        colors[sig.to * 3 + 2] = activeCol.b;
      }
    }

    this.pointMesh.geometry.attributes.color.needsUpdate = true;
    this.signalPoints.geometry.attributes.position.needsUpdate = true;

    this.group.rotation.y = this.time * 0.035;
  }
}
