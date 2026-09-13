/**
 * Automated Load & Scalability Test for Fórum UPB LIVE Architecture
 * Prueba de conexión y sincronización en tiempo real para 1 a 30 clientes concurrentes.
 */

import { WebSocket } from 'ws';
import assert from 'node:assert';

const SERVER_URL = 'ws://localhost:3000';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runLoadTests() {
  console.log('\n===============================================================');
  console.log('🧪 INICIANDO PRUEBA DE CARGA Y SINCRONIZACIÓN LIVE (30 CLIENTES)');
  console.log('===============================================================\n');

  // 1. Conectar Host Virtual
  console.log('1️⃣ Conectando LIVE_HOST...');
  const hostWs = new WebSocket(SERVER_URL);
  await new Promise((resolve) => hostWs.on('open', resolve));

  hostWs.send(JSON.stringify({
    type: 'HOST_REGISTER',
    senderId: 'host_virtual_01',
    senderMode: 'LIVE_HOST',
    payload: {
      currentSlide: 0,
      language: 'es',
      simulationStates: {}
    }
  }));
  console.log('✓ Host conectado y registrado con éxito.');
  await sleep(200);

  // 2. Conectar 30 Clientes Virtuales Concurrentes
  const totalClients = 30;
  const clients = [];
  const clientStates = new Map();

  console.log(`\n2️⃣ Conectando ${totalClients} clientes móviles en tiempo real...`);

  for (let i = 1; i <= totalClients; i++) {
    const clientId = `client_mobile_${String(i).padStart(2, '0')}`;
    const ws = new WebSocket(SERVER_URL);

    clientStates.set(clientId, {
      currentSlide: -1,
      language: '',
      connected: false
    });

    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw.toString());
        const state = clientStates.get(clientId);

        if (msg.type === 'HOST_STATE_SYNC') {
          state.currentSlide = msg.payload.currentSlide;
          state.language = msg.payload.language;
        } else if (msg.type === 'SLIDE_CHANGE') {
          state.currentSlide = msg.payload.slideIndex;
        } else if (msg.type === 'LANG_CHANGE') {
          state.language = msg.payload.language;
        }
      } catch (e) {}
    });

    ws.on('open', () => {
      clientStates.get(clientId).connected = true;
      ws.send(JSON.stringify({
        type: 'CLIENT_HELLO',
        senderId: clientId,
        senderMode: 'LIVE_CLIENT',
        payload: { clientId }
      }));
    });

    clients.push({ id: clientId, ws });

    // Hitos progresivos de conexión
    if (i === 1 || i === 5 || i === 10 || i === 30) {
      await sleep(150);
      const connectedCount = clients.filter(c => c.ws.readyState === WebSocket.OPEN).length;
      console.log(`  ✓ Hito: ${connectedCount} celulares conectados y sincronizados.`);
    }
  }

  await sleep(500);

  // Verificar que los 30 clientes están en Slide 0
  for (let i = 1; i <= totalClients; i++) {
    const cid = `client_mobile_${String(i).padStart(2, '0')}`;
    assert.strictEqual(clientStates.get(cid).currentSlide, 0, `Cliente ${cid} debe estar en slide 0`);
  }
  console.log('✓ Los 30 celulares recibieron correctamente el estado inicial (Slide 0).');

  // 3. Probar avance del Host: 0 -> 5
  console.log('\n3️⃣ Host avanza: Diapositiva 0 ➔ 5');
  hostWs.send(JSON.stringify({
    type: 'SLIDE_CHANGE',
    senderMode: 'LIVE_HOST',
    payload: { slideIndex: 5 }
  }));
  await sleep(300);

  for (let i = 1; i <= totalClients; i++) {
    const cid = `client_mobile_${String(i).padStart(2, '0')}`;
    assert.strictEqual(clientStates.get(cid).currentSlide, 5, `Cliente ${cid} debe estar en slide 5`);
  }
  console.log('✓ Los 30 celulares avanzaron sincrónicamente a la Diapositiva 5.');

  // 4. Probar avance a la última: 5 -> 12
  console.log('\n4️⃣ Host avanza: Diapositiva 5 ➔ 12 (Cierre)');
  hostWs.send(JSON.stringify({
    type: 'SLIDE_CHANGE',
    senderMode: 'LIVE_HOST',
    payload: { slideIndex: 12 }
  }));
  await sleep(300);

  for (let i = 1; i <= totalClients; i++) {
    const cid = `client_mobile_${String(i).padStart(2, '0')}`;
    assert.strictEqual(clientStates.get(cid).currentSlide, 12, `Cliente ${cid} debe estar en slide 12`);
  }
  console.log('✓ Los 30 celulares avanzaron sincrónicamente a la Diapositiva 12.');

  // 5. Probar retroceso del Host: 12 -> 2
  console.log('\n5️⃣ Host retrocede: Diapositiva 12 ➔ 2');
  hostWs.send(JSON.stringify({
    type: 'SLIDE_CHANGE',
    senderMode: 'LIVE_HOST',
    payload: { slideIndex: 2 }
  }));
  await sleep(300);

  for (let i = 1; i <= totalClients; i++) {
    const cid = `client_mobile_${String(i).padStart(2, '0')}`;
    assert.strictEqual(clientStates.get(cid).currentSlide, 2, `Cliente ${cid} debe estar en slide 2`);
  }
  console.log('✓ Los 30 celulares retrocedieron sincrónicamente a la Diapositiva 2.');

  // 6. Probar cambio de idioma del Host: ES -> PT
  console.log('\n6️⃣ Host cambia idioma: ES ➔ PT');
  hostWs.send(JSON.stringify({
    type: 'LANG_CHANGE',
    senderMode: 'LIVE_HOST',
    payload: { language: 'pt' }
  }));
  await sleep(300);

  for (let i = 1; i <= totalClients; i++) {
    const cid = `client_mobile_${String(i).padStart(2, '0')}`;
    assert.strictEqual(clientStates.get(cid).language, 'pt', `Cliente ${cid} debe tener idioma PT`);
  }
  console.log('✓ Los 30 celulares actualizaron el idioma a Portugués en tiempo real.');

  // 7. Prueba de Desconexión y Reconexión
  console.log('\n7️⃣ Probando desconexión de 5 clientes, avance del Host y reconexión...');
  const clientsToDisconnect = clients.slice(0, 5);
  clientsToDisconnect.forEach(c => c.ws.close());
  await sleep(300);

  // Host avanza a Slide 8 mientras están desconectados
  console.log('   Host avanza a Slide 8 (mientras 5 celulares están fuera de línea)...');
  hostWs.send(JSON.stringify({
    type: 'SLIDE_CHANGE',
    senderMode: 'LIVE_HOST',
    payload: { slideIndex: 8 }
  }));
  await sleep(300);

  // Reconectar los 5 clientes
  console.log('   Reconectando los 5 celulares...');
  for (const c of clientsToDisconnect) {
    const newWs = new WebSocket(SERVER_URL);
    clientStates.get(c.id).currentSlide = -1; // Resetear estado local

    newWs.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw.toString());
        if (msg.type === 'HOST_STATE_SYNC') {
          clientStates.get(c.id).currentSlide = msg.payload.currentSlide;
        }
      } catch (e) {}
    });

    await new Promise((res) => {
      newWs.on('open', () => {
        newWs.send(JSON.stringify({
          type: 'CLIENT_HELLO',
          senderId: c.id,
          senderMode: 'LIVE_CLIENT',
          payload: { clientId: c.id }
        }));
        res();
      });
    });
    c.ws = newWs;
  }

  await sleep(400);

  // Verificar que los 5 clientes reconectados recibieron inmediatamente Slide 8
  for (const c of clientsToDisconnect) {
    assert.strictEqual(clientStates.get(c.id).currentSlide, 8, `Cliente reconectado ${c.id} debe estar en slide 8`);
  }
  console.log('✓ Los 5 celulares reconectados recibieron de inmediato el Slide 8 actual del Host.');

  // Cerrar sockets de prueba
  clients.forEach(c => c.ws.close());
  hostWs.close();

  console.log('\n===============================================================');
  console.log('🎉 TODAS LAS PRUEBAS DE CARGA Y SINCRONIZACIÓN LIVE SUPERADAS (100%)');
  console.log('===============================================================\n');
}

runLoadTests().catch((err) => {
  console.error('❌ Error en prueba de carga:', err);
  process.exit(1);
});
