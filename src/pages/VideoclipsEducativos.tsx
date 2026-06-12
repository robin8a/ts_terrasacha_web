import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Status } from '../API';
import VideoclipFeedToolbar, { type VideoclipFeedFilter } from '../components/videoclip/VideoclipFeedToolbar';
import VideoclipMediaPlayer from '../components/videoclip/VideoclipMediaPlayer';
import VideoclipReelViewer from '../components/videoclip/VideoclipReelViewer';
import VideoclipsHero from '../components/videoclip/VideoclipsHero';
import { listEducationalVideoclips } from '../graphql/queries';
import { formatPublishedDateEs } from '../lib/adminHelpers';
import { getGraphqlClient } from '../lib/amplifySetup';
import { isWithinPublicationWindow } from '../lib/publicationWindow';
import { mapAmplifyVideoclipToPublic, type PublicVideoclip } from '../lib/videoclipMapper';

const VideoclipsEducativos = () => {
  const [videoclips, setVideoclips] = useState<PublicVideoclip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<VideoclipFeedFilter>('all');
  const [feedViewerIndex, setFeedViewerIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchVideoclips = async () => {
      setIsLoading(true);
      try {
        const client = getGraphqlClient();
        const allItems: unknown[] = [];
        let nextToken: string | null = null;

        do {
          const response: any = await client.graphql({
            query: listEducationalVideoclips,
            variables: {
              filter: { status: { eq: Status.PUBLISHED } },
              limit: 1000,
              nextToken,
            },
            authMode: 'apiKey',
          });

          const items = response?.data?.listEducationalVideoclips?.items ?? [];
          allItems.push(...items);
          nextToken = response?.data?.listEducationalVideoclips?.nextToken ?? null;
        } while (nextToken);

        const visibleItems = allItems.filter((item) =>
          isWithinPublicationWindow(item as { publishedAt?: string | null }),
        );

        const mapped = visibleItems
          .map(mapAmplifyVideoclipToPublic)
          .filter((item): item is PublicVideoclip => item !== null)
          .sort((a, b) => {
            const aTime = new Date(a.publishedAt ?? 0).getTime();
            const bTime = new Date(b.publishedAt ?? 0).getTime();
            return bTime - aTime;
          });

        if (!cancelled) setVideoclips(mapped);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void fetchVideoclips();
    return () => {
      cancelled = true;
    };
  }, []);

  const featured = useMemo(() => {
    const highlighted = videoclips.filter((item) => item.highlight);
    if (highlighted.length > 0) {
      return highlighted.sort(
        (a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime(),
      )[0];
    }
    return videoclips[0] ?? null;
  }, [videoclips]);

  const categoryOptions = useMemo(() => {
    const categories = new Set(
      videoclips.map((item) => item.topicCategory?.trim()).filter((value): value is string => Boolean(value)),
    );
    return Array.from(categories).sort((a, b) => a.localeCompare(b, 'es'));
  }, [videoclips]);

  const filteredVideoclips = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return videoclips.filter((item) => {
      if (activeFilter === 'highlighted' && !item.highlight) return false;
      if (
        activeFilter !== 'all' &&
        activeFilter !== 'highlighted' &&
        item.topicCategory !== activeFilter
      ) {
        return false;
      }
      if (!normalizedSearch) return true;
      return `${item.title} ${item.summary} ${item.topicCategory ?? ''}`.toLowerCase().includes(normalizedSearch);
    });
  }, [activeFilter, searchTerm, videoclips]);

  const reelPlaylist = useMemo(
    () =>
      [...filteredVideoclips].sort((a, b) => {
        const highlightDiff = Number(b.highlight) - Number(a.highlight);
        if (highlightDiff !== 0) return highlightDiff;
        const aTime = new Date(a.publishedAt ?? 0).getTime();
        const bTime = new Date(b.publishedAt ?? 0).getTime();
        return bTime - aTime;
      }),
    [filteredVideoclips],
  );

  const feedReelPlaylist = useMemo(() => {
    if (!featured) return reelPlaylist;
    const withoutFeatured = reelPlaylist.filter((item) => item.id !== featured.id);
    return withoutFeatured.length > 0 ? withoutFeatured : reelPlaylist;
  }, [featured, reelPlaylist]);

  const showFeedSection = feedReelPlaylist.length > 0 && videoclips.length > 1;

  useEffect(() => {
    setFeedViewerIndex(0);
  }, [activeFilter, searchTerm, feedReelPlaylist.length]);

  const handleFilterChange = (filter: VideoclipFeedFilter) => {
    setActiveFilter(filter);
  };

  useEffect(() => {
    if (feedViewerIndex >= feedReelPlaylist.length) {
      setFeedViewerIndex(feedReelPlaylist.length > 0 ? feedReelPlaylist.length - 1 : 0);
    }
  }, [feedViewerIndex, feedReelPlaylist.length]);

  return (
    <main className="font-primary min-h-screen bg-gray-50 py-16">
      <section className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 xl:px-10">
        <VideoclipsHero
          totalCount={videoclips.length}
          highlightedCount={videoclips.filter((item) => item.highlight).length}
        />

        <section className="mt-10 sm:mt-12 lg:mt-14">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wide sm:text-base md:text-lg">
              <span className="text-secondary-[bosques-nublados]">VIDEOCLIP</span>{' '}
              <span className="text-primary">DESTACADO</span>
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-600 sm:text-base">
              Pieza priorizada para acceder rápido a contenido educativo breve sobre sostenibilidad,
              territorio y ciencia aplicada.
            </p>
          </div>

        {isLoading ? (
          <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <p className="text-sm text-gray-600">Cargando videoclips...</p>
          </div>
        ) : featured ? (
          <article className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="relative h-80 min-h-[24rem] overflow-hidden bg-secondary-[bosques-nublados] lg:col-span-7 lg:h-full">
                <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
                  <VideoclipMediaPlayer videoclip={featured} className="w-full" />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-secondary-[bosques-nublados]/85 via-secondary-[bosques-nublados]/30 to-transparent" />
                <div className="pointer-events-none absolute left-5 top-5 inline-flex rounded-full bg-secondary-[amarillo-tierra] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary-[bosques-nublados]">
                  {featured.highlight ? 'Videoclip destacado' : 'Último publicado'}
                </div>
              </div>

              <Link
                to={`/videoclips-educativos/${featured.slug}`}
                className="group flex flex-col justify-center bg-gradient-to-br from-white via-white to-secondary-claro/10 p-6 sm:p-8 lg:col-span-5 lg:p-10"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary sm:text-sm">
                  {featured.topicCategory ?? 'Videoclip educativo'}
                </p>
                <h3 className="mt-4 text-2xl font-black leading-tight text-secondary-[bosques-nublados] transition-colors group-hover:text-primary sm:text-3xl lg:text-[2rem]">
                  {featured.title}
                </h3>
                <p className="mt-5 text-sm leading-relaxed text-gray-600 sm:text-base">{featured.summary}</p>

                <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50/80 p-4">
                  <p className="text-sm leading-relaxed text-gray-700">
                    {formatPublishedDateEs(featured.publishedAt)}
                    {' · '}
                    TerraSacha
                  </p>
                </div>

                <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
                  Ver videoclip
                  <svg
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </div>
          </article>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <p className="text-sm text-gray-600">No hay videoclips publicados todavía.</p>
          </div>
        )}
        </section>
      </section>

      {showFeedSection ? (
        <>
          <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 xl:px-10">
            <div className="h-px bg-gray-200" aria-hidden="true" />
          </div>

          <section className="py-12 sm:py-14">
            <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 xl:px-10">
              <div className="mb-2 flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-200" aria-hidden="true" />
                <p className="whitespace-nowrap text-xs font-medium uppercase tracking-widest text-gray-500">
                  Feed de shorts
                </p>
                <div className="h-px flex-1 bg-gray-200" aria-hidden="true" />
              </div>
              <p className="mb-8 text-center text-sm text-gray-500">
                Reproduce el videoclip principal y elige el siguiente desde la cola, como en YouTube
              </p>

              <VideoclipFeedToolbar
                searchTerm={searchTerm}
                activeFilter={activeFilter}
                categoryOptions={categoryOptions}
                onSearchChange={setSearchTerm}
                onFilterChange={handleFilterChange}
              />

              <div className="mt-8">
              {isLoading ? (
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                  <div className="h-14 animate-pulse bg-gray-100" />
                  <div className="aspect-video animate-pulse bg-gray-200" />
                  <div className="space-y-2 p-5">
                    <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
                    <div className="h-16 animate-pulse rounded bg-gray-100" />
                  </div>
                </div>
              ) : feedReelPlaylist.length > 0 ? (
                <VideoclipReelViewer
                  videoclips={feedReelPlaylist}
                  currentIndex={feedViewerIndex}
                  onIndexChange={setFeedViewerIndex}
                />
              ) : (
                <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
                  <p className="text-sm text-gray-600">
                    {searchTerm.trim() || activeFilter !== 'all'
                      ? 'No hay videoclips con ese criterio. Prueba otro filtro o búsqueda.'
                      : 'No hay videoclips en el feed por ahora.'}
                  </p>
                </div>
              )}
              </div>
            </div>
          </section>
        </>
      ) : null}

    </main>
  );
};

export default VideoclipsEducativos;
