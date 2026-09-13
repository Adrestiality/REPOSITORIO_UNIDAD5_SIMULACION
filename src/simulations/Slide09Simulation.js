/**
 * Slide 09: Dos Poblaciones Base en Dispersión (Interacción Táctil 2)
 * Concepto: "Una visión. Dos generaciones."
 * En LIVE_CLIENT: Cada usuario genera 12-16 puntos de su grupo asignado (A: Cyan / B: Magenta)
 * y los arrastra con el dedo en tiempo real sobre el plano X/Y con física elástica.
 * En LIVE_HOST: Visualiza en tiempo real todos los puntos agregados de todos los celulares.
 * En GENERIC_VIEWER: Genera dos poblaciones procedurales y permite arrastre con ratón/touch.
 */
import * as THREE from 'three';
import { BaseSimulation } from './BaseSimulation.js';

export class Slide09Simulation extends BaseSimulation {
  constructor() {
    super('vision-generaciones', 'Dos Poblaciones Base');
    this.pointMeshes = new Map(); // pointId -> THREE.Mesh
    this.pointsData = new Map(); // pointId -> { id, clientId, group, x, y, z, vx, vy, isDragging }
    this.draggedPointId = null;
    this.dragTargetPos = new THREE.Vector3();
    this.pointsPerClient = 14;

    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
  }

  buildScene() {
    this.pointsData.clear();
    this.draggedPointId = null;

    // Crear grupo contenedor de mallas
    this.pointsContainer = new THREE.Group();
    this.group.add(this.pointsContainer);

    const existingPoints = this.stateManager ? this.stateManager.getPoints() : [];

    if (this.isClient) {
      // Cliente móvil: Inicializar sus propios puntos si no existen
      const myClientId = this.syncBridge?.clientId || 'local_client';
      const myGroup = this.stateManager ? this.stateManager.getUserGroup() : 'A';
      const myExisting = existingPoints.filter(p => p.clientId === myClientId);

      if (myExisting.length === 0) {
        this.initClientPoints(myClientId, myGroup);
      } else {
        myExisting.forEach(p => this.registerPoint(p));
      }

      // También registrar otros puntos si ya están en el estado
      existingPoints.forEach(p => {
        if (p.clientId !== myClientId) {
          this.registerPoint(p);
        }
      });
    } else if (this.isHost) {
      // Host: Cargar puntos recibidos de todos los clientes
      existingPoints.forEach(p => this.registerPoint(p));
    } else {
      // GENERIC_VIEWER
      if (existingPoints.length > 0) {
        existingPoints.forEach(p => this.registerPoint(p));
      } else {
        this.generateProceduralPopulations();
      }
    }

    // Activar listeners de arrastre táctil / mouse
    if (typeof window !== 'undefined') {
      window.addEventListener('pointerdown', this.onPointerDown);
      window.addEventListener('pointermove', this.onPointerMove);
      window.addEventListener('pointerup', this.onPointerUp);
      window.addEventListener('pointercancel', this.onPointerUp);
    }
  }

  // Conversión de pantalla a plano 3D en Z=0
  screenToWorld(clientX, clientY) {
    const mouse = new THREE.Vector2(
      (clientX / window.innerWidth) * 2 - 1,
      -(clientY / window.innerHeight) * 2 + 1
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);
    const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const target = new THREE.Vector3();
    raycaster.ray.intersectPlane(planeZ, target);
    return target;
  }

  initClientPoints(clientId, group) {
    const newPoints = [];
    const baseOffsetX = group === 'A' ? -6.5 : 6.5;

    for (let i = 0; i < this.pointsPerClient; i++) {
      const u = Math.random() * Math.PI * 2;
      const r = 1.5 + Math.random() * 4.5;
      const x = baseOffsetX + Math.cos(u) * r;
      const y = (Math.random() - 0.5) * 8.0;
      const z = (Math.random() - 0.5) * 2.0;

      const pData = {
        id: `point_${clientId}_${i}`,
        index: i,
        clientId,
        group,
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.4
      };

      newPoints.push(pData);
      this.registerPoint(pData);
    }

    if (this.stateManager) {
      newPoints.forEach(p => this.stateManager.updatePoint(p));
    }
    if (this.syncBridge) {
      this.syncBridge.sendInitPoints(newPoints);
    }
  }

  generateProceduralPopulations() {
    const procedural = [];
    const groups = ['A', 'B'];

    groups.forEach((group) => {
      const baseOffsetX = group === 'A' ? -7.0 : 7.0;
      for (let i = 0; i < 28; i++) {
        const u = Math.random() * Math.PI * 2;
        const r = 2.0 + Math.random() * 5.0;
        const x = baseOffsetX + Math.cos(u) * r;
        const y = (Math.random() - 0.5) * 9.0;
        const z = (Math.random() - 0.5) * 3.0;

        const pData = {
          id: `proc_p_${group}_${i}`,
          index: i,
          clientId: 'procedural',
          group,
          x,
          y,
          z,
          baseX: x,
          baseY: y,
          baseZ: z,
          phase: Math.random() * Math.PI * 2,
          speed: 0.4 + Math.random() * 0.4
        };

        procedural.push(pData);
        this.registerPoint(pData);
      }
    });

    if (this.stateManager) {
      this.stateManager.setAllPoints(procedural);
    }
  }

