import { type DragEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { uploadData } from 'aws-amplify/storage';
import { createAnnouncement, deleteAnnouncement, updateAnnouncement } from '../../graphql/mutations';
import { getAnnouncement, listAnnouncements } from '../../graphql/queries';
import type {
  CreateAnnouncementInput,
  ModelAnnouncementFilterInput,
  Status,
  UpdateAnnouncementInput,
} from '../../API';
import { Status as AnnouncementStatus } from '../../API';
import { getGraphqlClient } from '../../lib/amplifySetup';
import { buildS3PublicObjectUrl } from '../../lib/s3PublicUrl';

type AdminAnnouncement = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  type?: string | null;
  targetAudience?: string | null;
  category?: string | null;
  coverImageUrl?: string | null;
  attachmentUrls?: Array<string | null> | null;
  status: Status;
  highlight: boolean;
  authorName?: string | null;
  publishedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type AnnouncementFormState = {
  id?: string;
  title: string;
  type: string;
  targetAudience: string;
  category: string;
  content: string;
  authorName: string;
  publishedAtLocal: string;
  status: Status;
  highlight: boolean;
  slug: string;
  coverImageUrl: string | null;
  attachmentUrls: string[];
  mediaFiles: File[];
};

type SortOption = 'recent' | 'old' | 'titleAsc';
type HighlightFilter = 'all' | 'true' | 'false';

const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;
const DEFAULT_SORT: SortOption = 'recent';
const MAX_MEDIA_FILES = 4;
const ANNOUNCEMENT_TYPE_OPTIONS = [
  'Comunicado oficial',
  'Boletín informativo',
  'Convocatoria',
  'Aviso institucional',
  'Nota de prensa',
] as const;
const ANNOUNCEMENT_CATEGORY_OPTIONS = [
  'Institucional',
  'Proyecto',
  'Comunidad',
  'Sostenibilidad',
  'Investigación',
  'Eventos',
] as const;
const ANNOUNCEMENT_AUDIENCE_OPTIONS = [
  'Comunidad local',
  'Instituciones públicas',
  'Sector privado',
  'Academia',
  'Medios de comunicación',
  'Público general',
  'Aliados del proyecto',
] as const;

const sanitizeFileName = (name: string) =>
  name.replace(/[^\w.-]+/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '');

const uploadPublicFile = async (file: File, pathPrefix: string): Promise<string> => {
  const safeName = sanitizeFileName(file.name) || 'file';
  const fullPath = `public/${pathPrefix}/${Date.now()}-${safeName}`;
  const task = uploadData({ path: fullPath, data: file });
  await task.result;
  return buildS3PublicObjectUrl(fullPath);
};

const buildEmptyForm = (): AnnouncementFormState => ({
  title: '',
  type: '',
  targetAudience: '',
  category: '',
  content: '',
  authorName: '',
  publishedAtLocal: '',
  status: AnnouncementStatus.PUBLISHED,
  highlight: false,
  slug: '',
  coverImageUrl: null,
  attachmentUrls: [],
  mediaFiles: [],
});

const toSlug = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

const buildSummaryFromContent = (content: string): string => {
  const firstParagraph = content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .find((paragraph) => paragraph.length > 0);
  if (!firstParagraph) return '';
  const normalized = firstParagraph.replace(/\s+/g, ' ').trim();
  const words = normalized.split(' ');
  return words.length <= 35 ? normalized : `${words.slice(0, 35).join(' ')}...`;
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

const pickMatchingFiles = (files: FileList | File[], matcher: (file: File) => boolean): File[] =>
  Array.from(files).filter(matcher);

const getMediaFileKey = (file: File): string => `${file.name}-${file.lastModified}-${file.size}`;

const getStatusLabel = (status: Status): string => {
  switch (status) {
    case AnnouncementStatus.DRAFT:
      return 'Borrador';
    case AnnouncementStatus.PUBLISHED:
      return 'Publicado';
    case AnnouncementStatus.ARCHIVED:
      return 'Archivado';
    default:
      return String(status);
  }
};

const getStatusBadgeClasses = (status: Status): string => {
  switch (status) {
    case AnnouncementStatus.DRAFT:
      return 'border-yellow-200 bg-yellow-50 text-yellow-800';
    case AnnouncementStatus.PUBLISHED:
      return 'border-emerald-200 bg-emerald-50 text-emerald-800';
    case AnnouncementStatus.ARCHIVED:
      return 'border-gray-200 bg-gray-100 text-gray-700';
    default:
      return 'border-gray-200 bg-gray-100 text-gray-700';
  }
};

const isScheduledAnnouncement = (announcement: { publishedAt?: string | null }): boolean => {
  if (!announcement.publishedAt) return false;
  const scheduledTime = new Date(announcement.publishedAt).getTime();
  if (Number.isNaN(scheduledTime)) return false;
  return scheduledTime > Date.now();
};

const AdminAnnouncementsManager = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<AdminAnnouncement[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [form, setForm] = useState<AnnouncementFormState>(buildEmptyForm());
  const [isSaving, setIsSaving] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [principalImageKey, setPrincipalImageKey] = useState<string | null>(null);
  const [pendingImagePreviewUrls, setPendingImagePreviewUrls] = useState<Record<string, string>>({});

  const pageTokensRef = useRef<Array<string | null>>([null]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE_OPTIONS[0]);
  const [hasNextPage, setHasNextPage] = useState(false);

  const [titleSearch, setTitleSearch] = useState('');
  const [debouncedTitleSearch, setDebouncedTitleSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | ''>('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [highlightFilter, setHighlightFilter] = useState<HighlightFilter>('all');
  const [showScheduledOnly, setShowScheduledOnly] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>(DEFAULT_SORT);
  const skipNextPageFetchRef = useRef(false);
  const didInitRef = useRef(false);

  const fetchAnnouncements = useCallback(async (targetPageIndex: number) => {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const client = getGraphqlClient();
      const nextToken = pageTokensRef.current[targetPageIndex - 1] ?? null;
      const listFilter: ModelAnnouncementFilterInput | null =
        debouncedTitleSearch.trim() || statusFilter || typeFilter || categoryFilter || highlightFilter !== 'all' || showScheduledOnly
          ? {
            ...(debouncedTitleSearch.trim() ? { title: { contains: debouncedTitleSearch.trim() } } : {}),
            ...(statusFilter ? { status: { eq: statusFilter as Status } } : {}),
            ...(typeFilter.trim() ? { type: { contains: typeFilter.trim() } } : {}),
            ...(categoryFilter.trim() ? { category: { contains: categoryFilter.trim() } } : {}),
            ...(highlightFilter !== 'all' ? { highlight: { eq: highlightFilter === 'true' } } : {}),
            ...(showScheduledOnly ? { publishedAt: { gt: new Date().toISOString() } } : {}),
          }
          : null;

      const res: any = await client.graphql({
        query: listAnnouncements,
        variables: { filter: listFilter ?? undefined, limit: pageSize, nextToken },
        authMode: 'userPool',
      });

      const pageItems = (res?.data?.listAnnouncements?.items ?? []) as AdminAnnouncement[];
      const sorted = [...pageItems].sort((a, b) => {
        if (sortOption === 'titleAsc') return a.title.localeCompare(b.title, 'es', { sensitivity: 'base' });
        const aTime = new Date(a.publishedAt ?? a.createdAt ?? a.updatedAt ?? 0).getTime();
        const bTime = new Date(b.publishedAt ?? b.createdAt ?? b.updatedAt ?? 0).getTime();
        return sortOption === 'old' ? aTime - bTime : bTime - aTime;
      });

      setItems(sorted);
      const nextTokenFromApi = res?.data?.listAnnouncements?.nextToken ?? null;
      pageTokensRef.current[targetPageIndex] = nextTokenFromApi;
      setHasNextPage(Boolean(nextTokenFromApi));
    } catch (err) {
      const message =
        err instanceof Error ? err.stack ?? err.message : typeof err === 'string' ? err : 'Error cargando comunicados.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, [categoryFilter, debouncedTitleSearch, highlightFilter, pageSize, showScheduledOnly, sortOption, statusFilter, typeFilter]);

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
    void fetchAnnouncements(1);
  }, [categoryFilter, debouncedTitleSearch, fetchAnnouncements, highlightFilter, pageIndex, pageSize, showScheduledOnly, sortOption, statusFilter, typeFilter]);

  useEffect(() => {
    if (skipNextPageFetchRef.current) {
      skipNextPageFetchRef.current = false;
      return;
    }
    void fetchAnnouncements(pageIndex);
  }, [fetchAnnouncements, pageIndex]);

  const openCreateModal = useCallback(() => {
    setModalMode('create');
    setForm(buildEmptyForm());
    setShowAdvancedOptions(false);
    setPrincipalImageKey(null);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setForm(buildEmptyForm());
    setShowAdvancedOptions(false);
    setPrincipalImageKey(null);
  }, []);

  const openEditModal = useCallback(async (id: string) => {
    setModalMode('edit');
    setIsModalOpen(true);
    setForm(buildEmptyForm());
    setErrorMessage(null);
    try {
      const client = getGraphqlClient();
      const res: any = await client.graphql({
        query: getAnnouncement,
        variables: { id },
        authMode: 'userPool',
      });
      const item = res?.data?.getAnnouncement as AdminAnnouncement | null;
      if (!item) {
        setErrorMessage('El comunicado no existe o fue eliminado.');
        return;
      }
      setForm({
        id: item.id,
        title: item.title ?? '',
        type: item.type ?? '',
        targetAudience: item.targetAudience ?? '',
        category: item.category ?? '',
        content: item.body ?? '',
        authorName: item.authorName ?? '',
        publishedAtLocal: toDateTimeLocalValue(item.publishedAt),
        status: item.status ?? AnnouncementStatus.PUBLISHED,
        highlight: Boolean(item.highlight),
        slug: item.slug ?? '',
        coverImageUrl: item.coverImageUrl ?? null,
        attachmentUrls: Array.isArray(item.attachmentUrls)
          ? item.attachmentUrls.filter((u): u is string => typeof u === 'string')
          : [],
        mediaFiles: [],
      });
      setShowAdvancedOptions(Boolean(item.type || item.category || item.targetAudience || item.authorName));
      if (item.coverImageUrl) {
        setPrincipalImageKey(`existing:${item.coverImageUrl}`);
      } else {
        setPrincipalImageKey(null);
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'No se pudo cargar el comunicado.');
    }
  }, []);

  const handleFormChange = useCallback(<K extends keyof AnnouncementFormState>(key: K, value: AnnouncementFormState[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'title') next.slug = toSlug(String(value));
      return next;
    });
  }, []);

  const handleMediaPick = useCallback((files: FileList | null) => {
    const picked = files ? Array.from(files) : [];
    if (picked.length === 0) return;
    setForm((prev) => {
      const existingCount = (prev.coverImageUrl ? 1 : 0) + prev.attachmentUrls.length;
      const remainingSlots = Math.max(0, MAX_MEDIA_FILES - existingCount - prev.mediaFiles.length);
      if (remainingSlots === 0) {
        setErrorMessage(`Máximo ${MAX_MEDIA_FILES} imágenes por comunicado.`);
        return prev;
      }
      const accepted = picked.filter((f) => f.type.startsWith('image/')).slice(0, remainingSlots);
      if (accepted.length === 0) {
        setErrorMessage('Solo se permiten imágenes.');
        return prev;
      }
      if (accepted.length < picked.length) {
        setErrorMessage(`Solo se agregaron ${accepted.length} archivo(s). Máximo ${MAX_MEDIA_FILES} por comunicado.`);
      } else {
        setErrorMessage(null);
      }
      return { ...prev, mediaFiles: [...prev.mediaFiles, ...accepted] };
    });
  }, []);

  const handleDropMedia = useCallback((event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    const dropped = pickMatchingFiles(event.dataTransfer.files, (file) => file.type.startsWith('image/'));
    if (dropped.length === 0) return;
    setForm((prev) => {
      const existingCount = (prev.coverImageUrl ? 1 : 0) + prev.attachmentUrls.length;
      const remainingSlots = Math.max(0, MAX_MEDIA_FILES - existingCount - prev.mediaFiles.length);
      if (remainingSlots === 0) {
        setErrorMessage(`Máximo ${MAX_MEDIA_FILES} imágenes por comunicado.`);
        return prev;
      }
      const accepted = dropped.slice(0, remainingSlots);
      if (accepted.length < dropped.length) {
        setErrorMessage(`Solo se agregaron ${accepted.length} archivo(s). Máximo ${MAX_MEDIA_FILES} por comunicado.`);
      } else {
        setErrorMessage(null);
      }
      return { ...prev, mediaFiles: [...prev.mediaFiles, ...accepted] };
    });
  }, []);

  const handleRemoveCoverImage = useCallback(() => {
    setForm((prev) => ({ ...prev, coverImageUrl: null }));
    setPrincipalImageKey((prev) => (prev?.startsWith('existing:') ? null : prev));
  }, []);

  const handleRemoveAttachmentImage = useCallback((urlToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      attachmentUrls: prev.attachmentUrls.filter((url) => url !== urlToRemove),
    }));
    setPrincipalImageKey((prev) => (prev === `existing:${urlToRemove}` ? null : prev));
  }, []);

  const handleRemovePendingMediaFile = useCallback((keyToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      mediaFiles: prev.mediaFiles.filter((file) => getMediaFileKey(file) !== keyToRemove),
    }));
    setPrincipalImageKey((prev) => (prev === `new:${keyToRemove}` ? null : prev));
    setErrorMessage(null);
  }, []);

  useEffect(() => {
    const nextPreviews: Record<string, string> = {};
    form.mediaFiles.forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const key = getMediaFileKey(file);
      nextPreviews[key] = URL.createObjectURL(file);
    });

    setPendingImagePreviewUrls(nextPreviews);
    return () => {
      Object.values(nextPreviews).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [form.mediaFiles]);

  const imagePreviewEntries = useMemo<Array<{ key: string; url: string; isExisting: boolean; fileName?: string }>>(() => {
    const existing = [
      ...(form.coverImageUrl ? [{ key: `existing:${form.coverImageUrl}`, url: form.coverImageUrl, isExisting: true }] : []),
      ...form.attachmentUrls
        .filter((url) => /\.(png|jpe?g|webp|gif|bmp|svg)(\?.*)?$/i.test(url))
        .map((url) => ({ key: `existing:${url}`, url, isExisting: true })),
    ];

    const pending = form.mediaFiles.map((file) => {
      const mediaKey = getMediaFileKey(file);
      return { key: `new:${mediaKey}`, url: pendingImagePreviewUrls[mediaKey] ?? '', isExisting: false, fileName: file.name };
    }).filter((entry) => entry.url);

    return [...existing, ...pending];
  }, [form.attachmentUrls, form.coverImageUrl, form.mediaFiles, pendingImagePreviewUrls]);

  const activePreviewEntry = useMemo(() => {
    if (imagePreviewEntries.length === 0) return null;
    const selected = principalImageKey ? imagePreviewEntries.find((entry) => entry.key === principalImageKey) ?? null : null;
    return selected ?? imagePreviewEntries[0];
  }, [imagePreviewEntries, principalImageKey]);

  const validateForm = useCallback(() => {
    if (!form.title.trim()) return 'El título es obligatorio.';
    if (!form.content.trim()) return 'El contenido es obligatorio.';
    if (!form.slug.trim()) return 'El slug no puede estar vacío.';
    return null;
  }, [form]);

  const handleSave = useCallback(async () => {
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    try {
      const client = getGraphqlClient();
      const mediaPrefix = crypto.randomUUID();

      let coverImageUrl = form.coverImageUrl;
      let attachmentUrls = [...form.attachmentUrls];
      const uploadedImageUrlByKey = new Map<string, string>();
      if (form.mediaFiles.length > 0) {
        for (let i = 0; i < form.mediaFiles.length; i += 1) {
          const file = form.mediaFiles[i];
          const url = await uploadPublicFile(file, `announcements/${mediaPrefix}/images/${i}`);
          uploadedImageUrlByKey.set(getMediaFileKey(file), url);
        }
      }

      const existingImages = [
        ...(coverImageUrl ? [coverImageUrl] : []),
        ...attachmentUrls.filter((url) => url !== coverImageUrl),
      ];
      const uploadedImageUrls = Array.from(uploadedImageUrlByKey.values());
      const allImages = [...existingImages, ...uploadedImageUrls];

      if (principalImageKey?.startsWith('existing:')) {
        const selectedExistingUrl = principalImageKey.replace('existing:', '');
        if (allImages.includes(selectedExistingUrl)) {
          coverImageUrl = selectedExistingUrl;
        }
      } else if (principalImageKey?.startsWith('new:')) {
        const key = principalImageKey.replace('new:', '');
        const uploadedUrl = uploadedImageUrlByKey.get(key);
        if (uploadedUrl) {
          coverImageUrl = uploadedUrl;
        }
      }

      if (!coverImageUrl && allImages.length > 0) {
        coverImageUrl = allImages[0];
      }

      attachmentUrls = allImages.filter((url) => url !== coverImageUrl);

      const body = form.content.trim();
      const summary = buildSummaryFromContent(body);
      const publishedAt = toIsoFromDateTimeLocal(form.publishedAtLocal);

      if (modalMode === 'create') {
        const input: CreateAnnouncementInput = {
          title: form.title.trim(),
          slug: form.slug.trim(),
          summary,
          body,
          type: form.type.trim() || null,
          targetAudience: form.targetAudience.trim() || null,
          category: form.category.trim() || null,
          tags: null,
          coverImageUrl,
          attachmentUrls: attachmentUrls.length > 0 ? attachmentUrls : null,
          status: form.status,
          highlight: form.highlight,
          authorName: form.authorName.trim() || null,
          publishedAt,
        };
        await client.graphql({ query: createAnnouncement, variables: { input }, authMode: 'userPool' });
      } else {
        if (!form.id) throw new Error('Falta id de comunicado.');
        const input: UpdateAnnouncementInput = {
          id: form.id,
          title: form.title.trim(),
          slug: form.slug.trim(),
          summary,
          body,
          type: form.type.trim() || null,
          targetAudience: form.targetAudience.trim() || null,
          category: form.category.trim() || null,
          tags: null,
          coverImageUrl,
          attachmentUrls: attachmentUrls.length > 0 ? attachmentUrls : null,
          status: form.status,
          highlight: form.highlight,
          authorName: form.authorName.trim() || null,
          publishedAt,
        };
        await client.graphql({ query: updateAnnouncement, variables: { input }, authMode: 'userPool' });
      }

      closeModal();
      await fetchAnnouncements(pageIndex);
      setSuccessMessage(modalMode === 'create' ? 'Comunicado creado correctamente.' : 'Comunicado actualizado correctamente.');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Error guardando comunicado.');
    } finally {
      setIsSaving(false);
    }
  }, [closeModal, fetchAnnouncements, form, modalMode, pageIndex, principalImageKey, validateForm]);

  const handleDelete = useCallback(async (id: string) => {
    const ok = window.confirm('¿Seguro que quieres eliminar este comunicado?');
    if (!ok) return;
    setIsSaving(true);
    setErrorMessage(null);
    try {
      const client = getGraphqlClient();
      await client.graphql({ query: deleteAnnouncement, variables: { input: { id } }, authMode: 'userPool' });
      await fetchAnnouncements(pageIndex);
      setSuccessMessage('Comunicado eliminado correctamente.');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Error eliminando comunicado.');
    } finally {
      setIsSaving(false);
    }
  }, [fetchAnnouncements, pageIndex]);

  const handleClearFilters = useCallback(() => {
    setTitleSearch('');
    setDebouncedTitleSearch('');
    setStatusFilter('');
    setTypeFilter('');
    setCategoryFilter('');
    setHighlightFilter('all');
    setShowScheduledOnly(false);
    setSortOption(DEFAULT_SORT);
    pageTokensRef.current = [null];
    setHasNextPage(false);
    setItems([]);
    setPageIndex(1);
  }, []);

  return (
    <section aria-label="Gestión de Comunicados">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Comunicados</h2>
          <p className="text-sm text-gray-600">Publica comunicados oficiales para la sección pública.</p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        >
          Nuevo comunicado
        </button>
      </div>

      {errorMessage && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div>}
      {successMessage && <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{successMessage}</div>}

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="p-4 sm:p-5">
          <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-6">
            <input
              value={titleSearch}
              onChange={(e) => setTitleSearch(e.target.value)}
              placeholder="Buscar título…"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm xl:col-span-2"
            />
            <input
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              placeholder="Tipo"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <input
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              placeholder="Categoría"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter((e.target.value as Status | '') ?? '')}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Estado: Todos</option>
              <option value={AnnouncementStatus.DRAFT}>Borrador</option>
              <option value={AnnouncementStatus.PUBLISHED}>Publicado</option>
              <option value={AnnouncementStatus.ARCHIVED}>Archivado</option>
            </select>
            <select
              value={highlightFilter}
              onChange={(e) => setHighlightFilter(e.target.value as HighlightFilter)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="all">Destacada: Todas</option>
              <option value="true">Destacadas</option>
              <option value="false">No destacadas</option>
            </select>
          </div>

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Orden</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="recent">Más recientes</option>
                <option value="old">Más antiguas</option>
                <option value="titleAsc">Título A-Z</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowScheduledOnly((prev) => !prev)}
                className={`rounded-lg px-3 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
                  showScheduledOnly
                    ? 'border border-primary bg-primary text-white'
                    : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
                aria-pressed={showScheduledOnly}
                aria-label={showScheduledOnly ? 'Ver todos los comunicados' : 'Ver comunicados programados'}
              >
                {showScheduledOnly ? 'Ver todas' : 'Ver programadas'}
              </button>
              <span className="text-sm text-gray-600">Filas</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleClearFilters}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Limpiar
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-100">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-600">
                <tr>
                  <th className="px-4 py-3">Título</th>
                  <th className="px-4 py-3">Autor</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr><td colSpan={6} className="px-4 py-6 text-gray-600">Cargando comunicados...</td></tr>
                ) : items.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-6 text-gray-600">No hay comunicados con los filtros actuales.</td></tr>
                ) : items.map((a) => {
                  const isScheduled = isScheduledAnnouncement(a);
                  return (
                  <tr key={a.id} className="group border-t border-gray-100 transition-colors hover:bg-gray-50/60">
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-3">
                        {(() => {
                          const previewImage = a.coverImageUrl ?? a.attachmentUrls?.find((url) => typeof url === 'string' && url.trim().length > 0) ?? null;
                          if (!previewImage) {
                            return <div className="h-12 w-16 shrink-0 rounded-md border border-dashed border-gray-200 bg-gray-50" />;
                          }
                          return (
                            <img
                              src={previewImage}
                              alt={a.title}
                              className="h-12 w-16 shrink-0 rounded-md border border-gray-200 object-cover"
                              loading="lazy"
                            />
                          );
                        })()}
                        <div>
                          <div title={a.title} className="font-semibold text-gray-900 line-clamp-2">{a.title}</div>
                          <div className="mt-1 text-[11px] text-gray-500">/{a.slug}</div>
                        </div>
                      </div>
                      {a.highlight && <span className="mt-1 inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">Destacada</span>}
                      {isScheduled && <span className="mt-1 ml-2 inline-flex rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-sky-700">Programado</span>}
                    </td>
                    <td className="px-4 py-4 text-gray-700">{a.authorName?.trim() ? a.authorName : '-'}</td>
                    <td className="px-4 py-4 text-gray-700">{a.type ?? '-'}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full border px-2 py-1 text-[11px] font-semibold ${getStatusBadgeClasses(a.status)}`}>
                        {getStatusLabel(a.status)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-700">{a.publishedAt ? new Date(a.publishedAt).toLocaleDateString('es-CO') : '-'}</td>
                    <td className="px-4 py-4 text-right">
                      <div className="inline-flex gap-2">
                        <button type="button" onClick={() => void openEditModal(a.id)} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">Editar</button>
                        <button type="button" onClick={() => void handleDelete(a.id)} className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50">Eliminar</button>
                      </div>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-gray-600">Mostrando {items.length} comunicado(s) · Página {pageIndex}</span>
            <div className="inline-flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPageIndex((p) => Math.max(1, p - 1))}
                disabled={pageIndex <= 1}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                type="button"
                onClick={() => setPageIndex((p) => p + 1)}
                disabled={!hasNextPage}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm px-4 py-8">
          <div className="w-full max-w-6xl overflow-hidden rounded-xl bg-white shadow-xl" role="dialog" aria-modal="true" aria-label="Crear o editar comunicado">
            <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-5 py-4">
              <h3 className="text-base font-bold text-gray-900">{modalMode === 'create' ? 'Crear comunicado' : 'Editar comunicado'}</h3>
              <button
                type="button"
                onClick={closeModal}
                disabled={isSaving}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cerrar
              </button>
            </div>
            <div className="max-h-[85vh] overflow-auto px-5 py-5">
              <form
                className="space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  void handleSave();
                }}
              >
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                  <div className="space-y-5 lg:col-span-7">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="announcementTitle">Título</label>
                      <input id="announcementTitle" type="text" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.title} onChange={(e) => handleFormChange('title', e.target.value)} disabled={isSaving} required />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="announcementContent">Contenido</label>
                      <textarea id="announcementContent" rows={9} className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.content} onChange={(e) => handleFormChange('content', e.target.value)} disabled={isSaving} placeholder="Escribe el comunicado..." required />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:items-end">
                      <div className="h-full">
                        <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="announcementPublishedAt">Fecha publicación</label>
                        <input id="announcementPublishedAt" type="datetime-local" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.publishedAtLocal} onChange={(e) => handleFormChange('publishedAtLocal', e.target.value)} disabled={isSaving} />
                      </div>
                      <div className="h-full">
                        <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="announcementStatus">Estado</label>
                        <select id="announcementStatus" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.status} onChange={(e) => handleFormChange('status', e.target.value as Status)} disabled={isSaving}>
                          <option value={AnnouncementStatus.DRAFT}>Borrador</option>
                          <option value={AnnouncementStatus.PUBLISHED}>Publicado</option>
                          <option value={AnnouncementStatus.ARCHIVED}>Archivado</option>
                        </select>
                      </div>
                      <div className="flex h-full items-end sm:justify-center">
                        <label htmlFor="announcementHighlight" className="flex min-h-[42px] w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 sm:w-auto sm:min-w-[180px]">
                          <input id="announcementHighlight" type="checkbox" className="h-4 w-4" checked={form.highlight} onChange={(e) => handleFormChange('highlight', e.target.checked)} disabled={isSaving} />
                          <span>Destacada</span>
                        </label>
                      </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-gray-50/80">
                      <button
                        type="button"
                        onClick={() => setShowAdvancedOptions((prev) => !prev)}
                        className="flex w-full items-center justify-between px-4 py-3 text-left"
                        aria-expanded={showAdvancedOptions}
                        aria-controls="announcementAdvancedOptions"
                      >
                        <span className="text-sm font-semibold text-gray-800">Opciones avanzadas</span>
                        <span className="text-xs font-medium text-gray-500">{showAdvancedOptions ? 'Ocultar' : 'Mostrar'}</span>
                      </button>
                      {showAdvancedOptions && (
                        <div id="announcementAdvancedOptions" className="space-y-4 border-t border-gray-200 px-4 py-4">
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                              <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="announcementType">Tipo</label>
                              <select
                                id="announcementType"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                value={form.type}
                                onChange={(e) => handleFormChange('type', e.target.value)}
                                disabled={isSaving}
                              >
                                <option value="">Selecciona un tipo</option>
                                {ANNOUNCEMENT_TYPE_OPTIONS.map((typeOption) => (
                                  <option key={typeOption} value={typeOption}>
                                    {typeOption}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="announcementCategory">Categoría</label>
                              <select
                                id="announcementCategory"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                value={form.category}
                                onChange={(e) => handleFormChange('category', e.target.value)}
                                disabled={isSaving}
                              >
                                <option value="">Selecciona una categoría</option>
                                {ANNOUNCEMENT_CATEGORY_OPTIONS.map((categoryOption) => (
                                  <option key={categoryOption} value={categoryOption}>
                                    {categoryOption}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                              <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="announcementAudience">Audiencia objetivo</label>
                              <select
                                id="announcementAudience"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                value={form.targetAudience}
                                onChange={(e) => handleFormChange('targetAudience', e.target.value)}
                                disabled={isSaving}
                              >
                                <option value="">Selecciona una audiencia</option>
                                {ANNOUNCEMENT_AUDIENCE_OPTIONS.map((audienceOption) => (
                                  <option key={audienceOption} value={audienceOption}>
                                    {audienceOption}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="announcementAuthor">Autor</label>
                              <input id="announcementAuthor" type="text" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.authorName} onChange={(e) => handleFormChange('authorName', e.target.value)} disabled={isSaving} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="announcementMediaFiles" className="mb-2 block text-sm font-medium text-gray-700">
                        Imágenes del comunicado (máximo {MAX_MEDIA_FILES})
                      </label>
                      <label
                        htmlFor="announcementMediaFiles"
                        className="group block cursor-pointer rounded-xl border-2 border-dashed border-primary/40 bg-gradient-to-br from-primary/5 to-white p-6 transition hover:border-primary hover:shadow-sm"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDropMedia}
                      >
                        <input
                          id="announcementMediaFiles"
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => handleMediaPick(e.target.files)}
                          disabled={isSaving}
                        />
                        <p className="text-sm font-semibold text-secondary-[bosques-nublados]">
                          Arrastra imágenes aquí o haz clic para seleccionarlas
                        </p>
                        <p className="mt-1 text-xs text-gray-600">
                          Podrás elegir una imagen principal para el comunicado.
                        </p>
                      </label>
                    </div>

                  </div>

                  <aside className="rounded-xl border border-gray-200 bg-gray-50 p-3 lg:col-span-5">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Vista previa</p>
                    {activePreviewEntry ? (
                      <div className="space-y-3">
                        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                          <img src={activePreviewEntry.url} alt="Imagen principal seleccionada" className="h-56 w-full object-cover" />
                        </div>
                        <p className="text-xs text-gray-600">
                          Imagen principal:
                          <span className="ml-1 font-semibold text-gray-700">
                            {activePreviewEntry.isExisting ? 'Archivo existente' : (activePreviewEntry.fileName ?? 'Nueva imagen')}
                          </span>
                        </p>
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {imagePreviewEntries.map((entry) => (
                            <button
                              key={entry.key}
                              type="button"
                              onClick={() => setPrincipalImageKey(entry.key)}
                              disabled={isSaving}
                              className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-md border-2 ${
                                activePreviewEntry.key === entry.key ? 'border-primary' : 'border-transparent'
                              }`}
                              title={entry.isExisting ? 'Imagen existente' : (entry.fileName ?? 'Nueva imagen')}
                            >
                              <img src={entry.url} alt="Miniatura" className="h-full w-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-lg border border-dashed border-gray-300 bg-white px-3 py-8 text-center text-xs text-gray-500">
                        Aquí verás la imagen principal y sus miniaturas cuando subas archivos.
                      </div>
                    )}

                    {(form.coverImageUrl || form.attachmentUrls.length > 0 || form.mediaFiles.length > 0) && (
                      <div className="mt-3 space-y-2 rounded-lg border border-gray-200 bg-white p-2">
                        {form.coverImageUrl && (
                          <div className="flex items-center justify-between gap-2 rounded-md bg-gray-50 px-2 py-1">
                            <div className="flex min-w-0 items-center gap-2">
                              <span className="inline-flex rounded bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">Principal actual</span>
                              <span className="truncate text-xs text-gray-700">Imagen existente</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setPrincipalImageKey(`existing:${form.coverImageUrl}`)}
                                disabled={isSaving}
                                className={`rounded-md border px-2 py-1 text-xs font-semibold ${
                                  principalImageKey === `existing:${form.coverImageUrl}`
                                    ? 'border-primary bg-primary text-white'
                                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                Principal
                              </button>
                              <button
                                type="button"
                                onClick={handleRemoveCoverImage}
                                disabled={isSaving}
                                className="rounded-md border border-red-200 bg-white px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                              >
                                Quitar
                              </button>
                            </div>
                          </div>
                        )}

                        {form.attachmentUrls.map((url) => (
                          <div key={url} className="flex items-center justify-between gap-2 rounded-md bg-gray-50 px-2 py-1">
                            <span className="truncate text-xs text-gray-700">Imagen existente</span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setPrincipalImageKey(`existing:${url}`)}
                                disabled={isSaving}
                                className={`rounded-md border px-2 py-1 text-xs font-semibold ${
                                  principalImageKey === `existing:${url}`
                                    ? 'border-primary bg-primary text-white'
                                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                Principal
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveAttachmentImage(url)}
                                disabled={isSaving}
                                className="rounded-md border border-red-200 bg-white px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                              >
                                Quitar
                              </button>
                            </div>
                          </div>
                        ))}

                        {form.mediaFiles.map((file) => {
                          const fileKey = getMediaFileKey(file);
                          return (
                            <div key={fileKey} className="flex items-center justify-between gap-2 rounded-md bg-gray-50 px-2 py-1">
                              <span className="truncate text-xs text-gray-700">{file.name}</span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setPrincipalImageKey(`new:${fileKey}`)}
                                  disabled={isSaving}
                                  className={`rounded-md border px-2 py-1 text-xs font-semibold ${
                                    principalImageKey === `new:${fileKey}`
                                      ? 'border-primary bg-primary text-white'
                                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                                  }`}
                                >
                                  Principal
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemovePendingMediaFile(fileKey)}
                                  disabled={isSaving}
                                  className="rounded-md border border-red-200 bg-white px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                                >
                                  Quitar
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </aside>
                </div>

                {errorMessage && (
                  <p className="text-sm text-red-700" role="alert">
                    {errorMessage}
                  </p>
                )}

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button type="button" onClick={closeModal} disabled={isSaving} className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 disabled:cursor-not-allowed disabled:opacity-60">Cancelar</button>
                  <button type="submit" disabled={isSaving} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60">
                    {isSaving ? 'Guardando...' : modalMode === 'create' ? 'Crear comunicado' : 'Guardar cambios'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminAnnouncementsManager;

