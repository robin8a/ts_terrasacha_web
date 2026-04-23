import { stripPresignedQueryFromOurBucketUrl } from './s3PublicUrl';

type PublicPodcast = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  audioUrl: string;
  coverImageUrl?: string;
  publishedAt?: string | null;
  highlight: boolean;
  relatedNewsIds: string[];
  relatedAnnouncementIds: string[];
  relatedResearchIds: string[];
};

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item: unknown) => (typeof item === 'string' || typeof item === 'number'))
    .map((item) => String(item).trim())
    .filter((item) => item.length > 0);
};

export const mapAmplifyPodcastToPublic = (item: any): PublicPodcast => {
  const audioUrl = stripPresignedQueryFromOurBucketUrl(item?.audioUrl) ?? String(item?.audioUrl ?? '');
  const coverImageUrl = stripPresignedQueryFromOurBucketUrl(item?.coverImageUrl) ?? undefined;

  return {
    id: String(item?.id ?? ''),
    slug: String(item?.slug ?? ''),
    title: String(item?.title ?? ''),
    summary: String(item?.description ?? ''),
    audioUrl,
    coverImageUrl,
    publishedAt: item?.publishedAt ?? item?.createdAt ?? null,
    highlight: Boolean(item?.highlight),
    relatedNewsIds: toStringArray(item?.relatedNewsIds),
    relatedAnnouncementIds: toStringArray(item?.relatedAnnouncementIds),
    relatedResearchIds: toStringArray(item?.relatedResearchIds),
  };
};

export type PodcastRelationType = 'news' | 'announcement' | 'research';

export const podcastMatchesRelation = (
  podcast: PublicPodcast,
  relationType: PodcastRelationType,
  relatedId: string,
): boolean => {
  const normalizedRelatedId = relatedId.trim().toLowerCase();
  if (!normalizedRelatedId) return false;

  if (relationType === 'news') {
    return podcast.relatedNewsIds.some((id) => id.trim().toLowerCase() === normalizedRelatedId);
  }

  if (relationType === 'announcement') {
    return podcast.relatedAnnouncementIds.some((id) => id.trim().toLowerCase() === normalizedRelatedId);
  }

  return podcast.relatedResearchIds.some((id) => id.trim().toLowerCase() === normalizedRelatedId);
};

export type { PublicPodcast };
