type VideoEmbedPlayerProps = {
  embedUrl: string;
  title: string;
  variant?: 'default' | 'hero' | 'short';
  className?: string;
  fullWidth?: boolean;
  autoplay?: boolean;
};

const VideoEmbedPlayer = ({
  embedUrl,
  title,
  variant = 'default',
  className = '',
  fullWidth = false,
  autoplay = false,
}: VideoEmbedPlayerProps) => {
  const isShort = variant === 'short';
  const aspectClass = 'aspect-video';
  const maxWidthClass = isShort && !fullWidth ? 'mx-auto w-full max-w-2xl' : 'w-full';

  const containerClasses =
    variant === 'hero'
      ? `overflow-hidden bg-black ${className}`.trim()
      : `overflow-hidden rounded-2xl border border-gray-100 bg-black ${className}`.trim();

  const isFeedLayout = fullWidth && className.includes('h-full');
  const iframeSrc = autoplay
    ? `${embedUrl}${embedUrl.includes('?') ? '&' : '?'}autoplay=1`
    : embedUrl;

  return (
    <div className={`${containerClasses} ${maxWidthClass}`}>
      <div className={`relative w-full ${isFeedLayout ? 'h-full' : aspectClass}`}>
        <iframe
          src={iframeSrc}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default VideoEmbedPlayer;