  registerPoint(pData) {
    if (!pData || !pData.id) return;
    const existing = this.pointsData.get(pData.id);
    if (existing) {
      existing.x = pData.x;
      existing.y = pData.y;
      existing.z = pData.z !== undefined ? pData.z : existing.z;
      existing.group = pData.group || existing.group;
      return;
    }

    const data = {
      ...pData,
      baseX: pData.baseX !== undefined ? pData.baseX : pData.x,
      baseY: pData.baseY !== undefined ? pData.baseY : pData.y,
      baseZ: pData.baseZ !== undefined ? pData.baseZ : (pData.z || 0),
      vx: 0,
      vy: 0,
      phase: pData.phase !== undefined ? pData.phase : Math.random() * Math.PI * 2,
      speed: pData.speed !== undefined ? pData.speed : (0.4 + Math.random() * 0.4),
      isDragging: false
    };
    this.pointsData.set(pData.id, data);
    this.createPointMesh(data);
  }

  createPointMesh(pData) {
    const isGroupA = pData.group === 'A';
    const colorHex = isGroupA ? 0x08a9dd : 0xf7353f; // Cyan (A) o Magenta (B)

    const geo = new THREE.SphereGeometry(0.35, 12, 12);
    const mat = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(pData.x, pData.y, pData.z || 0);

    // Halo / Resplandor sutil
    const haloGeo = new THREE.SphereGeometry(0.7, 12, 12);
    const haloMat = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
      wireframe: true
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    mesh.add(halo);

    this.pointMeshes.set(pData.id, mesh);
    this.pointsContainer.add(mesh);
  }

  onPointerDown(e) {
    if (e.target.closest('button') || e.target.closest('.help-panel')) return;

    const worldPos = this.screenToWorld(e.clientX, e.clientY);
    const myClientId = this.syncBridge?.clientId;

    let nearestDist = 3.5; // Radio de captura cómodo en táctil
    let nearestId = null;

    for (const [id, p] of this.pointsData.entries()) {
      // En modo LIVE_CLIENT, el usuario solo puede arrastrar sus propios puntos
      if (this.isClient && myClientId && p.clientId !== myClientId) {
        continue;
      }
      const dist = new THREE.Vector2(p.x, p.y).distanceTo(new THREE.Vector2(worldPos.x, worldPos.y));
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestId = id;
      }
    }

    if (nearestId) {
      this.draggedPointId = nearestId;
      this.dragTargetPos.copy(worldPos);
      const p = this.pointsData.get(nearestId);
      if (p) p.isDragging = true;
    }
  }

  onPointerMove(e) {
    if (!this.draggedPointId) return;
    const worldPos = this.screenToWorld(e.clientX, e.clientY);
    this.dragTargetPos.copy(worldPos);

    const p = this.pointsData.get(this.draggedPointId);
    if (p) {
      // Física de arrastre elástica
      p.x += (this.dragTargetPos.x - p.x) * 0.45;
      p.y += (this.dragTargetPos.y - p.y) * 0.45;
      p.baseX = p.x;
      p.baseY = p.y;

      // Actualizar en StateManager y enviar por WebSocket
      if (this.stateManager) {
        this.stateManager.updatePoint({
          id: p.id,
          clientId: p.clientId,
          group: p.group,
          x: p.x,
          y: p.y,
          z: p.z
        });
      }
      if (this.syncBridge) {
        this.syncBridge.sendPointUpdate({
          id: p.id,
          clientId: p.clientId,
          group: p.group,
          x: p.x,
          y: p.y,
          z: p.z
        });
      }
    }
  }

  onPointerUp() {
    if (this.draggedPointId) {
      const p = this.pointsData.get(this.draggedPointId);
      if (p) {
        p.isDragging = false;
        p.baseX = p.x;
        p.baseY = p.y;
      }
      this.draggedPointId = null;
    }
  }

  update(deltaTime) {
    super.update(deltaTime);

    // Sincronizar puntos desde StateManager
    if (this.stateManager) {
      const allPoints = this.stateManager.getPoints();
      allPoints.forEach((p) => {
        if (!this.pointsData.has(p.id)) {
          this.registerPoint(p);
        } else if (p.id !== this.draggedPointId) {
          const local = this.pointsData.get(p.id);
          // Interpolación suave para cambios recibidos por la red
          local.x += (p.x - local.x) * 0.2;
          local.y += (p.y - local.y) * 0.2;
        }
      });
    }

    // Actualizar movimiento orgánico y posiciones de mallas
    for (const [id, p] of this.pointsData.entries()) {
      if (!p.isDragging) {
        const floatX = Math.sin(this.time * p.speed + p.phase) * 0.7;
        const floatY = Math.cos(this.time * (p.speed * 0.8) + p.phase) * 0.5;
        const floatZ = Math.sin(this.time * (p.speed * 0.6) + p.phase) * 0.4;

        p.currentX = p.baseX + floatX;
        p.currentY = p.baseY + floatY;
        p.currentZ = p.baseZ + floatZ;
      } else {
        p.currentX = p.x;
        p.currentY = p.y;
        p.currentZ = p.z;
      }

      const mesh = this.pointMeshes.get(id);
      if (mesh) {
        mesh.position.set(p.currentX, p.currentY, p.currentZ);
      }
    }

    // Rotación suave del conjunto
    this.group.rotation.y = Math.sin(this.time * 0.15) * 0.08;
  }

  dispose() {
    super.dispose();
    if (typeof window !== 'undefined') {
      window.removeEventListener('pointerdown', this.onPointerDown);
      window.removeEventListener('pointermove', this.onPointerMove);
      window.removeEventListener('pointerup', this.onPointerUp);
      window.removeEventListener('pointercancel', this.onPointerUp);
    }
  }
}

