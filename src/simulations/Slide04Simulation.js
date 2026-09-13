/**
 * Slide 04: Tres Fuerzas (Academia + Industria + Ciudad)
 * Concepto: Tres patrones o poblaciones diferentes con comportamiento, ritmo y estructura propia que interactúan y se complementan.
 */
import * as THREE from 'three';
import { BaseSimulation } from './BaseSimulation.js';

export class Slide04Simulation extends BaseSimulation {
  constructor() {
    super('academia-industria-ciudad', 'Tres Fuerzas');
    this.populations = [];
    this.bridgeLines = null;
  }

  buildScene() {
    this.populations = [];

    // 1. Población ACADEMIA: Red poliédrica estructurada, analítica (Cyan)
    const acadPos = new THREE.Vector3(-11, -3, 0);
    const acadGeo = new THREE.IcosahedronGeometry(4.5, 1);
    const acadMat = new THREE.MeshBasicMaterial({
      color: 0x08a9dd,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });
    const acadMesh = new THREE.Mesh(acadGeo, acadMat);
    acadMesh.position.copy(acadPos);
    this.group.add(acadMesh);

    // Nodos de academia
    const acadNodeGeo = new THREE.BufferGeometry();
    acadNodeGeo.setAttribute('position', acadGeo.attributes.position);
    const acadNodeMat = new THREE.PointsMaterial({
      color: 0x00f2fe,
      size: 1.1,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const acadNodes = new THREE.Points(acadNodeGeo, acadNodeMat);
    acadMesh.add(acadNodes);

    // 2. Población INDUSTRIA: Flujo cinético rápido, anillos concéntricos en fase (Magenta)
    const indPos = new THREE.Vector3(11, -3, 0);
    const indGroup = new THREE.Group();
    indGroup.position.copy(indPos);
    this.group.add(indGroup);

    for (let r = 0; r < 3; r++) {
      const ringGeo = new THREE.TorusGeometry(2.0 + r * 1.5, 0.06, 8, 36);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xf7353f,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = r * 0.6;
      ring.rotation.y = r * 0.4;
      indGroup.add(ring);
    }

    // 3. Población CIUDAD: Enjambre orgánico distribuido y adaptativo (Ámbar / Rosa)
    const cityPos = new THREE.Vector3(0, 9, 0);
    const cityCount = 45;
    const cityPositions = new Float32Array(cityCount * 3);
    for (let i = 0; i < cityCount; i++) {
      const u = Math.random() * Math.PI * 2;
      const v = (Math.random() - 0.5) * 4;
      const r = 1.5 + Math.random() * 3.5;
      cityPositions[i * 3] = r * Math.cos(u);
      cityPositions[i * 3 + 1] = v;
      cityPositions[i * 3 + 2] = r * Math.sin(u);
    }
    const cityGeo = new THREE.BufferGeometry();
    cityGeo.setAttribute('position', new THREE.BufferAttribute(cityPositions, 3));
    const cityMat = new THREE.PointsMaterial({
      color: 0xe96daa,
      size: 1.0,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const cityMesh = new THREE.Points(cityGeo, cityMat);
    cityMesh.position.copy(cityPos);
    this.group.add(cityMesh);

    // Puentes sinápticos interactivos entre las tres poblaciones
    const bridgeGeo = new THREE.BufferGeometry();
    const bridgePositions = new Float32Array(18 * 3); // 3 puentes con puntos intermedios
    bridgeGeo.setAttribute('position', new THREE.BufferAttribute(bridgePositions, 3));
    const bridgeMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });
    this.bridgeLines = new THREE.LineSegments(bridgeGeo, bridgeMat);
    this.group.add(this.bridgeLines);

    this.populations = [
      { mesh: acadMesh, type: 'academia', basePos: acadPos },
      { mesh: indGroup, type: 'industria', basePos: indPos },
      { mesh: cityMesh, type: 'ciudad', basePos: cityPos }
    ];
  }

  update(deltaTime) {
    super.update(deltaTime);

    // Dinámica 1: Academia (rotación armónica pausada)
    const acad = this.populations[0].mesh;
    acad.rotation.y = this.time * 0.2;
    acad.rotation.x = Math.sin(this.time * 0.15) * 0.3;

    // Dinámica 2: Industria (rotaciones cruzadas de alta velocidad)
    const ind = this.populations[1].mesh;
    ind.children.forEach((child, i) => {
      child.rotation.z += deltaTime * (1.2 + i * 0.5);
      child.rotation.y += deltaTime * 0.8;
    });

    // Dinámica 3: Ciudad (pulsación adaptativa)
    const city = this.populations[2].mesh;
    city.rotation.y = this.time * 0.4;
    const cityScale = 1 + Math.sin(this.time * 1.5) * 0.12;
    city.scale.set(cityScale, cityScale, cityScale);

    // Actualizar puentes dinámicos de intercambio
    if (this.bridgeLines) {
      const pos = this.bridgeLines.geometry.attributes.position.array;
      const p1 = this.populations[0].basePos;
      const p2 = this.populations[1].basePos;
      const p3 = this.populations[2].basePos;

      const t = this.time;
      const mid12 = p1.clone().lerp(p2, 0.5).add(new THREE.Vector3(0, Math.sin(t * 2) * 1.5, Math.cos(t * 2) * 1.5));
      const mid23 = p2.clone().lerp(p3, 0.5).add(new THREE.Vector3(Math.cos(t * 2) * 1.5, Math.sin(t * 2) * 1.5, 0));
      const mid31 = p3.clone().lerp(p1, 0.5).add(new THREE.Vector3(Math.sin(t * 2) * 1.5, 0, Math.cos(t * 2) * 1.5));

      // Línea 1-2
      pos[0] = p1.x; pos[1] = p1.y; pos[2] = p1.z; pos[3] = mid12.x; pos[4] = mid12.y; pos[5] = mid12.z;
      pos[6] = mid12.x; pos[7] = mid12.y; pos[8] = mid12.z; pos[9] = p2.x; pos[10] = p2.y; pos[11] = p2.z;

      // Línea 2-3
      pos[12] = p2.x; pos[13] = p2.y; pos[14] = p2.z; pos[15] = mid23.x; pos[16] = mid23.y; pos[17] = mid23.z;
      pos[18] = mid23.x; pos[19] = mid23.y; pos[20] = mid23.z; pos[21] = p3.x; pos[22] = p3.y; pos[23] = p3.z;

      // Línea 3-1
      pos[24] = p3.x; pos[25] = p3.y; pos[26] = p3.z; pos[27] = mid31.x; pos[28] = mid31.y; pos[29] = mid31.z;
      pos[30] = mid31.x; pos[31] = mid31.y; pos[32] = mid31.z; pos[33] = p1.x; pos[34] = p1.y; pos[35] = p1.z;

      this.bridgeLines.geometry.attributes.position.needsUpdate = true;
    }

    this.group.rotation.y = this.time * 0.04;
  }
}
