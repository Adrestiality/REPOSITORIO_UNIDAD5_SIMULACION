/**
 * BaseSimulation
 * Interfaz base y clase abstracta para los 13 módulos de simulación procedural.
 */

import * as THREE from 'three';

export class BaseSimulation {
  constructor(id, title = '') {
    this.id = id;
    this.title = title;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.container = null;
    this.mode = null;
    this.isClient = false;
    
    // Contenedor raíz para todos los objetos 3D de esta simulación
    this.group = new THREE.Group();
    this.group.name = `sim-group-${this.id}`;

    this.time = 0;
    this.transitionProgress = 1;
    this.isInitialized = false;
  }

  /**
   * Inicializa la simulación y añade los objetos a la escena
   */
  initialize(context) {
    this.scene = context.scene;
    this.camera = context.camera;
    this.renderer = context.renderer;
    this.container = context.container;
    this.mode = context.mode;
    this.isClient = context.isClient;

    this.time = 0;
    this.transitionProgress = 1;

    if (this.scene && !this.scene.getObjectByName(this.group.name)) {
      this.scene.add(this.group);
    }

    this.buildScene();
    this.isInitialized = true;
  }

  /**
   * Método a sobreescribir por cada simulación específica para construir mallas y redes
   */
  buildScene() {
    // Implementado en subclases
  }

  /**
   * Actualización lógica y física en cada frame
   */
  update(deltaTime, simulationState = null) {
    this.time += deltaTime;
    // Implementado en subclases
  }

  /**
   * Renderizado (por defecto delega a Three.js WebGLRenderer)
   */
  render(renderer, scene, camera) {
    renderer.render(scene, camera);
  }

  /**
   * Manejo de redimensión de ventana
   */
  resize(width, height) {
    // Sobreescribir si la simulación requiere buffers o FBOs dependientes del tamaño
  }

  /**
   * Transición de entrada (progress va de 0.0 a 1.0)
   */
  transitionIn(progress) {
    this.transitionProgress = progress;
    this.group.position.y = (1 - progress) * -10;
    this.group.scale.setScalar(0.7 + progress * 0.3);
  }

  /**
   * Transición de salida (progress va de 1.0 a 0.0)
   */
  transitionOut(progress) {
    this.transitionProgress = progress;
    this.group.position.y = (1 - progress) * 10;
    this.group.scale.setScalar(0.7 + progress * 0.3);
  }

  /**
   * Recibe micro-interacciones de clientes móviles
   */
  onClientInteraction(clientId, data) {
    // Implementado en subclases
  }

  /**
   * Serializa el estado mínimo para sincronización de red
   */
  getSerializableState() {
    return {
      time: this.time
    };
  }

  /**
   * Aplica estado recibido desde el Host
   */
  applyState(state) {
    if (!state) return;
    if (typeof state.time === 'number') {
      this.time = state.time;
    }
  }

  /**
   * Libera memoria, geometrías y materiales al cambiar de slide
   */
  dispose() {
    this.isInitialized = false;

    // Recorrer y liberar geometrías y materiales
    this.group.traverse((child) => {
      if (child.isMesh || child.isPoints || child.isLine) {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => mat.dispose());
          } else {
            child.material.dispose();
          }
        }
      }
    });

    // Vaciar el grupo y remover de la escena
    while (this.group.children.length > 0) {
      this.group.remove(this.group.children[0]);
    }

    if (this.scene) {
      this.scene.remove(this.group);
    }
  }
}
