import { defineConfig } from 'vite';

export default defineConfig({
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

