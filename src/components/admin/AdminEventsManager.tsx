import { type ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { uploadData } from 'aws-amplify/storage';
import { createEvent, deleteEvent, updateEvent } from '../../graphql/mutations';
import { getEvent, listEvents } from '../../graphql/queries';
import type { CreateEventInput, EventType, ModelEventFilterInput, Status, UpdateEventInput } from '../../API';
import { EventType as EventTypeValues, Status as EventStatus } from '../../API';
import { getGraphqlClient } from '../../lib/amplifySetup';
import { buildS3PublicObjectUrl } from '../../lib/s3PublicUrl';
import { getEventTypeLabelEs } from '../../lib/eventMapper';

type AdminEventRow = {
  id: string;
  title: string;
  description: string;
  eventType?: EventType | null;
  category?: string | null;
  tags?: Array<string | null> | null;
  startDateTime: string;
  endDateTime?: string | null;
  timezone?: string | null;
  location?: string | null;
  isOnline: boolean;
  onlineUrl?: string | null;
  registrationUrl?: string | null;
  capacity?: number | null;
  coverImageUrl?: string | null;
  publishedAt?: string | null;
  highlight: boolean;
  status: Status;
  visible: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type EventFormState = {
  id?: string;
  title: string;
  description: string;
  eventType: EventType | '';
  category: string;
  tagsComma: string;
  startLocal: string;
  endLocal: string;
  timezone: string;
  location: string;
  isOnline: boolean;
  onlineUrl: string;
  registrationUrl: string;
  capacity: string;
  publishedAtLocal: string;
  status: Status;
  highlight: boolean;
  visible: boolean;
  coverImageUrl: string | null;
  coverImageFile: File | null;
};

type SortOption = 'startAsc' | 'startDesc' | 'recent' | 'titleAsc';

const PAGE_SIZE = 25;
const DEFAULT_TIMEZONE = 'America/Bogota';
const EVENT_TYPE_SELECT: Array<{ value: EventType | ''; label: string }> = [
  { value: '', label: '(Sin tipo)' },
  { value: EventTypeValues.WORKSHOP, label: 'Taller' },
  { value: EventTypeValues.WEBINAR, label: 'Webinar' },
  { value: EventTypeValues.ONSITE, label: 'Presencial' },
  { value: EventTypeValues.ONLINE, label: 'En línea' },
  { value: EventTypeValues.OTHER, label: 'Otro' },
];

const EVENT_CATEGORY_SELECT: Array<{ value: string; label: string }> = [
  { value: '', label: '(Sin categoría)' },
  { value: 'Formación', label: 'Formación' },
  { value: 'Territorio', label: 'Territorio' },
  { value: 'Sostenibilidad', label: 'Sostenibilidad' },
  { value: 'Innovación', label: 'Innovación' },
  { value: 'Institucional', label: 'Institucional' },
  { value: 'Comunidad', label: 'Comunidad' },
  { value: 'Investigación', label: 'Investigación' },
  { value: 'Convocatoria', label: 'Convocatoria' },
  { value: 'Cultura y bienestar', label: 'Cultura y bienestar' },
];

const sanitizeFileName = (name: string) =>
  name.replace(/[^\w.-]+/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '');

const uploadPublicFile = async (file: File, pathPrefix: string): Promise<string> => {
  const safeName = sanitizeFileName(file.name) || 'file';
  const fullPath = `public/${pathPrefix}/${Date.now()}-${safeName}`;
  const task = uploadData({ path: fullPath, data: file });
  await task.result;
  return buildS3PublicObjectUrl(fullPath);
};

const toDateTimeLocalValue = (iso?: string | null) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 16);
};

const toIsoFromDateTimeLocal = (value: string) => {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
};

/** Amplify/AppSync a menudo devuelve objetos que no son `instanceof Error`. */
const formatGraphqlClientError = (err: unknown, fallback: string): string => {
  if (err == null) return fallback;
  if (typeof err === 'string') return err;
  if (err instanceof Error) return err.message || fallback;
  if (typeof err === 'object') {
    const o = err as Record<string, unknown>;
    if (Array.isArray(o.errors) && o.errors.length > 0) {
      const parts = o.errors
        .map((e) => {
          if (e && typeof e === 'object' && 'message' in e) return String((e as { message: unknown }).message);
          return null;
        })
        .filter((s): s is string => Boolean(s));
      if (parts.length > 0) return parts.join(' · ');
    }
    if (typeof o.message === 'string' && o.message.trim()) return o.message;
    const underlying = o.underlyingError ?? o.cause;
    if (underlying) return formatGraphqlClientError(underlying, fallback);
  }
  return fallback;
};

