import os from 'node:os';
import { defineConfig } from 'vite';

function getLocalIpAddresses() {
  const interfaces = os.networkInterfaces();
  return Object.values(interfaces)
    .flat()
    .filter((iface) => iface && iface.family === 'IPv4' && !iface.internal)
    .map((iface) => iface.address);
}

function printViewUrls() {
  return {
    name: 'print-view-urls',
    configureServer(server) {
      server.httpServer?.once('listening', () => {
        const address = server.httpServer.address();
        const port = typeof address === 'object' && address ? address.port : 5173;
        const localUrl = (mode) => `http://localhost:${port}/?mode=${mode}`;

        console.log('\n===============================================================');
        console.log('🌐 ACCESOS DIRECTOS DE VISUALIZACIÓN');
        console.log('===============================================================');
        console.log(`  💻 HOST (local):   ${localUrl('host')}`);
        console.log(`  📱 MÓVIL (local):  ${localUrl('client')}`);
        console.log(`  🌐 VISOR (local):  ${localUrl('generic')}`);

        for (const ip of getLocalIpAddresses()) {
          const url = (mode) => `http://${ip}:${port}/?mode=${mode}`;
          console.log(`\n  📡 ACCESOS LAN (${ip}):`);
          console.log(`     💻 HOST:   ${url('host')}`);
          console.log(`     📱 MÓVIL:  ${url('client')}`);
          console.log(`     🌐 VISOR:  ${url('generic')}`);
        }
        console.log('===============================================================\n');
      });
    }
  };
}

export default defineConfig({
  plugins: [printViewUrls()],
  base: './',
  server: {
    host: '0.0.0.0', // Escuchar en todas las interfaces de red para acceso desde celulares
    port: 5173,
    strictPort: true,
    cors: true
  },
  build: {
    target: 'es2022'
  }
});

