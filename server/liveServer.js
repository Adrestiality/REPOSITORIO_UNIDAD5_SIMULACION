/**
 * Live WebSocket Server - Fórum UPB
 * Maneja sesión en tiempo real, sincronización de diapositivas e interacciones colaborativas:
 * 1. Trazos táctiles (Slide 5 -> 6 -> 7) con límite de 3 por cliente y borrado por doble tap.
 * 2. Población de puntos A/B (Slide 9 -> 10) con asignación equilibrada y arrastre táctil.
 */

import http from 'node:http';
import os from 'node:os';
import { WebSocketServer, WebSocket } from 'ws';

const PORT = process.env.PORT || 3000;
const VITE_PORT = process.env.VITE_PORT || 5173;

function getLocalIpAddresses() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push(iface.address);
      }
    }
  }
  return addresses.length > 0 ? addresses : ['localhost'];
}

// Estado de la sesión en memoria RAM
const session = {
  currentSlide: 0,
  language: 'es',
  simulationStates: {},
  // Interacción 1 (Slides 5-7): Trazos
  strokes: new Map(), // strokeId -> { strokeId, clientId, points }
  clientStrokeCounts: new Map(), // clientId -> number of active strokes (max 3)
  // Interacción 2 (Slides 9-10): Puntos A/B
  userGroups: new Map(), // clientId -> 'A' | 'B'
  points: new Map(), // pointId -> { pointId, clientId, group, x, y, z }
  groupCounter: 0, // Para balanceo 50/50 A/B
  connectedClients: new Map(), // clientId -> { ws, ip, joinedAt, lastSeen }
  hostSocket: null
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.url === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'active',
      currentSlide: session.currentSlide,
      language: session.language,
      connectedClientsCount: session.connectedClients.size,
      totalStrokes: session.strokes.size,
      totalPoints: session.points.size,
      hasHost: session.hostSocket !== null && session.hostSocket.readyState === WebSocket.OPEN,
      uptime: process.uptime()
    }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Fórum UPB Live Server activo.');
});

const wss = new WebSocketServer({ server });

function sendTo(ws, type, payload = {}) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    try {
      ws.send(JSON.stringify({ type, payload, timestamp: Date.now() }));
    } catch (err) {
      console.error('[LiveServer] Error enviando mensaje:', err);
    }
  }
}

function broadcastToClients(type, payload = {}) {
  const msg = JSON.stringify({ type, payload, timestamp: Date.now() });
  for (const [clientId, client] of session.connectedClients.entries()) {
    if (client.ws.readyState === WebSocket.OPEN) {
      try {
        client.ws.send(msg);
      } catch (err) {
        session.connectedClients.delete(clientId);
      }
    }
  }
}

function broadcastAll(type, payload = {}) {
  broadcastToClients(type, payload);
  if (session.hostSocket && session.hostSocket.readyState === WebSocket.OPEN) {
    sendTo(session.hostSocket, type, payload);
  }
}

function notifyHostClientCount() {
  if (session.hostSocket && session.hostSocket.readyState === WebSocket.OPEN) {
    sendTo(session.hostSocket, 'CLIENT_COUNT_UPDATE', {
      count: session.connectedClients.size
    });
  }
}

