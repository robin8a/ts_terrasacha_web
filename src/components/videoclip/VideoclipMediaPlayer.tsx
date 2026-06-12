import type { PublicVideoclip } from '../../lib/videoclipMapper';

type VideoclipMediaPlayerProps = {
  videoclip: PublicVideoclip;
  autoplay?: boolean;
  className?: string;
};

const VideoclipMediaPlayer = ({
  videoclip,
  autoplay = false,
  className = '',
}: VideoclipMediaPlayerProps) => {
  const youtubeSrc = autoplay
    ? `${videoclip.youtubeEmbedUrl}${videoclip.youtubeEmbedUrl.includes('?') ? '&' : '?'}autoplay=1`
    : videoclip.youtubeEmbedUrl;

  return (
    <div className={className}>
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
        <iframe
          key={`${videoclip.id}-youtube`}
          src={youtubeSrc}
          title={videoclip.title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default VideoclipMediaPlayer;
