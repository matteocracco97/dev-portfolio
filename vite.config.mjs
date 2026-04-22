import { defineConfig } from 'vite'

export default defineConfig({
  root: './src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    publicDir: 'public', 
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          gsap: ['gsap'],
          chart: ['chart.js']
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['vanta'] // Escludi Vanta dall'ottimizzazione
  }
})