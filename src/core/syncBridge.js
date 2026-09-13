/**
 * Sync Bridge
 * Canal de sincronización híbrido para navegación, estado e interacciones en tiempo real.
 */

import { APP_MODES } from './stateManager.js';

export const SYNC_EVENTS = {
  SLIDE_CHANGE: 'SLIDE_CHANGE',
  LANG_CHANGE: 'LANG_CHANGE',
  HOST_STATE_SYNC: 'HOST_STATE_SYNC',
  HOST_REGISTER: 'HOST_REGISTER',
  CLIENT_COUNT_UPDATE: 'CLIENT_COUNT_UPDATE',
  CLIENT_HELLO: 'CLIENT_HELLO',
  CLIENT_HEARTBEAT: 'CLIENT_HEARTBEAT',
  CLIENT_BYE: 'CLIENT_BYE',
  CLIENT_INTERACTION: 'CLIENT_INTERACTION',

  // Interacción 1 (Slides 5-7): Trazos
  STROKE_CREATE: 'STROKE_CREATE',
  STROKE_DELETE: 'STROKE_DELETE',

  // Interacción 2 (Slides 9-10): Puntos A/B
  POINT_UPDATE: 'POINT_UPDATE',
  INIT_CLIENT_POINTS: 'INIT_CLIENT_POINTS',
  BATCH_POINTS_UPDATE: 'BATCH_POINTS_UPDATE'
};

export class SyncBridge {
  constructor(stateManager, options = {}) {
    this.stateManager = stateManager;
    this.channelName = options.channelName || 'forum-upb-sync';
    this.clientId = 'client_' + Math.random().toString(36).substring(2, 9);
    this.connectedClients = new Map();

    const wsHost = typeof window !== 'undefined' ? (window.location.hostname || 'localhost') : 'localhost';
    const wsPort = options.wsPort || 3000;
    this.wsUrl = options.wsUrl || `ws://${wsHost}:${wsPort}`;

    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectDelay = 8000;
    this.reconnectTimer = null;
    this.heartbeatTimer = null;
    this.statusListeners = new Set();

    this.isBcSupported = typeof window !== 'undefined' && 'BroadcastChannel' in window;
    if (this.isBcSupported) {
      this.channel = new BroadcastChannel(this.channelName);
      this.channel.onmessage = (event) => this.handleMessage(event.data);
    }
  }

  onStatusChange(listener) {
    this.statusListeners.add(listener);
    return () => this.statusListeners.delete(listener);
  }

  notifyStatus(status) {
    for (const listener of this.statusListeners) {
      try {
        listener(status);
      } catch (e) {}
    }
  }

  init() {
    const mode = this.stateManager.getMode();
    if (mode === APP_MODES.GENERIC_VIEWER) {
      return;
    }

    this.connectWebSocket();

    // El Host difunde cambios de slide e idioma
    this.stateManager.subscribe((state, prevState) => {
      if (this.stateManager.getMode() === APP_MODES.LIVE_HOST) {
        if (state.currentSlide !== prevState.currentSlide) {
          this.send(SYNC_EVENTS.SLIDE_CHANGE, { slideIndex: state.currentSlide });
        }
        if (state.language !== prevState.language) {
          this.send(SYNC_EVENTS.LANG_CHANGE, { language: state.language });
        }
      }
    });
  }

