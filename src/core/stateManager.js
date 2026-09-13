/**
 * State Manager Central
 * Administrador reactivo de estado global, persistencia de simulaciones
 * y almacén en tiempo real de las 2 interacciones (Trazos y Puntos).
 */

export const APP_MODES = {
  LIVE_HOST: 'LIVE_HOST',
  LIVE_CLIENT: 'LIVE_CLIENT',
  GENERIC_VIEWER: 'GENERIC_VIEWER'
};

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

export class StateManager {
  constructor(initialMode = APP_MODES.GENERIC_VIEWER) {
    this.state = {
      mode: initialMode,
      currentSlide: 0,
      language: getStoredLanguage(),
      isFullscreen: false,
      userGroup: 'A', // 'A' (Cyan) o 'B' (Magenta)

      // Interacción 1 (Slides 5-7): Trazos
      strokes: new Map(),

      // Interacción 2 (Slides 9-10): Puntos A/B
      points: new Map(),

      // Almacén persistente por cada simulación
      simulationStates: {},
      clientInteractions: {},
      connectedClientsCount: 0,
      lastUpdated: Date.now()
    };

    this.listeners = new Set();
  }

  getState() {
    return this.state;
  }

  getMode() {
    return this.state.mode;
  }

  isHost() {
    return this.state.mode === APP_MODES.LIVE_HOST;
  }

  isClient() {
    return this.state.mode === APP_MODES.LIVE_CLIENT;
  }

  isGeneric() {
    return this.state.mode === APP_MODES.GENERIC_VIEWER;
  }

  getCurrentSlide() {
    return this.state.currentSlide;
  }

  getLanguage() {
    return this.state.language;
  }

  getUserGroup() {
    return this.state.userGroup;
  }

  setUserGroup(group) {
    if (group === 'A' || group === 'B') {
      this.setState({ userGroup: group });
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  setState(partialState, notify = true) {
    const prevState = { ...this.state };
    this.state = {
      ...this.state,
      ...partialState,
      lastUpdated: Date.now()
    };

    if (notify) {
      for (const listener of this.listeners) {
        try {
          listener(this.state, prevState);
        } catch (err) {
          console.error('[StateManager] Error en listener:', err);
        }
      }
    }
  }

  setSlide(slideIndex) {
    if (typeof slideIndex !== 'number' || slideIndex < 0) return;
    this.setState({ currentSlide: slideIndex });
  }

  setLanguage(lang) {
    if (lang !== 'es' && lang !== 'pt') return;
    setStoredLanguage(lang);
    this.setState({ language: lang });
  }

  setMode(mode) {
    if (APP_MODES[mode]) {
      this.setState({ mode });
    }
  }

  // --- MÉTODOS DE TRAZOS (INTERACCIÓN 1: SLIDES 5-7) ---
  addStroke(stroke) {
    if (!stroke || !stroke.id) return;
    this.state.strokes.set(stroke.id, stroke);
    this.setState({ strokes: new Map(this.state.strokes) });
  }

  removeStroke(strokeId) {
    if (this.state.strokes.has(strokeId)) {
      this.state.strokes.delete(strokeId);
      this.setState({ strokes: new Map(this.state.strokes) });
    }
  }

  getStrokes() {
    return Array.from(this.state.strokes.values());
  }

  setAllStrokes(strokesArray) {
    if (!Array.isArray(strokesArray)) return;
    this.state.strokes.clear();
    strokesArray.forEach((s) => {
      if (s && s.id) this.state.strokes.set(s.id, s);
    });
    this.setState({ strokes: new Map(this.state.strokes) });
  }

  // --- MÉTODOS DE PUNTOS (INTERACCIÓN 2: SLIDES 9-10) ---
  updatePoint(point) {
    if (!point || !point.id) return;
    this.state.points.set(point.id, point);
    this.setState({ points: new Map(this.state.points) });
  }

  getPoints() {
    return Array.from(this.state.points.values());
  }

  setAllPoints(pointsArray) {
    if (!Array.isArray(pointsArray)) return;
    this.state.points.clear();
    pointsArray.forEach((p) => {
      if (p && p.id) this.state.points.set(p.id, p);
    });
    this.setState({ points: new Map(this.state.points) });
  }

  setSimulationState(slideId, data) {
    this.state.simulationStates[slideId] = {
      ...(this.state.simulationStates[slideId] || {}),
      ...data,
      updatedAt: Date.now()
    };
  }

  getSimulationState(slideId) {
    return this.state.simulationStates[slideId] || null;
  }

  recordClientInteraction(clientId, data) {
    this.state.clientInteractions[clientId] = {
      ...data,
      timestamp: Date.now()
    };
    this.setState({
      clientInteractions: { ...this.state.clientInteractions }
    });
  }

  setConnectedClientsCount(count) {
    this.setState({ connectedClientsCount: count });
  }
}
