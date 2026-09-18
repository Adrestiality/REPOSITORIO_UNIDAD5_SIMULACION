/**
 * SlideManager - Gestor Central de Diapositivas & Estado de Presentación
 * Controla la navegación (currentSlide), cambio de idioma (ES/PT),
 * intercambio de estado continuo entre slides consecutivas y ciclo de vida visual.
 */
import { SLIDES_REGISTRY } from '../slides/index.js';
import { SLIDES_DATA } from '../slides/slidesData.js';

function getStoredLanguage() {
  try {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('forum-language') || 'es';
    }
  } catch (e) {}
  return 'es';
}

function setStoredLanguage(lang) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('forum-language', lang);
    }
  } catch (e) {}
}

export class SlideManager {
  constructor(threeStage) {
    this.threeStage = threeStage;
    this.currentSlideIndex = 0;
    this.language = getStoredLanguage();
    this.totalSlides = SLIDES_DATA.length;

    // Almacén compartido para datos procedurales entre diapositivas consecutivas
    this.sharedData = new Map();

    this.activeSlideInstance = null;
    this.listeners = new Set();
  }

  getCurrentSlideIndex() {
    return this.currentSlideIndex;
  }

  getTotalSlides() {
    return this.totalSlides;
  }

  getCurrentSlideData() {
    return SLIDES_DATA[this.currentSlideIndex] || SLIDES_DATA[0];
  }

  getLanguage() {
    return this.language;
  }

  setLanguage(lang) {
    if (lang !== 'es' && lang !== 'pt') return;
    this.language = lang;
    setStoredLanguage(lang);
    this.notify();
  }

  setSharedData(key, value) {
    this.sharedData.set(key, value);
  }

  getSharedData(key) {
    return this.sharedData.get(key);
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      try {
        listener(this.currentSlideIndex, this.language, this.getCurrentSlideData());
      } catch (err) {
        console.error('[SlideManager] Error en listener:', err);
      }
    }
  }

  goTo(index) {
    if (typeof index !== 'number' || index < 0 || index >= this.totalSlides) return;
    if (this.currentSlideIndex === index && this.activeSlideInstance) return;

    this.currentSlideIndex = index;

    // Instanciar la nueva diapositiva aislada
    const SlideClass = SLIDES_REGISTRY[index] || SLIDES_REGISTRY[0];
    this.activeSlideInstance = new SlideClass();

    // Conectar al ThreeStage sin destruir el contexto WebGL
    this.threeStage.setActiveSlide(this.activeSlideInstance, this);

    this.notify();
  }

  next() {
    if (this.currentSlideIndex < this.totalSlides - 1) {
      this.goTo(this.currentSlideIndex + 1);
    }
  }

  prev() {
    if (this.currentSlideIndex > 0) {
      this.goTo(this.currentSlideIndex - 1);
    }
  }

  first() {
    this.goTo(0);
  }

  last() {
    this.goTo(this.totalSlides - 1);
  }

  dispose() {
    if (this.activeSlideInstance) {
      this.activeSlideInstance.dispose();
      this.activeSlideInstance = null;
    }
    this.listeners.clear();
    this.sharedData.clear();
  }
}
