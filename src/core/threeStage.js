/**
 * ThreeStage - Gestor del Escenario WebGL / 3D
 * Inicializa Three.js, la escena, renderizador y cámaras independientes para Host y Clientes.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { APP_MODES } from './stateManager.js';

export class ThreeStage {
  constructor(canvasElement, options = {}) {
    this.canvas = canvasElement;
    this.mode = options.mode || APP_MODES.GENERIC_VIEWER;
    this.isClient = this.mode === APP_MODES.LIVE_CLIENT;
    
    this.scene = new THREE.Scene();
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Cámara 3D principal
    this.camera = new THREE.PerspectiveCamera(
      50,
      this.width / this.height,
      0.1,
      1000
    );
    this.defaultCameraPos = new THREE.Vector3(0, 0, 32);
    this.camera.position.copy(this.defaultCameraPos);

    // Renderizador WebGL de alto rendimiento
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(this.width, this.height, false);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    // Luces de ambientación
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(this.ambientLight);

    this.dirLight = new THREE.DirectionalLight(0x00f2fe, 1.5);
    this.dirLight.position.set(10, 20, 15);
    this.scene.add(this.dirLight);

    // Controles de Cámara Libre para Cliente Móvil / Exploración
    // IMPORTANTE: Estos controles modifican EXCLUSIVAMENTE la matriz de vista local de este cliente,
    // NO alteran en lo absoluto el estado global de la simulación.
    this.controls = null;
    if (this.isClient) {
      this.initClientControls();
    }

    // Loop de renderizado
    this.clock = new THREE.Clock();
    this.activeSimulation = null;
    this.rafId = null;
    this.isRunning = false;

    // Manejo de redimensión
    this.resize = this.resize.bind(this);
    window.addEventListener('resize', this.resize);
  }

  initClientControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.enableZoom = true;
    this.controls.enablePan = true;
    this.controls.enableRotate = true;
    this.controls.minDistance = 5;
    this.controls.maxDistance = 80;
    this.controls.autoRotate = false;
  }

  resetCamera() {
    this.camera.position.copy(this.defaultCameraPos);
    this.camera.lookAt(0, 0, 0);
    if (this.controls) {
      this.controls.target.set(0, 0, 0);
      this.controls.update();
    }
  }

  setMode(mode) {
    this.mode = mode;
    this.isClient = mode === APP_MODES.LIVE_CLIENT;
    if (this.isClient && !this.controls) {
      this.initClientControls();
    }
  }

  setActiveSimulation(simulation) {
    if (this.activeSimulation && this.activeSimulation !== simulation) {
      this.activeSimulation.dispose();
    }
    this.activeSimulation = simulation;
    if (this.activeSimulation) {
      this.activeSimulation.initialize({
        scene: this.scene,
        camera: this.camera,
        renderer: this.renderer,
        container: this.canvas.parentElement,
        mode: this.mode,
        isClient: this.isClient
      });
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.clock.start();

    const animate = () => {
      if (!this.isRunning) return;
      const deltaTime = Math.min(this.clock.getDelta(), 0.1);

      // Actualizar controles de cámara libre si están activos
      if (this.controls) {
        this.controls.update();
      } else if (!this.isClient) {
        // En modo Host / Generic, sutil movimiento orbital cinemático
        const time = this.clock.getElapsedTime();
        this.camera.position.x = Math.sin(time * 0.15) * 1.5;
        this.camera.position.y = Math.cos(time * 0.2) * 1.0;
        this.camera.lookAt(0, 0, 0);
      }

      // Actualizar y renderizar la simulación activa
      if (this.activeSimulation) {
        this.activeSimulation.update(deltaTime);
        this.activeSimulation.render(this.renderer, this.scene, this.camera);
      } else {
        this.renderer.render(this.scene, this.camera);
      }

      this.rafId = requestAnimationFrame(animate);
    };

    this.rafId = requestAnimationFrame(animate);
  }

  stop() {
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.clock.stop();
  }

  resize() {
    const parent = this.canvas.parentElement;
    const width = parent ? parent.clientWidth : window.innerWidth;
    const height = parent ? parent.clientHeight : window.innerHeight;

    this.width = width;
    this.height = height;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    if (this.activeSimulation && typeof this.activeSimulation.resize === 'function') {
      this.activeSimulation.resize(width, height);
    }
  }

  dispose() {
    this.stop();
    window.removeEventListener('resize', this.resize);
    if (this.controls) {
      this.controls.dispose();
      this.controls = null;
    }
    if (this.activeSimulation) {
      this.activeSimulation.dispose();
      this.activeSimulation = null;
    }
    this.renderer.dispose();
  }
}
