import { Amplify } from 'aws-amplify';
import amplifyConfig from '../src/amplifyconfiguration.json';
import { API, graphqlOperation } from 'aws-amplify';
import { createNews } from '../src/graphql/mutations';
import { noticias } from '../src/data/noticias';

type NewsStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

type NewsInput = {
  title: string;
  slug: string;
  summary: string;
  body: string;
  category?: string | null;
  tags?: string[] | null;
  coverImageUrl?: string | null;
  galleryImageUrls?: string[] | null;
  videoUrl?: string | null;
  status: NewsStatus;
  highlight: boolean;
  authorName?: string | null;
  publishedAt?: string | null;
};

Amplify.configure(amplifyConfig);

const toSlug = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

const mapNoticiaToNewsInput = (noticia: (typeof noticias)[number]): NewsInput => {
  const body = (noticia.content ?? []).join('\n\n');

  return {
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
    publishedAt: null,
  };
};

const seed = async (): Promise<void> => {
  console.log('⏳ Iniciando seed de News desde src/data/noticias.ts');

  for (const noticia of noticias) {
    const input = mapNoticiaToNewsInput(noticia);
    console.log(`Creando News para: "${input.title}"`);

    try {
      const result: any = await API.graphql(
        graphqlOperation(createNews, { input }),
      );
      console.log('✔ Creado:', result.data.createNews.id);
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

