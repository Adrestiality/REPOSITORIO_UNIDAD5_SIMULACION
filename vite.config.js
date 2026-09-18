import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    port: 5173,
    strictPort: true,
    cors: true
  },
  build: {
    target: 'es2022'
  }
});
