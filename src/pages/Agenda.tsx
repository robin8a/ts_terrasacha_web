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
    <main className="font-primary bg-gray-50 min-h-screen">
      <section className="relative w-full flex items-center justify-center overflow-hidden h-[320px] sm:h-[360px] md:h-[400px] bg-secondary-bosquesNublados">
        <div className="absolute inset-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBfQ0n8xHH295DYRfaoDi9YuisSdVJz3OcK25N9XZlrEenPdsNp0bIIJb5drdB4wY9oj_sZL5zqXh2K4gFNHokA8aGDetHJ5mH1srrUogHiqmgCgAehxuDehGRMlXYwM_AlTbD2oua9zgueMUIBLzHlWeNzbClnUrOZMJUMSxU3lS_I247_cIrZiHOT4dyyIj2z77l6nAbJNzpIwSYck1F7xZHwT5kYbqTXgpsWNmlUOLDOhtkC6l_LxGw4ZQHS-_Qcs1caMUU4fQ"
            alt="Bosque y naturaleza"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="font-slogan uppercase mb-3 sm:mb-4 text-white drop-shadow-2xl text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] tracking-slogan">
            AGENDA
          </h1>
          <p className="text-sm sm:text-base md:text-lg font-light text-white max-w-2xl mx-auto drop-shadow-lg">
            Eventos de innovación, conciencia, transformación y educación del proyecto Terrasacha.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-secondary-bosquesNublados">Próximas actividades</h2>
            <p className="mt-1 text-sm text-gray-600">Filtra por tipo, modalidad o palabra clave.</p>
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

          {isLoading ? (
            <p className="text-center text-gray-600 py-16">Cargando agenda…</p>
          ) : filteredEvents.length === 0 ? (
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
          ) : (
            <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {filteredEvents.map((ev) => (
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
          )}
        </div>
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
