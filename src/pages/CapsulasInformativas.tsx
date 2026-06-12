import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Status } from '../API';
import { LIST_INFORMATIVE_CAPSULES } from '../graphql/capsulesVideoclips';
import { formatPublishedDateEs } from '../lib/adminHelpers';
import { getGraphqlClient } from '../lib/amplifySetup';
import {
  CAPSULE_CONTEXT_OPTIONS,
  getContextTypeChipClasses,
  mapAmplifyCapsuleToPublic,
  type CapsuleContextType,
  type PublicCapsule,
} from '../lib/capsuleMapper';
import { isWithinPublicationWindow } from '../lib/publicationWindow';

type ContextFilter = 'all' | CapsuleContextType;

const CONTEXT_ACCENT_CLASSES: Record<CapsuleContextType, string> = {
  Legal: 'border-l-primary',
  Social: 'border-l-secondary-pradera',
  Investigativo: 'border-l-secondary-claro',
  'Tec científico': 'border-l-gray-400',
};

const CapsuleCover = ({
  capsule,
  className = 'h-full w-full',
  eager = false,
  fit = 'cover',
}: {
  capsule: PublicCapsule;
  className?: string;
  eager?: boolean;
  fit?: 'cover' | 'contain';
}) => {
  if (capsule.image) {
    return (
      <img
        src={capsule.image}
        alt={capsule.title}
        className={`${fit === 'contain' ? 'object-contain' : 'object-cover'} transition-transform duration-500 group-hover:scale-[1.02] ${className}`}
        loading={eager ? 'eager' : 'lazy'}
      />
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#f5f2e7] via-white to-secondary-claro/20 ${className}`}
    >
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[#44482c]/10 bg-white/80 text-secondary-[bosques-nublados] shadow-sm">
        <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </span>
      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary-[bosques-nublados]/70">
        {capsule.contextType}
      </span>
    </div>
  );
};

const CapsuleMetaChips = ({ capsule }: { capsule: PublicCapsule }) => (
  <div className="flex flex-wrap gap-2">
    {capsule.institution ? (
      <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[11px] text-gray-700">
        {capsule.institution}
      </span>
    ) : null}
    {capsule.legalReference ? (
      <span className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-medium text-primary">
        {capsule.legalReference}
      </span>
    ) : null}
    {capsule.attachmentUrls.length > 0 ? (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828L18 9.828a4 4 0 10-5.656-5.656L5.757 10.757a6 6 0 108.486 8.486L20.5 13"
          />
        </svg>
        {capsule.attachmentUrls.length} adjunto{capsule.attachmentUrls.length === 1 ? '' : 's'}
      </span>
    ) : null}
  </div>
);

const CapsulasInformativas = () => {
  const [capsules, setCapsules] = useState<PublicCapsule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [contextFilter, setContextFilter] = useState<ContextFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let cancelled = false;

    const fetchCapsules = async () => {
      setIsLoading(true);
      try {
        const client = getGraphqlClient();
        const allItems: unknown[] = [];
        let nextToken: string | null = null;

        do {
          const response: any = await client.graphql({
            query: LIST_INFORMATIVE_CAPSULES,
            variables: {
              filter: { status: { eq: Status.PUBLISHED } },
              limit: 1000,
              nextToken,
            },
            authMode: 'apiKey',
          });

          const items = response?.data?.listInformativeCapsules?.items ?? [];
          allItems.push(...items);
          nextToken = response?.data?.listInformativeCapsules?.nextToken ?? null;
        } while (nextToken);

        const visibleItems = allItems.filter((item) =>
          isWithinPublicationWindow(item as { publishedAt?: string | null }),
        );

        const sorted = visibleItems
          .map(mapAmplifyCapsuleToPublic)
          .sort((a, b) => {
            const highlightDiff = Number(b.highlight) - Number(a.highlight);
            if (highlightDiff !== 0) return highlightDiff;
            const aTime = new Date(a.publishedAt ?? 0).getTime();
            const bTime = new Date(b.publishedAt ?? 0).getTime();
            return bTime - aTime;
          });

        if (!cancelled) setCapsules(sorted);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void fetchCapsules();
    return () => {
      cancelled = true;
    };
  }, []);

  const contextCounts = useMemo(() => {
    const counts: Record<ContextFilter, number> = {
      all: capsules.length,
      Legal: 0,
      Social: 0,
      Investigativo: 0,
      'Tec científico': 0,
    };
    capsules.forEach((capsule) => {
      counts[capsule.contextType] += 1;
    });
    return counts;
  }, [capsules]);

  const filteredCapsules = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return capsules.filter((capsule) => {
      if (contextFilter !== 'all' && capsule.contextType !== contextFilter) return false;
      if (!normalizedSearch) return true;
      const haystack = [
        capsule.title,
        capsule.excerpt,
        capsule.institution,
        capsule.legalReference,
        capsule.category,
        capsule.contextType,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [capsules, contextFilter, searchTerm]);

  const featured = filteredCapsules[0] ?? null;
  const remaining = filteredCapsules.slice(1);
  const showArchiveSection = capsules.length > 1;

  const handleFilterChange = (filter: ContextFilter) => {
    setContextFilter(filter);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
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
                Sala de consulta
              </div>

              <h1 className="mt-5 text-4xl font-black uppercase tracking-tight text-[#44482c] sm:text-5xl lg:text-6xl">
                Cápsulas Informativas
              </h1>

              <p className="mt-5 max-w-3xl text-sm leading-relaxed text-[#44482c]/90 sm:text-base md:text-lg">
                Archivo editorial con contexto legal, social, investigativo y tec. científico vinculado a los
                objetivos del proyecto Terrasacha. Consulta normas, referencias y material de soporte
                en un formato breve y accesible.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-[#44482c]">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#44482c]/10 bg-white/35 px-4 py-2">
                  <span className="h-2 w-2 rounded-full bg-secondary-[amarillo-tierra]" />
                  Contexto legal y normativo
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#44482c]/10 bg-white/35 px-4 py-2">
                  <span className="h-2 w-2 rounded-full bg-secondary-claro" />
                  Documentos y adjuntos
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#44482c]/10 bg-white/35 px-4 py-2">
                  <span className="h-2 w-2 rounded-full bg-secondary-pradera" />
                  Enfoque investigativo
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="rounded-2xl border border-[#44482c]/12 bg-white/35 p-5 backdrop-blur-sm sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#44482c]">Panorama</p>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-[#44482c]/10 bg-[#44482c] p-4">
                    <p className="text-2xl font-black text-[#e8d79a]">{capsules.length}</p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-[#e8d79a]/75">Cápsulas</p>
                  </div>
                  <div className="rounded-2xl border border-[#44482c]/10 bg-[#44482c] p-4">
                    <p className="text-2xl font-black text-[#e8d79a]">
                      {capsules.filter((item) => item.attachmentUrls.length > 0).length}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-[#e8d79a]/75">Con adjuntos</p>
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  {CAPSULE_CONTEXT_OPTIONS.map((option) => (
                    <div
                      key={option}
                      className="flex items-center justify-between rounded-xl border border-[#44482c]/10 bg-white/45 px-3 py-2"
                    >
                      <span className="text-xs font-semibold text-[#44482c]">{option}</span>
                      <span className="rounded-full bg-[#44482c] px-2.5 py-0.5 text-[11px] font-bold text-[#e8d79a]">
                        {contextCounts[option]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-10 sm:mt-12 lg:mt-14">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wide sm:text-base md:text-lg">
              <span className="text-secondary-[bosques-nublados]">CÁPSULA</span>{' '}
              <span className="text-primary">DESTACADA</span>
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-600 sm:text-base">
              Pieza priorizada para facilitar la consulta rápida de contexto normativo,
              social, investigativo o tec. científico.
            </p>
          </div>

          {isLoading ? (
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
              <p className="text-sm text-gray-600">Cargando cápsulas...</p>
            </div>
          ) : featured ? (
            <article className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              <Link to={`/capsulas-informativas/${featured.id}`} className="group grid grid-cols-1 lg:grid-cols-12">
                <div className="relative h-80 min-h-[24rem] overflow-hidden lg:col-span-7 lg:h-full">
                  <CapsuleCover capsule={featured} className="h-full w-full" eager />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary-[bosques-nublados]/85 via-secondary-[bosques-nublados]/30 to-transparent" />
                  <div className="absolute left-5 top-5 inline-flex rounded-full bg-secondary-[amarillo-tierra] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-secondary-[bosques-nublados]">
                    {featured.highlight ? 'Cápsula destacada' : 'Última cápsula'}
                  </div>
                </div>

                <div className="flex flex-col justify-center bg-gradient-to-br from-white via-white to-secondary-claro/10 p-6 sm:p-8 lg:col-span-5 lg:p-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary sm:text-sm">
                    {featured.category ?? featured.contextType}
                  </p>
                  <h3 className="mt-4 text-2xl font-black leading-tight text-secondary-[bosques-nublados] transition-colors group-hover:text-primary sm:text-3xl lg:text-[2rem]">
                    {featured.title}
                  </h3>
                  <p className="mt-5 text-sm leading-relaxed text-gray-600 sm:text-base">{featured.excerpt}</p>

                  <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50/80 p-4">
                    <p className="text-sm leading-relaxed text-gray-700">
                      {featured.body[0] ?? featured.excerpt}
                    </p>
                  </div>

                  <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
                    Leer cápsula
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
                </div>
              </Link>
            </article>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
              <p className="text-sm text-gray-600">
                {searchTerm.trim() || contextFilter !== 'all'
                  ? 'No hay cápsulas que coincidan con tu búsqueda o filtro.'
                  : 'No hay cápsulas publicadas todavía.'}
              </p>
            </div>
          )}
        </section>

        {showArchiveSection ? (
        <section className="mt-10 sm:mt-12">
          <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wide sm:text-base md:text-lg">
                <span className="text-secondary-[bosques-nublados]">ARCHIVO DE</span>{' '}
                <span className="text-primary">CÁPSULAS</span>
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-gray-600">
                Explora el repositorio por tipo de contexto o usa la búsqueda para localizar normas,
                instituciones y referencias.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder="Buscar por título, norma o institución..."
                className="w-full rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:min-w-[280px]"
                aria-label="Buscar cápsulas informativas"
              />
            </div>
          </div>

          <div
            className="mb-6 flex flex-wrap gap-2"
            role="group"
            aria-label="Filtrar por tipo de contexto"
          >
            {(['all', ...CAPSULE_CONTEXT_OPTIONS] as ContextFilter[]).map((filter) => {
              const label = filter === 'all' ? 'Todas' : filter;
              const isActive = contextFilter === filter;
              const count = contextCounts[filter];
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => handleFilterChange(filter)}
                  aria-pressed={isActive}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
                    isActive
                      ? 'border-[#44482c] bg-[#44482c] text-[#e8d79a]'
                      : 'border-gray-200 bg-white text-secondary-[bosques-nublados] hover:border-primary/40 hover:bg-primary/5'
                  }`}
                >
                  {label}
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] ${
                      isActive ? 'bg-[#e8d79a]/20 text-[#e8d79a]' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="h-52 animate-pulse rounded-xl bg-gray-100" />
                  <div className="mt-4 h-5 w-24 animate-pulse rounded bg-gray-200" />
                  <div className="mt-3 h-16 animate-pulse rounded bg-gray-100" />
                </div>
              ))}
            </div>
          ) : remaining.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {remaining.map((capsule) => (
                <Link
                  key={capsule.id}
                  to={`/capsulas-informativas/${capsule.id}`}
                  className={`group overflow-hidden rounded-2xl border border-gray-100 border-l-4 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg ${CONTEXT_ACCENT_CLASSES[capsule.contextType]}`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-white">
                    <CapsuleCover capsule={capsule} className="h-full w-full" fit="contain" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-secondary-[bosques-nublados]/30 to-transparent" />
                    <div
                      className={`absolute left-4 top-4 inline-flex rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] backdrop-blur-sm ${getContextTypeChipClasses(capsule.contextType)}`}
                    >
                      {capsule.contextType}
                    </div>
                  </div>

                  <div className="p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">
                        {capsule.category ?? 'Cápsula informativa'}
                      </p>
                      <time className="shrink-0 text-[11px] text-gray-500">
                        {formatPublishedDateEs(capsule.publishedAt)}
                      </time>
                    </div>

                    <h3 className="mt-3 text-lg font-black leading-snug text-secondary-[bosques-nublados] transition-colors group-hover:text-primary sm:text-xl">
                      {capsule.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-600">
                      {capsule.excerpt}
                    </p>

                    <div className="mt-5">
                      <CapsuleMetaChips capsule={capsule} />
                    </div>

                    <div className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
                      Consultar cápsula
                      <svg
                        className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
              <p className="text-sm text-gray-600">
                {searchTerm.trim() || contextFilter !== 'all'
                  ? 'No hay más cápsulas con ese filtro o búsqueda. Prueba otro criterio.'
                  : 'No hay más cápsulas en el archivo por ahora.'}
              </p>
            </div>
          )}
        </section>
        ) : null}
      </section>
    </main>
  );
};

export default CapsulasInformativas;
