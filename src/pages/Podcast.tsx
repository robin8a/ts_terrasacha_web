  import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Status } from '../API';
import { getGraphqlClient } from '../lib/amplifySetup';
import { mapAmplifyPodcastToPublic, type PublicPodcast } from '../lib/podcastMapper';
import { isWithinPublicationWindow } from '../lib/publicationWindow';

const LIST_PUBLIC_PODCASTS = /* GraphQL */ `
  query ListPublicPodcasts($filter: ModelPodcastEpisodeFilterInput, $limit: Int, $nextToken: String) {
    listPodcastEpisodes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        slug
        description
        audioUrl
        coverImageUrl
        publishedAt
        createdAt
        highlight
        relatedNewsIds
        relatedAnnouncementIds
        relatedResearchIds
      }
      nextToken
    }
  }
`;

const Podcast = () => {
  const [podcasts, setPodcasts] = useState<PublicPodcast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activePodcastId, setActivePodcastId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'highlighted'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let cancelled = false;

    const fetchPodcasts = async () => {
      setIsLoading(true);

      try {
        const client = getGraphqlClient();
        const allItems: any[] = [];
        let nextToken: string | null = null;

        do {
          const response: any = await client.graphql({
            query: LIST_PUBLIC_PODCASTS,
            variables: {
              filter: { status: { eq: Status.PUBLISHED } },
              limit: 1000,
              nextToken,
            },
            authMode: 'apiKey',
          });

          const items = response?.data?.listPodcastEpisodes?.items ?? [];
          allItems.push(...items);
          nextToken = response?.data?.listPodcastEpisodes?.nextToken ?? null;
        } while (nextToken);

        const sorted = allItems
          .filter((item) => isWithinPublicationWindow(item))
          .map(mapAmplifyPodcastToPublic)
          .sort((a, b) => {
            const highlightDiff = Number(b.highlight) - Number(a.highlight);
            if (highlightDiff !== 0) return highlightDiff;
            const aTime = new Date(a.publishedAt ?? 0).getTime();
            const bTime = new Date(b.publishedAt ?? 0).getTime();
            return bTime - aTime;
          });

        if (!cancelled) {
          setPodcasts(sorted);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void fetchPodcasts();

    return () => {
      cancelled = true;
    };
  }, []);

  const featuredPodcast = useMemo(
    () => podcasts.find((item) => item.highlight) ?? podcasts[0],
    [podcasts],
  );

  const activePodcast = useMemo(() => {
    if (!activePodcastId) return featuredPodcast ?? null;
    return podcasts.find((item) => item.id === activePodcastId) ?? featuredPodcast ?? null;
  }, [activePodcastId, featuredPodcast, podcasts]);

  useEffect(() => {
    if (!featuredPodcast) return;
    setActivePodcastId((currentId) => currentId ?? featuredPodcast.id);
  }, [featuredPodcast]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilter]);

  const formatPublishedDate = (value?: string | null): string => {
    if (!value) return 'Sin fecha';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Sin fecha';
    return date.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const filteredPodcasts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return podcasts.filter((podcast) => {
      if (activeFilter === 'highlighted' && !podcast.highlight) return false;
      if (!normalizedSearch) return true;

      const haystack = `${podcast.title} ${podcast.summary}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [activeFilter, podcasts, searchTerm]);

  const pageSize = 9;
  const totalPages = Math.max(1, Math.ceil(filteredPodcasts.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedPodcasts = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredPodcasts.slice(start, start + pageSize);
  }, [filteredPodcasts, safeCurrentPage]);

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    for (let page = 1; page <= totalPages; page += 1) {
      pages.push(page);
    }
    return pages;
  }, [totalPages]);

  return (
    <main className="font-primary min-h-screen bg-gray-50 py-16">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-[#44482c]/15 bg-[#f5f2e7] px-6 py-10 shadow-sm sm:px-8 sm:py-12 lg:px-12 lg:py-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(177,193,129,0.28),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(68,72,44,0.16),transparent_22%)]" />
          <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(rgba(68,72,44,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(68,72,44,0.1)_1px,transparent_1px)] [background-size:32px_32px]" />

          <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#44482c]/15 bg-[#44482c] px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-[#e8d79a]">
                Audio y conversación
              </div>

              <h1 className="mt-5 text-4xl font-black tracking-tight text-[#44482c] sm:text-5xl lg:text-6xl">
                Podcast
              </h1>

              <p className="mt-5 max-w-3xl text-sm leading-relaxed text-[#44482c]/90 sm:text-base md:text-lg">
                Escucha episodios relacionados con noticias, comunicados e investigación del proyecto
                Terrasacha. Cada publicación puede enlazar a sus podcasts asociados para ampliar el
                contexto desde audio.
              </p>
            </div>

            <div className="lg:col-span-4">
              <div className="rounded-2xl border border-[#44482c]/12 bg-white/60 p-5 backdrop-blur-sm sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#44482c]">
                  Panorama
                </p>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-[#44482c]/10 bg-[#44482c] p-4">
                    <p className="text-2xl font-black text-[#e8d79a]">{podcasts.length}</p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-[#e8d79a]/75">
                      Episodios
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[#44482c]/10 bg-[#44482c] p-4">
                    <p className="text-2xl font-black text-[#e8d79a]">
                      {podcasts.filter((item) => item.highlight).length}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-[#e8d79a]/75">
                      Destacados
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-[#44482c]/10 bg-white/75 p-4">
                  <p className="text-sm leading-relaxed text-[#44482c]/90">
                    Los episodios se integran con el resto del contenido para ofrecer acceso cruzado
                    desde cada sección del sitio.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-10 sm:mt-12 lg:mt-14">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-sm sm:text-base md:text-lg font-bold uppercase tracking-wide">
              <span className="text-secondary-[bosques-nublados]">REPRODUCTOR</span>{' '}
              <span className="text-primary">PRINCIPAL</span>
            </h2>
          </div>

          {isLoading ? (
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
              <p className="text-sm text-gray-600">Cargando episodios...</p>
            </div>
          ) : activePodcast ? (
            <article className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="relative min-h-[22rem] overflow-hidden lg:col-span-5">
                  {activePodcast.coverImageUrl ? (
                    <img
                      src={activePodcast.coverImageUrl}
                      alt={activePodcast.title}
                      className="h-full w-full object-cover"
                      loading="eager"
                    />
                  ) : (
                    <div className="flex h-full min-h-[22rem] items-center justify-center bg-gradient-to-br from-secondary-claro/30 to-[#e8d79a]">
                      <span className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary-[bosques-nublados]">
                        Podcast
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary-[bosques-nublados]/80 via-secondary-[bosques-nublados]/20 to-transparent" />
                  <div className="absolute left-5 top-5 inline-flex rounded-full bg-secondary-[amarillo-tierra] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary-[bosques-nublados]">
                    En reproducción
                  </div>
                </div>

                <div className="flex flex-col justify-center bg-gradient-to-br from-white via-white to-secondary-claro/10 p-6 sm:p-8 lg:col-span-7 lg:p-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    Podcast Terrasacha
                  </p>
                  <h3 className="mt-4 text-2xl font-black leading-tight text-secondary-[bosques-nublados] sm:text-3xl">
                    {activePodcast.title}
                  </h3>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
                    Publicado: {formatPublishedDate(activePodcast.publishedAt)}
                  </p>
                  <p className="mt-5 text-sm leading-relaxed text-gray-600 sm:text-base">
                    {activePodcast.summary}
                  </p>

                  <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-4">
                    <audio className="w-full" controls preload="metadata">
                      <source src={activePodcast.audioUrl} />
                      Tu navegador no soporta la reproducción de audio.
                    </audio>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {featuredPodcast && activePodcast.id !== featuredPodcast.id && (
                      <button
                        type="button"
                        onClick={() => setActivePodcastId(featuredPodcast.id)}
                        className="inline-flex items-center gap-2 rounded-full border border-primary px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
                      >
                        Volver al destacado
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
              <p className="text-sm text-gray-600">No hay episodios de podcast publicados todavía.</p>
            </div>
          )}
        </section>

        <section className="mt-10 sm:mt-12">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
            <h2 className="text-sm sm:text-base md:text-lg font-bold uppercase tracking-wide">
              <span className="text-secondary-[bosques-nublados]">LISTA DE</span>{' '}
              <span className="text-primary">EPISODIOS</span>
            </h2>
              <p className="mt-2 text-sm text-gray-600">
                {isLoading
                  ? 'Cargando catálogo...'
                  : `${filteredPodcasts.length} episodio(s) disponibles para escuchar`}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar por título o tema"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-sm sm:w-72"
              />
              <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
                <button
                  type="button"
                  onClick={() => setActiveFilter('all')}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                    activeFilter === 'all'
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Todos
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('highlighted')}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                    activeFilter === 'highlighted'
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Destacados
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
                  <div className="mt-4 h-24 animate-pulse rounded bg-gray-100" />
                </div>
              ))}
            </div>
          ) : filteredPodcasts.length > 0 ? (
            <div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {paginatedPodcasts.map((podcast, index) => {
                const isActive = podcast.id === activePodcast?.id;
                const absoluteIndex = (safeCurrentPage - 1) * pageSize + index + 1;
                return (
                  <article
                    key={podcast.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setActivePodcastId(podcast.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setActivePodcastId(podcast.id);
                      }
                    }}
                    className={`flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition ${
                      isActive
                        ? 'border-primary/40 ring-2 ring-primary/15'
                        : 'border-gray-100 hover:border-primary/30'
                    } cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60`}
                  >
                    <div className="h-44 w-full overflow-hidden border-b border-gray-100 bg-gray-100">
                        {podcast.coverImageUrl ? (
                          <img
                            src={podcast.coverImageUrl}
                            alt={podcast.title}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] font-bold uppercase tracking-wide text-gray-500">
                            Podcast
                          </div>
                        )}
                    </div>

                    <div className="flex flex-1 flex-col p-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-semibold text-gray-600">
                          Episodio {String(absoluteIndex).padStart(2, '0')}
                          </span>
                          {podcast.highlight && (
                            <span className="inline-flex rounded-full border border-secondary-claro/40 bg-secondary-claro/15 px-2.5 py-1 text-[11px] font-semibold text-secondary-[bosques-nublados]">
                              Destacado
                            </span>
                          )}
                        </div>

                      <h3 className="mt-3 text-lg font-black leading-snug text-secondary-[bosques-nublados] break-words">
                          {podcast.title}
                      </h3>
                      <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                        {formatPublishedDate(podcast.publishedAt)}
                      </p>
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-600">{podcast.summary}</p>

                      <div className="mt-auto pt-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setActivePodcastId(podcast.id);
                          }}
                          className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                            isActive
                              ? 'bg-primary text-white'
                              : 'border border-primary text-primary hover:bg-primary hover:text-white'
                          }`}
                        >
                          {isActive ? 'Reproduciendo' : 'Reproducir'}
                        </button>
                        <Link
                          to={`/podcast/${podcast.slug}`}
                          onClick={(event) => event.stopPropagation()}
                          className="inline-flex items-center justify-center rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-primary hover:text-primary"
                        >
                          Ver detalle
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    disabled={safeCurrentPage === 1}
                    className="inline-flex rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition disabled:cursor-not-allowed disabled:opacity-50 hover:border-primary hover:text-primary"
                  >
                    Anterior
                  </button>

                  {pageNumbers.map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`inline-flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm font-semibold transition ${
                        page === safeCurrentPage
                          ? 'bg-primary text-white'
                          : 'border border-gray-300 text-gray-700 hover:border-primary hover:text-primary'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                    disabled={safeCurrentPage === totalPages}
                    className="inline-flex rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition disabled:cursor-not-allowed disabled:opacity-50 hover:border-primary hover:text-primary"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
              <p className="text-sm text-gray-600">
                No encontramos episodios con esos filtros. Prueba con otra búsqueda o cambia la vista.
              </p>
            </div>
          )}
        </section>
      </section>
    </main>
  );
};

export default Podcast;
