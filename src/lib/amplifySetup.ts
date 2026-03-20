/**
 * Un solo módulo: `Amplify.configure` + `generateClient` comparten el mismo
 * grafo que `main.tsx` (import estático). Evita el error Symbol(amplify) en Vite
 * cuando `aws-amplify/api` se cargaba en otro chunk.
 */
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import amplifyConfig from '../amplifyconfiguration.json';

const CONFIG_MARKER = '__AMPLIFY_CONFIGURED__';
const globalAny = globalThis as unknown as Record<string, unknown>;

if (!globalAny[CONFIG_MARKER]) {
  Amplify.configure(amplifyConfig);
  globalAny[CONFIG_MARKER] = true;
}

export const getGraphqlClient = () => generateClient();
