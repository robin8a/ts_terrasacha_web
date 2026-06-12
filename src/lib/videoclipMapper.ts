import { stripPresignedQueryFromOurBucketUrl } from './s3PublicUrl';
import { getYouTubeEmbedUrlFromInput, normalizeYouTubeInput, parseYouTubeVideoId } from './youtubeEmbed';
import { toStringArray } from './adminHelpers';

export const VIDEOCLIP_TOPIC_CATEGORY_OPTIONS = [
  'Sostenibilidad',
  'Ambiente',
  'Territorio',
  'Innovación',
  'Formación',
  'Investigación',
  'Comunidad',
  'Institucional',
  'Tecnología',
  'Impacto social',
] as const;

export type VideoclipTopicCategory = (typeof VIDEOCLIP_TOPIC_CATEGORY_OPTIONS)[number];

export type PublicVideoclip = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  youtubeUrl: string;
  youtubeEmbedUrl: string;
  thumbnailUrl: string;
  coverImageUrl?: string;
  topicCategory?: string;
  publishedAt?: string | null;
  highlight: boolean;
  relatedNewsIds: string[];
  relatedAnnouncementIds: string[];
  relatedResearchIds: string[];
  relatedCapsuleIds: string[];
  relatedPodcastIds: string[];
};

const buildYoutubeThumbnail = (videoId: string): string =>
  `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

export const mapAmplifyVideoclipToPublic = (item: any): PublicVideoclip | null => {
  const rawYoutube = String(item?.youtubeUrl ?? '').trim();
  const normalizedYoutube = normalizeYouTubeInput(rawYoutube);
  if (!normalizedYoutube) return null;

  const videoId = parseYouTubeVideoId(normalizedYoutube);
  if (!videoId) return null;

  const youtubeEmbedUrl = getYouTubeEmbedUrlFromInput(normalizedYoutube);
  if (!youtubeEmbedUrl) return null;

  const coverFromS3 = stripPresignedQueryFromOurBucketUrl(item?.coverImageUrl);

  return {
    id: String(item?.id ?? ''),
    slug: String(item?.slug ?? ''),
    title: String(item?.title ?? ''),
    summary: String(item?.description ?? ''),
    youtubeUrl: normalizedYoutube,
    youtubeEmbedUrl,
    thumbnailUrl: coverFromS3 ?? buildYoutubeThumbnail(videoId),
    coverImageUrl: coverFromS3,
    topicCategory: typeof item?.topicCategory === 'string' ? item.topicCategory : undefined,
    publishedAt: item?.publishedAt ?? item?.createdAt ?? null,
    highlight: Boolean(item?.highlight),
    relatedNewsIds: toStringArray(item?.relatedNewsIds),
    relatedAnnouncementIds: toStringArray(item?.relatedAnnouncementIds),
    relatedResearchIds: toStringArray(item?.relatedResearchIds),
    relatedCapsuleIds: toStringArray(item?.relatedCapsuleIds),
    relatedPodcastIds: toStringArray(item?.relatedPodcastIds),
  };
};

export type VideoclipRelationType = 'news' | 'announcement' | 'research' | 'capsule' | 'podcast';

export const videoclipMatchesRelation = (
  videoclip: PublicVideoclip,
  relationType: VideoclipRelationType,
  relatedId: string,
): boolean => {
  const normalizedRelatedId = relatedId.trim().toLowerCase();
  if (!normalizedRelatedId) return false;

  if (relationType === 'news') {
    return videoclip.relatedNewsIds.some((itemId) => itemId.trim().toLowerCase() === normalizedRelatedId);
  }

  if (relationType === 'announcement') {
    return videoclip.relatedAnnouncementIds.some((itemId) => itemId.trim().toLowerCase() === normalizedRelatedId);
  }

  if (relationType === 'research') {
    return videoclip.relatedResearchIds.some((itemId) => itemId.trim().toLowerCase() === normalizedRelatedId);
  }

  if (relationType === 'capsule') {
    return videoclip.relatedCapsuleIds.some((itemId) => itemId.trim().toLowerCase() === normalizedRelatedId);
  }

  return videoclip.relatedPodcastIds.some((itemId) => itemId.trim().toLowerCase() === normalizedRelatedId);
};
