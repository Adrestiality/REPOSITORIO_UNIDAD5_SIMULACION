/**
 * Slide 05: Trazos Planos Base (Interacción Táctil 1)
 * En LIVE_CLIENT: Cada usuario dibuja hasta 3 trazos táctiles continuos (2D en Z=0),
 * con eliminación por doble tap. Todos ven los trazos de todos.
 * En GENERIC_VIEWER: Genera trazos procedurales equivalentes.
 */
import * as THREE from 'three';
import { BaseSimulation } from './BaseSimulation.js';

export class Slide05Simulation extends BaseSimulation {
  constructor() {
    super('impacto', 'Trazos Planos Base');
    this.strokeMeshes = new Map(); // strokeId -> THREE.Line
    this.isDrawing = false;
    this.currentPoints = [];
    this.myStrokeCount = 0;
    this.lastTapTime = 0;
    this.lastTapPos = new THREE.Vector2();

    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
  }

  buildScene() {
    this.strokeMeshes.clear();
    this.myStrokeCount = 0;

    // Verificar si existen trazos ya creados en StateManager
    const existingStrokes = this.stateManager ? this.stateManager.getStrokes() : [];
    if (existingStrokes.length > 0) {
      existingStrokes.forEach((s) => this.renderStroke(s));
    } else if (this.mode === 'GENERIC_VIEWER') {
      this.generateProceduralStrokes();
    }

    // Si es cliente móvil, activar listeners de dibujo táctil
    if (this.isClient && typeof window !== 'undefined') {
      window.addEventListener('pointerdown', this.onPointerDown);
      window.addEventListener('pointermove', this.onPointerMove);
      window.addEventListener('pointerup', this.onPointerUp);
      window.addEventListener('pointercancel', this.onPointerUp);
    }
  }

  // Conversión de coordenadas de pantalla (píxeles) a plano 3D en Z=0
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

  onPointerDown(e) {
    if (e.target.closest('button') || e.target.closest('.help-panel') || e.target.closest('.client-header')) return;
    if (e.cancelable) e.preventDefault();

    const now = Date.now();
    const worldPos = this.screenToWorld(e.clientX, e.clientY);

    // Detección de doble tap para eliminar trazo propio
    if (now - this.lastTapTime < 420) {
      const deleted = this.checkDoubleTapDelete(worldPos);
      if (deleted) {
        this.lastTapTime = 0;
        this.isDrawing = false;
        return;
      }
    }
    this.lastTapTime = now;
    this.lastTapPos.set(e.clientX, e.clientY);

    // Contar cuántos trazos tiene este cliente actualmente
    const myClientId = this.syncBridge?.clientId;
    const myStrokes = this.stateManager ? this.stateManager.getStrokes().filter(s => !myClientId || s.clientId === myClientId) : [];
    if (myStrokes.length >= 3) {
      return; // Límite estricto de 3 trazos por dispositivo
    }

    this.isDrawing = true;
    this.currentPoints = [worldPos];
  }

  onPointerMove(e) {
    if (!this.isDrawing || this.currentPoints.length === 0) return;
    if (e.cancelable) e.preventDefault();

    const worldPos = this.screenToWorld(e.clientX, e.clientY);
    const lastPoint = this.currentPoints[this.currentPoints.length - 1];

    if (worldPos.distanceTo(lastPoint) > 0.35) {
      this.currentPoints.push(worldPos);
      this.renderTemporaryStroke(this.currentPoints);
    }
  }

  onPointerUp(e) {
    if (!this.isDrawing) return;
    if (e && e.cancelable) e.preventDefault();
    this.isDrawing = false;

    if (this.currentPoints.length >= 2) {
      const strokeId = `stroke_${this.syncBridge?.clientId || 'local'}_${Date.now()}`;
      const strokeData = {
        id: strokeId,
        clientId: this.syncBridge?.clientId || 'local',
        points: this.currentPoints.map(p => ({ x: p.x, y: p.y, z: 0 }))
      };

      this.stateManager.addStroke(strokeData);
      if (this.syncBridge) {
        this.syncBridge.sendStrokeCreate(strokeData);
      }
    }

    if (this.tempLine) {
      this.group.remove(this.tempLine);
      this.tempLine.geometry.dispose();
      this.tempLine = null;
    }
    this.currentPoints = [];
  }

