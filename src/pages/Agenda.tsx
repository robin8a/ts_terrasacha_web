import { useCallback, useEffect, useMemo, useState } from 'react';
import { EventType as EventTypeEnum, Status } from '../API';
import type { EventType } from '../API';
import { listEvents } from '../graphql/queries';
import { getGraphqlClient } from '../lib/amplifySetup';
import {
  formatEventDateRangeEs,
  getEventCardAccentClasses,
  getEventTypeLabelEs,
  isPublicAgendaEvent,
  mapAmplifyEventToPublic,
  truncatePlainText,
  type PublicAgendaEvent,
} from '../lib/eventMapper';

type ModalityFilter = 'all' | 'online' | 'onsite';

const EVENT_TYPE_FILTERS: Array<{ value: EventType | ''; label: string }> = [
  { value: '', label: 'Todos los tipos' },
  { value: EventTypeEnum.WORKSHOP, label: 'Taller' },
  { value: EventTypeEnum.WEBINAR, label: 'Webinar' },
  { value: EventTypeEnum.ONSITE, label: 'Presencial' },
  { value: EventTypeEnum.ONLINE, label: 'En línea' },
  { value: EventTypeEnum.OTHER, label: 'Otro' },
];

const sortAgendaEvents = (list: PublicAgendaEvent[]): PublicAgendaEvent[] => {
  const now = Date.now();
  return [...list].sort((a, b) => {
    const ta = new Date(a.startDateTime).getTime();
    const tb = new Date(b.startDateTime).getTime();
    const aPast = ta < now;
    const bPast = tb < now;
    if (aPast !== bPast) return aPast ? 1 : -1;
    return ta - tb;
  });
};

