import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  base: '/js/vue-apps/timesheet/dist/',
  resolve: {
    alias: {
      '@': resolve(__dirname, '.')
    }
  },
  build: {
    outDir: resolve(__dirname, 'dist'),
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    },
    minify: 'esbuild',
    sourcemap: false
  },
  server: {
    port: 5173,
    open: false,
    host: true,
    cors: true
  }
});