const getGraphqlErrorsFromResult = (res: unknown): string | null => {
  if (!res || typeof res !== 'object') return null;
  const errors = (res as { errors?: Array<{ message?: string } | null> | null }).errors;
  if (!Array.isArray(errors) || errors.length === 0) return null;
  const messages = errors.map((e) => e?.message).filter((m): m is string => typeof m === 'string' && m.length > 0);
  return messages.length > 0 ? messages.join(' · ') : null;
};

const buildEmptyForm = (): EventFormState => ({
  title: '',
  description: '',
  eventType: '',
  category: '',
  tagsComma: '',
  startLocal: '',
  endLocal: '',
  timezone: DEFAULT_TIMEZONE,
  location: '',
  isOnline: false,
  onlineUrl: '',
  registrationUrl: '',
  capacity: '',
  publishedAtLocal: '',
  status: EventStatus.DRAFT,
  highlight: false,
  visible: true,
  coverImageUrl: null,
  coverImageFile: null,
});

const parseTags = (comma: string): string[] | null => {
  const parts = comma
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
  return parts.length ? parts : null;
};

const getStatusLabel = (status: Status): string => {
  switch (status) {
    case EventStatus.DRAFT:
      return 'Borrador';
    case EventStatus.PUBLISHED:
      return 'Publicado';
    case EventStatus.ARCHIVED:
      return 'Archivado';
    default:
      return String(status);
  }
};

const getStatusBadgeClasses = (status: Status): string => {
  switch (status) {
    case EventStatus.DRAFT:
      return 'border-yellow-200 bg-yellow-50 text-yellow-800';
    case EventStatus.PUBLISHED:
      return 'border-emerald-200 bg-emerald-50 text-emerald-800';
    case EventStatus.ARCHIVED:
      return 'border-gray-200 bg-gray-100 text-gray-700';
    default:
      return 'border-gray-200 bg-gray-100 text-gray-700';
  }
};