const Agenda = () => {
  const [events, setEvents] = useState<PublicAgendaEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<EventType | ''>('');
  const [modalityFilter, setModalityFilter] = useState<ModalityFilter>('all');
  /** Por defecto true: si no, los eventos de prueba con fecha pasada no aparecen y la agenda parece vacía. */
  const [includePast, setIncludePast] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<PublicAgendaEvent | null>(null);

  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const client = getGraphqlClient();
      const allItems: unknown[] = [];
      let nextToken: string | null = null;
      do {
        const res: unknown = await client.graphql({
          query: listEvents,
          variables: {
            filter: {
              status: { eq: Status.PUBLISHED },
            },
            limit: 1000,
            nextToken,
          },
          authMode: 'apiKey',
        });
        const gqlErr = (res as { errors?: Array<{ message?: string } | null> | null }).errors;
        if (Array.isArray(gqlErr) && gqlErr.length > 0) {
          const msg = gqlErr.map((e) => e?.message).filter(Boolean).join(' · ');
          if (msg) {
            setLoadError(msg);
            setEvents([]);
            return;
          }
        }
        const data = res as {
          data?: { listEvents?: { items?: unknown[] | null; nextToken?: string | null } | null };
        };
        const items = data?.data?.listEvents?.items ?? [];
        allItems.push(...items.filter(Boolean));
        nextToken = data?.data?.listEvents?.nextToken ?? null;
      } while (nextToken);

      type RawEvent = Parameters<typeof mapAmplifyEventToPublic>[0] & {
        status: Status;
        visible: boolean;
        publishedAt?: string | null;
      };
      const published = (allItems as RawEvent[]).filter((row) => row && isPublicAgendaEvent(row));
      const mapped = published.map((row) => mapAmplifyEventToPublic(row));

      setEvents(sortAgendaEvents(mapped));
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === 'object' &&
              err !== null &&
              'errors' in err &&
              Array.isArray((err as { errors: { message?: string }[] }).errors)
            ? (err as { errors: { message?: string }[] }).errors.map((e) => e?.message).filter(Boolean).join(' · ')
            : 'No se pudo cargar la agenda.';
      setLoadError(msg);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') void loadEvents();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [loadEvents]);

  const filteredEvents = useMemo(() => {
    const now = Date.now();
    const q = search.trim().toLowerCase();
    return events.filter((ev) => {
      if (!includePast && new Date(ev.startDateTime).getTime() < now) return false;
      if (typeFilter && ev.eventType !== typeFilter) return false;
      if (modalityFilter === 'online' && !ev.isOnline) return false;
      if (modalityFilter === 'onsite' && ev.isOnline) return false;
      if (!q) return true;
      const hay = `${ev.title} ${ev.description} ${ev.location ?? ''} ${ev.category ?? ''} ${ev.tags.join(' ')}`.toLowerCase();
      return hay.includes(q);
    });
  }, [events, includePast, modalityFilter, search, typeFilter]);

  const upcomingCount = useMemo(() => {
    const now = Date.now();
    return events.filter((ev) => new Date(ev.startDateTime).getTime() >= now).length;
  }, [events]);

  const featuredEvent = useMemo(() => {
    if (filteredEvents.length === 0) return null;

    const highlighted = filteredEvents.find((ev) => ev.highlight);
    if (highlighted) return highlighted;

    const now = Date.now();
    const upcoming = filteredEvents.filter(
      (ev) => new Date(ev.startDateTime).getTime() >= now,
    );
    return upcoming[0] ?? filteredEvents[0];
  }, [filteredEvents]);

  const gridEvents = useMemo(() => {
    if (!featuredEvent) return filteredEvents;
    return filteredEvents.filter((ev) => ev.id !== featuredEvent.id);
  }, [filteredEvents, featuredEvent]);

  const handleCloseModal = useCallback(() => setSelectedEvent(null), []);

  useEffect(() => {
    if (!selectedEvent) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedEvent(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedEvent]);

  return (
    <main className="font-primary min-h-screen bg-gray-50 py-16">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-[#44482c]/15 bg-[#e8d79a] px-6 py-10 shadow-sm sm:px-8 sm:py-12 lg:px-12 lg:py-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(68,72,44,0.16),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(132,155,80,0.2),transparent_22%)]" />
          <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(rgba(68,72,44,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(68,72,44,0.12)_1px,transparent_1px)] [background-size:32px_32px]" />
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-20 left-0 h-64 w-64 rounded-full bg-secondary-claro/25 blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#44482c]/15 bg-[#44482c] px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-[#e8d79a]">
                Eventos Terrasacha
              </div>

              <h1 className="mt-5 text-4xl font-black uppercase tracking-tight text-[#44482c] sm:text-5xl lg:text-6xl">
                Agenda
              </h1>

              <p className="mt-5 max-w-3xl text-sm leading-relaxed text-[#44482c]/90 sm:text-base md:text-lg">
                Eventos de innovación, conciencia, transformación y educación del proyecto
                Terrasacha.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-[#44482c]">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#44482c]/10 bg-white/35 px-4 py-2">
                  <span className="h-2 w-2 rounded-full bg-secondary-[amarillo-tierra]" />
                  Innovación y educación
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#44482c]/10 bg-white/35 px-4 py-2">
                  <span className="h-2 w-2 rounded-full bg-secondary-claro" />
                  Presencial y en línea
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
                    <p className="text-2xl font-black text-[#e8d79a]">{events.length}</p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-[#e8d79a]/75">
                      Eventos
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[#44482c]/10 bg-[#44482c] p-4">
                    <p className="text-2xl font-black text-[#e8d79a]">{upcomingCount}</p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-[#e8d79a]/75">
                      Próximos
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-[#44482c]/10 bg-white/45 p-4">
                  <p className="text-sm leading-relaxed text-[#44482c]/90">
                    Consulta el evento destacado y explora el resto de actividades con filtros por
                    tipo, modalidad o palabra clave.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-10 sm:mt-12 lg:mt-14">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wide sm:text-base md:text-lg">
              <span className="text-secondary-[bosques-nublados]">EVENTO</span>{' '}
              <span className="text-primary">DESTACADO</span>
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-600 sm:text-base">
              Actividad priorizada para facilitar el acceso a fechas, modalidad y detalle completo
              del evento.
            </p>
          </div>

          {isLoading ? (
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
              <p className="text-sm text-gray-600">Cargando agenda…</p>
            </div>
          ) : featuredEvent ? (
            <article className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              <div className="group grid grid-cols-1 lg:grid-cols-12">
                <div className="relative min-h-[24rem] h-80 overflow-hidden lg:col-span-7 lg:h-full">
                  {featuredEvent.coverImageUrl ? (
                    <img
                      src={featuredEvent.coverImageUrl}
                      alt=""
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
                    Evento destacado
                  </div>
                </div>

                <div className="flex flex-col justify-center bg-gradient-to-br from-white via-white to-secondary-claro/10 p-6 sm:p-8 lg:col-span-5 lg:p-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary sm:text-sm">
                    {getEventTypeLabelEs(featuredEvent.eventType)}
                  </p>
                  <h3 className="mt-4 text-2xl font-black leading-tight text-secondary-[bosques-nublados] sm:text-3xl lg:text-[2rem]">
                    {featuredEvent.title}
                  </h3>
                  <p className="mt-5 text-sm leading-relaxed text-gray-600 sm:text-base">
                    {truncatePlainText(featuredEvent.description, 220)}
                  </p>
                  <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50/80 p-4">
                    <p className="text-sm font-medium text-gray-800">
                      {formatEventDateRangeEs(
                        featuredEvent.startDateTime,
                        featuredEvent.endDateTime,
                        featuredEvent.timezone,
                      )}
                    </p>
                    {featuredEvent.location ? (
                      <p className="mt-2 text-sm text-gray-700">
                        <span className="font-semibold">Lugar:</span> {featuredEvent.location}
                        {featuredEvent.isOnline ? (
                          <span className="ml-1 text-primary">· En línea</span>
                        ) : null}
                      </p>
                    ) : featuredEvent.isOnline ? (
                      <p className="mt-2 text-sm font-medium text-primary">Modalidad en línea</p>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedEvent(featuredEvent)}
                    className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary transition-colors hover:text-primary-dark"
                  >
                    Ver detalles del evento
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
                  </button>
                </div>
              </div>
            </article>
          ) : !loadError ? (
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
              <p className="text-sm text-gray-600">
                {events.length === 0
                  ? 'No hay eventos publicados todavía.'
                  : 'No hay eventos con estos filtros para mostrar un destacado.'}
              </p>
            </div>
          ) : null}
        </section>

        <section className="mt-10 sm:mt-12 lg:mt-14">
          <div className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wide sm:text-base md:text-lg">
              <span className="text-secondary-[bosques-nublados]">MÁS</span>{' '}
              <span className="text-primary">EVENTOS</span>
            </h2>
            <p className="mt-2 text-sm text-gray-600 sm:text-base">
              Filtra por tipo, modalidad o palabra clave.
            </p>
          </div>

          <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end">
            <label className="flex min-w-[200px] flex-1 flex-col gap-1 text-xs font-semibold text-secondary-bosquesNublados">
              Buscar
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-xl border border-secondary-claro/50 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm"
                placeholder="Título, lugar, tema…"
                aria-label="Buscar en la agenda"
              />
            </label>
            <label className="flex w-full max-w-[220px] flex-col gap-1 text-xs font-semibold text-secondary-bosquesNublados">
              Tipo
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter((e.target.value as EventType | '') || '')}
                className="rounded-xl border border-secondary-claro/50 bg-white px-3 py-2 text-sm shadow-sm"
                aria-label="Filtrar por tipo de evento"
              >
                {EVENT_TYPE_FILTERS.map((opt) => (
                  <option key={String(opt.value) + opt.label} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex w-full max-w-[200px] flex-col gap-1 text-xs font-semibold text-secondary-bosquesNublados">
              Modalidad
              <select
                value={modalityFilter}
                onChange={(e) => setModalityFilter(e.target.value as ModalityFilter)}
                className="rounded-xl border border-secondary-claro/50 bg-white px-3 py-2 text-sm shadow-sm"
                aria-label="Filtrar por modalidad"
              >
                <option value="all">Todas</option>
                <option value="online">En línea</option>
                <option value="onsite">Presencial / territorio</option>
              </select>
            </label>
            <label className="inline-flex items-center gap-2 rounded-xl border border-secondary-claro/50 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm">
              <input
                type="checkbox"
                checked={includePast}
                onChange={(e) => setIncludePast(e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary/40"
              />
              Incluir eventos pasados
            </label>
          </div>

          {loadError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900" role="alert">
              {loadError}
            </div>
          ) : null}

          {!isLoading && filteredEvents.length === 0 ? (
            <div className="rounded-3xl border border-secondary-claro/40 bg-white p-10 text-center shadow-lg">
              {events.length === 0 ? (
                <>
                  <p className="text-lg font-semibold text-secondary-bosquesNublados">No hay eventos publicados aún</p>
                  <p className="mt-2 text-sm text-gray-600">
                    Cuando existan eventos con estado <strong className="font-semibold">Publicado</strong>, visibles y (si
                    tienen fecha de publicación) ya en vigor, aparecerán aquí. Revisa en el admin que el evento no sea
                    borrador, que esté marcado como visible y que la «publicación programada» no sea una fecha futura.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-lg font-semibold text-secondary-bosquesNublados">No hay eventos con estos filtros</p>
                  <p className="mt-2 text-sm text-gray-600">
                    Prueba limpiar la búsqueda, restablecer tipo y modalidad a «Todos», o desmarca «Incluir eventos
                    pasados» solo si quieres ver únicamente lo que aún no ha comenzado.
                  </p>
                </>
              )}
            </div>
          ) : !isLoading ? (
            <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {gridEvents.map((ev) => (
                <li key={ev.id}>
                  <article
                    className={`flex h-full flex-col overflow-hidden rounded-2xl border border-secondary-claro/30 shadow-md transition hover:shadow-lg ${getEventCardAccentClasses(ev.eventType)}`}
                  >
                    <div className="relative h-44 w-full shrink-0 bg-secondary-claro/20">
                      {ev.coverImageUrl ? (
                        <img src={ev.coverImageUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary-pradera/25 to-secondary-claro/40 text-secondary-bosquesNublados/80 text-sm font-medium px-4 text-center">
                          Terrasacha
                        </div>
                      )}
                      {ev.highlight ? (
                        <span className="absolute left-3 top-3 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                          Destacado
                        </span>
                      ) : null}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-xs font-bold uppercase tracking-wide text-primary">{getEventTypeLabelEs(ev.eventType)}</p>
                      <h3 className="mt-1 text-lg font-bold text-secondary-bosquesNublados leading-snug">{ev.title}</h3>
                      <p className="mt-2 text-sm text-gray-600 line-clamp-3">{truncatePlainText(ev.description, 180)}</p>
                      <p className="mt-3 text-sm font-medium text-gray-800">
                        {formatEventDateRangeEs(ev.startDateTime, ev.endDateTime, ev.timezone)}
                      </p>
                      {ev.location ? (
                        <p className="mt-1 text-xs text-gray-500">
                          <span className="font-semibold text-gray-700">Lugar:</span> {ev.location}
                          {ev.isOnline ? <span className="ml-1 text-primary">· En línea</span> : null}
                        </p>
                      ) : ev.isOnline ? (
                        <p className="mt-1 text-xs text-primary font-medium">Modalidad en línea</p>
                      ) : null}
                      <div className="mt-auto pt-4">
                        <button
                          type="button"
                          onClick={() => setSelectedEvent(ev)}
                          className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 sm:w-auto"
                        >
                          Ver detalles
                        </button>
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      </section>

      {selectedEvent ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="agenda-modal-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/55"
            aria-label="Cerrar detalle del evento"
            onClick={handleCloseModal}
          />
          <div className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
            <div className="relative h-48 w-full shrink-0 bg-secondary-claro/30">
              {selectedEvent.coverImageUrl ? (
                <img src={selectedEvent.coverImageUrl} alt="" className="h-full w-full object-cover" />
              ) : null}
              <button
                type="button"
                onClick={handleCloseModal}
                className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-xl text-gray-700 shadow hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <p className="text-xs font-bold uppercase tracking-wide text-primary">{getEventTypeLabelEs(selectedEvent.eventType)}</p>
              <h2 id="agenda-modal-title" className="mt-2 text-2xl font-bold text-secondary-bosquesNublados">
                {selectedEvent.title}
              </h2>
              <p className="mt-3 text-sm font-medium text-gray-800">
                {formatEventDateRangeEs(selectedEvent.startDateTime, selectedEvent.endDateTime, selectedEvent.timezone)}
              </p>
              {selectedEvent.location ? (
                <p className="mt-2 text-sm text-gray-700">
                  <span className="font-semibold">Lugar:</span> {selectedEvent.location}
                </p>
              ) : null}
              {selectedEvent.isOnline ? (
                <p className="mt-1 text-sm text-primary font-medium">Incluye participación en línea</p>
              ) : null}
              {selectedEvent.capacity != null ? (
                <p className="mt-2 text-sm text-gray-700">
                  <span className="font-semibold">Cupo:</span> {selectedEvent.capacity}
                </p>
              ) : null}
              <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">{selectedEvent.description}</div>
              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                {selectedEvent.registrationUrl ? (
                  <a
                    href={selectedEvent.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-white hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                  >
                    Inscripción o registro
                  </a>
                ) : null}
                {selectedEvent.onlineUrl ? (
                  <a
                    href={selectedEvent.onlineUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center rounded-xl border border-primary/40 bg-white px-4 py-3 text-center text-sm font-semibold text-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                  >
                    Enlace del evento
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
};

export default Agenda;
