import { stripPresignedQueryFromOurBucketUrl } from './s3PublicUrl';

type PublicResearchItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string[];
  category?: string;
  coverImageUrl?: string;
  documentUrl?: string;
  documentLabel: string;
  attachmentUrls: string[];
  authorName?: string;
  institution?: string;
  publishedAt?: string | null;
  highlight: boolean;
};

const toParagraphs = (text?: string | null): string[] => {
  if (!text) return [];
  return text
    .split('\n\n')
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
};

export const mapAmplifyResearchToPublic = (item: any): PublicResearchItem => {
  const coverImageUrl = stripPresignedQueryFromOurBucketUrl(item?.coverImageUrl) ?? undefined;
  const sourceDocxUrl = stripPresignedQueryFromOurBucketUrl(item?.sourceDocxUrl) ?? undefined;
  const pdfUrl = stripPresignedQueryFromOurBucketUrl(item?.pdfUrl) ?? undefined;
  const documentUrl = sourceDocxUrl ?? pdfUrl;
  const documentLabel = sourceDocxUrl ? 'DOC' : pdfUrl ? 'PDF' : 'Documento';
  const attachmentUrls = Array.isArray(item?.attachmentUrls)
    ? item.attachmentUrls
        .filter((url: unknown): url is string => typeof url === 'string' && url.trim().length > 0)
        .map((url: string) => stripPresignedQueryFromOurBucketUrl(url) ?? url)
    : [];

  return {
    id: String(item?.id ?? ''),
    slug: String(item?.slug ?? ''),
    title: String(item?.title ?? ''),
    summary: String(item?.summary ?? ''),
    body: toParagraphs(item?.body),
    category: typeof item?.category === 'string' ? item.category : undefined,
    coverImageUrl,
    documentUrl,
    documentLabel,
    attachmentUrls,
    authorName: typeof item?.authorName === 'string' ? item.authorName : undefined,
    institution: typeof item?.institution === 'string' ? item.institution : undefined,
    publishedAt: item?.publishedAt ?? item?.createdAt ?? null,
    highlight: Boolean(item?.highlight),
  };
};

export type { PublicResearchItem };
