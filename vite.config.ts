import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['aws-amplify', '@aws-amplify/core', '@aws-amplify/api-graphql'],
    alias: {
      '@aws-amplify/core': path.resolve(__dirname, 'node_modules/@aws-amplify/core'),
      '@aws-amplify/api-graphql': path.resolve(__dirname, 'node_modules/@aws-amplify/api-graphql'),
      'aws-amplify': path.resolve(__dirname, 'node_modules/aws-amplify'),
    },
  },
  optimizeDeps: {
    // Evita que Amplify (subpaths) se pre-empaquete en un grafo distinto en dev,
    // lo que vuelve a romper `getInternals()` con `Symbol(amplify)` undefined.
    exclude: [
      'aws-amplify',
      'aws-amplify/api',
      'aws-amplify/auth',
      'aws-amplify/storage',
      '@aws-amplify/core',
      '@aws-amplify/api-graphql',
    ],
    // Compatibilidad: crc-32 es CJS, y sin prebundle Vite puede generar un ESM
    // que intenta importar `default` (error anterior).
    include: ['crc-32'],
  },
});
