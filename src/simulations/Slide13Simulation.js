/**
 * Slide 13: Escena Mínima y Discreta de Cierre
 * Concepto: "Continuidad / @centrodeeventosupb"
 * Los códigos QR y enlaces son prioritarios. La simulación es extremadamente sutil,
 * con partículas ambientales discretas y respiración suave que no compite visualmente.
 */
import * as THREE from 'three';
import { BaseSimulation } from './BaseSimulation.js';

export class Slide13Simulation extends BaseSimulation {
  constructor() {
    super('qr-cierre', 'Atmósfera Discreta de Cierre');
    this.particleCount = 45;
  }

  buildScene() {
    const positions = new Float32Array(this.particleCount * 3);
    const colors = new Float32Array(this.particleCount * 3);

    const colDimCyan = new THREE.Color(0x08a9dd);
    const colDimRose = new THREE.Color(0xe96daa);

    for (let i = 0; i < this.particleCount; i++) {
      const u = Math.random() * Math.PI * 2;
      const v = (Math.random() - 0.5) * 16;
      const r = 8 + Math.random() * 12;

      positions[i * 3] = Math.cos(u) * r;
      positions[i * 3 + 1] = v;
      positions[i * 3 + 2] = Math.sin(u) * r * 0.6;

      const col = (i % 2 === 0 ? colDimCyan : colDimRose).clone().multiplyScalar(0.45);
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    const pointGeo = new THREE.BufferGeometry();
    pointGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pointMat = new THREE.PointsMaterial({
      size: 0.75,
      vertexColors: true,
      transparent: true,
      opacity: 0.35, // Opacidad muy sutil para no competir con el QR
      blending: THREE.AdditiveBlending
    });
    this.points = new THREE.Points(pointGeo, pointMat);
    this.group.add(this.points);
  }

  update(deltaTime) {
    super.update(deltaTime);

    // Deriva ambiental ultra lenta y relajante
    this.group.rotation.y = this.time * 0.015;
    this.group.rotation.x = Math.sin(this.time * 0.01) * 0.04;
  }
}
