import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'url'


export default defineConfig({
  // root: 'src/',
  base: './',          // wichtig: relative Pfade für Cordova
  server: {
    host: true,
    open: true,
  },
  build: {
    outDir: 'dist', // Output in the dist/ folder
    emptyOutDir: true, // Empty the folder first
    sourcemap: true, // Add sourcemap
    assetsDir: 'assets',
  }
});
    
