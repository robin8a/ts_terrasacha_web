import { type DragEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createNews, deleteNews, updateNews } from '../../graphql/mutations';
import { getNews, listNews } from '../../graphql/queries';
import { uploadData } from 'aws-amplify/storage';
import type { CreateNewsInput, ModelNewsFilterInput, Status, UpdateNewsInput } from '../../API';
import { Status as NewsStatus } from '../../API';
import { getGraphqlClient } from '../../lib/amplifySetup';
import { buildS3PublicObjectUrl } from '../../lib/s3PublicUrl';

type AdminNews = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  category?: string | null;
  coverImageUrl?: string | null;
  galleryImageUrls?: Array<string | null> | null;
  videoUrl?: string | null;
  status: Status;
  highlight: boolean;
  authorName?: string | null;
  publishedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

const sanitizeFileName = (name: string) =>
  name.replace(/[^\w.-]+/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '');

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

const toSlug = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

const uploadPublicFile = async (file: File, pathPrefix: string): Promise<string> => {
  const safeName = sanitizeFileName(file.name) || 'file';
  const fullPath = `public/${pathPrefix}/${Date.now()}-${safeName}`;
  const task = uploadData({ path: fullPath, data: file });
  await task.result;
  return buildS3PublicObjectUrl(fullPath);
};

type NewsFormState = {
  id?: string;
  title: string;
  category: string;
  content: string;
  authorName: string;
  publishedAtLocal: string;
  status: Status;
  highlight: boolean;
  slug: string;

  coverImageUrl: string | null;
  galleryImageUrls: string[];
  videoUrl: string | null;
  mediaFiles: File[];
};

const buildEmptyForm = (): NewsFormState => ({
  title: '',
  category: '',
  content: '',
  authorName: '',
  publishedAtLocal: '',
  status: NewsStatus.PUBLISHED,
  highlight: false,
  slug: '',
  coverImageUrl: null,
  galleryImageUrls: [],
  videoUrl: null,
  mediaFiles: [],
});

const buildSummaryFromContent = (content: string): string => {
  const normalized = content.replace(/\s+/g, ' ').trim();
  if (!normalized) return '';

  const words = normalized.split(' ');
  const maxWords = 35;
  if (words.length <= maxWords) return normalized;
  return `${words.slice(0, maxWords).join(' ')}...`;
};

const pickMatchingFiles = (files: FileList | File[], matcher: (file: File) => boolean): File[] =>
  Array.from(files).filter(matcher);

const getMediaFileKey = (file: File): string => `${file.name}-${file.lastModified}-${file.size}`;
const MAX_MEDIA_FILES = 4;

const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;
const CATEGORY_OPTIONS = ['Tecnología', 'Innovación', 'Sostenibilidad', 'Alianzas', 'Impacto'] as const;
type SortOption = 'recent' | 'old' | 'titleAsc';
type HighlightFilter = 'all' | 'true' | 'false';

const DEFAULT_SORT: SortOption = 'recent';

const getNewsTimeMs = (news: { publishedAt?: string | null; createdAt?: string | null; updatedAt?: string | null }): number => {
  const iso = news.publishedAt ?? news.createdAt ?? news.updatedAt ?? null;
  if (!iso) return 0;
  const ms = new Date(iso).getTime();
  return Number.isNaN(ms) ? 0 : ms;
};

const getStatusLabel = (status: Status): string => {
  switch (status) {
    case NewsStatus.DRAFT:
      return 'Borrador';
    case NewsStatus.PUBLISHED:
      return 'Publicado';
    case NewsStatus.ARCHIVED:
      return 'Archivado';
    default:
      return String(status);
  }
};

const getStatusBadgeClasses = (status: Status): string => {
  switch (status) {
    case NewsStatus.DRAFT:
      return 'border-yellow-200 bg-yellow-50 text-yellow-800';
    case NewsStatus.PUBLISHED:
      return 'border-emerald-200 bg-emerald-50 text-emerald-800';
    case NewsStatus.ARCHIVED:
      return 'border-gray-200 bg-gray-100 text-gray-700';
    default:
      return 'border-gray-200 bg-gray-100 text-gray-700';
  }
};

