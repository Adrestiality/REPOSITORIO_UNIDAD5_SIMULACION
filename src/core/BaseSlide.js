/**
 * BaseSlide
 * Interfaz y clase abstracta para las 13 diapositivas de la presentación.
 * Estandariza el ciclo de vida: initialize, buildScene, update, render, resize y dispose.
 */
import * as THREE from 'three';

export class BaseSlide {
  constructor(id, title = '') {
    this.id = id;
    this.title = title;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.container = null;
    this.slideManager = null;

    // Contenedor 3D raíz para todos los objetos de esta diapositiva
    this.group = new THREE.Group();
    this.group.name = `slide-group-${this.id}`;

    this.time = 0;
    this.isInitialized = false;
  }

  /**
   * Inicializa la diapositiva y la añade a la escena WebGL única
   */
  initialize(context) {
    this.scene = context.scene;
    this.camera = context.camera;
    this.renderer = context.renderer;
    this.container = context.container;
    this.slideManager = context.slideManager;

    this.time = 0;

    if (this.scene && !this.scene.getObjectByName(this.group.name)) {
      this.scene.add(this.group);
    }

    this.buildScene();
    this.isInitialized = true;
  }

  /**
   * Método a sobreescribir por cada diapositiva para construir sus geometrías y mallas
   */
  buildScene() {
    // Implementado por subclases
  }

  /**
   * Actualización lógica y matemática en cada frame (requestAnimationFrame)
   */
  update(deltaTime) {
    this.time += deltaTime;
    // Implementado por subclases
  }

  /**
   * Renderizado (delega al WebGLRenderer central)
   */
  render(renderer, scene, camera) {
    renderer.render(scene, camera);
  }

  /**
   * Redimensión de viewport
   */
  resize(width, height) {
    // Sobreescribir si la diapositiva tiene buffers específicos
  }

  /**
   * Limpieza exhaustiva de geometrías, materiales y mallas al desmontar la diapositiva
   */
  dispose() {
    this.isInitialized = false;

    this.group.traverse((child) => {
      if (child.isMesh || child.isPoints || child.isLine || child.isLineSegments) {
        if (child.geometry) {
          child.geometry.dispose();
        }
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => {
              if (mat.map) mat.map.dispose();
              mat.dispose();
            });
          } else {
            if (child.material.map) child.material.map.dispose();
            child.material.dispose();
          }
        }
      }
    });

    while (this.group.children.length > 0) {
      this.group.remove(this.group.children[0]);
    }

    if (this.scene) {
      this.scene.remove(this.group);
    }
  }
}
