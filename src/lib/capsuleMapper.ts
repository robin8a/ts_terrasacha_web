import { stripPresignedQueryFromOurBucketUrl } from './s3PublicUrl';

export type CapsuleContextType = 'Legal' | 'Social' | 'Investigativo' | 'Tec científico';

export type PublicCapsule = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image?: string;
  contextType: CapsuleContextType;
  legalReference?: string;
  institution?: string;
  category?: string;
  body: string[];
  attachmentUrls: string[];
  publishedAt?: string | null;
  highlight: boolean;
};

const CONTEXT_TYPES: CapsuleContextType[] = ['Legal', 'Social', 'Investigativo', 'Tec científico'];

const API_CONTEXT_TO_PUBLIC: Record<string, CapsuleContextType> = {
  LEGAL: 'Legal',
  SOCIAL: 'Social',
  REGULATORIO: 'Social',
  INVESTIGATIVO: 'Investigativo',
  TEC_CIENTIFICO: 'Tec científico',
  MIXTO: 'Tec científico',
};

const PUBLIC_CONTEXT_TO_API: Record<CapsuleContextType, string> = {
  Legal: 'LEGAL',
  Social: 'SOCIAL',
  Investigativo: 'INVESTIGATIVO',
  'Tec científico': 'TEC_CIENTIFICO',
};

export const toApiCapsuleContextType = (value: CapsuleContextType): string =>
  PUBLIC_CONTEXT_TO_API[value] ?? 'TEC_CIENTIFICO';

const normalizeContextType = (value: unknown): CapsuleContextType => {
  const raw = typeof value === 'string' ? value.trim() : '';
  if (!raw) return 'Tec científico';

  const fromApi = API_CONTEXT_TO_PUBLIC[raw.toUpperCase()];
  if (fromApi) return fromApi;

  const normalized = raw.toLowerCase();
  if (normalized === 'regulatorio') return 'Social';
  if (normalized === 'mixto') return 'Tec científico';
  if (normalized === 'tec cientifico' || normalized === 'tec. científico') return 'Tec científico';

  const match = CONTEXT_TYPES.find((item) => item.toLowerCase() === normalized);
  return match ?? 'Tec científico';
};

export const formatCapsuleContextLabel = (value: unknown): CapsuleContextType =>
  normalizeContextType(value);

const toParagraphs = (text?: string | null): string[] => {
  if (!text) return [];
  return text
    .split('\n\n')
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
};

export const getContextTypeChipClasses = (contextType: CapsuleContextType): string => {
  if (contextType === 'Legal') return 'bg-primary/15 text-primary border-primary/20';
  if (contextType === 'Social') return 'bg-secondary-pradera/20 text-secondary-[bosques-nublados] border-secondary-pradera/30';
  if (contextType === 'Investigativo') return 'bg-secondary-claro/30 text-secondary-[bosques-nublados] border-secondary-claro/40';
  return 'bg-gray-100 text-gray-700 border-gray-200';
};

export const mapAmplifyCapsuleToPublic = (item: any): PublicCapsule => ({
  id: String(item?.id ?? ''),
  slug: String(item?.slug ?? ''),
  title: String(item?.title ?? ''),
  excerpt: String(item?.summary ?? ''),
  image: stripPresignedQueryFromOurBucketUrl(item?.coverImageUrl) ?? undefined,
  contextType: normalizeContextType(item?.contextType),
  legalReference: typeof item?.legalReference === 'string' ? item.legalReference : undefined,
  institution: typeof item?.institution === 'string' ? item.institution : undefined,
  category: typeof item?.category === 'string' ? item.category : undefined,
  body: toParagraphs(item?.body),
  attachmentUrls: Array.isArray(item?.attachmentUrls)
    ? item.attachmentUrls
        .filter((url: unknown): url is string => typeof url === 'string')
        .map((url) => stripPresignedQueryFromOurBucketUrl(url) ?? url)
    : [],
  publishedAt: item?.publishedAt ?? item?.createdAt ?? null,
  highlight: Boolean(item?.highlight),
});

export const CAPSULE_CONTEXT_OPTIONS: CapsuleContextType[] = CONTEXT_TYPES;