const AdminNewsManager = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<AdminNews[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [form, setForm] = useState<NewsFormState>(buildEmptyForm());
  const [isSaving, setIsSaving] = useState(false);
  const [principalImageKey, setPrincipalImageKey] = useState<string | null>(null);
  const [pendingImagePreviewUrls, setPendingImagePreviewUrls] = useState<Record<string, string>>({});

  const pageTokensRef = useRef<Array<string | null>>([null]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE_OPTIONS[0]);
  const [hasNextPage, setHasNextPage] = useState(false);

  const [titleSearch, setTitleSearch] = useState('');
  const [debouncedTitleSearch, setDebouncedTitleSearch] = useState('');

  const [statusFilter, setStatusFilter] = useState<Status | ''>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [highlightFilter, setHighlightFilter] = useState<HighlightFilter>('all');

  const [sortOption, setSortOption] = useState<SortOption>(DEFAULT_SORT);

  const skipNextPageFetchRef = useRef(false);

  const fetchNews = useCallback(async (targetPageIndex: number) => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const client = getGraphqlClient();
      const nextToken = pageTokensRef.current[targetPageIndex - 1] ?? null;

      const listFilter: ModelNewsFilterInput | null =
        debouncedTitleSearch.trim() || statusFilter || categoryFilter || highlightFilter !== 'all'
          ? {
            ...(debouncedTitleSearch.trim()
              ? { title: { contains: debouncedTitleSearch.trim() } }
              : {}),
            ...(statusFilter ? { status: { eq: statusFilter as Status } } : {}),
            ...(categoryFilter ? { category: { eq: categoryFilter } } : {}),
            ...(highlightFilter !== 'all' ? { highlight: { eq: highlightFilter === 'true' } } : {}),
          }
          : null;

      const res: any = await client.graphql({
        query: listNews,
        variables: {
          filter: listFilter ?? undefined,
          limit: pageSize,
          nextToken,
        },
        authMode: 'userPool',
      });

      if (Array.isArray(res?.errors) && res.errors.length > 0) {
        throw new Error(`listNews GraphQL errors: ${JSON.stringify(res.errors)}`);
      }

      const pageItems = (res?.data?.listNews?.items ?? []) as AdminNews[];
      const sorted = [...pageItems].sort((a, b) => {
        if (sortOption === 'titleAsc') {
          return a.title.localeCompare(b.title, 'es', { sensitivity: 'base' });
        }

        const aTime = getNewsTimeMs(a);
        const bTime = getNewsTimeMs(b);
        return sortOption === 'old' ? aTime - bTime : bTime - aTime;
      });

      setItems(sorted);
      const nextTokenFromApi = res?.data?.listNews?.nextToken ?? null;
      pageTokensRef.current[targetPageIndex] = nextTokenFromApi;
      setHasNextPage(Boolean(nextTokenFromApi));
    } catch (err) {
      const message =
        err instanceof Error ? err.stack ?? err.message : typeof err === 'string' ? err : 'Error cargando noticias.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, [categoryFilter, debouncedTitleSearch, highlightFilter, pageSize, sortOption, statusFilter]);

  useEffect(() => {
    const handle = window.setTimeout(() => setDebouncedTitleSearch(titleSearch), 400);
    return () => window.clearTimeout(handle);
  }, [titleSearch]);

  useEffect(() => {
    if (!successMessage) return;
    const timer = window.setTimeout(() => setSuccessMessage(null), 2800);
    return () => window.clearTimeout(timer);
  }, [successMessage]);

  const didInitRef = useRef(false);

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
    void fetchNews(1);
  }, [categoryFilter, debouncedTitleSearch, fetchNews, highlightFilter, pageIndex, pageSize, sortOption, statusFilter]);

  useEffect(() => {
    if (skipNextPageFetchRef.current) {
      skipNextPageFetchRef.current = false;
      return;
    }
    void fetchNews(pageIndex);
  }, [fetchNews, pageIndex]);

  const openCreateModal = useCallback(() => {
    setModalMode('create');
    setForm(buildEmptyForm());
    setPrincipalImageKey(null);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setForm(buildEmptyForm());
    setPrincipalImageKey(null);
  }, []);

  const openEditModal = useCallback(
    async (id: string) => {
      setModalMode('edit');
      setIsModalOpen(true);
      setForm(buildEmptyForm());
      setErrorMessage(null);

      try {
        const client = getGraphqlClient();
        const res = await client.graphql({
          query: getNews,
          variables: { id },
          authMode: 'userPool',
        });
        const n = res?.data?.getNews as AdminNews | null;
        if (!n) {
          setErrorMessage('La noticia no existe o fue eliminada.');
          return;
        }

        setForm({
          id: n.id,
          title: n.title ?? '',
          slug: n.slug ?? '',
          category: n.category ?? '',
          content: n.body ?? '',
          authorName: n.authorName ?? '',
          publishedAtLocal: toDateTimeLocalValue(n.publishedAt),
          status: n.status ?? NewsStatus.PUBLISHED,
          highlight: Boolean(n.highlight),
          coverImageUrl: n.coverImageUrl ?? null,
          galleryImageUrls: Array.isArray(n.galleryImageUrls)
            ? (n.galleryImageUrls.filter((u): u is string => typeof u === 'string'))
            : [],
          videoUrl: n.videoUrl ?? null,
          mediaFiles: [],
        });
        if (n.coverImageUrl) {
          setPrincipalImageKey(`existing:${n.coverImageUrl}`);
        } else {
          setPrincipalImageKey(null);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.stack ?? err.message : typeof err === 'string' ? err : 'Error cargando detalle de noticia.';
        console.error('[AdminNewsManager] openEditModal error:', err);
        setErrorMessage(message);
      }
    },
    [],
  );

  const handleFormChange = useCallback(<K extends keyof NewsFormState>(key: K, value: NewsFormState[K]) => {
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
      const existingCount =
        (prev.coverImageUrl ? 1 : 0) +
        prev.galleryImageUrls.length +
        (prev.videoUrl ? 1 : 0);
      const remainingSlots = Math.max(0, MAX_MEDIA_FILES - existingCount - prev.mediaFiles.length);
      if (remainingSlots === 0) {
        setErrorMessage(`Máximo ${MAX_MEDIA_FILES} archivos multimedia por noticia.`);
        return prev;
      }

      const accepted = picked.slice(0, remainingSlots);
      if (accepted.length < picked.length) {
        setErrorMessage(`Solo se agregaron ${accepted.length} archivo(s). Máximo ${MAX_MEDIA_FILES} por noticia.`);
      } else {
        setErrorMessage(null);
      }

      return { ...prev, mediaFiles: [...prev.mediaFiles, ...accepted] };
    });
  }, []);

  const handleDropMedia = useCallback((event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    const dropped = pickMatchingFiles(
      event.dataTransfer.files,
      (file) => file.type.startsWith('image/') || file.type.startsWith('video/'),
    );
    if (dropped.length === 0) return;
    setForm((prev) => {
      const existingCount =
        (prev.coverImageUrl ? 1 : 0) +
        prev.galleryImageUrls.length +
        (prev.videoUrl ? 1 : 0);
      const remainingSlots = Math.max(0, MAX_MEDIA_FILES - existingCount - prev.mediaFiles.length);
      if (remainingSlots === 0) {
        setErrorMessage(`Máximo ${MAX_MEDIA_FILES} archivos multimedia por noticia.`);
        return prev;
      }

      const accepted = dropped.slice(0, remainingSlots);
      if (accepted.length < dropped.length) {
        setErrorMessage(`Solo se agregaron ${accepted.length} archivo(s). Máximo ${MAX_MEDIA_FILES} por noticia.`);
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

  const handleRemoveGalleryImage = useCallback((urlToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      galleryImageUrls: prev.galleryImageUrls.filter((url) => url !== urlToRemove),
    }));
    setPrincipalImageKey((prev) => (prev === `existing:${urlToRemove}` ? null : prev));
  }, []);

  const handleRemoveVideoUrl = useCallback(() => {
    setForm((prev) => ({ ...prev, videoUrl: null }));
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
      ...form.galleryImageUrls.map((url) => ({
        key: `existing:${url}`,
        url,
        isExisting: true,
      })),
    ];

    const pending = form.mediaFiles
      .filter((file) => file.type.startsWith('image/'))
      .map((file) => {
        const mediaKey = getMediaFileKey(file);
        return {
          key: `new:${mediaKey}`,
          url: pendingImagePreviewUrls[mediaKey] ?? '',
          isExisting: false,
          fileName: file.name,
        };
      })
      .filter((entry) => entry.url);

    return [...existing, ...pending];
  }, [form.coverImageUrl, form.galleryImageUrls, form.mediaFiles, pendingImagePreviewUrls]);

  const activePreviewEntry = useMemo(() => {
    if (imagePreviewEntries.length === 0) return null;
    const bySelectedKey = principalImageKey
      ? imagePreviewEntries.find((entry) => entry.key === principalImageKey) ?? null
      : null;
    return bySelectedKey ?? imagePreviewEntries[0];
  }, [imagePreviewEntries, principalImageKey]);

  const validateForm = useCallback(() => {
    const title = form.title.trim();
    const content = form.content.trim();
    if (!title) return 'El título es obligatorio.';
    if (!content) return 'El contenido es obligatorio.';
    if (!form.slug) return 'El identificador URL no puede estar vacío.';
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
      const publishedAt = toIsoFromDateTimeLocal(form.publishedAtLocal);

      let coverImageUrl = form.coverImageUrl;
      let galleryImageUrls = form.galleryImageUrls;
      let videoUrl = form.videoUrl;
      const pendingImageFiles = form.mediaFiles.filter((file) => file.type.startsWith('image/'));
      const pendingVideoFiles = form.mediaFiles.filter((file) => file.type.startsWith('video/'));
      const uploadedImageUrlByKey = new Map<string, string>();

      if (pendingImageFiles.length > 0) {
        for (let i = 0; i < pendingImageFiles.length; i += 1) {
          const file = pendingImageFiles[i];
          const url = await uploadPublicFile(file, `news/${mediaPrefix}/images/${i}`);
          uploadedImageUrlByKey.set(getMediaFileKey(file), url);
        }
      }

      if (pendingVideoFiles.length > 0) {
        const firstVideo = pendingVideoFiles[0];
        videoUrl = await uploadPublicFile(firstVideo, `news/${mediaPrefix}/video`);
      }

      const existingImages = [
        ...(coverImageUrl ? [coverImageUrl] : []),
        ...galleryImageUrls.filter((url) => url !== coverImageUrl),
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

      galleryImageUrls = allImages.filter((url) => url !== coverImageUrl);

      const body = form.content.trim();
      const summary = buildSummaryFromContent(body);

      if (modalMode === 'create') {
        const input: CreateNewsInput = {
          title: form.title.trim(),
          slug: form.slug.trim(),
          summary,
          body,
          category: form.category.trim() ? form.category.trim() : null,
          tags: null,
          coverImageUrl,
          galleryImageUrls: galleryImageUrls.length > 0 ? galleryImageUrls : null,
          videoUrl,
          status: form.status,
          highlight: form.highlight,
          authorName: form.authorName.trim() ? form.authorName.trim() : null,
          publishedAt,
        };

        await client.graphql({
          query: createNews,
          variables: { input },
          authMode: 'userPool',
        });
      } else {
        if (!form.id) throw new Error('Falta el id de la noticia a editar.');

        const input: UpdateNewsInput = {
          id: form.id,
          title: form.title.trim(),
          slug: form.slug.trim(),
          summary,
          body,
          category: form.category.trim() ? form.category.trim() : null,
          tags: null,
          coverImageUrl,
          galleryImageUrls: galleryImageUrls.length > 0 ? galleryImageUrls : null,
          videoUrl,
          status: form.status,
          highlight: form.highlight,
          authorName: form.authorName.trim() ? form.authorName.trim() : null,
          publishedAt,
        };

        await client.graphql({
          query: updateNews,
          variables: { input },
          authMode: 'userPool',
        });
      }

      closeModal();
      await fetchNews(pageIndex);
      setSuccessMessage(modalMode === 'create' ? 'Noticia creada correctamente.' : 'Noticia actualizada correctamente.');
    } catch (err) {
      const message =
        err instanceof Error ? err.stack ?? err.message : typeof err === 'string' ? err : 'Error guardando la noticia.';
      console.error('[AdminNewsManager] handleSave error:', err);
      setErrorMessage(message);
    } finally {
      setIsSaving(false);
    }
  }, [closeModal, fetchNews, form, modalMode, pageIndex, principalImageKey, validateForm]);

  const handleDelete = useCallback(
    async (id: string) => {
      // eslint-disable-next-line no-alert
      const ok = window.confirm('¿Seguro que quieres eliminar esta noticia?');
      if (!ok) return;

      setIsSaving(true);
      setErrorMessage(null);

      try {
        const client = getGraphqlClient();
        await client.graphql({
          query: deleteNews,
          variables: { input: { id } },
          authMode: 'userPool',
        });

        await fetchNews(pageIndex);
        setSuccessMessage('Noticia eliminada correctamente.');
      } catch (err) {
        const message =
          err instanceof Error ? err.stack ?? err.message : typeof err === 'string' ? err : 'Error eliminando noticia.';
        console.error('[AdminNewsManager] handleDelete error:', err);
        setErrorMessage(message);
      } finally {
        setIsSaving(false);
      }
    },
    [fetchNews, pageIndex],
  );

  const handlePrevPage = useCallback(() => {
    if (pageIndex <= 1) return;
    setPageIndex((prev) => prev - 1);
  }, [pageIndex]);

  const handleNextPage = useCallback(() => {
    if (!hasNextPage) return;
    setPageIndex((prev) => prev + 1);
  }, [hasNextPage]);

  const handleClearFilters = useCallback(() => {
    setTitleSearch('');
    setDebouncedTitleSearch('');
    setStatusFilter('');
    setCategoryFilter('');
    setHighlightFilter('all');
    setSortOption(DEFAULT_SORT);
    pageTokensRef.current = [null];
    setHasNextPage(false);
    setItems([]);
    setPageIndex(1);
  }, []);

  const featuredHint = useMemo(() => {
    if (!form.highlight) return null;
    if (form.status !== NewsStatus.PUBLISHED) return 'Marca “Publicado” para que aparezca en /noticias.';
    return 'Si esta noticia es la más reciente, será la destacada en /noticias.';
  }, [form.highlight, form.status]);

  const activeFilters = useMemo(() => {
    const filters: Array<{ key: string; label: string; onRemove: () => void }> = [];

    if (debouncedTitleSearch.trim()) {
      filters.push({ key: 'search', label: `Búsqueda: "${debouncedTitleSearch.trim()}"`, onRemove: () => setTitleSearch('') });
    }
    if (statusFilter) {
      filters.push({ key: 'status', label: `Estado: ${getStatusLabel(statusFilter as Status)}`, onRemove: () => setStatusFilter('') });
    }
    if (categoryFilter) {
      filters.push({ key: 'category', label: `Categoría: ${categoryFilter}`, onRemove: () => setCategoryFilter('') });
    }
    if (highlightFilter !== 'all') {
      filters.push({ key: 'highlight', label: `Destacada: ${highlightFilter === 'true' ? 'Sí' : 'No'}`, onRemove: () => setHighlightFilter('all') });
    }
    if (sortOption !== DEFAULT_SORT) {
      const labels: Record<SortOption, string> = { recent: 'Más recientes', old: 'Más antiguas', titleAsc: 'Título A-Z' };
      filters.push({ key: 'sort', label: `Orden: ${labels[sortOption]}`, onRemove: () => setSortOption(DEFAULT_SORT) });
    }

    return filters;
  }, [categoryFilter, debouncedTitleSearch, highlightFilter, sortOption, statusFilter]);

  return (
    <section aria-label="Gestión de Noticias">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Noticias</h2>
          <p className="text-sm text-gray-600">
            Administra publicaciones. Las imágenes y video se suben a S3 y se guardan con URL pública.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        >
          Nueva noticia
        </button>
      </div>

      {errorMessage && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700" role="status">
          {successMessage}
        </div>
      )}

      {isLoading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 h-4 w-56 animate-pulse rounded bg-gray-200" />
          <div className="space-y-3">
            <div className="h-10 w-full animate-pulse rounded bg-gray-100" />
            <div className="h-10 w-full animate-pulse rounded bg-gray-100" />
            <div className="h-10 w-full animate-pulse rounded bg-gray-100" />
            <div className="h-10 w-full animate-pulse rounded bg-gray-100" />
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="p-4 sm:p-5">
            <div className="sticky top-[72px] z-20 -mx-2 mb-4 rounded-xl border border-secondary-claro/30 bg-white/95 px-2 py-2 backdrop-blur-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-end">
                <div className="w-full md:w-64">
                  <label htmlFor="adminNewsSearch" className="mb-1 block text-sm font-medium text-gray-700">
                    Buscar
                  </label>
                  <input
                    id="adminNewsSearch"
                    type="text"
                    value={titleSearch}
                    onChange={(e) => setTitleSearch(e.target.value)}
                    placeholder="Título…"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                    aria-label="Buscar noticias por título"
                  />
                </div>

                <div className="w-full md:w-44">
                  <label htmlFor="adminNewsStatus" className="mb-1 block text-sm font-medium text-gray-700">
                    Estado
                  </label>
                  <select
                    id="adminNewsStatus"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter((e.target.value as Status | '') ?? '')}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                    aria-label="Filtrar por estado"
                  >
                    <option value="">Todos</option>
                    <option value={NewsStatus.DRAFT}>Borrador</option>
                    <option value={NewsStatus.PUBLISHED}>Publicado</option>
                    <option value={NewsStatus.ARCHIVED}>Archivado</option>
                  </select>
                </div>

                <div className="w-full md:w-44">
                  <label htmlFor="adminNewsCategory" className="mb-1 block text-sm font-medium text-gray-700">
                    Categoría
                  </label>
                  <select
                    id="adminNewsCategory"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                    aria-label="Filtrar por categoría"
                  >
                    <option value="">Todas</option>
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-full md:w-44">
                  <label htmlFor="adminNewsHighlight" className="mb-1 block text-sm font-medium text-gray-700">
                    Destacada
                  </label>
                  <select
                    id="adminNewsHighlight"
                    value={highlightFilter}
                    onChange={(e) => setHighlightFilter(e.target.value as HighlightFilter)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                    aria-label="Filtrar por destacada"
                  >
                    <option value="all">Todas</option>
                    <option value="true">Sí</option>
                    <option value="false">No</option>
                  </select>
                </div>

                <div className="w-full md:w-44">
                  <label htmlFor="adminNewsSort" className="mb-1 block text-sm font-medium text-gray-700">
                    Orden
                  </label>
                  <select
                    id="adminNewsSort"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value as SortOption)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                    aria-label="Ordenar resultados"
                  >
                    <option value="recent">Más recientes</option>
                    <option value="old">Más antiguas</option>
                    <option value="titleAsc">Título A-Z</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Filas</span>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                    aria-label="Cambiar filas por página"
                  >
                    {PAGE_SIZE_OPTIONS.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                  aria-label="Limpiar filtros"
                >
                  Limpiar
                </button>
              </div>
            </div>
            </div>

            {activeFilters.length > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {activeFilters.map((filter) => (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={filter.onRemove}
                    className="inline-flex items-center gap-2 rounded-full border border-secondary-claro/40 bg-secondary-claro/20 px-3 py-1 text-xs font-semibold text-secondary-bosquesNublados hover:bg-secondary-claro/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                  >
                    <span>{filter.label}</span>
                    <span aria-hidden="true">×</span>
                  </button>
                ))}
              </div>
            )}

            <div className="mt-4 overflow-x-auto overflow-y-auto max-h-[60vh] rounded-lg border border-gray-100">
              <table className="min-w-full text-left text-sm">
                <thead className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur text-xs font-semibold uppercase tracking-wider text-gray-600">
                  <tr>
                    <th className="px-4 py-3">Título</th>
                    <th className="px-4 py-3">Categoría</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center">
                        <div className="mx-auto max-w-md">
                          <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary-claro/20 text-secondary-bosquesNublados">
                            <span aria-hidden="true" className="text-xl">📰</span>
                          </div>
                          <p className="text-sm font-semibold text-gray-800">No hay noticias con los filtros actuales.</p>
                          <p className="mt-1 text-xs text-gray-500">Prueba ajustando la búsqueda o limpiando filtros.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    items.map((n) => {
                      const dateValue = n.publishedAt ?? n.createdAt ?? n.updatedAt ?? null;
                      return (
                        <tr
                          key={n.id}
                          className="group border-t border-gray-100 hover:bg-gray-50/60 transition-colors"
                        >
                          <td className="px-4 py-4">
                            <div className="flex items-start gap-3">
                              {n.coverImageUrl ? (
                                <img
                                  src={n.coverImageUrl}
                                  alt={n.title}
                                  className="h-12 w-16 shrink-0 rounded-md border border-gray-200 object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="h-12 w-16 shrink-0 rounded-md border border-dashed border-gray-200 bg-gray-50" />
                              )}
                              <div>
                                <div title={n.title} className="font-semibold text-gray-900 line-clamp-2">
                                  {n.title}
                                </div>
                                <div className="mt-1 text-[11px] text-gray-500">/{n.slug}</div>
                              </div>
                            </div>
                            {n.highlight && (
                              <div className="mt-1 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                                Destacada
                              </div>
                            )}
                          </td>

                          <td className="px-4 py-4">
                            {n.category ? (
                              <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2 py-1 text-[11px] font-semibold text-gray-700">
                                {n.category}
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex rounded-full border px-2 py-1 text-[11px] font-semibold ${getStatusBadgeClasses(n.status)}`}
                            >
                              {getStatusLabel(n.status)}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-gray-700">
                            {dateValue ? new Date(dateValue).toLocaleDateString('es-CO') : '-'}
                          </td>

                          <td className="px-4 py-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => void openEditModal(n.id)}
                                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                                aria-label={`Editar noticia ${n.title}`}
                              >
                                Editar
                              </button>
                              <button
                                type="button"
                                onClick={() => void handleDelete(n.id)}
                                className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40"
                                aria-label={`Eliminar noticia ${n.title}`}
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-gray-600">
                {items.length === 0 ? (
                  'Sin resultados.'
                ) : (
                  <>
                    Mostrando {items.length} noticia(s) · Página {pageIndex}
                  </>
                )}
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handlePrevPage}
                  disabled={pageIndex <= 1 || isSaving}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                  aria-label="Página anterior"
                >
                  Anterior
                </button>
                <div className="min-w-[110px] text-center text-sm font-semibold text-gray-900">
                  Página {pageIndex}
                </div>
                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={!hasNextPage || isSaving}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                  aria-label="Página siguiente"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm px-4 py-8">
          <div
            className="w-full max-w-6xl overflow-hidden rounded-xl bg-white shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-label="Crear o editar noticia"
          >
            <div className="flex items-start justify-between gap-4 border-b border-gray-200 bg-gray-50 px-5 py-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {modalMode === 'create' ? 'Crear noticia' : 'Editar noticia'}
                </h3>
                <p className="mt-1 text-sm text-gray-600">{featuredHint ?? 'Sube imágenes y video para /noticias.'}</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                aria-label="Cerrar"
                disabled={isSaving}
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
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">
                          Título
                        </label>
                        <input
                          id="title"
                          type="text"
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                          value={form.title}
                          onChange={(e) => handleFormChange('title', e.target.value)}
                          disabled={isSaving}
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="category" className="mb-1 block text-sm font-medium text-gray-700">
                          Categoría
                        </label>
                        <select
                          id="category"
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                          value={form.category}
                          onChange={(e) => handleFormChange('category', e.target.value)}
                          disabled={isSaving}
                        >
                          <option value="">Selecciona una categoría</option>
                          <option value="Tecnología">Tecnología</option>
                          <option value="Innovación">Innovación</option>
                          <option value="Sostenibilidad">Sostenibilidad</option>
                          <option value="Alianzas">Alianzas</option>
                          <option value="Impacto">Impacto</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="content" className="mb-1 block text-sm font-medium text-gray-700">
                        Contenido
                      </label>
                      <textarea
                        id="content"
                        rows={8}
                        className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                        value={form.content}
                        onChange={(e) => handleFormChange('content', e.target.value)}
                        disabled={isSaving}
                        required
                        placeholder="Separa párrafos con una línea en blanco."
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div>
                        <label htmlFor="publishedAt" className="mb-1 block text-sm font-medium text-gray-700">
                          Fecha publicación
                        </label>
                        <input
                          id="publishedAt"
                          type="datetime-local"
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                          value={form.publishedAtLocal}
                          onChange={(e) => handleFormChange('publishedAtLocal', e.target.value)}
                          disabled={isSaving}
                        />
                      </div>

                      <div>
                        <label htmlFor="status" className="mb-1 block text-sm font-medium text-gray-700">
                          Estado
                        </label>
                        <select
                          id="status"
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                          value={form.status}
                          onChange={(e) => handleFormChange('status', e.target.value as Status)}
                          disabled={isSaving}
                        >
                          <option value={NewsStatus.DRAFT}>Borrador</option>
                          <option value={NewsStatus.PUBLISHED}>Publicado</option>
                          <option value={NewsStatus.ARCHIVED}>Archivado</option>
                        </select>
                      </div>

                      <div className="flex items-end gap-3">
                        <div className="flex-1">
                          <label htmlFor="highlight" className="mb-1 block text-sm font-medium text-gray-700">
                            Destacada
                          </label>
                          <input
                            id="highlight"
                            type="checkbox"
                            className="h-4 w-4"
                            checked={form.highlight}
                            onChange={(e) => handleFormChange('highlight', e.target.checked)}
                            disabled={isSaving}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="mediaFiles" className="mb-2 block text-sm font-medium text-gray-700">
                        Multimedia (máximo {MAX_MEDIA_FILES} archivos)
                      </label>
                      <label
                        htmlFor="mediaFiles"
                        className="group block cursor-pointer rounded-xl border-2 border-dashed border-primary/40 bg-gradient-to-br from-primary/5 to-white p-6 transition hover:border-primary hover:shadow-sm"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDropMedia}
                      >
                        <input
                          id="mediaFiles"
                          type="file"
                          accept="image/*,video/*"
                          multiple
                          className="hidden"
                          onChange={(e) => handleMediaPick(e.target.files)}
                          disabled={isSaving}
                        />
                        <p className="text-sm font-semibold text-secondary-[bosques-nublados]">
                          Arrastra archivos aquí o haz clic para seleccionarlos
                        </p>
                        <p className="mt-1 text-xs text-gray-600">
                          Puedes subir imágenes y video. Luego marca una imagen como principal.
                        </p>
                      </label>
                    </div>
                  </div>

                  <aside className="rounded-xl border border-gray-200 bg-gray-50 p-3 lg:col-span-5">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Vista previa
                    </p>

                    {activePreviewEntry ? (
                      <div className="space-y-3">
                        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                          <img
                            src={activePreviewEntry.url}
                            alt="Imagen principal seleccionada"
                            className="h-56 w-full object-cover"
                          />
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

                    {(form.coverImageUrl || form.galleryImageUrls.length > 0 || form.videoUrl || form.mediaFiles.length > 0) && (
                      <div className="mt-3 space-y-2 rounded-lg border border-gray-200 bg-white p-2">
                        {form.coverImageUrl && (
                          <div className="flex items-center justify-between gap-2 rounded-md bg-gray-50 px-2 py-1">
                            <div className="flex min-w-0 items-center gap-2">
                              <span className="inline-flex rounded bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                                Principal actual
                              </span>
                              <span className="truncate text-xs text-gray-700">Imagen existente</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setPrincipalImageKey(`existing:${form.coverImageUrl}`)}
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
                                className="rounded-md border border-red-200 bg-white px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                              >
                                Quitar
                              </button>
                            </div>
                          </div>
                        )}

                        {form.galleryImageUrls.map((url) => (
                          <div key={url} className="flex items-center justify-between gap-2 rounded-md bg-gray-50 px-2 py-1">
                            <span className="truncate text-xs text-gray-700">Imagen existente</span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setPrincipalImageKey(`existing:${url}`)}
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
                                onClick={() => handleRemoveGalleryImage(url)}
                                className="rounded-md border border-red-200 bg-white px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                              >
                                Quitar
                              </button>
                            </div>
                          </div>
                        ))}

                        {form.videoUrl && (
                          <div className="flex items-center justify-between gap-2 rounded-md bg-gray-50 px-2 py-1">
                            <span className="truncate text-xs text-gray-700">Video actual</span>
                            <button
                              type="button"
                              onClick={handleRemoveVideoUrl}
                              className="rounded-md border border-red-200 bg-white px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                            >
                              Quitar
                            </button>
                          </div>
                        )}

                        {form.mediaFiles.map((file) => {
                          const fileKey = getMediaFileKey(file);
                          const isImage = file.type.startsWith('image/');
                          return (
                            <div key={fileKey} className="flex items-center justify-between gap-2 rounded-md bg-gray-50 px-2 py-1">
                              <span className="truncate text-xs text-gray-700">{file.name}</span>
                              <div className="flex items-center gap-2">
                                {isImage && (
                                  <button
                                    type="button"
                                    onClick={() => setPrincipalImageKey(`new:${fileKey}`)}
                                    className={`rounded-md border px-2 py-1 text-xs font-semibold ${
                                      principalImageKey === `new:${fileKey}`
                                        ? 'border-primary bg-primary text-white'
                                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                                  >
                                    Principal
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleRemovePendingMediaFile(fileKey)}
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
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                    disabled={isSaving}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                    disabled={isSaving}
                  >
                    {isSaving ? 'Guardando...' : modalMode === 'create' ? 'Crear noticia' : 'Guardar cambios'}
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

export default AdminNewsManager;

