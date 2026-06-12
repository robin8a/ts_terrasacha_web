import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Noticia } from '../data/noticias';
import { listNews } from '../graphql/queries';
import { getGraphqlClient } from '../lib/amplifySetup';
import { mapAmplifyNewsToNoticia } from '../lib/newsMapper';
import { isWithinPublicationWindow } from '../lib/publicationWindow';
import { extractYoutubeVideoId } from '../lib/youtube';
import { Status } from '../API';

const EMOJI_REGEX = /\p{Extended_Pictographic}/gu;

const sanitizeNewsText = (value?: string) => {
  if (!value) return '';
  return value.replace(EMOJI_REGEX, '').replace(/\s{2,}/g, ' ').trim();
};

const getFeaturedCoverImage = (noticia: Noticia): string | undefined => {
  if (noticia.image) return noticia.image;

  const youtubeVideoId = extractYoutubeVideoId(noticia.youtubeEmbedUrl);
  if (youtubeVideoId) {
    return `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`;
  }

  return noticia.gallery?.[0];
};

const Noticias = () => {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
  const remaining = noticias.slice(1);
  const featuredCoverImage = featured ? getFeaturedCoverImage(featured) : undefined;
  const featuredPreview = featured
    ? sanitizeNewsText(featured.content?.[0] ?? featured.excerpt)
    : '';

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

  return (
    <main className="font-primary min-h-screen bg-gray-50 py-16">
      <section className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="relative overflow-hidden rounded-3xl border border-[#44482c]/15 bg-[#e8d79a] px-6 py-10 shadow-sm sm:px-8 sm:py-12 lg:px-12 lg:py-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(68,72,44,0.16),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(132,155,80,0.2),transparent_22%)]" />
          <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(rgba(68,72,44,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(68,72,44,0.12)_1px,transparent_1px)] [background-size:32px_32px]" />
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-20 left-0 h-64 w-64 rounded-full bg-secondary-claro/25 blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#44482c]/15 bg-[#44482c] px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-[#e8d79a]">
                Actualidad Terrasacha
              </div>

              <h1 className="mt-5 text-4xl font-black uppercase tracking-tight text-[#44482c] sm:text-5xl lg:text-6xl">
                Noticias
              </h1>

              <p className="mt-5 max-w-3xl text-sm leading-relaxed text-[#44482c]/90 sm:text-base md:text-lg">
                Actualidad, ciencia y tecnología aplicada a la conservación. Sigue de cerca las
                novedades, eventos y artículos que están transformando el futuro sostenible de
                nuestros ecosistemas.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-[#44482c]">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#44482c]/10 bg-white/35 px-4 py-2">
                  <span className="h-2 w-2 rounded-full bg-secondary-[amarillo-tierra]" />
                  Ciencia y tecnología aplicada
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#44482c]/10 bg-white/35 px-4 py-2">
                  <span className="h-2 w-2 rounded-full bg-secondary-claro" />
                  Consulta por noticia individual
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="rounded-2xl border border-[#44482c]/12 bg-white/35 p-5 backdrop-blur-sm sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#44482c]">
                  Panorama
                </p>
                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-[#44482c]/10 bg-[#44482c] p-4">
                    <p className="text-2xl font-black text-[#e8d79a]">{noticias.length}</p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-[#e8d79a]/75">
                      Noticias
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[#44482c]/10 bg-[#44482c] p-4">
                    <p className="text-2xl font-black text-[#e8d79a]">{featured ? 1 : 0}</p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-[#e8d79a]/75">
                      Destacada
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-[#44482c]/10 bg-white/45 p-4">
                  <p className="text-sm leading-relaxed text-[#44482c]/90">
                    La sección prioriza la noticia más reciente y facilita el acceso al detalle
                    completo de cada publicación.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-10 sm:mt-12 lg:mt-14">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wide sm:text-base md:text-lg">
              <span className="text-secondary-[bosques-nublados]">NOTICIA</span>{' '}
              <span className="text-primary">DESTACADA</span>
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-600 sm:text-base">
              Publicación priorizada para facilitar la lectura, fortalecer la jerarquía del
              contenido y mejorar el acceso a cada noticia del proyecto.
            </p>
          </div>

          {isLoading ? (
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
              <p className="text-sm text-gray-600">Cargando noticias...</p>
            </div>
          ) : featured ? (
            <article className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              <Link
                to={`/noticias/${featured.id}`}
                className="group grid grid-cols-1 lg:grid-cols-12"
              >
                <div className="relative min-h-[24rem] h-80 overflow-hidden lg:col-span-7 lg:h-full">
                  {featuredCoverImage ? (
                    <img
                      src={featuredCoverImage}
                      alt={featured.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="eager"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary-pradera/25 to-secondary-claro/40 text-secondary-[bosques-nublados]/80">
                      Terrasacha
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary-[bosques-nublados]/85 via-secondary-[bosques-nublados]/30 to-transparent" />
                  <div className="absolute left-5 top-5 inline-flex rounded-full bg-secondary-[amarillo-tierra] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary-[bosques-nublados]">
                    Noticia destacada
                  </div>
                </div>

                <div className="flex flex-col justify-center bg-gradient-to-br from-white via-white to-secondary-claro/10 p-6 sm:p-8 lg:col-span-5 lg:p-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary sm:text-sm">
                    {featured.category ?? 'Noticias'}
                  </p>
                  {featured.date ? (
                    <p className="mt-2 text-xs text-gray-500 sm:text-sm">{featured.date}</p>
                  ) : null}
                  <h3 className="mt-4 text-2xl font-black leading-tight text-secondary-[bosques-nublados] transition-colors group-hover:text-primary sm:text-3xl lg:text-[2rem]">
                    {featured.title}
                  </h3>
                  <p className="mt-5 text-sm leading-relaxed text-gray-600 sm:text-base">
                    {sanitizeNewsText(featured.excerpt)}
                  </p>
                  {featuredPreview ? (
                    <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50/80 p-4">
                      <p className="text-sm leading-relaxed text-gray-700 line-clamp-4">
                        {featuredPreview}
                      </p>
                    </div>
                  ) : null}

                  <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
                    Leer noticia
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
              </Link>
            </article>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
              <p className="text-sm text-gray-600">No hay noticias publicadas todavía.</p>
            </div>
          )}

          <div className="mt-10 sm:mt-12">
            <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide sm:text-base md:text-lg">
                  <span className="text-secondary-[bosques-nublados]">MÁS</span>{' '}
                  <span className="text-primary">NOTICIAS</span>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600 sm:text-base">
                  Navega el resto de publicaciones en un formato más práctico y continuo.
                </p>
              </div>

              {remaining.length > 0 ? (
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
              ) : null}
            </div>

            {remaining.length > 0 ? (
              <div
                ref={carouselRef}
                className="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4"
              >
                {remaining.map((noticia) => (
                  <Link
                    key={noticia.id}
                    to={`/noticias/${noticia.id}`}
                    className="group max-w-[360px] min-w-[290px] snap-start overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg sm:min-w-[340px] lg:min-w-[360px]"
                  >
                    {noticia.image ? (
                      <div className="relative h-52 overflow-hidden">
                        <img
                          src={noticia.image}
                          alt={noticia.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-secondary-[bosques-nublados]/80 via-secondary-[bosques-nublados]/10 to-transparent" />
                        <div className="absolute left-4 top-4 inline-flex rounded-full bg-secondary-[amarillo-tierra] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-secondary-[bosques-nublados]">
                          Noticia
                        </div>
                      </div>
                    ) : null}

                    <div className="p-5 sm:p-6">
                      {noticia.date ? (
                        <p className="text-[11px] text-gray-500 sm:text-xs">{noticia.date}</p>
                      ) : null}
                      <h4 className="mt-3 text-lg font-black leading-snug text-secondary-[bosques-nublados] transition-colors group-hover:text-primary sm:text-xl">
                        {noticia.title}
                      </h4>
                      <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-gray-600">
                        {noticia.excerpt}
                      </p>

                      <div className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
                        Leer noticia
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
                  </Link>
                ))}
              </div>
            ) : !isLoading && featured ? (
              <p className="text-sm text-gray-600">No hay más noticias por el momento.</p>
            ) : null}
          </div>
        </section>
      </section>
    </main>
  );
};

export default Noticias;
