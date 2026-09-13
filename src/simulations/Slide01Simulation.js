/**
 * Slide 01: Crecimiento por Capas Generacionales
 * Concepto: Acumulación de experiencia, capas que construyen sobre las anteriores sin reemplazarlas.
 */
import * as THREE from 'three';
import { BaseSimulation } from './BaseSimulation.js';

export class Slide01Simulation extends BaseSimulation {
  constructor() {
    super('relevo-generacional', 'Crecimiento por Capas');
    this.layers = [];
    this.totalLayers = 4;
  }

  buildScene() {
    this.layers = [];
    const layerColors = [
      new THREE.Color(0x08a9dd), // Capa 0: Base / Fundación
      new THREE.Color(0x22c1ee), // Capa 1: Experiencia consolidada
      new THREE.Color(0xe96daa), // Capa 2: Relevo emergente
      new THREE.Color(0xf7353f)  // Capa 3: Frontera activa
    ];

    const layerRadii = [3.5, 6.5, 9.8, 13.2];
    const nodesPerLayer = [16, 28, 42, 56];

    let previousLayerNodes = null;

    for (let l = 0; l < this.totalLayers; l++) {
      const count = nodesPerLayer[l];
      const radius = layerRadii[l];
      const col = layerColors[l];
      const currentLayerNodes = [];

      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);

      for (let i = 0; i < count; i++) {
        const theta = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
        const phi = Math.acos((Math.random() * 2 - 1) * 0.75); // Distribución esferoide elíptica

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta) * 0.65;
        const z = radius * Math.cos(phi) * 0.8;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        colors[i * 3] = col.r;
        colors[i * 3 + 1] = col.g;
        colors[i * 3 + 2] = col.b;

        currentLayerNodes.push(new THREE.Vector3(x, y, z));
      }

      // Nodos de la capa
      const pointGeo = new THREE.BufferGeometry();
      pointGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      pointGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const pointMat = new THREE.PointsMaterial({
        size: 0.9 + (this.totalLayers - l) * 0.25,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
      });
      const points = new THREE.Points(pointGeo, pointMat);
      this.group.add(points);

      // Conexiones intra-capa (filamentos horizontales)
      const intraLines = [];
      for (let i = 0; i < count; i++) {
        const next = (i + 1) % count;
        intraLines.push(
          currentLayerNodes[i].x, currentLayerNodes[i].y, currentLayerNodes[i].z,
          currentLayerNodes[next].x, currentLayerNodes[next].y, currentLayerNodes[next].z
        );
      }

      // Conexiones inter-capa (puentes generacionales anclados a la capa anterior)
      const interLines = [];
      if (previousLayerNodes) {
        for (let i = 0; i < count; i++) {
          // Conectar cada nodo con los 2 más cercanos de la capa anterior
          const p = currentLayerNodes[i];
          const sortedPrev = [...previousLayerNodes]
            .map((prevNode) => ({ node: prevNode, dist: p.distanceToSquared(prevNode) }))
            .sort((a, b) => a.dist - b.dist);

          for (let k = 0; k < Math.min(2, sortedPrev.length); k++) {
            const target = sortedPrev[k].node;
            interLines.push(p.x, p.y, p.z, target.x, target.y, target.z);
          }
        }
      }

      const allLines = [...intraLines, ...interLines];
      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(allLines, 3));

      const lineMat = new THREE.LineBasicMaterial({
        color: col,
        transparent: true,
        opacity: 0.25 + (1 - l / this.totalLayers) * 0.2,
        blending: THREE.AdditiveBlending
      });
      const lines = new THREE.LineSegments(lineGeo, lineMat);
      this.group.add(lines);

      this.layers.push({
        points,
        lines,
        radius,
        baseOpacity: lineMat.opacity,
        nodes: currentLayerNodes,
        layerIndex: l
      });

      previousLayerNodes = currentLayerNodes;
    }
  }

  update(deltaTime) {
    super.update(deltaTime);

    // Pulso sutil de crecimiento y respiración por capas
    this.layers.forEach((layer) => {
      const wave = Math.sin(this.time * 1.2 - layer.layerIndex * 0.7);
      const scale = 1 + wave * 0.035;
      layer.points.scale.set(scale, scale, scale);
      layer.lines.scale.set(scale, scale, scale);
      layer.lines.material.opacity = layer.baseOpacity * (0.8 + wave * 0.3);
    });

    this.group.rotation.y = this.time * 0.05;
    this.group.rotation.x = Math.sin(this.time * 0.03) * 0.12;
  }
}
