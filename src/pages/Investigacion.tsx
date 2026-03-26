import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Status } from '../API';
import { listResearchItems } from '../graphql/queries';
import { getGraphqlClient } from '../lib/amplifySetup';
import { isWithinPublicationWindow } from '../lib/publicationWindow';
import { mapAmplifyResearchToPublic, type PublicResearchItem } from '../lib/researchMapper';

const ResearchPage = () => {
  const [researchItems, setResearchItems] = useState<PublicResearchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchResearch = async () => {
      setIsLoading(true);

      try {
        const client = getGraphqlClient();
        const allItems: any[] = [];
        let nextToken: string | null = null;

        do {
          const res: any = await client.graphql({
            query: listResearchItems,
            variables: {
              filter: { status: { eq: Status.PUBLISHED } },
              limit: 1000,
              nextToken,
            },
            authMode: 'apiKey',
          });

          const items = res?.data?.listResearchItems?.items ?? [];
          allItems.push(...items);
          nextToken = res?.data?.listResearchItems?.nextToken ?? null;
        } while (nextToken);

        const visibleItems = allItems.filter((item) => isWithinPublicationWindow(item));

        const sorted = visibleItems.sort((a, b) => {
          const highlightDiff = Number(Boolean(b?.highlight)) - Number(Boolean(a?.highlight));
          if (highlightDiff !== 0) return highlightDiff;
          const aTime = new Date(a?.publishedAt ?? a?.createdAt ?? 0).getTime();
          const bTime = new Date(b?.publishedAt ?? b?.createdAt ?? 0).getTime();
          return bTime - aTime;
        });

        if (!cancelled) {
          setResearchItems(sorted.map(mapAmplifyResearchToPublic));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void fetchResearch();

    return () => {
      cancelled = true;
    };
  }, []);

  const featuredItem = useMemo(
    () => researchItems.find((item) => item.highlight) ?? researchItems[0],
    [researchItems],
  );

  const remainingItems = useMemo(
    () => researchItems.filter((item) => item.id !== featuredItem?.id),
    [featuredItem, researchItems],
  );

  return (
    <main className="font-primary min-h-screen bg-gray-50 py-16">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-[#44482c]/15 bg-[#f5f2e7] px-6 py-10 shadow-sm sm:px-8 sm:py-12 lg:px-12 lg:py-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(177,193,129,0.28),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(68,72,44,0.16),transparent_22%)]" />
          <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(rgba(68,72,44,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(68,72,44,0.1)_1px,transparent_1px)] [background-size:32px_32px]" />

          <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#44482c]/15 bg-[#44482c] px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-[#e8d79a]">
                Conocimiento aplicado
              </div>

              <h1 className="mt-5 text-4xl font-black tracking-tight text-[#44482c] sm:text-5xl lg:text-6xl">
                Investigación
              </h1>

              <p className="mt-5 max-w-3xl text-sm leading-relaxed text-[#44482c]/90 sm:text-base md:text-lg">
                Explora publicaciones técnicas, documentos metodológicos e informes
                desarrollados en el marco del proyecto Terrasacha, con enfoque en
                sostenibilidad, ciencia aplicada e innovación territorial.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-[#44482c]">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#44482c]/10 bg-white/60 px-4 py-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  Documentos descargables
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#44482c]/10 bg-white/60 px-4 py-2">
                  <span className="h-2 w-2 rounded-full bg-secondary-claro" />
                  Contenido editorial para lectura web
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="rounded-2xl border border-[#44482c]/12 bg-white/60 p-5 backdrop-blur-sm sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#44482c]">
                  Panorama
                </p>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-[#44482c]/10 bg-[#44482c] p-4">
                    <p className="text-2xl font-black text-[#e8d79a]">{researchItems.length}</p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-[#e8d79a]/75">
                      Publicaciones
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[#44482c]/10 bg-[#44482c] p-4">
                    <p className="text-2xl font-black text-[#e8d79a]">
                      {researchItems.filter((item) => item.documentUrl).length}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-[#e8d79a]/75">
                      Con documento
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-[#44482c]/10 bg-white/75 p-4">
                  <p className="text-sm leading-relaxed text-[#44482c]/90">
                    La sección prioriza rigor documental, trazabilidad y acceso público
                    a productos de investigación del proyecto.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-10 sm:mt-12 lg:mt-14">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-sm sm:text-base md:text-lg font-bold uppercase tracking-wide">
              <span className="text-secondary-[bosques-nublados]">PUBLICACIÓN</span>{' '}
              <span className="text-primary">DESTACADA</span>
            </h2>
          </div>

          {isLoading ? (
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
              <p className="text-sm text-gray-600">Cargando publicaciones de investigación...</p>
            </div>
          ) : featuredItem ? (
            <article className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              <Link to={`/investigacion/${featuredItem.slug}`} className="group grid grid-cols-1 lg:grid-cols-12">
                <div className="relative min-h-[22rem] overflow-hidden lg:col-span-5">
                  {featuredItem.coverImageUrl ? (
                    <img
                      src={featuredItem.coverImageUrl}
                      alt={featuredItem.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="eager"
                    />
                  ) : (
                    <div className="flex h-full min-h-[22rem] items-center justify-center bg-gradient-to-br from-secondary-claro/30 to-[#e8d79a]">
                      <span className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary-[bosques-nublados]">
                        Investigación
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary-[bosques-nublados]/80 via-secondary-[bosques-nublados]/20 to-transparent" />
                  <div className="absolute left-5 top-5 inline-flex rounded-full bg-secondary-[amarillo-tierra] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary-[bosques-nublados]">
                    Destacada
                  </div>
                </div>

                <div className="flex flex-col justify-center bg-gradient-to-br from-white via-white to-secondary-claro/10 p-6 sm:p-8 lg:col-span-7 lg:p-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    {featuredItem.category ?? 'Investigación aplicada'}
                  </p>
                  <h3 className="mt-4 text-2xl font-black leading-tight text-secondary-[bosques-nublados] transition-colors group-hover:text-primary sm:text-3xl">
                    {featuredItem.title}
                  </h3>
                  <p className="mt-5 text-sm leading-relaxed text-gray-600 sm:text-base">
                    {featuredItem.summary}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3 text-xs text-gray-600">
                    {featuredItem.authorName && (
                      <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1">
                        Autor: {featuredItem.authorName}
                      </span>
                    )}
                    {featuredItem.institution && (
                      <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1">
                        {featuredItem.institution}
                      </span>
                    )}
                    {featuredItem.documentUrl && (
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">
                        {featuredItem.documentLabel} disponible
                      </span>
                    )}
                  </div>

                  <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
                    Ver investigación
                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </article>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
              <p className="text-sm text-gray-600">No hay publicaciones de investigación disponibles todavía.</p>
            </div>
          )}
        </section>

        <section className="mt-10 sm:mt-12">
          <div className="mb-6">
            <h2 className="text-sm sm:text-base md:text-lg font-bold uppercase tracking-wide">
              <span className="text-secondary-[bosques-nublados]">ARCHIVO DE</span>{' '}
              <span className="text-primary">INVESTIGACIÓN</span>
            </h2>
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
          ) : remainingItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {remainingItems.map((item) => (
                <Link
                  key={item.id}
                  to={`/investigacion/${item.slug}`}
                  className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  {item.coverImageUrl ? (
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={item.coverImageUrl}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-secondary-[bosques-nublados]/70 via-transparent to-transparent" />
                    </div>
                  ) : (
                    <div className="flex h-52 items-center justify-center bg-gradient-to-br from-secondary-claro/30 to-[#e8d79a]">
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-secondary-[bosques-nublados]">
                        Investigación
                      </span>
                    </div>
                  )}

                  <div className="p-5 sm:p-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">
                      {item.category ?? 'Investigación aplicada'}
                    </p>
                    <h3 className="mt-3 text-lg font-black leading-snug text-secondary-[bosques-nublados] transition-colors group-hover:text-primary sm:text-xl">
                      {item.title}
                    </h3>
                    <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-gray-600">
                      {item.summary}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {item.authorName && (
                        <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[11px] text-gray-700">
                          {item.authorName}
                        </span>
                      )}
                      {item.documentUrl && (
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                          {item.documentLabel}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
              <p className="text-sm text-gray-600">Todavía no hay más publicaciones en el archivo de investigación.</p>
            </div>
          )}
        </section>
      </section>
    </main>
  );
};

export default ResearchPage;

