/**
 * ThreeStage - Escenario WebGL / Three.js Central
 * Iluminación de estudio cinematográfica calibrada (Key, Fill, Rim)
 * para resaltar telas, texturas textiles, metales cepillados y tensores.
 */
import * as THREE from 'three';

export class ThreeStage {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.scene = new THREE.Scene();
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Cámara 3D principal con perspectiva cinemática
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.width / this.height,
      0.1,
      1000
    );
    this.defaultCameraPos = new THREE.Vector3(0, 0, 30);
    this.camera.position.copy(this.defaultCameraPos);

    // Renderizador WebGL de alta gama
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(this.width, this.height, false);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    // --- SETUP DE ILUMINACIÓN DE ESTUDIO CINEMATOGRÁFICO ---
    
    // 1. Luz Ambiental Difusa (Mantiene negros profundos pero con detalle en pliegues)
    this.ambientLight = new THREE.AmbientLight(0x1a202c, 1.2);
    this.scene.add(this.ambientLight);

    // 2. Key Light (Luz Principal Cálida Rasante desde arriba a la derecha)
    this.keyLight = new THREE.DirectionalLight(0xfff5ea, 2.8);
    this.keyLight.position.set(16, 22, 18);
    this.scene.add(this.keyLight);

    // 3. Fill Light (Luz de Relleno Fría / Grafito desde la izquierda)
    this.fillLight = new THREE.DirectionalLight(0x718096, 1.4);
    this.fillLight.position.set(-18, -10, 14);
    this.scene.add(this.fillLight);

    // 4. Rim Light / Back Light (Luz de Contorno Posterior Intensa para Fresnel en telas)
    this.rimLight = new THREE.DirectionalLight(0x08a9dd, 3.2);
    this.rimLight.position.set(0, 24, -22);
    this.scene.add(this.rimLight);

    // 5. Kicker Accent Light (Acento rasante inferior)
    this.kickerLight = new THREE.DirectionalLight(0xf7353f, 1.6);
    this.kickerLight.position.set(-12, -18, -10);
    this.scene.add(this.kickerLight);

    // Reloj y bucle de render
    this.clock = new THREE.Clock();
    this.activeSlide = null;
    this.rafId = null;
    this.isRunning = false;

    // Redimensión responsiva
    this.resize = this.resize.bind(this);
    window.addEventListener('resize', this.resize);
  }

  /**
   * Conecta la diapositiva activa al escenario Three.js
   */
  setActiveSlide(slideInstance, slideManager) {
    if (this.activeSlide && this.activeSlide !== slideInstance) {
      this.activeSlide.dispose();
    }

    this.activeSlide = slideInstance;

    if (this.activeSlide) {
      this.activeSlide.initialize({
        scene: this.scene,
        camera: this.camera,
        renderer: this.renderer,
        container: this.canvas.parentElement,
        slideManager
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

      // Movimiento orbital de cámara cinemático ultra suave y elegante
      const time = this.clock.getElapsedTime();
      this.camera.position.x = Math.sin(time * 0.12) * 1.2;
      this.camera.position.y = Math.cos(time * 0.16) * 0.8;
      this.camera.lookAt(0, 0, 0);

      // Actualizar y renderizar la diapositiva activa
      if (this.activeSlide && this.activeSlide.isInitialized) {
        this.activeSlide.update(deltaTime);
        this.activeSlide.render(this.renderer, this.scene, this.camera);
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

    if (this.activeSlide && typeof this.activeSlide.resize === 'function') {
      this.activeSlide.resize(width, height);
    }
  }

  dispose() {
    this.stop();
    window.removeEventListener('resize', this.resize);
    if (this.activeSlide) {
      this.activeSlide.dispose();
      this.activeSlide = null;
    }
    this.renderer.dispose();
  }
}
