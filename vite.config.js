import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Allows imports from 'src' as '@'
    },
  },
  server: {
    host: '::',
    port: '8080',
    strictPort: true,
    clearScreen: false,
  },
  build: {
    rollupOptions: {
      external: ['@chakra-ui/icons', 'react-icons/fa'], // Add '@chakra-ui/icons' and any other necessary external dependencies
    },
  },
  plugins: [react()],
});