wss.on('connection', (ws, req) => {
  const clientIp = req.socket.remoteAddress;
  let clientIdentifier = null;
  let isHost = false;

  ws.isAlive = true;
  ws.on('pong', () => { ws.isAlive = true; });

  ws.on('message', (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw.toString());
    } catch (e) {
      return;
    }

    const { type, payload = {}, senderId, senderMode } = msg;

    switch (type) {
      // --- REGISTRO DEL HOST ---
      case 'HOST_REGISTER':
      case 'HOST_STATE_SYNC':
        isHost = true;
        session.hostSocket = ws;
        if (typeof payload.currentSlide === 'number') {
          session.currentSlide = payload.currentSlide;
        }
        if (payload.language) {
          session.language = payload.language;
        }
        notifyHostClientCount();
        broadcastToClients('HOST_STATE_SYNC', {
          currentSlide: session.currentSlide,
          language: session.language,
          simulationStates: session.simulationStates,
          strokes: Array.from(session.strokes.values()),
          points: Array.from(session.points.values())
        });
        break;

      // --- CAMBIO DE SLIDE POR EL HOST ---
      case 'SLIDE_CHANGE':
        if (isHost || senderMode === 'LIVE_HOST') {
          session.currentSlide = payload.slideIndex;
          broadcastToClients('SLIDE_CHANGE', { slideIndex: session.currentSlide });
        }
        break;

      // --- CAMBIO DE IDIOMA POR EL HOST ---
      case 'LANG_CHANGE':
        if (isHost || senderMode === 'LIVE_HOST') {
          session.language = payload.language;
          broadcastToClients('LANG_CHANGE', { language: session.language });
        }
        break;

      // --- REGISTRO / BIENVENIDA DE CLIENTE MÓVIL ---
      case 'CLIENT_HELLO':
      case 'CLIENT_REGISTER':
      case 'CLIENT_HEARTBEAT':
        clientIdentifier = payload.clientId || senderId || ('client_' + Math.random().toString(36).substring(2, 7));
        
        // Asignación equilibrada de grupo A/B (50% Cyan, 50% Magenta)
        let group = session.userGroups.get(clientIdentifier);
        if (!group) {
          group = (session.groupCounter % 2 === 0) ? 'A' : 'B';
          session.groupCounter++;
          session.userGroups.set(clientIdentifier, group);
        }

        session.connectedClients.set(clientIdentifier, {
          ws,
          ip: clientIp,
          joinedAt: session.connectedClients.get(clientIdentifier)?.joinedAt || Date.now(),
          lastSeen: Date.now()
        });

        // Enviar estado de sesión y grupo asignado al cliente
        sendTo(ws, 'HOST_STATE_SYNC', {
          currentSlide: session.currentSlide,
          language: session.language,
          assignedGroup: group,
          strokes: Array.from(session.strokes.values()),
          points: Array.from(session.points.values()),
          simulationStates: session.simulationStates
        });

        notifyHostClientCount();
        break;

      // --- INTERACCIÓN 1: CREACIÓN DE TRAZO (SLIDE 5, index 4) ---
      case 'STROKE_CREATE':
        if (session.currentSlide === 4 && clientIdentifier) { // Solo en Slide 5
          const currentCount = session.clientStrokeCounts.get(clientIdentifier) || 0;
          if (currentCount < 3 && payload.stroke) {
            const strokeId = payload.stroke.id || `stroke_${clientIdentifier}_${Date.now()}`;
            const strokeData = {
              ...payload.stroke,
              id: strokeId,
              clientId: clientIdentifier,
              timestamp: Date.now()
            };
            session.strokes.set(strokeId, strokeData);
            session.clientStrokeCounts.set(clientIdentifier, currentCount + 1);

            // Difundir nuevo trazo a todos (Host y demás celulares)
            broadcastAll('STROKE_CREATE', { stroke: strokeData });
          }
        }
        break;

      // --- INTERACCIÓN 1: ELIMINACIÓN DE TRAZO POR DOBLE TAP ---
      case 'STROKE_DELETE':
        if (session.currentSlide === 4 && clientIdentifier && payload.strokeId) {
          const stroke = session.strokes.get(payload.strokeId);
          if (stroke && stroke.clientId === clientIdentifier) {
            session.strokes.delete(payload.strokeId);
            const currentCount = session.clientStrokeCounts.get(clientIdentifier) || 1;
            session.clientStrokeCounts.set(clientIdentifier, Math.max(0, currentCount - 1));

            // Notificar eliminación a todos
            broadcastAll('STROKE_DELETE', { strokeId: payload.strokeId, clientId: clientIdentifier });
          }
        }
        break;

      // --- INTERACCIÓN 2: ACTUALIZACIÓN / ARRASTRE DE PUNTOS (SLIDE 9, index 8) ---
      case 'POINT_UPDATE':
      case 'POINT_DRAG':
        if (session.currentSlide === 8 && clientIdentifier && payload.point) { // Solo en Slide 9
          const pointId = payload.point.id || `point_${clientIdentifier}_${payload.point.index || 0}`;
          const pointData = {
            ...payload.point,
            id: pointId,
            clientId: clientIdentifier,
            group: session.userGroups.get(clientIdentifier) || 'A',
            timestamp: Date.now()
          };
          session.points.set(pointId, pointData);

          // Difundir actualización de punto
          broadcastAll('POINT_UPDATE', { point: pointData });
        }
        break;

      // --- CARGA INICIAL DE PUNTOS DEL CLIENTE ---
      case 'INIT_CLIENT_POINTS':
        if (session.currentSlide === 8 && clientIdentifier && Array.isArray(payload.points)) {
          const userGroup = session.userGroups.get(clientIdentifier) || 'A';
          payload.points.forEach((p) => {
            const pointId = p.id || `point_${clientIdentifier}_${p.index}`;
            const pointData = {
              ...p,
              id: pointId,
              clientId: clientIdentifier,
              group: userGroup,
              timestamp: Date.now()
            };
            session.points.set(pointId, pointData);
          });
          broadcastAll('BATCH_POINTS_UPDATE', { points: Array.from(session.points.values()) });
        }
        break;

      case 'CLIENT_BYE':
        if (clientIdentifier) {
          session.connectedClients.delete(clientIdentifier);
          notifyHostClientCount();
        }
        break;

      default:
        break;
    }
  });

  ws.on('close', () => {
    if (ws === session.hostSocket) {
      session.hostSocket = null;
    }
    if (clientIdentifier) {
      session.connectedClients.delete(clientIdentifier);
      notifyHostClientCount();
    }
  });
});

const heartbeatTimer = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      return ws.terminate();
    }
    ws.isAlive = false;
    ws.ping();
  });
}, 3000);

wss.on('close', () => clearInterval(heartbeatTimer));

server.listen(PORT, () => {
  const ips = getLocalIpAddresses();
  console.log('\n===============================================================');
  console.log('⚡ FÓRUM UPB - SERVIDOR LIVE ACTIVO');
  console.log(`📡 WebSocket escuchando en el puerto: ${PORT}`);
  console.log('===============================================================');
  console.log('\n🌐 RUTAS:');
  console.log(`  💻 HOST:    http://localhost:${VITE_PORT}/?mode=host`);
  console.log(`  🌐 GENERIC: http://localhost:${VITE_PORT}/?mode=generic`);
  ips.forEach((ip) => {
    console.log(`  📱 MÓVIL:   http://${ip}:${VITE_PORT}/?mode=client`);
  });
  console.log('===============================================================\n');
});