  checkDoubleTapDelete(worldPos) {
    const myClientId = this.syncBridge?.clientId;
    const myStrokes = this.stateManager ? this.stateManager.getStrokes().filter(s => !myClientId || s.clientId === myClientId) : [];
    for (const stroke of myStrokes) {
      for (const p of stroke.points) {
        const strokePos = new THREE.Vector3(p.x, p.y, p.z || 0);
        if (strokePos.distanceTo(worldPos) < 3.8) {
          this.stateManager.removeStroke(stroke.id);
          if (this.syncBridge) {
            this.syncBridge.sendStrokeDelete(stroke.id);
          }
          return true;
        }
      }
    }
    return false;
  }

  renderTemporaryStroke(points) {
    if (this.tempLine) {
      this.group.remove(this.tempLine);
      this.tempLine.geometry.dispose();
    }
    const curve = new THREE.CatmullRomCurve3(points);
    const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(points.length * 3));
    const mat = new THREE.LineBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    this.tempLine = new THREE.Line(geo, mat);
    this.group.add(this.tempLine);
  }

  renderStroke(stroke) {
    if (!stroke || !stroke.points || stroke.points.length < 2) return;
    if (this.strokeMeshes.has(stroke.id)) {
      const old = this.strokeMeshes.get(stroke.id);
      this.group.remove(old);
      old.geometry.dispose();
    }

    const pts = stroke.points.map(p => new THREE.Vector3(p.x, p.y, p.z || 0));
    const curve = new THREE.CatmullRomCurve3(pts);
    const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(Math.max(20, pts.length * 4)));

    const colors = [0x08a9dd, 0xe96daa, 0xf7353f, 0x00f2fe];
    const color = colors[Math.abs(stroke.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % colors.length];

    const mat = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const line = new THREE.Line(geo, mat);
    this.strokeMeshes.set(stroke.id, line);
    this.group.add(line);
  }

  generateProceduralStrokes() {
    const procedural = [];
    const colors = [0x08a9dd, 0xe96daa, 0xf7353f, 0x00f2fe];

    for (let s = 0; s < 6; s++) {
      const pts = [];
      const startX = (Math.random() - 0.5) * 18;
      const startY = (Math.random() - 0.5) * 10;
      let cur = new THREE.Vector3(startX, startY, 0);
      pts.push({ x: cur.x, y: cur.y, z: 0 });

      let angle = Math.random() * Math.PI * 2;
      for (let p = 1; p < 14; p++) {
        angle += (Math.random() - 0.5) * 0.8;
        const step = 0.9 + Math.random() * 0.5;
        cur = cur.clone().add(new THREE.Vector3(Math.cos(angle) * step, Math.sin(angle) * step, 0));
        pts.push({ x: cur.x, y: cur.y, z: 0 });
      }

      const strokeData = {
        id: `proc_stroke_${s}`,
        clientId: 'procedural',
        points: pts
      };
      procedural.push(strokeData);
      this.renderStroke(strokeData);
    }
    if (this.stateManager) {
      this.stateManager.setAllStrokes(procedural);
    }
  }

  update(deltaTime) {
    super.update(deltaTime);

    // Sincronizar mallas con el almacén de StateManager
    if (this.stateManager) {
      const activeStrokes = this.stateManager.getStrokes();
      const activeIds = new Set(activeStrokes.map(s => s.id));

      // Eliminar mallas borradas
      for (const [id, mesh] of this.strokeMeshes.entries()) {
        if (!activeIds.has(id)) {
          this.group.remove(mesh);
          mesh.geometry.dispose();
          this.strokeMeshes.delete(id);
        }
      }

      // Añadir o actualizar mallas
      activeStrokes.forEach((s) => {
        if (!this.strokeMeshes.has(s.id)) {
          this.renderStroke(s);
        }
      });
    }

    this.group.rotation.y = Math.sin(this.time * 0.2) * 0.05;
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
