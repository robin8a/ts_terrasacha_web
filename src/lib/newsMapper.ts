import type { Noticia } from '../data/noticias';
import { stripPresignedQueryFromOurBucketUrl } from './s3PublicUrl';
import { buildYoutubeEmbedUrl } from './youtube';

const MONTHS_UTC_ES_LONG = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
] as const;

const pad2 = (n: number) => String(n).padStart(2, '0');

export const formatNewsDateLongEs = (isoDateTime?: string | null): string => {
  if (!isoDateTime) return '';
  const date = new Date(isoDateTime);
  if (Number.isNaN(date.getTime())) return '';

  // Tomamos UTC para que no cambie según zona horaria del usuario.
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  const monthName = MONTHS_UTC_ES_LONG[date.getUTCMonth()];

  return `${pad2(day)} de ${monthName}, ${year}`;
};

export const mapAmplifyNewsToNoticia = (news: any): Noticia => {
  const idValue = String(news?.id ?? '').trim();
  const body = typeof news?.body === 'string' ? news.body : '';
  const content = body
    ? body
        .split('\n\n')
        .map((p: string) => p.trim())
        .filter(Boolean)
    : undefined;

  const gallery = Array.isArray(news?.galleryImageUrls)
    ? (news.galleryImageUrls.filter((u: string | null) => typeof u === 'string') as string[])
    : undefined;

  const image = stripPresignedQueryFromOurBucketUrl(news?.coverImageUrl) ?? undefined;
  const galleryNormalized = gallery?.map((u) => stripPresignedQueryFromOurBucketUrl(u) ?? u);
  const video = stripPresignedQueryFromOurBucketUrl(news?.videoUrl) ?? news?.videoUrl ?? undefined;
  const youtubeEmbedUrl = buildYoutubeEmbedUrl(news?.youtubeUrl) ?? undefined;

  return {
    id: idValue,
    title: news?.title ?? '',
    date: formatNewsDateLongEs(news?.publishedAt ?? news?.createdAt),
    excerpt: news?.summary ?? '',
    image,
    category: news?.category ?? undefined,
    content,
    gallery: galleryNormalized,
    video,
    youtubeEmbedUrl,
  };
};

