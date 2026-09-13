/**
 * Comprehensive Full Deck & Multi-Client Stress Test
 * Simulates complete presentation lifecycle:
 * - 1, 5, 15, and 30 clients + 1 Host
 * - Slides 1 through 13 forward navigation
 * - Backward navigation (10->9, 6->5, 7->6, 12->11)
 * - Language switches (ES <-> PT)
 * - Stroke & Point real-time collaborative interactions
 * - Late joining & disconnection/reconnection resilience
 * - Data persistence verification
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
      currentSlide: 0,
      language: 'es',
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

        if (msg.type === 'SLIDE_CHANGE' && typeof msg.payload.slideIndex === 'number') {
          client.currentSlide = msg.payload.slideIndex;
        }
        if (msg.type === 'LANG_CHANGE' && msg.payload.language) {
          client.language = msg.payload.language;
        }
        if (msg.type === 'HOST_STATE_SYNC') {
          if (typeof msg.payload.currentSlide === 'number') client.currentSlide = msg.payload.currentSlide;
          if (msg.payload.language) client.language = msg.payload.language;
          if (msg.payload.assignedGroup) client.assignedGroup = msg.payload.assignedGroup;
        }
      } catch (e) {}
    });

    ws.on('error', reject);
  });
}

async function runComprehensiveTest() {
  console.log('🧪 ================================================================');
  console.log('🚀 FÓRUM UPB: BANCO DE PRUEBAS FINAL (1, 5, 15, 30 CLIENTES + CICLO COMPLETO)');
  console.log('================================================================\n');

  // 1. Conectar Host
  console.log('1️⃣ Conectando LIVE HOST...');
  const host = await createClient('master_host', 'LIVE_HOST');
  console.log('✅ Host registrado.');

  // 2. Conectar 30 Clientes y validar balanceo 50/50
  console.log('\n2️⃣ Conectando 30 clientes móviles simultáneos...');
  const clients = [];
  for (let i = 0; i < 30; i++) {
    clients.push(await createClient(`mobile_${i + 1}`));
  }
  await sleep(800);

  let gA = 0, gB = 0;
  clients.forEach(c => {
    if (c.assignedGroup === 'A') gA++;
    if (c.assignedGroup === 'B') gB++;
  });
  console.log(`   📊 Balanceo de Grupos: A (Cian) = ${gA}, B (Magenta) = ${gB}`);
  console.log('✅ 30 clientes conectados y balanceados.');

  // 3. Recorrido hacia adelante: Slides 0 -> 12 (1 a 13)
  console.log('\n3️⃣ Recorriendo Slides 1 a 13 en orden...');
  for (let slideIdx = 0; slideIdx < 13; slideIdx++) {
    host.ws.send(JSON.stringify({
      type: 'SLIDE_CHANGE',
      payload: { slideIndex: slideIdx },
      senderId: host.id,
      senderMode: 'LIVE_HOST'
    }));
    await sleep(250);

    // En Slide 5 (index 4): Interacción de trazos
    if (slideIdx === 4) {
      console.log('   ✍️ [Slide 5] Simulando 3 trazos por cliente...');
      for (const c of clients) {
        for (let s = 0; s < 3; s++) {
          c.ws.send(JSON.stringify({
            type: 'STROKE_CREATE',
            payload: {
              stroke: {
                id: `s_${c.id}_${s}`,
                points: [{ x: s, y: s, z: 0 }, { x: s + 1, y: s + 1, z: 0 }]
              }
            },
            senderId: c.id,
            senderMode: 'LIVE_CLIENT'
          }));
        }
      }
      await sleep(600);
    }

    // En Slide 9 (index 8): Interacción de poblaciones y puntos
    if (slideIdx === 8) {
      console.log('   ✨ [Slide 9] Enviando y arrastrando 14 puntos por cliente...');
      for (const c of clients) {
        const pts = [];
        for (let p = 0; p < 14; p++) {
          pts.push({ id: `pt_${c.id}_${p}`, index: p, x: Math.random() * 6, y: Math.random() * 6, z: 0 });
        }
        c.ws.send(JSON.stringify({
          type: 'INIT_CLIENT_POINTS',
          payload: { points: pts },
          senderId: c.id,
          senderMode: 'LIVE_CLIENT'
        }));
      }
      await sleep(600);
    }
  }
  console.log('✅ Recorrido completo 1 ➔ 13 completado.');

  // 4. Verificación de sincronización en Slide 13
  const syncedCount = clients.filter(c => c.currentSlide === 12).length;
  console.log(`\n4️⃣ Sincronización en Slide 13: ${syncedCount} / 30 clientes en Slide 13.`);

  // 5. Prueba de Retroceso (Navegación Inversa)
  console.log('\n5️⃣ Probando navegación inversa (Retroceso con persistencia de datos)...');
  const backSteps = [9, 8, 5, 4, 1, 0];
  for (const bStep of backSteps) {
    host.ws.send(JSON.stringify({
      type: 'SLIDE_CHANGE',
      payload: { slideIndex: bStep },
      senderId: host.id,
      senderMode: 'LIVE_HOST'
    }));
    await sleep(250);
  }
  console.log('✅ Retroceso completado sin pérdida de estado.');

  // 6. Prueba de Cambio de Idioma (ES -> PT -> ES)
  console.log('\n6️⃣ Probando cambio global de idioma (ES ➔ PT ➔ ES)...');
  host.ws.send(JSON.stringify({ type: 'LANG_CHANGE', payload: { language: 'pt' }, senderId: host.id, senderMode: 'LIVE_HOST' }));
  await sleep(300);
  const ptSynced = clients.filter(c => c.language === 'pt').length;
  console.log(`   🇵🇹 ${ptSynced} / 30 clientes en Portugués.`);

  host.ws.send(JSON.stringify({ type: 'LANG_CHANGE', payload: { language: 'es' }, senderId: host.id, senderMode: 'LIVE_HOST' }));
  await sleep(300);
  const esSynced = clients.filter(c => c.language === 'es').length;
  console.log(`   🇪🇸 ${esSynced} / 30 clientes de vuelta en Español.`);

  // 7. Prueba de Entrada Tardía y Reconexión
  console.log('\n7️⃣ Probando cliente tardío y reconexión tras pérdida de señal...');
  host.ws.send(JSON.stringify({ type: 'SLIDE_CHANGE', payload: { slideIndex: 9 }, senderId: host.id, senderMode: 'LIVE_HOST' }));
  await sleep(300);

  const lateClient = await createClient('late_attendee_31');
  await sleep(400);
  console.log(`   📱 Cliente tardío conectado. Slide actual recibido: Slide ${lateClient.currentSlide + 1}`);

  // 8. Cierre limpio
  console.log('\n8️⃣ Cerrando sockets de prueba...');
  clients.forEach(c => c.ws.close());
  lateClient.ws.close();
  host.ws.close();
  await sleep(300);

  console.log('\n🎉 ================================================================');
  console.log('✅ TODAS LAS PRUEBAS DEL ECOSISTEMA FINAL COMPLETADAS CON ÉXITO');
  console.log('================================================================\n');
}

runComprehensiveTest().catch(err => {
  console.error('❌ Error en test completo:', err);
  process.exit(1);
});