const AdminEventsManager = () => {
  const [items, setItems] = useState<AdminEventRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [titleSearch, setTitleSearch] = useState('');
  const [debouncedTitleSearch, setDebouncedTitleSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | ''>('');
  const [sortOption, setSortOption] = useState<SortOption>('startDesc');
  const [pageIndex, setPageIndex] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const pageTokensRef = useRef<Array<string | null>>([null]);
  const skipNextPageFetchRef = useRef(false);
  const didInitRef = useRef(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [form, setForm] = useState<EventFormState>(buildEmptyForm);
  const [isSaving, setIsSaving] = useState(false);

  const categorySelectOptions = useMemo(() => {
    const known = new Set(EVENT_CATEGORY_SELECT.map((o) => o.value));
    const current = form.category.trim();
    if (current && !known.has(current)) {
      return [...EVENT_CATEGORY_SELECT, { value: current, label: `${current} (valor guardado)` }];
    }
    return EVENT_CATEGORY_SELECT;
  }, [form.category]);

  const fetchEvents = useCallback(async (targetPageIndex: number) => {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const client = getGraphqlClient();
      const nextToken = pageTokensRef.current[targetPageIndex - 1] ?? null;
      const listFilter: ModelEventFilterInput | null =
        debouncedTitleSearch.trim() || statusFilter
          ? {
              ...(debouncedTitleSearch.trim() ? { title: { contains: debouncedTitleSearch.trim() } } : {}),
              ...(statusFilter ? { status: { eq: statusFilter as Status } } : {}),
            }
          : null;

      const res: unknown = await client.graphql({
        query: listEvents,
        variables: { filter: listFilter ?? undefined, limit: PAGE_SIZE, nextToken },
        authMode: 'userPool',
      });
      const gqlErr = getGraphqlErrorsFromResult(res);
      if (gqlErr) {
        setErrorMessage(gqlErr);
        return;
      }
      const data = res as {
        data?: { listEvents?: { items?: AdminEventRow[] | null; nextToken?: string | null } | null };
      };
      const pageItems = (data?.data?.listEvents?.items ?? []).filter(Boolean) as AdminEventRow[];
      const sorted = [...pageItems].sort((a, b) => {
        if (sortOption === 'titleAsc') return a.title.localeCompare(b.title, 'es', { sensitivity: 'base' });
        const ta = new Date(a.startDateTime).getTime();
        const tb = new Date(b.startDateTime).getTime();
        if (sortOption === 'startAsc') return ta - tb;
        if (sortOption === 'startDesc') return tb - ta;
        const aTime = new Date(a.updatedAt ?? a.createdAt ?? 0).getTime();
        const bTime = new Date(b.updatedAt ?? b.createdAt ?? 0).getTime();
        return bTime - aTime;
      });
      setItems(sorted);
      const nextTokenFromApi = data?.data?.listEvents?.nextToken ?? null;
      pageTokensRef.current[targetPageIndex] = nextTokenFromApi;
      setHasNextPage(Boolean(nextTokenFromApi));
    } catch (err) {
      setErrorMessage(formatGraphqlClientError(err, 'Error cargando eventos.'));
    } finally {
      setIsLoading(false);
    }
  }, [debouncedTitleSearch, sortOption, statusFilter]);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedTitleSearch(titleSearch), 400);
    return () => window.clearTimeout(timer);
  }, [titleSearch]);

  useEffect(() => {
    if (!successMessage) return;
    const timer = window.setTimeout(() => setSuccessMessage(null), 2800);
    return () => window.clearTimeout(timer);
  }, [successMessage]);

  useEffect(() => {
    if (!didInitRef.current) {
      didInitRef.current = true;
      return;
    }
    const shouldSkip = pageIndex !== 1;
    skipNextPageFetchRef.current = shouldSkip;
    pageTokensRef.current = [null];
    setHasNextPage(false);
    setItems([]);
    setPageIndex(1);
    void fetchEvents(1);
  }, [debouncedTitleSearch, fetchEvents, sortOption, statusFilter]);

  useEffect(() => {
    if (skipNextPageFetchRef.current) {
      skipNextPageFetchRef.current = false;
      return;
    }
    void fetchEvents(pageIndex);
  }, [fetchEvents, pageIndex]);

  const openCreateModal = useCallback(() => {
    setModalMode('create');
    setForm(buildEmptyForm());
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setForm(buildEmptyForm());
  }, []);

  const openEditModal = useCallback(async (id: string) => {
    setModalMode('edit');
    setIsModalOpen(true);
    setForm(buildEmptyForm());
    setErrorMessage(null);
    try {
      const client = getGraphqlClient();
      const res: unknown = await client.graphql({
        query: getEvent,
        variables: { id },
        authMode: 'userPool',
      });
      const item = (res as { data?: { getEvent?: AdminEventRow | null } }).data?.getEvent;
      if (!item) {
        setErrorMessage('El evento no existe o fue eliminado.');
        return;
      }
      const tags = Array.isArray(item.tags) ? item.tags.filter((t): t is string => typeof t === 'string') : [];
      setForm({
        id: item.id,
        title: item.title ?? '',
        description: item.description ?? '',
        eventType: (item.eventType ?? '') as EventType | '',
        category: item.category ?? '',
        tagsComma: tags.join(', '),
        startLocal: toDateTimeLocalValue(item.startDateTime),
        endLocal: toDateTimeLocalValue(item.endDateTime),
        timezone: item.timezone ?? DEFAULT_TIMEZONE,
        location: item.location ?? '',
        isOnline: Boolean(item.isOnline),
        onlineUrl: item.onlineUrl ?? '',
        registrationUrl: item.registrationUrl ?? '',
        capacity: item.capacity != null ? String(item.capacity) : '',
        publishedAtLocal: toDateTimeLocalValue(item.publishedAt),
        status: item.status ?? EventStatus.DRAFT,
        highlight: Boolean(item.highlight),
        visible: item.visible !== false,
        coverImageUrl: item.coverImageUrl ?? null,
        coverImageFile: null,
      });
    } catch (err) {
      setErrorMessage(formatGraphqlClientError(err, 'No se pudo cargar el evento.'));
    }
  }, []);

  const handleFormChange = useCallback(<K extends keyof EventFormState>(key: K, value: EventFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleCoverPick = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Solo se permiten imágenes para la portada.');
      return;
    }
    setErrorMessage(null);
    setForm((prev) => ({ ...prev, coverImageFile: file }));
  }, []);

  const handleRemoveCover = useCallback(() => {
    setForm((prev) => ({ ...prev, coverImageUrl: null, coverImageFile: null }));
  }, []);

  const handleSave = useCallback(async () => {
    if (!form.title.trim() || !form.description.trim() || !form.startLocal) {
      setErrorMessage('Completa título, descripción y fecha de inicio.');
      return;
    }
    const startIso = toIsoFromDateTimeLocal(form.startLocal);
    if (!startIso) {
      setErrorMessage('La fecha de inicio no es válida.');
      return;
    }
    setIsSaving(true);
    setErrorMessage(null);
    try {
      let coverUrl = form.coverImageUrl;
      if (form.coverImageFile) {
        const prefix = form.id ? `events/${form.id}/cover` : `events/new/${Date.now()}/cover`;
        coverUrl = await uploadPublicFile(form.coverImageFile, prefix);
      }

      const endIso = form.endLocal ? toIsoFromDateTimeLocal(form.endLocal) : null;
      const publishedAt = toIsoFromDateTimeLocal(form.publishedAtLocal);
      const tags = parseTags(form.tagsComma);
      const capacityNum = form.capacity.trim() === '' ? null : Number(form.capacity);
      const capacity =
        capacityNum != null && !Number.isNaN(capacityNum) && Number.isFinite(capacityNum) ? Math.floor(capacityNum) : null;

      const client = getGraphqlClient();

      if (modalMode === 'create') {
        const input: CreateEventInput = {
          title: form.title.trim(),
          description: form.description.trim(),
          eventType: form.eventType || null,
          category: form.category.trim() || null,
          tags,
          startDateTime: startIso,
          endDateTime: endIso,
          timezone: form.timezone.trim() || DEFAULT_TIMEZONE,
          location: form.location.trim() || null,
          isOnline: form.isOnline,
          onlineUrl: form.onlineUrl.trim() || null,
          registrationUrl: form.registrationUrl.trim() || null,
          capacity,
          coverImageUrl: coverUrl,
          publishedAt,
          highlight: form.highlight,
          status: form.status,
          visible: form.visible,
        };
        await client.graphql({
          query: createEvent,
          variables: { input },
          authMode: 'userPool',
        });
        setSuccessMessage('Evento creado.');
      } else if (form.id) {
        const input: UpdateEventInput = {
          id: form.id,
          title: form.title.trim(),
          description: form.description.trim(),
          eventType: form.eventType || null,
          category: form.category.trim() || null,
          tags,
          startDateTime: startIso,
          endDateTime: endIso,
          timezone: form.timezone.trim() || DEFAULT_TIMEZONE,
          location: form.location.trim() || null,
          isOnline: form.isOnline,
          onlineUrl: form.onlineUrl.trim() || null,
          registrationUrl: form.registrationUrl.trim() || null,
          capacity,
          coverImageUrl: coverUrl,
          publishedAt,
          highlight: form.highlight,
          status: form.status,
          visible: form.visible,
        };
        await client.graphql({
          query: updateEvent,
          variables: { input },
          authMode: 'userPool',
        });
        setSuccessMessage('Evento actualizado.');
      }

      closeModal();
      pageTokensRef.current = [null];
      setPageIndex(1);
      await fetchEvents(1);
    } catch (err) {
      setErrorMessage(formatGraphqlClientError(err, 'No se pudo guardar el evento.'));
    } finally {
      setIsSaving(false);
    }
  }, [closeModal, fetchEvents, form, modalMode]);

  const handleDelete = useCallback(
    async (id: string, title: string) => {
      if (!window.confirm(`¿Eliminar el evento «${title}»? Esta acción no se puede deshacer.`)) return;
      setErrorMessage(null);
      try {
        const client = getGraphqlClient();
        await client.graphql({
          query: deleteEvent,
          variables: { input: { id } },
          authMode: 'userPool',
        });
        setSuccessMessage('Evento eliminado.');
        pageTokensRef.current = [null];
        setPageIndex(1);
        await fetchEvents(1);
      } catch (err) {
        setErrorMessage(formatGraphqlClientError(err, 'No se pudo eliminar el evento.'));
      }
    },
    [fetchEvents],
  );

  const [coverObjectUrl, setCoverObjectUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!form.coverImageFile) {
      setCoverObjectUrl(null);
      return;
    }
    const url = URL.createObjectURL(form.coverImageFile);
    setCoverObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [form.coverImageFile]);

  const coverPreviewUrl = coverObjectUrl ?? form.coverImageUrl;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-gray-600">Crea y publica eventos para la agenda pública en /agenda.</p>
          <p className="mt-1 text-xs text-gray-500">
            En la web solo aparecen eventos <strong className="font-medium text-gray-700">Publicados</strong>, con{' '}
            <strong className="font-medium text-gray-700">Visible en web</strong> activado y cuya fecha de publicación
            programada (si existe) ya haya llegado.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          Nuevo evento
        </button>
      </div>

      {successMessage ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900" role="status">
          {successMessage}
        </div>
      ) : null}

      {errorMessage ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900 whitespace-pre-wrap break-words">
          {errorMessage}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end">
        <label className="flex min-w-[200px] flex-1 flex-col gap-1 text-xs font-medium text-gray-700">
          Buscar por título
          <input
            type="search"
            value={titleSearch}
            onChange={(e) => setTitleSearch(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            placeholder="Ej. taller, webinar…"
            aria-label="Buscar eventos por título"
          />
        </label>
        <label className="flex w-full max-w-[200px] flex-col gap-1 text-xs font-medium text-gray-700">
          Estado
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter((e.target.value as Status | '') || '')}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            aria-label="Filtrar por estado"
          >
            <option value="">Todos</option>
            <option value={EventStatus.DRAFT}>Borrador</option>
            <option value={EventStatus.PUBLISHED}>Publicado</option>
            <option value={EventStatus.ARCHIVED}>Archivado</option>
          </select>
        </label>
        <label className="flex w-full max-w-[220px] flex-col gap-1 text-xs font-medium text-gray-700">
          Orden
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            aria-label="Ordenar listado"
          >
            <option value="startDesc">Inicio (más reciente primero)</option>
            <option value="startAsc">Inicio (más antiguo primero)</option>
            <option value="recent">Última edición</option>
            <option value="titleAsc">Título A–Z</option>
          </select>
        </label>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
          <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-600">
            <tr>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Inicio</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  Cargando…
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No hay eventos con estos filtros.
                </td>
              </tr>
            ) : (
              items.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/80">
                  <td className="px-4 py-3 font-medium text-gray-900">{row.title}</td>
                  <td className="px-4 py-3 text-gray-700">{getEventTypeLabelEs(row.eventType)}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {new Date(row.startDateTime).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${getStatusBadgeClasses(row.status)}`}
                    >
                      {getStatusLabel(row.status)}
                    </span>
                    {!row.visible ? (
                      <span className="ml-2 text-xs text-amber-700">Oculto</span>
                    ) : null}
                    {row.publishedAt && new Date(row.publishedAt).getTime() > Date.now() ? (
                      <span className="ml-2 block text-xs text-amber-800 sm:inline sm:ml-2">
                        Visible en web desde{' '}
                        {new Date(row.publishedAt).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1">
                      <button
                        type="button"
                        onClick={() => void openEditModal(row.id)}
                        className="text-primary hover:underline text-xs font-semibold"
                      >
                        Editar
                      </button>
                      {row.status === EventStatus.PUBLISHED && row.visible !== false ? (
                        <Link
                          to="/agenda"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-700 hover:underline text-xs font-semibold"
                        >
                          Ver en web
                        </Link>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => void handleDelete(row.id, row.title)}
                        className="text-red-700 hover:underline text-xs font-semibold"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          disabled={pageIndex <= 1 || isLoading}
          onClick={() => setPageIndex((p) => Math.max(1, p - 1))}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 disabled:opacity-40"
        >
          Anterior
        </button>
        <span className="text-sm text-gray-600">Página {pageIndex}</span>
        <button
          type="button"
          disabled={!hasNextPage || isLoading}
          onClick={() => setPageIndex((p) => p + 1)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 disabled:opacity-40"
        >
          Siguiente
        </button>
      </div>

      {isModalOpen ? (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-event-modal-title"
        >
          <button
            type="button"
            aria-label="Cerrar modal"
            className="absolute inset-0 bg-black/50"
            onClick={closeModal}
          />
          <div className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-gray-200 bg-white shadow-2xl sm:rounded-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <h2 id="admin-event-modal-title" className="text-lg font-bold text-gray-900">
                {modalMode === 'create' ? 'Nuevo evento' : 'Editar evento'}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                aria-label="Cerrar"
              >
                <span aria-hidden="true" className="text-xl leading-none">
                  ×
                </span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              <label className="flex flex-col gap-1 text-xs font-medium text-gray-700">
                Título
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleFormChange('title', e.target.value)}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  required
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-medium text-gray-700">
                Descripción
                <textarea
                  value={form.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  rows={5}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  required
                />
              </label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-xs font-medium text-gray-700">
                  Tipo
                  <select
                    value={form.eventType}
                    onChange={(e) => handleFormChange('eventType', (e.target.value || '') as EventType | '')}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  >
                    {EVENT_TYPE_SELECT.map((opt) => (
                      <option key={opt.label + String(opt.value)} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-xs font-medium text-gray-700">
                  Categoría
                  <select
                    value={form.category}
                    onChange={(e) => handleFormChange('category', e.target.value)}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    aria-label="Categoría del evento"
                  >
                    {categorySelectOptions.map((opt) => (
                      <option key={opt.value || '__empty__'} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="flex flex-col gap-1 text-xs font-medium text-gray-700">
                Etiquetas (separadas por coma)
                <input
                  type="text"
                  value={form.tagsComma}
                  onChange={(e) => handleFormChange('tagsComma', e.target.value)}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  placeholder="territorio, innovación"
                />
              </label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-xs font-medium text-gray-700">
                  Inicio (local)
                  <input
                    type="datetime-local"
                    value={form.startLocal}
                    onChange={(e) => handleFormChange('startLocal', e.target.value)}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    required
                  />
                </label>
                <label className="flex flex-col gap-1 text-xs font-medium text-gray-700">
                  Fin (opcional)
                  <input
                    type="datetime-local"
                    value={form.endLocal}
                    onChange={(e) => handleFormChange('endLocal', e.target.value)}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  />
                </label>
              </div>
              <label className="flex flex-col gap-1 text-xs font-medium text-gray-700">
                Zona horaria (IANA)
                <input
                  type="text"
                  value={form.timezone}
                  onChange={(e) => handleFormChange('timezone', e.target.value)}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-medium text-gray-700">
                Lugar
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => handleFormChange('location', e.target.value)}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-gray-800">
                <input
                  type="checkbox"
                  checked={form.isOnline}
                  onChange={(e) => handleFormChange('isOnline', e.target.checked)}
                  className="rounded border-gray-300"
                />
                Evento en línea
              </label>
              <label className="flex flex-col gap-1 text-xs font-medium text-gray-700">
                URL del evento en línea
                <input
                  type="url"
                  value={form.onlineUrl}
                  onChange={(e) => handleFormChange('onlineUrl', e.target.value)}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  placeholder="https://"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-medium text-gray-700">
                URL de inscripción
                <input
                  type="url"
                  value={form.registrationUrl}
                  onChange={(e) => handleFormChange('registrationUrl', e.target.value)}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  placeholder="https://"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-medium text-gray-700">
                Cupo (opcional)
                <input
                  type="number"
                  min={0}
                  value={form.capacity}
                  onChange={(e) => handleFormChange('capacity', e.target.value)}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-medium text-gray-700">
                Publicación programada (opcional)
                <input
                  type="datetime-local"
                  value={form.publishedAtLocal}
                  onChange={(e) => handleFormChange('publishedAtLocal', e.target.value)}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
                <span className="text-[11px] font-normal text-gray-500">Si está vacío, el evento puede mostrarse de inmediato al publicar.</span>
              </label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-xs font-medium text-gray-700">
                  Estado
                  <select
                    value={form.status}
                    onChange={(e) => handleFormChange('status', e.target.value as Status)}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  >
                    <option value={EventStatus.DRAFT}>Borrador</option>
                    <option value={EventStatus.PUBLISHED}>Publicado</option>
                    <option value={EventStatus.ARCHIVED}>Archivado</option>
                  </select>
                </label>
                <div className="flex flex-col gap-2 justify-end">
                  <label className="inline-flex items-center gap-2 text-sm text-gray-800">
                    <input
                      type="checkbox"
                      checked={form.highlight}
                      onChange={(e) => handleFormChange('highlight', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    Destacar
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm text-gray-800">
                    <input
                      type="checkbox"
                      checked={form.visible}
                      onChange={(e) => handleFormChange('visible', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    Visible en web
                  </label>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-700 mb-1">Imagen de portada</p>
                {coverPreviewUrl ? (
                  <div className="relative inline-block">
                    <img src={coverPreviewUrl} alt="" className="max-h-40 rounded-lg border object-cover" />
                    <button
                      type="button"
                      onClick={handleRemoveCover}
                      className="mt-2 text-xs font-semibold text-red-700 hover:underline"
                    >
                      Quitar imagen
                    </button>
                  </div>
                ) : null}
                <input type="file" accept="image/*" onChange={handleCoverPick} className="mt-2 block text-sm" />
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-gray-100 px-4 py-3">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={() => void handleSave()}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {isSaving ? 'Guardando…' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AdminEventsManager;
