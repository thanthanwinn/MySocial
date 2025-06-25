import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(),tailwindcss()],
  resolve: {
    alias: {
      // Polyfill global variable
      global: 'globalthis',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis', // Fixes "global is not defined"
      },
    },
  },
  build: {
    rollupOptions: {

    },
  },
})
