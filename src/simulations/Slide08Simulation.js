/**
 * Slide 08: Plasticidad y Nuevas Rutas
 * Concepto: "La experiencia construye el camino. Las nuevas generaciones descubren nuevas rutas."
 * Identidad: Rutas principales consolidadas donde surgen nuevos caminos exploratorios,
 * algunos se fortalecen por uso, otros se desvanecen y nuevos aparecen en diferentes áreas.
 */
import * as THREE from 'three';
import { BaseSimulation } from './BaseSimulation.js';

export class Slide08Simulation extends BaseSimulation {
  constructor() {
    super('nuevas-rutas', 'Plasticidad y Nuevas Rutas');
    this.primaryRoutes = [];
    this.exploratoryRoutes = [];
    this.maxExploratory = 24;
  }

  buildScene() {
    this.primaryRoutes = [];
    this.exploratoryRoutes = [];

    // 1. Rutas primarias consolidadas (La Experiencia)
    const primaryPointsA = [
      new THREE.Vector3(-14, -4, 0),
      new THREE.Vector3(-7, -1, 2),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(7, 2, -2),
      new THREE.Vector3(14, 5, 0)
    ];
    const curveA = new THREE.CatmullRomCurve3(primaryPointsA);
    const geoA = new THREE.BufferGeometry().setFromPoints(curveA.getPoints(50));
    const matA = new THREE.LineBasicMaterial({
      color: 0x08a9dd,
      linewidth: 3,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    this.primaryA = new THREE.Line(geoA, matA);
    this.group.add(this.primaryA);

    const primaryPointsB = [
      new THREE.Vector3(-14, 4, -2),
      new THREE.Vector3(-6, 2, 0),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(8, -3, 2),
      new THREE.Vector3(14, -5, 0)
    ];
    const curveB = new THREE.CatmullRomCurve3(primaryPointsB);
    const geoB = new THREE.BufferGeometry().setFromPoints(curveB.getPoints(50));
    const matB = new THREE.LineBasicMaterial({
      color: 0x22c1ee,
      linewidth: 3,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    this.primaryB = new THREE.Line(geoB, matB);
    this.group.add(this.primaryB);

    // 2. Pool de rutas exploratorias dinámicas (Nuevas Generaciones)
    for (let i = 0; i < this.maxExploratory; i++) {
      const pCount = 5;
      const pts = [];
      const origin = Math.random() < 0.5 ? primaryPointsA[1 + Math.floor(Math.random() * 3)] : primaryPointsB[1 + Math.floor(Math.random() * 3)];
      let cur = origin.clone();
      pts.push(cur);

      const targetDir = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ).normalize();

      for (let k = 1; k < pCount; k++) {
        cur = cur.clone().add(targetDir.clone().multiplyScalar(2.5 + Math.random() * 2));
        pts.push(cur);
      }

      const curve = new THREE.CatmullRomCurve3(pts);
      const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(25));
      const mat = new THREE.LineBasicMaterial({
        color: 0xf7353f,
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending
      });
      const line = new THREE.Line(geo, mat);
      this.group.add(line);

      this.exploratoryRoutes.push({
        line,
        age: Math.random() * 5,
        lifetime: 3 + Math.random() * 4,
        strength: Math.random(),
        state: 'growing' // 'growing', 'active', 'decaying'
      });
    }
  }

  update(deltaTime) {
    super.update(deltaTime);

    // Respiración de las rutas primarias
    const primOpacity = 0.75 + Math.sin(this.time * 1.5) * 0.15;
    this.primaryA.material.opacity = primOpacity;
    this.primaryB.material.opacity = primOpacity * 0.9;

    // Ciclo de vida y plasticidad de las rutas exploratorias
    this.exploratoryRoutes.forEach((route) => {
      route.age += deltaTime;

      if (route.age > route.lifetime) {
        route.age = 0;
        route.lifetime = 3 + Math.random() * 4;
        route.strength = Math.random();
      }

      const progress = route.age / route.lifetime;
      // Curva de campana de opacidad (nace, se fortalece, se desvanece)
      const alpha = Math.sin(progress * Math.PI) * (0.3 + route.strength * 0.6);
      route.line.material.opacity = alpha;
      route.line.material.color.setHex(route.strength > 0.5 ? 0xf7353f : 0xe96daa);
    });

    this.group.rotation.y = this.time * 0.04;
    this.group.rotation.x = Math.sin(this.time * 0.03) * 0.1;
  }
}
