import { defineConfig } from 'vite';
import inspect from 'vite-plugin-inspect';

export default defineConfig({
  plugins: [
    inspect(),
  ]
});