  connectWebSocket() {
    if (typeof window === 'undefined' || typeof WebSocket === 'undefined') return;

    try {
      this.socket = new WebSocket(this.wsUrl);

      this.socket.onopen = () => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.notifyStatus('connected');

        const mode = this.stateManager.getMode();
        if (mode === APP_MODES.LIVE_HOST) {
          const state = this.stateManager.getState();
          this.send(SYNC_EVENTS.HOST_REGISTER, {
            currentSlide: state.currentSlide,
            language: state.language,
            simulationStates: state.simulationStates
          });
        } else if (mode === APP_MODES.LIVE_CLIENT) {
          this.send(SYNC_EVENTS.CLIENT_HELLO, { clientId: this.clientId });
        }

        if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
        this.heartbeatTimer = setInterval(() => {
          if (this.stateManager.getMode() === APP_MODES.LIVE_CLIENT) {
            this.send(SYNC_EVENTS.CLIENT_HEARTBEAT, { clientId: this.clientId });
          }
        }, 2500);
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (e) {}
      };

      this.socket.onclose = () => {
        this.isConnected = false;
        this.notifyStatus('reconnecting');
        this.scheduleReconnect();
      };

      this.socket.onerror = () => {
        if (this.socket) {
          this.socket.close();
        }
      };
    } catch (err) {
      this.scheduleReconnect();
    }
  }

  scheduleReconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    const delay = Math.min(1000 * Math.pow(1.5, this.reconnectAttempts), this.maxReconnectDelay);
    this.reconnectAttempts++;
    this.reconnectTimer = setTimeout(() => {
      this.connectWebSocket();
    }, delay);
  }

  send(type, payload = {}) {
    const message = {
      type,
      payload,
      senderId: this.clientId,
      senderMode: this.stateManager.getMode(),
      timestamp: Date.now()
    };

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      try {
        this.socket.send(JSON.stringify(message));
      } catch (err) {}
    }

    if (this.channel) {
      try {
        this.channel.postMessage(message);
      } catch (err) {}
    }
  }

  // --- MÉTODOS DE ENVÍO PARA INTERACCIONES ---
  sendStrokeCreate(stroke) {
    this.send(SYNC_EVENTS.STROKE_CREATE, { stroke });
  }

  sendStrokeDelete(strokeId) {
    this.send(SYNC_EVENTS.STROKE_DELETE, { strokeId });
  }

  sendPointUpdate(point) {
    this.send(SYNC_EVENTS.POINT_UPDATE, { point });
  }

  sendInitPoints(points) {
    this.send(SYNC_EVENTS.INIT_CLIENT_POINTS, { points });
  }

  handleMessage(message) {
    if (!message) return;
    const mode = this.stateManager.getMode();
    const isSelf = message.senderId === this.clientId;

    switch (message.type) {
      case SYNC_EVENTS.SLIDE_CHANGE:
        if (mode === APP_MODES.LIVE_CLIENT) {
          this.stateManager.setSlide(message.payload.slideIndex);
        }
        break;

      case SYNC_EVENTS.LANG_CHANGE:
        if (mode === APP_MODES.LIVE_CLIENT) {
          this.stateManager.setLanguage(message.payload.language);
        }
        break;

      case SYNC_EVENTS.HOST_STATE_SYNC:
        if (mode === APP_MODES.LIVE_HOST) {
          if (message.payload.serverInfo) {
            this.stateManager.setState({ serverInfo: message.payload.serverInfo });
          }
        } else if (mode === APP_MODES.LIVE_CLIENT) {
          if (message.payload.assignedGroup) {
            this.stateManager.setUserGroup(message.payload.assignedGroup);
          }
          if (Array.isArray(message.payload.strokes)) {
            this.stateManager.setAllStrokes(message.payload.strokes);
          }
          if (Array.isArray(message.payload.points)) {
            this.stateManager.setAllPoints(message.payload.points);
          }
          this.stateManager.setState({
            currentSlide: message.payload.currentSlide,
            language: message.payload.language,
            simulationStates: message.payload.simulationStates || {}
          });
        }
        break;


      case SYNC_EVENTS.CLIENT_COUNT_UPDATE:
        if (mode === APP_MODES.LIVE_HOST) {
          this.stateManager.setConnectedClientsCount(message.payload.count || 0);
        }
        break;

      // --- EVENTOS DE INTERACCIÓN 1 (TRAZOS) ---
      case SYNC_EVENTS.STROKE_CREATE:
        if (message.payload.stroke) {
          this.stateManager.addStroke(message.payload.stroke);
        }
        break;

      case SYNC_EVENTS.STROKE_DELETE:
        if (message.payload.strokeId) {
          this.stateManager.removeStroke(message.payload.strokeId);
        }
        break;

      // --- EVENTOS DE INTERACCIÓN 2 (PUNTOS) ---
      case SYNC_EVENTS.POINT_UPDATE:
        if (message.payload.point && !isSelf) {
          this.stateManager.updatePoint(message.payload.point);
        }
        break;

      case SYNC_EVENTS.BATCH_POINTS_UPDATE:
        if (Array.isArray(message.payload.points)) {
          this.stateManager.setAllPoints(message.payload.points);
        }
        break;

      default:
        break;
    }
  }

  destroy() {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
  }
}
