/**
 * Slide 12: Autoorganización y Tejido Emergente
 * Concepto: "El futuro no se hereda. Se construye."
 * Identidad: Nodos inicialmente desordenados que encuentran relaciones locales,
 * autoensamblándose progresivamente en una estructura compleja (tejido/red neuronal abstracta, NO un cerebro).
 */
import * as THREE from 'three';
import { BaseSimulation } from './BaseSimulation.js';

export class Slide12Simulation extends BaseSimulation {
  constructor() {
    super('futuro-construido', 'Autoorganización Emergente');
    this.nodeCount = 95;
    this.nodes = [];
    this.assemblyProgress = 0;
  }

  buildScene() {
    this.nodes = [];
    const positions = new Float32Array(this.nodeCount * 3);
    const colors = new Float32Array(this.nodeCount * 3);

    const colDisorder = new THREE.Color(0x64748b);
    const colCyan = new THREE.Color(0x08a9dd);
    const colPink = new THREE.Color(0xe96daa);

    // 1. Generar estados iniciales caóticos y estados objetivos autoorganizados (Tejido Geodésico Tensegrity)
    for (let i = 0; i < this.nodeCount; i++) {
      // Posición inicial desordenada
      const startPos = new THREE.Vector3(
        (Math.random() - 0.5) * 26,
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 22
      );

      // Posición objetivo de la estructura autoensamblada (Hiper-estructura toroidal/hiperbólica tejida)
      const u = (i / this.nodeCount) * Math.PI * 4;
      const v = i * 0.35;
      const R = 8.5;
      const r = 3.2 + Math.sin(u * 2) * 1.5;

      const targetPos = new THREE.Vector3(
        (R + r * Math.cos(v)) * Math.cos(u),
        r * Math.sin(v) + Math.cos(u * 3) * 2.2,
        (R + r * Math.cos(v)) * Math.sin(u)
      );

      positions[i * 3] = startPos.x;
      positions[i * 3 + 1] = startPos.y;
      positions[i * 3 + 2] = startPos.z;

      colors[i * 3] = colDisorder.r;
      colors[i * 3 + 1] = colDisorder.g;
      colors[i * 3 + 2] = colDisorder.b;

      this.nodes.push({
        start: startPos,
        target: targetPos,
        current: startPos.clone(),
        colorTarget: i % 2 === 0 ? colCyan : colPink,
        phase: Math.random() * Math.PI * 2
      });
    }

    // Puntos del tejido
    const pointGeo = new THREE.BufferGeometry();
    pointGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pointMat = new THREE.PointsMaterial({
      size: 1.25,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    this.points = new THREE.Points(pointGeo, pointMat);
    this.group.add(this.points);

    // Malla de filamentos que se tejen a medida que se autoorganiza
    const maxLines = this.nodeCount * 5;
    const linePositions = new Float32Array(maxLines * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    const lineMat = new THREE.LineBasicMaterial({
      color: 0x08a9dd,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    this.networkLines = new THREE.LineSegments(lineGeo, lineMat);
    this.group.add(this.networkLines);
  }

  update(deltaTime) {
    super.update(deltaTime);
    if (!this.points || !this.networkLines) return;

    // Progresión suave de autoorganización
    this.assemblyProgress = Math.min(1.0, this.assemblyProgress + deltaTime * 0.35);
    const easeT = this.assemblyProgress * this.assemblyProgress * (3 - 2 * this.assemblyProgress);

    const positions = this.points.geometry.attributes.position.array;
    const colors = this.points.geometry.attributes.color.array;
    const linePositions = this.networkLines.geometry.attributes.position.array;
    const colDisorder = new THREE.Color(0x475569);

    for (let i = 0; i < this.nodeCount; i++) {
      const n = this.nodes[i];
      const breathing = Math.sin(this.time * 1.8 + n.phase) * (0.2 + easeT * 0.3);
      const targetWithMotion = n.target.clone().addScalar(breathing);

      n.current.lerpVectors(n.start, targetWithMotion, easeT);

      positions[i * 3] = n.current.x;
      positions[i * 3 + 1] = n.current.y;
      positions[i * 3 + 2] = n.current.z;

      // Transición cromática de desorden a orden activo
      const c = colDisorder.clone().lerp(n.colorTarget, easeT);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    this.points.geometry.attributes.position.needsUpdate = true;
    this.points.geometry.attributes.color.needsUpdate = true;

    // Conexiones de filamentos emergentes entre nodos próximos
    let lineIdx = 0;
    const connectThresholdSq = (3.5 + easeT * 2.8) ** 2;

    for (let i = 0; i < this.nodeCount; i++) {
      for (let j = i + 1; j < this.nodeCount; j++) {
        const dSq = this.nodes[i].current.distanceToSquared(this.nodes[j].current);
        if (dSq < connectThresholdSq && lineIdx < linePositions.length - 6) {
          linePositions[lineIdx++] = this.nodes[i].current.x;
          linePositions[lineIdx++] = this.nodes[i].current.y;
          linePositions[lineIdx++] = this.nodes[i].current.z;
          linePositions[lineIdx++] = this.nodes[j].current.x;
          linePositions[lineIdx++] = this.nodes[j].current.y;
          linePositions[lineIdx++] = this.nodes[j].current.z;
        }
      }
    }

    for (let k = lineIdx; k < linePositions.length; k++) {
      linePositions[k] = 0;
    }
    this.networkLines.geometry.attributes.position.needsUpdate = true;

    this.group.rotation.y = this.time * 0.09;
    this.group.rotation.x = Math.sin(this.time * 0.05) * 0.15;
  }
}
