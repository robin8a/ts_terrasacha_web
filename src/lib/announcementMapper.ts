type PublicAnnouncement = {
  id: string;
  title: string;
  excerpt: string;
  image?: string;
  eyebrow: string;
  body: string[];
  category?: string;
  publishedAt?: string | null;
};

const toParagraphs = (text?: string | null): string[] => {
  if (!text) return [];
  return text
    .split('\n\n')
    .map((p) => p.trim())
    .filter(Boolean);
};

export const mapAmplifyAnnouncementToPublic = (item: any): PublicAnnouncement => {
  const type = typeof item?.type === 'string' && item.type.trim() ? item.type.trim() : 'COMUNICADO OFICIAL';
  return {
    id: String(item?.id ?? ''),
    title: String(item?.title ?? ''),
    excerpt: String(item?.summary ?? ''),
    image: typeof item?.coverImageUrl === 'string' ? item.coverImageUrl : undefined,
    eyebrow: type.toUpperCase(),
    body: toParagraphs(item?.body),
    category: typeof item?.category === 'string' ? item.category : undefined,
    publishedAt: item?.publishedAt ?? item?.createdAt ?? null,
  };
};

export type { PublicAnnouncement };

