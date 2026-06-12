import { useCallback, useState, type KeyboardEvent } from 'react';
import { formatPublishedDateEs } from '../../lib/adminHelpers';
import type { PublicVideoclip } from '../../lib/videoclipMapper';

type VideoclipFeedPostProps = {
  videoclip: PublicVideoclip;
  onOpenViewer: (videoclipId: string) => void;
};

const VideoclipFeedPost = ({ videoclip, onOpenViewer }: VideoclipFeedPostProps) => {
  const [shareLabel, setShareLabel] = useState('Compartir');

  const handleOpenViewer = useCallback(() => {
    onOpenViewer(videoclip.id);
  }, [onOpenViewer, videoclip.id]);

  const handleShare = useCallback(async () => {
    const shareUrl = `${window.location.origin}/videoclips-educativos/${videoclip.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: videoclip.title, text: videoclip.summary, url: shareUrl });
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      setShareLabel('Enlace copiado');
      window.setTimeout(() => setShareLabel('Compartir'), 2000);
    } catch {
      // Usuario canceló el diálogo nativo de compartir
    }
  }, [videoclip.slug, videoclip.summary, videoclip.title]);

  const handleShareKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    void handleShare();
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_1px_3px_0_rgba(68,72,44,0.06)]">
      <header className="flex items-center justify-between px-5 pb-4 pt-5">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-[bosques-nublados] text-sm font-black text-secondary-[amarillo-tierra]"
            aria-hidden="true"
          >
            TS
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium leading-tight text-secondary-[bosques-nublados]">
              Terrasacha
            </p>
            <p className="truncate text-xs text-gray-500">
              {formatPublishedDateEs(videoclip.publishedAt)}
              {videoclip.topicCategory ? ` · ${videoclip.topicCategory}` : ''}
            </p>
          </div>
        </div>
        {videoclip.highlight ? (
          <span className="shrink-0 rounded-full bg-secondary-[amarillo-tierra]/60 px-3 py-1 text-xs font-medium uppercase tracking-wide text-secondary-[bosques-nublados]">
            Destacado
          </span>
        ) : null}
      </header>

      <div className="relative w-full bg-secondary-[bosques-nublados]">
        <button
          type="button"
          onClick={handleOpenViewer}
          className="group relative block aspect-video w-full"
          aria-label={`Reproducir ${videoclip.title}`}
        >
          <img
            src={videoclip.thumbnailUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary-[bosques-nublados]/40 transition-colors group-hover:bg-secondary-[bosques-nublados]/50">
            <span className="mb-3 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-secondary-[bosques-nublados] shadow-lg transition-transform group-hover:scale-105">
              <svg className="ml-1 h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span className="text-sm font-medium text-white/90">Toca para ver en modo reel</span>
          </div>
        </button>
      </div>

      <div className="px-5 pb-3 pt-4">
        <h3 className="mb-2 text-base font-black leading-snug text-secondary-[bosques-nublados]">
          {videoclip.title}
        </h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-gray-500">{videoclip.summary}</p>
      </div>

      <div className="flex items-center gap-3 px-5 pb-5 pt-1">
        <button
          type="button"
          onClick={handleOpenViewer}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="10" strokeWidth={2} />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 8l6 4-6 4V8z" />
          </svg>
          Ver videoclip
        </button>
        <button
          type="button"
          onClick={() => void handleShare()}
          onKeyDown={handleShareKeyDown}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition-colors hover:border-primary/30 hover:text-primary"
          aria-label={shareLabel}
          title={shareLabel}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="18" cy="5" r="3" strokeWidth={2} />
            <circle cx="6" cy="12" r="3" strokeWidth={2} />
            <circle cx="18" cy="19" r="3" strokeWidth={2} />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m8.59 13.51 6.83 3.98m-.01-10.98-6.82 3.98" />
          </svg>
        </button>
      </div>
    </article>
  );
};

export default VideoclipFeedPost;
