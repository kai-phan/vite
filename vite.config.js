import { defineConfig } from 'vite';
import inspect from 'vite-plugin-inspect';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import path from 'path';

export default defineConfig({
  plugins: [
    inspect(),
  ],
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
      ],
    },
    preprocessorOptions: {
      scss: {
        additionalData: `$color: #ff7301;`,
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        about: path.resolve(__dirname, 'about.html'),
      }
    }
  }
});