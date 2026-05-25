import type { PublicPodcast } from '../../lib/podcastMapper';

type PodcastPlayerProps = {
  podcast: PublicPodcast;
  title?: string;
  className?: string;
  variant?: 'default' | 'hero';
};

const PodcastPlayer = ({
  podcast,
  title = 'Reproductor del episodio',
  className = '',
  variant = 'default',
}: PodcastPlayerProps) => {
  if (podcast.youtubeEmbedUrl) {
    const containerClasses =
      variant === 'hero'
        ? `overflow-hidden bg-black ${className}`.trim()
        : `overflow-hidden rounded-2xl border border-gray-100 bg-black ${className}`.trim();

    return (
      <div className={containerClasses}>
        <div className="relative aspect-video w-full">
          <iframe
            src={podcast.youtubeEmbedUrl}
            title={title}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  if (podcast.audioUrl) {
    return (
      <div className={`rounded-2xl border border-gray-100 bg-white p-4 ${className}`.trim()}>
        <audio className="w-full" controls preload="metadata">
          <source src={podcast.audioUrl} />
          Tu navegador no soporta la reproducción de audio.
        </audio>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 ${className}`.trim()}>
      Este episodio no tiene un reproductor configurado todavía.
    </div>
  );
};

export default PodcastPlayer;
