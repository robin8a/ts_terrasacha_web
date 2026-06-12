const YOUTUBE_VIDEO_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;

export const parseYouTubeVideoId = (url: string): string | null => {
  const trimmed = url.trim();
  if (!trimmed) return null;

  if (YOUTUBE_VIDEO_ID_PATTERN.test(trimmed)) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      const id = parsed.pathname.split('/').filter(Boolean)[0] ?? '';
      return YOUTUBE_VIDEO_ID_PATTERN.test(id) ? id : null;
    }

    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
      const vParam = parsed.searchParams.get('v');
      if (vParam && YOUTUBE_VIDEO_ID_PATTERN.test(vParam)) {
        return vParam;
      }

      const pathParts = parsed.pathname.split('/').filter(Boolean);
      const pathKind = pathParts[0];
      const pathId = pathParts[1] ?? '';

      if ((pathKind === 'embed' || pathKind === 'shorts' || pathKind === 'live') && YOUTUBE_VIDEO_ID_PATTERN.test(pathId)) {
        return pathId;
      }
    }
  } catch {
    // Fall through to regex matching for partial URLs.
  }

  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/live\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match?.[1] && YOUTUBE_VIDEO_ID_PATTERN.test(match[1])) {
      return match[1];
    }
  }

  return null;
};

export const buildYouTubeWatchUrl = (videoId: string): string => `https://www.youtube.com/watch?v=${videoId}`;

export const buildYouTubeEmbedUrl = (videoId: string, options?: { autoplay?: boolean }): string => {
  const params = new URLSearchParams({ rel: '0' });
  if (options?.autoplay) params.set('autoplay', '1');
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
};

export const normalizeYouTubeInput = (value: string): string | null => {
  const videoId = parseYouTubeVideoId(value);
  if (!videoId) return null;
  return buildYouTubeWatchUrl(videoId);
};

export const getYouTubeEmbedUrlFromInput = (value: string | null | undefined): string | null => {
  if (!value) return null;
  const videoId = parseYouTubeVideoId(value);
  if (!videoId) return null;
  return buildYouTubeEmbedUrl(videoId);
};
