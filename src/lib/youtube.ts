const YOUTUBE_VIDEO_ID_REGEX = /^[A-Za-z0-9_-]{11}$/;

const getNormalizedYoutubeHostname = (hostname: string): string =>
  hostname.trim().toLowerCase().replace(/^www\./, '');

export const extractYoutubeVideoId = (value: string | null | undefined): string | null => {
  const candidate = value?.trim();
  if (!candidate) return null;

  try {
    const parsed = new URL(candidate);
    const hostname = getNormalizedYoutubeHostname(parsed.hostname);

    if (hostname === 'youtu.be') {
      const pathnameId = parsed.pathname.split('/').filter(Boolean)[0] ?? '';
      return YOUTUBE_VIDEO_ID_REGEX.test(pathnameId) ? pathnameId : null;
    }

    if (hostname !== 'youtube.com' && hostname !== 'm.youtube.com') {
      return null;
    }

    if (parsed.pathname === '/watch') {
      const searchId = parsed.searchParams.get('v') ?? '';
      return YOUTUBE_VIDEO_ID_REGEX.test(searchId) ? searchId : null;
    }

    const pathSegments = parsed.pathname.split('/').filter(Boolean);
    const embeddedId = pathSegments[0] && ['embed', 'shorts', 'live'].includes(pathSegments[0])
      ? pathSegments[1] ?? ''
      : '';

    return YOUTUBE_VIDEO_ID_REGEX.test(embeddedId) ? embeddedId : null;
  } catch {
    return null;
  }
};

export const normalizeYoutubeUrl = (value: string | null | undefined): string | null => {
  const videoId = extractYoutubeVideoId(value);
  if (!videoId) return null;
  return `https://www.youtube.com/watch?v=${videoId}`;
};

export const buildYoutubeEmbedUrl = (value: string | null | undefined): string | null => {
  const videoId = extractYoutubeVideoId(value);
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}`;
};
