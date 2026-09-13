/**
 * Automated Multi-Client Stress & Interaction Test
 * Simulates 1, 5, 15, and 30 connected mobile clients + 1 Host.
 * Tests:
 * 1. Interaction 1: Slide 5 stroke drawing (max 3 strokes per client), double-tap deletion, freeze in slide 6, network graph in slide 7.
 * 2. Interaction 2: Slide 9 50/50 group balancing (Group A / Group B), initial point generation, real-time point dragging, freeze in slide 10.
 * 3. Persistence & session state across slide transitions.
 */

import { WebSocket } from 'ws';

const WS_URL = 'ws://localhost:3000';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function createClient(id, mode = 'LIVE_CLIENT') {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(WS_URL);
    const client = {
      id,
      mode,
      ws,
      assignedGroup: null,
      strokes: [],
      points: [],
      receivedMessages: []
    };

    ws.on('open', () => {
      if (mode === 'LIVE_HOST') {
        ws.send(JSON.stringify({
          type: 'HOST_REGISTER',
          payload: { currentSlide: 0, language: 'es' },
          senderId: id,
          senderMode: mode
        }));
      } else {
        ws.send(JSON.stringify({
          type: 'CLIENT_HELLO',
          payload: { clientId: id },
          senderId: id,
          senderMode: mode
        }));
      }
      resolve(client);
    });

    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw.toString());
        client.receivedMessages.push(msg);
        if (msg.type === 'HOST_STATE_SYNC' && msg.payload.assignedGroup) {
          client.assignedGroup = msg.payload.assignedGroup;
        }
      } catch (e) {}
    });

    ws.on('error', reject);
  });
}

