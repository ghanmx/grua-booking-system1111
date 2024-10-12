import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Permite importar desde 'src' como '@'
    },
  },
  server: {
    host: '::',
    port: '8080',
    strictPort: true,
    clearScreen: false,
  },
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['@chakra-ui/icons'], // Agregar '@chakra-ui/icons' aquí
    },
  },
});
