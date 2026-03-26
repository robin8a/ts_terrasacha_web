import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Noticia } from '../data/noticias';
import { listNews } from '../graphql/queries';
import { getGraphqlClient } from '../lib/amplifySetup';
import { mapAmplifyNewsToNoticia } from '../lib/newsMapper';
import { isWithinPublicationWindow } from '../lib/publicationWindow';
import { extractYoutubeVideoId } from '../lib/youtube';
import { Status } from '../API';

type FeaturedMediaItem =
  | {
      kind: 'youtube';
      embedUrl: string;
      thumbnailUrl: string;
      title: string;
    }
  | {
      kind: 'image';
      src: string;
      title: string;
    };

const Noticias = () => {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [activeFeaturedMediaIndex, setActiveFeaturedMediaIndex] = useState(0);
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const formatDate = (dateString: string) => {
    return dateString;
  };

  const getCategoryBadgeClasses = (category?: string) => {
    const map: Record<string, string> = {
      'Tecnología': 'bg-primary text-white',
      'Innovación': 'bg-secondary-pradera text-white',
      'Sostenibilidad': 'bg-secondary-claro text-white',
      'Alianzas': 'bg-secondary-[amarillo-tierra] text-white',
      'Impacto': 'bg-secondary-[bosques-nublados] text-white',
    };
    return map[category || ''] || 'bg-gray-700 text-white';
  };

  useEffect(() => {
    let cancelled = false;

    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const client = getGraphqlClient();

        const allItems: any[] = [];
        let nextToken: string | null = null;

        do {
          const res: any = await client.graphql({
            query: listNews,
            variables: {
              filter: { status: { eq: Status.PUBLISHED } },
              limit: 1000,
              nextToken,
            },
            authMode: 'apiKey',
          });

          const items = res?.data?.listNews?.items ?? [];
          allItems.push(...items);
          nextToken = res?.data?.listNews?.nextToken ?? null;
        } while (nextToken);

        // Ordenamos para que la destacada sea la más reciente.
        const visibleItems = allItems.filter((item) => isWithinPublicationWindow(item));

        const sorted = visibleItems.sort((a, b) => {
          const aTime = new Date(a?.publishedAt ?? a?.createdAt ?? 0).getTime();
          const bTime = new Date(b?.publishedAt ?? b?.createdAt ?? 0).getTime();
          return bTime - aTime;
        });

        const mapped = sorted.map(mapAmplifyNewsToNoticia);

        if (!cancelled) setNoticias(mapped);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void fetchNews();

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') void fetchNews();
    };

    document.addEventListener('visibilitychange', handleVisibility);
    const intervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible') void fetchNews();
    }, 30000);

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', handleVisibility);
      window.clearInterval(intervalId);
    };
  }, []);

  const featured = noticias[0];
  const sidebarItems = noticias.slice(1, 4);
  const remaining = noticias.slice(1); // Para \"Todas las noticias\" mostramos todas menos la destacada
  const featuredMedia = useMemo<FeaturedMediaItem[]>(() => {
    if (!featured) {
      return [];
    }

    const images = [
      ...(featured.image ? [featured.image] : []),
      ...(featured.gallery ?? []),
    ].filter((image, index, current) => current.indexOf(image) === index);

    const media: FeaturedMediaItem[] = [];
    const youtubeVideoId = extractYoutubeVideoId(featured.youtubeEmbedUrl);

    if (featured.youtubeEmbedUrl && youtubeVideoId) {
      media.push({
        kind: 'youtube',
        embedUrl: featured.youtubeEmbedUrl,
        thumbnailUrl: `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`,
        title: featured.title,
      });
    }

    images.forEach((image) => {
      media.push({
        kind: 'image',
        src: image,
        title: featured.title,
      });
    });

    return media;
  }, [featured]);
  const hasMultipleFeaturedMedia = featuredMedia.length > 1;

  useEffect(() => {
    setActiveFeaturedMediaIndex(0);
  }, [featured?.id]);

  const handleCarouselNavigation = (direction: 'previous' | 'next') => {
    if (!carouselRef.current) {
      return;
    }

    const scrollAmount = carouselRef.current.clientWidth * 0.85;
    const left = direction === 'next' ? scrollAmount : -scrollAmount;

    carouselRef.current.scrollBy({
      left,
      behavior: 'smooth',
    });
  };

  const handlePreviousFeaturedMedia = () => {
    if (!hasMultipleFeaturedMedia) {
      return;
    }

    setActiveFeaturedMediaIndex((currentIndex) => (
      currentIndex === 0 ? featuredMedia.length - 1 : currentIndex - 1
    ));
  };

  const handleNextFeaturedMedia = () => {
    if (!hasMultipleFeaturedMedia) {
      return;
    }

    setActiveFeaturedMediaIndex((currentIndex) => (
      currentIndex === featuredMedia.length - 1 ? 0 : currentIndex + 1
    ));
  };

  const handleSelectFeaturedMedia = (selectedIndex: number) => {
    setActiveFeaturedMediaIndex(selectedIndex);
  };

  return (
    <main className="font-primary bg-gray-50 min-h-screen">
      {isLoading && noticias.length === 0 ? (
        <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-sm text-gray-600">Cargando noticias...</p>
        </section>
      ) : (
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
        {/* Título de página */}
        <h1 className="text-4xl sm:text-5xl lg:text-5xl font-black mb-10 sm:mb-12 tracking-tight">
          <span className="text-primary">NOTICIAS</span>
        </h1>

        {/* Sección superior: destacada + sidebar */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 mb-12 lg:mb-16">
          {/* Noticia destacada */}
          {featured && (
            <article
              id={`noticia-${featured.id}`}
              className="lg:col-span-8 bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden border border-gray-100 h-full"
            >
              {featuredMedia.length > 0 && (
                <div className="border-b border-gray-100 bg-gray-950/5">
                  <div className="relative h-72 sm:h-80 lg:h-[26rem] overflow-hidden">
                    {featuredMedia[activeFeaturedMediaIndex]?.kind === 'youtube' ? (
                      <iframe
                        className="absolute inset-0 h-full w-full"
                        src={featuredMedia[activeFeaturedMediaIndex].embedUrl}
                        title={`Video de YouTube de ${featured.title}`}
                        loading="eager"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    ) : (
                      <img
                        src={featuredMedia[activeFeaturedMediaIndex]?.kind === 'image' ? featuredMedia[activeFeaturedMediaIndex].src : ''}
                        alt={`${featured.title} - imagen ${activeFeaturedMediaIndex + 1}`}
                        className="absolute inset-0 h-full w-full object-cover"
                        loading="eager"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary-[bosques-nublados]/80 via-secondary-[bosques-nublados]/20 to-transparent" />
                    <div className="absolute left-5 right-5 bottom-5 sm:left-6 sm:right-6 sm:bottom-6">
                      {featured.category && (
                        <span
                          className={`inline-block px-3 py-1 text-[10px] sm:text-xs font-bold tracking-wider uppercase rounded-full ${getCategoryBadgeClasses(
                            featured.category
                          )}`}
                        >
                          {featured.category}
                        </span>
                      )}
                    </div>

                    {hasMultipleFeaturedMedia && (
                      <>
                        <button
                          type="button"
                          onClick={handlePreviousFeaturedMedia}
                          className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-secondary-[bosques-nublados] shadow-md transition-all hover:bg-white"
                          aria-label="Ver elemento anterior de la noticia principal"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                        </button>

                        <button
                          type="button"
                          onClick={handleNextFeaturedMedia}
                          className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-secondary-[bosques-nublados] shadow-md transition-all hover:bg-white"
                          aria-label="Ver elemento siguiente de la noticia principal"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>

                        <div className="absolute bottom-5 right-5 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white">
                          {activeFeaturedMediaIndex + 1} / {featuredMedia.length}
                        </div>
                      </>
                    )}
                  </div>

                  {hasMultipleFeaturedMedia && (
                    <div className="scrollbar-hide flex gap-3 overflow-x-auto px-4 py-4 sm:px-6">
                      {featuredMedia.map((media, index) => {
                        const isActive = index === activeFeaturedMediaIndex;

                        return (
                          <button
                            key={`${featured.id}-featured-thumbnail-${index}`}
                            type="button"
                            onClick={() => handleSelectFeaturedMedia(index)}
                            className={`relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                              isActive
                                ? 'border-primary shadow-md'
                                : 'border-transparent opacity-80 hover:opacity-100'
                            }`}
                            aria-label={
                              media.kind === 'youtube'
                                ? `Ver video ${index + 1} de la noticia principal`
                                : `Ver imagen ${index + 1} de la noticia principal`
                            }
                          >
                            <img
                              src={media.kind === 'youtube' ? media.thumbnailUrl : media.src}
                              alt={`${featured.title} - miniatura ${index + 1}`}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                            {media.kind === 'youtube' && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-primary shadow-md">
                                  <svg className="ml-0.5 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                </div>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {(featured.content || featured.excerpt) && (
                <div className="bg-gradient-to-b from-white to-gray-50/80 px-5 py-5 sm:px-6 sm:py-6 md:px-8 md:py-8">
                  <div className="border-b border-gray-100 pb-6">
                    <p className="text-xs sm:text-sm text-gray-500 font-primary">
                      {formatDate(featured.date)}
                    </p>
                    <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-black text-secondary-[bosques-nublados] leading-tight">
                      {featured.title}
                    </h2>
                    <p className="mt-4 text-sm sm:text-base md:text-lg leading-relaxed text-gray-700 font-primary max-w-4xl">
                      {featured.excerpt}
                    </p>
                  </div>

                  {featured.content && (
                    <div className="mt-6 space-y-4">
                      {featured.content.map((paragraph, index) => (
                        <p
                          key={`${featured.id}-paragraph-${index}`}
                          className="text-sm sm:text-base text-gray-700 leading-relaxed font-primary"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </article>
          )}

          {/* Sidebar Más Noticias */}
          <aside className="lg:col-span-4 rounded-xl sm:rounded-2xl border border-gray-100 bg-gradient-to-br from-white via-white to-secondary-claro/10 p-5 sm:p-6 shadow-sm flex flex-col h-full">
            <div className="mb-5 sm:mb-6 border-b border-gray-100 pb-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                Actualidad
              </div>
              <h3 className="mt-4 text-sm sm:text-base md:text-lg font-bold uppercase tracking-wide">
                <span className="text-secondary-[bosques-nublados]">MÁS</span>{' '}
                <span className="text-secondary-pradera">NOTICIAS</span>
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600 font-primary">
                Explora otras publicaciones recientes del proyecto Terrasacha y
                accede a su detalle completo.
              </p>
            </div>

            <div className="space-y-4 flex-grow">
              {sidebarItems.map((noticia) => (
                <Link
                  key={noticia.id}
                  to={`/noticias/${noticia.id}`}
                  className="group block overflow-hidden rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/20 hover:shadow-md"
                >
                  <div className="flex gap-3">
                    {noticia.image && (
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl">
                        <img
                          src={noticia.image}
                          alt={noticia.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        {noticia.category && (
                          <span
                            className={`px-3 py-1 text-[10px] sm:text-xs font-bold uppercase rounded-full ${getCategoryBadgeClasses(
                              noticia.category
                            )}`}
                          >
                            {noticia.category}
                          </span>
                        )}
                        <span className="text-[11px] sm:text-xs text-gray-500 font-primary">
                          {formatDate(noticia.date)}
                        </span>
                      </div>

                      <p className="text-sm sm:text-[15px] font-bold text-secondary-[bosques-nublados] leading-snug transition-colors group-hover:text-primary">
                        {noticia.title}
                      </p>

                      <p className="mt-2 line-clamp-2 text-xs sm:text-sm leading-relaxed text-gray-600 font-primary">
                        {noticia.excerpt}
                      </p>

                      <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
                        Ver detalle
                        <svg
                          className="h-4 w-4 transition-transform group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        </section>

        {/* Sección inferior: todas las noticias */}
        <section>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5 sm:mb-6">
            <h3 className="text-sm sm:text-base md:text-lg font-bold uppercase tracking-wide">
              <span className="text-secondary-[bosques-nublados]">TODAS LAS</span>{' '}
              <span className="text-primary">NOTICIAS</span>
            </h3>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => handleCarouselNavigation('previous')}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-secondary-[bosques-nublados] shadow-sm transition-all hover:border-primary hover:text-primary"
                aria-label="Ver noticias anteriores"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => handleCarouselNavigation('next')}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-secondary-[bosques-nublados] shadow-sm transition-all hover:border-primary hover:text-primary"
                aria-label="Ver noticias siguientes"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div
            ref={carouselRef}
            className="scrollbar-hide flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4"
          >
            {remaining.map((noticia) => (
              <Link
                key={noticia.id}
                id={`noticia-${noticia.id}`}
                to={`/noticias/${noticia.id}`}
                className="min-w-[280px] sm:min-w-[320px] lg:min-w-[340px] max-w-[340px] snap-start bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                {noticia.image && (
                  <div className="h-40 sm:h-44 md:h-48 relative">
                    <img
                      src={noticia.image}
                      alt={noticia.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {noticia.category && (
                      <span
                        className={`absolute top-3 left-3 px-3 py-1 text-[10px] sm:text-xs font-bold uppercase rounded-full ${getCategoryBadgeClasses(
                          noticia.category
                        )}`}
                      >
                        {noticia.category}
                      </span>
                    )}
                  </div>
                )}
                <div className="p-5 flex flex-col flex-grow">
                  <span className="text-[11px] sm:text-xs text-gray-500 mb-2 block font-primary">
                    {formatDate(noticia.date)}
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-secondary-[bosques-nublados] mb-2 leading-snug">
                    {noticia.title}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-1 flex-grow font-primary">
                    {noticia.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </section>
      )}
    </main>
  );
};

export default Noticias;

