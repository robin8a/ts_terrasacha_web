import { useCallback, useEffect, useRef, type KeyboardEvent as ReactKeyboardEvent, type TouchEvent } from 'react';
import { formatPublishedDateEs } from '../../lib/adminHelpers';
import type { PublicVideoclip } from '../../lib/videoclipMapper';
import VideoclipMediaPlayer from './VideoclipMediaPlayer';

type VideoclipReelViewerProps = {
  videoclips: PublicVideoclip[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
};

const SWIPE_THRESHOLD = 48;

const VideoclipReelViewer = ({
  videoclips,
  currentIndex,
  onIndexChange,
}: VideoclipReelViewerProps) => {
  const touchStartX = useRef<number | null>(null);
  const queueItemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const currentVideoclip = videoclips[currentIndex];
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < videoclips.length - 1;

  const handlePrevious = useCallback(() => {
    if (!hasPrevious) return;
    onIndexChange(currentIndex - 1);
  }, [currentIndex, hasPrevious, onIndexChange]);

  const handleNext = useCallback(() => {
    if (!hasNext) return;
    onIndexChange(currentIndex + 1);
  }, [currentIndex, hasNext, onIndexChange]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        handlePrevious();
        return;
      }
      if (event.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrevious]);

  useEffect(() => {
    const activeItem = queueItemRefs.current[currentIndex];
    activeItem?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [currentIndex]);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const startX = touchStartX.current;
    const endX = event.changedTouches[0]?.clientX;
    touchStartX.current = null;

    if (startX === null || endX === undefined) return;

    const deltaX = endX - startX;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;

    if (deltaX > 0) {
      handlePrevious();
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
    }

    handleNext();
  };

  const handleQueueItemKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    onIndexChange(index);
  };

  if (!currentVideoclip) return null;

  return (
    <div
      className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="min-w-0 lg:col-span-8">
        <article
          id="videoclip-reel"
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_1px_3px_0_rgba(68,72,44,0.06)]"
          aria-label="Reproductor de videoclips"
        >
          <header className="flex items-center justify-between px-5 pb-4 pt-5 sm:px-6">
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
                  {formatPublishedDateEs(currentVideoclip.publishedAt)}
                  {currentVideoclip.topicCategory ? ` · ${currentVideoclip.topicCategory}` : ''}
                </p>
              </div>
            </div>
            <p className="shrink-0 text-xs font-medium text-gray-500">
              {currentIndex + 1} / {videoclips.length}
            </p>
          </header>

          <div className="bg-secondary-[bosques-nublados] px-4 py-5 sm:px-6 sm:py-6">
            <VideoclipMediaPlayer videoclip={currentVideoclip} autoplay onDark />
          </div>

          <div className="px-5 pb-6 pt-5 sm:px-8 sm:pb-8">
            {currentVideoclip.highlight ? (
              <span className="mb-3 inline-flex rounded-full bg-secondary-[amarillo-tierra]/60 px-3 py-1 text-xs font-medium uppercase tracking-wide text-secondary-[bosques-nublados]">
                Destacado
              </span>
            ) : null}
            <h3 className="text-lg font-black leading-snug text-secondary-[bosques-nublados] sm:text-xl">
              {currentVideoclip.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-500 sm:text-base">
              {currentVideoclip.summary}
            </p>
          </div>
        </article>
      </div>

      <aside
        className="min-w-0 lg:col-span-4"
        aria-label="Cola de videoclips"
      >
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_1px_3px_0_rgba(68,72,44,0.06)]">
          <div className="border-b border-gray-100 px-4 py-3 sm:px-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">En cola</p>
            <p className="mt-1 text-sm text-gray-600">
              {videoclips.length} videoclip{videoclips.length === 1 ? '' : 's'} en esta selección
            </p>
          </div>

          <div className="max-h-[28rem] space-y-1 overflow-y-auto p-2 sm:max-h-[32rem] lg:max-h-[calc(100vh-14rem)]">
  const handleQueueItemKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
              const isActive = index === currentIndex;

              return (
                <button
                  key={videoclip.id}
                  ref={(element) => {
                    queueItemRefs.current[index] = element;
                  }}
                  type="button"
                  onClick={() => onIndexChange(index)}
                  onKeyDown={(event) => handleQueueItemKeyDown(event, index)}
                  aria-current={isActive ? 'true' : undefined}
                  aria-label={`Reproducir ${videoclip.title}`}
                  className={[
                    'flex w-full gap-3 rounded-xl p-2 text-left transition-colors',
                    isActive
                      ? 'bg-secondary-[amarillo-tierra]/25 ring-1 ring-secondary-[amarillo-tierra]/60'
                      : 'hover:bg-gray-50',
                  ].join(' ')}
                >
                  <div className="relative aspect-video w-36 shrink-0 overflow-hidden rounded-lg bg-secondary-[bosques-nublados] sm:w-40">
                    <img
                      src={videoclip.thumbnailUrl}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                    {isActive ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-secondary-[bosques-nublados]/50">
                        <span className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-secondary-[bosques-nublados]">
                          Reproduciendo
                        </span>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-secondary-[bosques-nublados]/20 opacity-0 transition-opacity hover:opacity-100">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-secondary-[bosques-nublados] shadow">
                          <svg className="ml-0.5 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </span>
                      </div>
                    )}
                    <span className="absolute bottom-1 right-1 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-medium text-white">
                      {index + 1}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1 py-0.5">
                    <p
                      className={[
                        'line-clamp-2 text-sm font-semibold leading-snug',
                        isActive ? 'text-secondary-[bosques-nublados]' : 'text-gray-800',
                      ].join(' ')}
                    >
                      {videoclip.title}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-500">
                      {videoclip.topicCategory ?? 'Videoclip educativo'}
                      {' · '}
                      {formatPublishedDateEs(videoclip.publishedAt)}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default VideoclipReelViewer;
