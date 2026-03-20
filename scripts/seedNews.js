import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import { signIn } from 'aws-amplify/auth';
import { noticias } from '../src/data/noticias-seed.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const amplifyConfig = JSON.parse(
  readFileSync(join(__dirname, '../src/amplifyconfiguration.json'), 'utf8'),
);

Amplify.configure(amplifyConfig);

// Definimos las operaciones GraphQL como strings para evitar importar TS generado
// directamente desde Node (Node no ejecuta TypeScript sin transpilar).
const createNews = /* GraphQL */ `
  mutation CreateNews($input: CreateNewsInput!, $condition: ModelNewsConditionInput) {
    createNews(input: $input, condition: $condition) {
      id
    }
  }
`;

const deleteNews = /* GraphQL */ `
  mutation DeleteNews($input: DeleteNewsInput!, $condition: ModelNewsConditionInput) {
    deleteNews(input: $input, condition: $condition) {
      id
    }
  }
`;

const listNews = /* GraphQL */ `
  query ListNews($filter: ModelNewsFilterInput, $limit: Int, $nextToken: String) {
    listNews(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
      }
      nextToken
    }
  }
`;

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const RESET_NEWS = (process.env.RESET_NEWS ?? 'false').toLowerCase() === 'true';

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  throw new Error(
    'Faltan credenciales para seed. Define ADMIN_EMAIL y ADMIN_PASSWORD en variables de entorno.',
  );
}

const toSlug = (text) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

const removeDiacritics = (text) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const parseSpanishDateToIsoUtc = (dateString) => {
  // Ej: "29 de Enero, 2025" | "04 de Febrero, 2025" | "5 de Marzo, 2025"
  const match = String(dateString).match(/(\d{1,2})\s+de\s+([A-Za-zÁÉÍÓÚáéíóúÑñ]+),?\s+(\d{4})/);
  if (!match) return null;

  const day = Number(match[1]);
  const rawMonth = removeDiacritics(match[2]).toLowerCase();
  const year = Number(match[3]);

  const monthMap = {
    enero: 0,
    febrero: 1,
    marzo: 2,
    abril: 3,
    mayo: 4,
    junio: 5,
    julio: 6,
    agosto: 7,
    septiembre: 8,
    setiembre: 8,
    octubre: 9,
    noviembre: 10,
    diciembre: 11,
  };

  const monthIndex = monthMap[rawMonth];
  if (monthIndex === undefined) return null;

  const iso = new Date(Date.UTC(year, monthIndex, day, 12, 0, 0)).toISOString();
  return iso;
};

const mapNoticiaToNewsInput = (noticia) => {
  const body = (noticia.content ?? []).join('\n\n');
  const publishedAt = noticia.date ? parseSpanishDateToIsoUtc(noticia.date) : null;

  return {
    id: String(noticia.id),
    title: noticia.title,
    slug: toSlug(noticia.title),
    summary: noticia.excerpt,
    body,
    category: noticia.category ?? null,
    tags: null,
    coverImageUrl: noticia.image ?? null,
    galleryImageUrls: noticia.gallery ?? null,
    videoUrl: noticia.video ?? null,
    status: 'PUBLISHED',
    highlight: false,
    authorName: null,
    publishedAt,
  };
};

const seed = async () => {
  console.log('⏳ Iniciando seed de News desde src/data/noticias.ts');

  const client = generateClient();

  const signInResult = await signIn({ username: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  console.log('🔐 signIn:', { isSignedIn: signInResult.isSignedIn, nextStep: signInResult.nextStep?.signInStep });

  if (RESET_NEWS) {
    console.log('🧹 RESET_NEWS=true: borrando News existentes...');
    let nextToken = null;
    do {
      const res = await client.graphql({
        query: listNews,
        variables: { limit: 1000, nextToken },
        authMode: 'AMAZON_COGNITO_USER_POOLS',
      });

      const items = res?.data?.listNews?.items ?? [];
      for (const item of items) {
        await client.graphql({
          query: deleteNews,
          variables: { input: { id: item.id } },
          authMode: 'AMAZON_COGNITO_USER_POOLS',
        });
      }

      nextToken = res?.data?.listNews?.nextToken ?? null;
    } while (nextToken);
    console.log('🧹 Borrado completado');
  }

  for (const noticia of noticias) {
    const input = mapNoticiaToNewsInput(noticia);
    console.log(`Creando News para: "${input.title}"`);

    try {
      const result = await client.graphql({
        query: createNews,
        variables: { input },
        authMode: 'AMAZON_COGNITO_USER_POOLS',
      });

      console.log('✔ Creado:', result?.data?.createNews?.id);
    } catch (error) {
      console.error('❌ Error creando noticia:', input.title, error);
    }
  }

  console.log('✅ Seed de News terminado');
};

seed()
  .then(() => {
    console.log('🎉 Proceso completado');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error general en seed:', err);
    process.exit(1);
  });

