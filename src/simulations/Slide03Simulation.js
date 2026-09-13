/**
 * Slide 03: Extensiones & Proyección al Mundo
 * Concepto: "Los eventos no llegaron a la Universidad. La Universidad decidió encontrarse con el mundo."
 * Identidad: Estructura central orgánica que emite prolongaciones dinámicas que buscan el exterior.
 */
import * as THREE from 'three';
import { BaseSimulation } from './BaseSimulation.js';

export class Slide03Simulation extends BaseSimulation {
  constructor() {
    super('universidad-mundo', 'Extensiones & Proyección');
    this.filamentCount = 24;
    this.segmentsPerFilament = 14;
    this.filaments = [];
  }

  buildScene() {
    this.filaments = [];
    const coreCount = 35;
    const corePositions = new Float32Array(coreCount * 3);

    // 1. Núcleo central denso
    for (let i = 0; i < coreCount; i++) {
      const u = Math.random() * Math.PI * 2;
      const v = Math.acos(Math.random() * 2 - 1);
      const r = 2.5 + Math.random() * 2.0;

      corePositions[i * 3] = r * Math.sin(v) * Math.cos(u);
      corePositions[i * 3 + 1] = r * Math.sin(v) * Math.sin(u);
      corePositions[i * 3 + 2] = r * Math.cos(v);
    }

    const coreGeo = new THREE.BufferGeometry();
    coreGeo.setAttribute('position', new THREE.BufferAttribute(corePositions, 3));
    const coreMat = new THREE.PointsMaterial({
      color: 0x08a9dd,
      size: 1.3,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });
    this.corePoints = new THREE.Points(coreGeo, coreMat);
    this.group.add(this.corePoints);

    // 2. Extensiones dinámicas / filamentos que se proyectan hacia el exterior
    for (let f = 0; f < this.filamentCount; f++) {
      const theta = (f / this.filamentCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.2;
      const phi = Math.acos((Math.random() * 2 - 1) * 0.85);

      const baseDir = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.sin(phi) * Math.sin(theta) * 0.7,
        Math.cos(phi)
      ).normalize();

      const points = [];
      let cur = new THREE.Vector3(0, 0, 0);
      points.push(cur.clone());

      const maxReach = 14 + Math.random() * 8;
      const stepLen = maxReach / this.segmentsPerFilament;

      for (let s = 1; s <= this.segmentsPerFilament; s++) {
        const offset = new THREE.Vector3(
          (Math.random() - 0.5) * 1.5,
          (Math.random() - 0.5) * 1.5,
          (Math.random() - 0.5) * 1.5
        );
        cur = cur.clone().add(baseDir.clone().multiplyScalar(stepLen)).add(offset);
        points.push(cur);
      }

      const curve = new THREE.CatmullRomCurve3(points);
      const curvePoints = curve.getPoints(30);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);

      const colorMix = f % 2 === 0 ? 0x08a9dd : 0xf7353f;
      const lineMat = new THREE.LineBasicMaterial({
        color: colorMix,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending
      });

      const lineMesh = new THREE.Line(lineGeo, lineMat);
      this.group.add(lineMesh);

      // Terminal activo en el extremo del filamento
      const tipGeo = new THREE.SphereGeometry(0.35, 8, 8);
      const tipMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
      });
      const tipMesh = new THREE.Mesh(tipGeo, tipMat);
      tipMesh.position.copy(points[points.length - 1]);
      this.group.add(tipMesh);

      this.filaments.push({
        lineMesh,
        tipMesh,
        basePoints: points,
        baseDir,
        phase: f * 0.3,
        speed: 1.0 + Math.random() * 0.6
      });
    }
  }

  update(deltaTime) {
    super.update(deltaTime);

    // Animación de pulsación y búsqueda hacia el exterior
    this.filaments.forEach((fil) => {
      const reachFactor = 0.85 + Math.sin(this.time * fil.speed + fil.phase) * 0.18;
      fil.lineMesh.scale.set(reachFactor, reachFactor, reachFactor);
      fil.tipMesh.scale.set(reachFactor, reachFactor, reachFactor);
      fil.tipMesh.position.copy(fil.basePoints[fil.basePoints.length - 1].clone().multiplyScalar(reachFactor));
    });

    this.group.rotation.y = this.time * 0.05;
    this.group.rotation.z = Math.sin(this.time * 0.04) * 0.08;
  }
}
