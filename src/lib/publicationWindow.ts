export type PublishWindowSource = {
  publishedAt?: string | null;
};

export const getPublishedAtTime = (item: PublishWindowSource): number | null => {
  const value = item.publishedAt;
  if (!value) return null;
  const publishedTime = new Date(value).getTime();
  if (Number.isNaN(publishedTime)) return null;
  return publishedTime;
};

export const isWithinPublicationWindow = (
  item: PublishWindowSource,
  nowMs: number = Date.now(),
): boolean => {
  const publishedTime = getPublishedAtTime(item);
  if (publishedTime === null) return true;
  return publishedTime <= nowMs;
};