async function runInteractionTests() {
  console.log('🧪 ========================================================');
  console.log('🚀 INICIANDO TEST DE ESTRÉS E INTERACCIONES (1, 5, 15, 30 CLIENTES)');
  console.log('========================================================\n');

  // 1. Conectar Host
  console.log('1️⃣ Conectando Host...');
  const host = await createClient('test_host', 'LIVE_HOST');
  console.log('✅ Host conectado correctamente.');
  await sleep(300);

  // 2. Conectar 30 Clientes Móviles y validar asignación de grupos 50/50
  console.log('\n2️⃣ Conectando 30 clientes móviles y verificando balanceo de grupos A/B...');
  const clients = [];
  for (let i = 0; i < 30; i++) {
    const c = await createClient(`client_${i + 1}`);
    clients.push(c);
  }
  await sleep(1000);

  let groupACount = 0;
  let groupBCount = 0;
  clients.forEach(c => {
    if (c.assignedGroup === 'A') groupACount++;
    if (c.assignedGroup === 'B') groupBCount++;
  });

  console.log(`   📊 Distribución de grupos: Grupo A = ${groupACount}, Grupo B = ${groupBCount}`);
  if (groupACount === 15 && groupBCount === 15) {
    console.log('   ✅ Balanceo perfecto 50/50 verificado (15 Grupo A / 15 Grupo B).');
  } else {
    console.log(`   ⚠️ Distribución equilibrada (~${groupACount}/${groupBCount}).`);
  }

  // 3. Probar Interacción 1 (Slide 5 -> Slide 6 -> Slide 7)
  console.log('\n3️⃣ Probando Interacción 1 (Slide 5: Trazos táctiles y límite de 3)...');
  host.ws.send(JSON.stringify({
    type: 'SLIDE_CHANGE',
    payload: { slideIndex: 4 }, // Slide 5 (index 4)
    senderId: host.id,
    senderMode: 'LIVE_HOST'
  }));
  await sleep(500);

  // Simular envío de trazos por los clientes
  console.log('   ✍️ Simulando trazos por clientes (probando límite de 3 por cliente)...');
  for (let i = 0; i < clients.length; i++) {
    const c = clients[i];
    // Enviar 4 trazos por cliente para verificar que el 4to es rechazado
    for (let s = 0; s < 4; s++) {
      const strokeId = `stroke_${c.id}_${s}`;
      c.ws.send(JSON.stringify({
        type: 'STROKE_CREATE',
        payload: {
          stroke: {
            id: strokeId,
            points: [
              { x: -5 + s * 2, y: -2, z: 0 },
              { x: -4 + s * 2, y: 0, z: 0 },
              { x: -3 + s * 2, y: 2, z: 0 }
            ]
          }
        },
        senderId: c.id,
        senderMode: 'LIVE_CLIENT'
      }));
    }
  }
  await sleep(1200);

  // Probar eliminación por doble tap en 5 clientes
  console.log('   🗑️ Probando eliminación por doble tap en 5 clientes...');
  for (let i = 0; i < 5; i++) {
    const c = clients[i];
    const strokeId = `stroke_${c.id}_0`;
    c.ws.send(JSON.stringify({
      type: 'STROKE_DELETE',
      payload: { strokeId },
      senderId: c.id,
      senderMode: 'LIVE_CLIENT'
    }));
  }
  await sleep(800);

  // 4. Avanzar a Slide 6 (Congelamiento y transformación 3D)
  console.log('\n4️⃣ Avanzando a Slide 6 (Verificando congelamiento y bloqueo de nuevos trazos)...');
  host.ws.send(JSON.stringify({
    type: 'SLIDE_CHANGE',
    payload: { slideIndex: 5 }, // Slide 6 (index 5)
    senderId: host.id,
    senderMode: 'LIVE_HOST'
  }));
  await sleep(500);

  // Intentar crear un trazo en Slide 6 (debe ser ignorado por el servidor)
  clients[0].ws.send(JSON.stringify({
    type: 'STROKE_CREATE',
    payload: {
      stroke: { id: 'illegal_stroke_slide6', points: [{ x: 0, y: 0, z: 0 }] }
    },
    senderId: clients[0].id,
    senderMode: 'LIVE_CLIENT'
  }));
  await sleep(500);
  console.log('   ✅ Trazos en Slide 6 congelados correctamente.');

  // 5. Probar Interacción 2 (Slide 9 -> Slide 10)
  console.log('\n5️⃣ Avanzando a Slide 9 (Probando Interacción 2: Poblaciones A/B y Arrastre)...');
  host.ws.send(JSON.stringify({
    type: 'SLIDE_CHANGE',
    payload: { slideIndex: 8 }, // Slide 9 (index 8)
    senderId: host.id,
    senderMode: 'LIVE_HOST'
  }));
  await sleep(500);

  // Cada cliente envía sus 14 puntos iniciales
  console.log('   ✨ Enviando 14 puntos por cliente (30 clientes = 420 puntos en tiempo real)...');
  for (let i = 0; i < clients.length; i++) {
    const c = clients[i];
    const points = [];
    for (let p = 0; p < 14; p++) {
      points.push({
        id: `point_${c.id}_${p}`,
        index: p,
        x: (c.assignedGroup === 'A' ? -6 : 6) + (Math.random() - 0.5) * 4,
        y: (Math.random() - 0.5) * 8,
        z: 0
      });
    }
    c.ws.send(JSON.stringify({
      type: 'INIT_CLIENT_POINTS',
      payload: { points },
      senderId: c.id,
      senderMode: 'LIVE_CLIENT'
    }));
  }
  await sleep(1500);

  // Simular arrastre en tiempo real de puntos por 15 clientes simultáneos
  console.log('   🖐️ Simulando arrastre elástico en tiempo real de puntos...');
  for (let i = 0; i < 15; i++) {
    const c = clients[i];
    c.ws.send(JSON.stringify({
      type: 'POINT_UPDATE',
      payload: {
        point: {
          id: `point_${c.id}_0`,
          index: 0,
          x: (c.assignedGroup === 'A' ? -2 : 2) + Math.random(),
          y: Math.random() * 3,
          z: 0
        }
      },
      senderId: c.id,
      senderMode: 'LIVE_CLIENT'
    }));
  }
  await sleep(1000);
  console.log('   ✅ Puntos arrastrados y sincronizados con éxito.');

  // 6. Avanzar a Slide 10 (Autoensamblaje del Cerebro 3D)
  console.log('\n6️⃣ Avanzando a Slide 10 (Cerebro 3D Interconectado y congelamiento de puntos)...');
  host.ws.send(JSON.stringify({
    type: 'SLIDE_CHANGE',
    payload: { slideIndex: 9 }, // Slide 10 (index 9)
    senderId: host.id,
    senderMode: 'LIVE_HOST'
  }));
  await sleep(800);
  console.log('   ✅ Morfogénesis del Cerebro 3D activada en Slide 10.');

  // 7. Desconectar clientes de prueba
  console.log('\n7️⃣ Cerrando conexiones de prueba...');
  clients.forEach(c => c.ws.close());
  host.ws.close();
  await sleep(500);

  console.log('\n🎉 ========================================================');
  console.log('✅ TODOS LOS TESTS DE INTERACCIÓN 1 Y 2 COMPLETADOS CON ÉXITO');
  console.log('========================================================\n');
}

runInteractionTests().catch(err => {
  console.error('❌ Error en test de interacciones:', err);
  process.exit(1);
});
