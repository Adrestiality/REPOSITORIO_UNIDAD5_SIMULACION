/**
 * Slide 07: Red Viva con Impulsos Eléctricos (Culminación de Interacción 1)
 * La red tridimensional resultante de Slide 6 continúa viva.
 * Impulsos de acción recorren las conexiones, se bifurcan en los nodos,
 * toman rutas alternativas y mantienen una actividad eléctrica continua y distribuida.
 */
import * as THREE from 'three';
import { BaseSimulation } from './BaseSimulation.js';

export class Slide07Simulation extends BaseSimulation {
  constructor() {
    super('confianza', 'Red Viva con Impulsos');
    this.nodes = [];
    this.edges = [];
    this.pulses = [];
    this.pulseCount = 32;
  }

  buildScene() {
    this.nodes = [];
    this.edges = [];
    this.pulses = [];

    // 1. Cargar el grafo de la red desde el estado guardado de Slide 6
    const savedState = this.stateManager ? this.stateManager.getSimulationState('comunidad') : null;

    if (savedState && Array.isArray(savedState.networkNodes) && savedState.networkNodes.length > 0) {
      this.nodes = savedState.networkNodes.map((p) => ({
        pos: new THREE.Vector3(p.x, p.y, p.z),
        neighbors: [],
        excitation: 0
      }));
      this.edges = savedState.networkEdges || [];
    } else {
      // Grafo procedural autónomo si se inicia directamente en Slide 7
      this.generateFallbackGraph();
    }

    // Construir tabla de adyacencia de vecinos
    this.edges.forEach(([i, j]) => {
      if (this.nodes[i] && this.nodes[j]) {
        this.nodes[i].neighbors.push(j);
        this.nodes[j].neighbors.push(i);
      }
    });

    // Malla de líneas de la red
    const linePositions = new Float32Array(this.edges.length * 6);
    this.edges.forEach(([i, j], idx) => {
      const p1 = this.nodes[i].pos;
      const p2 = this.nodes[j].pos;
      linePositions[idx * 6] = p1.x;
      linePositions[idx * 6 + 1] = p1.y;
      linePositions[idx * 6 + 2] = p1.z;
      linePositions[idx * 6 + 3] = p2.x;
      linePositions[idx * 6 + 4] = p2.y;
      linePositions[idx * 6 + 5] = p2.z;
    });

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x08a9dd,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });
    this.networkLines = new THREE.LineSegments(lineGeo, lineMat);
    this.group.add(this.networkLines);

    // Malla de nodos
    const nodePositions = new Float32Array(this.nodes.length * 3);
    const nodeColors = new Float32Array(this.nodes.length * 3);
    const baseCol = new THREE.Color(0x08a9dd);

    this.nodes.forEach((n, idx) => {
      nodePositions[idx * 3] = n.pos.x;
      nodePositions[idx * 3 + 1] = n.pos.y;
      nodePositions[idx * 3 + 2] = n.pos.z;
      nodeColors[idx * 3] = baseCol.r;
      nodeColors[idx * 3 + 1] = baseCol.g;
      nodeColors[idx * 3 + 2] = baseCol.b;
    });

    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));
    nodeGeo.setAttribute('color', new THREE.BufferAttribute(nodeColors, 3));

    const nodeMat = new THREE.PointsMaterial({
      size: 1.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    this.nodePoints = new THREE.Points(nodeGeo, nodeMat);
    this.group.add(this.nodePoints);

    // Impulsos eléctricos viajeros
    const pulsePositions = new Float32Array(this.pulseCount * 3);
    const pulseColors = new Float32Array(this.pulseCount * 3);

    for (let p = 0; p < this.pulseCount; p++) {
      const from = Math.floor(Math.random() * this.nodes.length);
      const neighbors = this.nodes[from].neighbors;
      const to = neighbors.length > 0 ? neighbors[Math.floor(Math.random() * neighbors.length)] : from;

      this.pulses.push({
        from,
        to,
        progress: Math.random(),
        speed: 0.8 + Math.random() * 0.8,
        color: p % 2 === 0 ? new THREE.Color(0x00f2fe) : new THREE.Color(0xf7353f)
      });

      const col = this.pulses[p].color;
      pulseColors[p * 3] = col.r;
      pulseColors[p * 3 + 1] = col.g;
      pulseColors[p * 3 + 2] = col.b;
    }

    const pulseGeo = new THREE.BufferGeometry();
    pulseGeo.setAttribute('position', new THREE.BufferAttribute(pulsePositions, 3));
    pulseGeo.setAttribute('color', new THREE.BufferAttribute(pulseColors, 3));

    const pulseMat = new THREE.PointsMaterial({
      size: 1.65,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });
    this.pulsePoints = new THREE.Points(pulseGeo, pulseMat);
    this.group.add(this.pulsePoints);
  }

  generateFallbackGraph() {
    const count = 55;
    this.nodes = [];
    this.edges = [];
    for (let i = 0; i < count; i++) {
      const u = Math.random() * Math.PI * 2;
      const v = (Math.random() - 0.5) * 14;
      const r = 5 + Math.random() * 10;
      this.nodes.push({
        pos: new THREE.Vector3(Math.cos(u) * r, v, Math.sin(u) * r * 0.8),
        neighbors: [],
        excitation: 0
      });
    }
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        if (this.nodes[i].pos.distanceToSquared(this.nodes[j].pos) < 7.5 * 7.5 && Math.random() < 0.35) {
          this.edges.push([i, j]);
        }
      }
    }
  }

  update(deltaTime) {
    super.update(deltaTime);
    if (!this.pulsePoints || !this.nodePoints || this.nodes.length === 0) return;

    const pulsePositions = this.pulsePoints.geometry.attributes.position.array;
    const nodeColors = this.nodePoints.geometry.attributes.color.array;
    const baseCol = new THREE.Color(0x08a9dd);
    const activeCol = new THREE.Color(0xffffff);

    // Actualizar impulsos
    this.pulses.forEach((pulse, idx) => {
      pulse.progress += deltaTime * pulse.speed;

      if (pulse.progress >= 1) {
        pulse.progress = 0;
        pulse.from = pulse.to;
        const neighbors = this.nodes[pulse.from].neighbors;
        if (neighbors.length > 0) {
          pulse.to = neighbors[Math.floor(Math.random() * neighbors.length)];
          this.nodes[pulse.from].excitation = 1.0;
        }
      }

      const p1 = this.nodes[pulse.from].pos;
      const p2 = this.nodes[pulse.to].pos;
      const cur = p1.clone().lerp(p2, pulse.progress);

      pulsePositions[idx * 3] = cur.x;
      pulsePositions[idx * 3 + 1] = cur.y;
      pulsePositions[idx * 3 + 2] = cur.z;
    });

    // Atenuación de excitación en los nodos
    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i];
      if (n.excitation > 0) {
        n.excitation = Math.max(0, n.excitation - deltaTime * 2.2);
      }
      const c = baseCol.clone().lerp(activeCol, n.excitation);
      nodeColors[i * 3] = c.r;
      nodeColors[i * 3 + 1] = c.g;
      nodeColors[i * 3 + 2] = c.b;
    }

    this.pulsePoints.geometry.attributes.position.needsUpdate = true;
    this.nodePoints.geometry.attributes.color.needsUpdate = true;

    this.group.rotation.y = this.time * 0.07;
  }
}
