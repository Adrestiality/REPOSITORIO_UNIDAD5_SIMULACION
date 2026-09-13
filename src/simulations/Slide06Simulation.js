/**
 * Slide 06: Transformación de Trazos a Red 3D (Evolución de Interacción 1)
 * La interacción está CERRADA: los trazos reales creados en Slide 5 se congelan,
 * adquieren profundidad en Z, brotan filamentos orgánicos y se interconectan
 * en una red tridimensional continua y orgánica (5–10s).
 */
import * as THREE from 'three';
import { BaseSimulation } from './BaseSimulation.js';

export class Slide06Simulation extends BaseSimulation {
  constructor() {
    super('comunidad', 'Evolución de Trazos a Red 3D');
    this.growthProgress = 0;
    this.strokeLines = [];
    this.filamentsMesh = null;
    this.networkNodes = [];
    this.networkEdges = [];
  }

  buildScene() {
    this.growthProgress = 0;
    this.strokeLines = [];
    this.networkNodes = [];
    this.networkEdges = [];

    // 1. Obtener los trazos congelados de Slide 5 desde StateManager
    const rawStrokes = this.stateManager ? this.stateManager.getStrokes() : [];
    const strokes = rawStrokes.length > 0 ? rawStrokes : this.createFallbackStrokes();

    const colors = [0x08a9dd, 0xe96daa, 0xf7353f, 0x00f2fe];

    // 2. Construir mallas para los trazos originales y calcular desplazamientos en Z
    strokes.forEach((stroke, sIdx) => {
      const pts = stroke.points.map((p, pIdx) => {
        // Asignar profundidad Z procedural armónica a cada vértice del trazo
        const zTarget = Math.sin(sIdx * 1.5 + pIdx * 0.4) * 4.5 + (Math.random() - 0.5) * 1.5;
        const baseVec = new THREE.Vector3(p.x, p.y, 0);
        const targetVec = new THREE.Vector3(p.x, p.y, zTarget);

        const nodeObj = {
          base: baseVec,
          target: targetVec,
          current: baseVec.clone(),
          strokeIndex: sIdx,
          pointIndex: pIdx
        };
        this.networkNodes.push(nodeObj);
        return nodeObj;
      });

      const color = colors[sIdx % colors.length];
      const geo = new THREE.BufferGeometry();
      const posArray = new Float32Array(pts.length * 3);
      geo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

      const mat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
      });
      const line = new THREE.Line(geo, mat);
      this.group.add(line);
      this.strokeLines.push({ line, nodes: pts });
    });

    // 3. Generar puentes y filamentos cruzados entre trazos distintos
    const interFilamentPairs = [];
    for (let i = 0; i < this.networkNodes.length; i++) {
      for (let j = i + 1; j < this.networkNodes.length; j++) {
        const n1 = this.networkNodes[i];
        const n2 = this.networkNodes[j];

        if (n1.strokeIndex !== n2.strokeIndex) {
          const dSq = n1.target.distanceToSquared(n2.target);
          if (dSq < 7.5 * 7.5 && Math.random() < 0.5) {
            interFilamentPairs.push({ from: n1, to: n2 });
            this.networkEdges.push([i, j]);
          }
        }
      }
    }

    const filamentPositions = new Float32Array(interFilamentPairs.length * 6);
    const filamentGeo = new THREE.BufferGeometry();
    filamentGeo.setAttribute('position', new THREE.BufferAttribute(filamentPositions, 3));

    const filamentMat = new THREE.LineBasicMaterial({
      color: 0x08a9dd,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    this.filamentsMesh = new THREE.LineSegments(filamentGeo, filamentMat);
    this.group.add(this.filamentsMesh);
    this.interFilamentPairs = interFilamentPairs;

    // Guardar grafo en StateManager para que Slide 7 lo electrifique
    if (this.stateManager) {
      this.stateManager.setSimulationState('comunidad', {
        networkNodes: this.networkNodes.map(n => ({ x: n.target.x, y: n.target.y, z: n.target.z })),
        networkEdges: this.networkEdges
      });
    }
  }

  createFallbackStrokes() {
    const fallback = [];
    for (let s = 0; s < 5; s++) {
      const pts = [];
      const startX = (Math.random() - 0.5) * 16;
      const startY = (Math.random() - 0.5) * 10;
      let cur = new THREE.Vector3(startX, startY, 0);
      pts.push({ x: cur.x, y: cur.y, z: 0 });

      let angle = Math.random() * Math.PI * 2;
      for (let p = 1; p < 12; p++) {
        angle += (Math.random() - 0.5) * 0.7;
        const step = 1.0;
        cur = cur.clone().add(new THREE.Vector3(Math.cos(angle) * step, Math.sin(angle) * step, 0));
        pts.push({ x: cur.x, y: cur.y, z: 0 });
      }
      fallback.push({ id: `fallback_${s}`, strokeIndex: s, points: pts });
    }
    return fallback;
  }

  update(deltaTime) {
    super.update(deltaTime);

    // Crecimiento continuo y orgánico (5–8 segundos de duración)
    this.growthProgress = Math.min(1.0, this.growthProgress + deltaTime * 0.18);
    const t = this.growthProgress;
    const smoothGrowth = t * t * (3 - 2 * t);

    // 1. Actualizar posiciones de los trazos (ganando profundidad en Z)
    this.strokeLines.forEach((item) => {
      const pos = item.line.geometry.attributes.position.array;
      item.nodes.forEach((n, idx) => {
        n.current.lerpVectors(n.base, n.target, smoothGrowth);
        pos[idx * 3] = n.current.x;
        pos[idx * 3 + 1] = n.current.y;
        pos[idx * 3 + 2] = n.current.z;
      });
      item.line.geometry.attributes.position.needsUpdate = true;
    });

    // 2. Extensión de los filamentos conectores hacia trazos vecinos
    if (this.filamentsMesh && this.interFilamentPairs) {
      const filPos = this.filamentsMesh.geometry.attributes.position.array;
      let idx = 0;

      this.interFilamentPairs.forEach((pair) => {
        const p1 = pair.from.current;
        // El filamento brota desde p1 hacia p2 proporcional a smoothGrowth
        const p2 = p1.clone().lerp(pair.to.current, smoothGrowth);

        filPos[idx++] = p1.x;
        filPos[idx++] = p1.y;
        filPos[idx++] = p1.z;
        filPos[idx++] = p2.x;
        filPos[idx++] = p2.y;
        filPos[idx++] = p2.z;
      });

      this.filamentsMesh.geometry.attributes.position.needsUpdate = true;
      this.filamentsMesh.material.opacity = 0.45 * smoothGrowth;
    }

    this.group.rotation.y = this.time * 0.05;
    this.group.rotation.x = Math.sin(this.time * 0.03) * 0.08;
  }
}
