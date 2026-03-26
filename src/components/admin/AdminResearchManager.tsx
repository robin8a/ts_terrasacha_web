import { type ChangeEvent, type DragEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { uploadData } from 'aws-amplify/storage';
import type {
  ModelResearchItemFilterInput,
  Status,
} from '../../API';
import { Status as ResearchStatus } from '../../API';
import { getGraphqlClient } from '../../lib/amplifySetup';
import { parseResearchDocxFile } from '../../lib/parseResearchDocx';
import { buildS3PublicObjectUrl } from '../../lib/s3PublicUrl';

type AdminResearchItem = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  category?: string | null;
  coverImageUrl?: string | null;
  sourceDocxUrl?: string | null;
  attachmentUrls?: Array<string | null> | null;
  status: Status;
  highlight: boolean;
  authorName?: string | null;
  institution?: string | null;
  publishedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type ResearchFormState = {
  id?: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  authorName: string;
  institution: string;
  publishedAtLocal: string;
  status: Status;
  highlight: boolean;
  coverImageUrl: string | null;
  sourceDocxUrl: string | null;
  attachmentUrls: string[];
  coverImageFile: File | null;
  sourceDocxFile: File | null;
  attachmentFiles: File[];
};

type SortOption = 'recent' | 'old' | 'titleAsc';
type HighlightFilter = 'all' | 'true' | 'false';
type UploadTarget = 'cover' | 'attachments';

const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;
const DEFAULT_SORT: SortOption = 'recent';
const RESEARCH_CATEGORY_OPTIONS = [
  'Artículo científico',
  'Informe técnico',
  'Documento metodológico',
  'Policy brief',
  'Reporte',
  'Análisis',
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

const toDateTimeLocalValue = (iso?: string | null) => {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 16);
};

const toIsoFromDateTimeLocal = (value: string) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
};

const toSlug = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

const getFileNameFromUrl = (url: string | null): string | null => {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    return decodeURIComponent(parsed.pathname.split('/').pop() ?? '').trim() || 'archivo actual';
  } catch {
    return url.split('/').pop() ?? 'archivo actual';
  }
};

const getStatusLabel = (status: Status): string => {
  switch (status) {
    case ResearchStatus.DRAFT:
      return 'Borrador';
    case ResearchStatus.PUBLISHED:
      return 'Publicado';
    case ResearchStatus.ARCHIVED:
      return 'Archivado';
    default:
      return String(status);
  }
};

const getStatusBadgeClasses = (status: Status): string => {
  switch (status) {
    case ResearchStatus.DRAFT:
      return 'border-yellow-200 bg-yellow-50 text-yellow-800';
    case ResearchStatus.PUBLISHED:
      return 'border-emerald-200 bg-emerald-50 text-emerald-800';
    case ResearchStatus.ARCHIVED:
      return 'border-gray-200 bg-gray-100 text-gray-700';
    default:
      return 'border-gray-200 bg-gray-100 text-gray-700';
  }
};

const isScheduledResearch = (item: { publishedAt?: string | null }): boolean => {
  if (!item.publishedAt) return false;
  const scheduledTime = new Date(item.publishedAt).getTime();
  if (Number.isNaN(scheduledTime)) return false;
  return scheduledTime > Date.now();
};

const getAttachmentFileKey = (file: File): string => `${file.name}-${file.lastModified}-${file.size}`;

const ADMIN_GET_RESEARCH_ITEM = /* GraphQL */ `
  query AdminGetResearchItem($id: ID!) {
    getResearchItem(id: $id) {
      id
      title
      slug
      summary
      body
      category
      tags
      coverImageUrl
      sourceDocxUrl
      attachmentUrls
      videoUrl
      status
      highlight
      authorName
      institution
      publishedAt
      createdAt
      updatedAt
      __typename
    }
  }
`;

const ADMIN_LIST_RESEARCH_ITEMS = /* GraphQL */ `
  query AdminListResearchItems($filter: ModelResearchItemFilterInput, $limit: Int, $nextToken: String) {
    listResearchItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        slug
        summary
        body
        category
        tags
        coverImageUrl
        sourceDocxUrl
        attachmentUrls
        videoUrl
        status
        highlight
        authorName
        institution
        publishedAt
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;

const ADMIN_CREATE_RESEARCH_ITEM = /* GraphQL */ `
  mutation AdminCreateResearchItem($input: CreateResearchItemInput!, $condition: ModelResearchItemConditionInput) {
    createResearchItem(input: $input, condition: $condition) {
      id
      sourceDocxUrl
      __typename
    }
  }
`;

const ADMIN_UPDATE_RESEARCH_ITEM = /* GraphQL */ `
  mutation AdminUpdateResearchItem($input: UpdateResearchItemInput!, $condition: ModelResearchItemConditionInput) {
    updateResearchItem(input: $input, condition: $condition) {
      id
      sourceDocxUrl
      __typename
    }
  }
`;

const ADMIN_DELETE_RESEARCH_ITEM = /* GraphQL */ `
  mutation AdminDeleteResearchItem($input: DeleteResearchItemInput!, $condition: ModelResearchItemConditionInput) {
    deleteResearchItem(input: $input, condition: $condition) {
      id
      __typename
    }
  }
`;

const buildEmptyForm = (): ResearchFormState => ({
  title: '',
  slug: '',
  summary: '',
  content: '',
  category: '',
  authorName: '',
  institution: '',
  publishedAtLocal: '',
  status: ResearchStatus.PUBLISHED,
  highlight: false,
  coverImageUrl: null,
  sourceDocxUrl: null,
  attachmentUrls: [],
  coverImageFile: null,
  sourceDocxFile: null,
  attachmentFiles: [],
});

const AdminResearchManager = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<AdminResearchItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [form, setForm] = useState<ResearchFormState>(buildEmptyForm());
  const [isSaving, setIsSaving] = useState(false);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [isPrefillingFromDocx, setIsPrefillingFromDocx] = useState(false);
  const [prefillMessage, setPrefillMessage] = useState<string | null>(null);
  const [prefillFileName, setPrefillFileName] = useState<string | null>(null);
  const [dragActiveTarget, setDragActiveTarget] = useState<UploadTarget | null>(null);

  const pageTokensRef = useRef<Array<string | null>>([null]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE_OPTIONS[0]);
  const [hasNextPage, setHasNextPage] = useState(false);

  const [titleSearch, setTitleSearch] = useState('');
  const [debouncedTitleSearch, setDebouncedTitleSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | ''>('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [highlightFilter, setHighlightFilter] = useState<HighlightFilter>('all');
  const [showScheduledOnly, setShowScheduledOnly] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>(DEFAULT_SORT);
  const skipNextPageFetchRef = useRef(false);
  const didInitRef = useRef(false);

  const fetchResearchItems = useCallback(async (targetPageIndex: number) => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const client = getGraphqlClient();
      const nextToken = pageTokensRef.current[targetPageIndex - 1] ?? null;
      const listFilter: ModelResearchItemFilterInput | null =
        debouncedTitleSearch.trim() || statusFilter || categoryFilter || highlightFilter !== 'all' || showScheduledOnly
          ? {
            ...(debouncedTitleSearch.trim() ? { title: { contains: debouncedTitleSearch.trim() } } : {}),
            ...(statusFilter ? { status: { eq: statusFilter as Status } } : {}),
            ...(categoryFilter.trim() ? { category: { contains: categoryFilter.trim() } } : {}),
            ...(highlightFilter !== 'all' ? { highlight: { eq: highlightFilter === 'true' } } : {}),
            ...(showScheduledOnly ? { publishedAt: { gt: new Date().toISOString() } } : {}),
          }
          : null;

      const res: any = await client.graphql({
        query: ADMIN_LIST_RESEARCH_ITEMS,
        variables: { filter: listFilter ?? undefined, limit: pageSize, nextToken },
        authMode: 'userPool',
      });

      const pageItems = (res?.data?.listResearchItems?.items ?? []) as AdminResearchItem[];
      const sorted = [...pageItems].sort((a, b) => {
        if (sortOption === 'titleAsc') return a.title.localeCompare(b.title, 'es', { sensitivity: 'base' });
        const aTime = new Date(a.publishedAt ?? a.createdAt ?? a.updatedAt ?? 0).getTime();
        const bTime = new Date(b.publishedAt ?? b.createdAt ?? b.updatedAt ?? 0).getTime();
        return sortOption === 'old' ? aTime - bTime : bTime - aTime;
      });

      setItems(sorted);
      const nextTokenFromApi = res?.data?.listResearchItems?.nextToken ?? null;
      pageTokensRef.current[targetPageIndex] = nextTokenFromApi;
      setHasNextPage(Boolean(nextTokenFromApi));
    } catch (err) {
      const message =
        err instanceof Error ? err.stack ?? err.message : typeof err === 'string' ? err : 'Error cargando investigación.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, [categoryFilter, debouncedTitleSearch, highlightFilter, pageSize, showScheduledOnly, sortOption, statusFilter]);

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
    void fetchResearchItems(1);
  }, [categoryFilter, debouncedTitleSearch, fetchResearchItems, highlightFilter, pageIndex, pageSize, showScheduledOnly, sortOption, statusFilter]);

  useEffect(() => {
    if (skipNextPageFetchRef.current) {
      skipNextPageFetchRef.current = false;
      return;
    }
    void fetchResearchItems(pageIndex);
  }, [fetchResearchItems, pageIndex]);

  useEffect(() => {
    if (!form.coverImageFile) {
      setCoverPreviewUrl(null);
      return undefined;
    }

    const nextUrl = URL.createObjectURL(form.coverImageFile);
    setCoverPreviewUrl(nextUrl);
    return () => URL.revokeObjectURL(nextUrl);
  }, [form.coverImageFile]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setForm(buildEmptyForm());
    setPrefillMessage(null);
    setPrefillFileName(null);
  }, []);

  const openCreateModal = useCallback(() => {
    setModalMode('create');
    setErrorMessage(null);
    setPrefillMessage(null);
    setPrefillFileName(null);
    setForm(buildEmptyForm());
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback(async (id: string) => {
    setModalMode('edit');
    setIsModalOpen(true);
    setForm(buildEmptyForm());
    setErrorMessage(null);
    setPrefillMessage(null);
    setPrefillFileName(null);

    try {
      const client = getGraphqlClient();
      const res: any = await client.graphql({
        query: ADMIN_GET_RESEARCH_ITEM,
        variables: { id },
        authMode: 'userPool',
      });

      const item = res?.data?.getResearchItem as AdminResearchItem | null;
      if (!item) {
        setErrorMessage('La investigación no existe o fue eliminada.');
        return;
      }

      setForm({
        id: item.id,
        title: item.title ?? '',
        slug: item.slug ?? '',
        summary: item.summary ?? '',
        content: item.body ?? '',
        category: item.category ?? '',
        authorName: item.authorName ?? '',
        institution: item.institution ?? '',
        publishedAtLocal: toDateTimeLocalValue(item.publishedAt),
        status: item.status ?? ResearchStatus.PUBLISHED,
        highlight: Boolean(item.highlight),
        coverImageUrl: item.coverImageUrl ?? null,
        sourceDocxUrl: item.sourceDocxUrl ?? null,
        attachmentUrls: Array.isArray(item.attachmentUrls)
          ? item.attachmentUrls.filter((url): url is string => typeof url === 'string')
          : [],
        coverImageFile: null,
        sourceDocxFile: null,
        attachmentFiles: [],
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.stack ?? err.message : typeof err === 'string' ? err : 'Error cargando investigación.';
      setErrorMessage(message);
    }
  }, []);

  const handleFormChange = useCallback(<K extends keyof ResearchFormState>(key: K, value: ResearchFormState[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'title') next.slug = toSlug(String(value));
      return next;
    });
  }, []);

  const handleCoverImagePick = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, coverImageFile: nextFile }));
    setErrorMessage(null);
  }, []);

  const handleAttachmentPick = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const nextFiles = event.target.files ? Array.from(event.target.files) : [];
    if (nextFiles.length === 0) return;
    setForm((prev) => ({ ...prev, attachmentFiles: [...prev.attachmentFiles, ...nextFiles] }));
    setErrorMessage(null);
  }, []);

  const handleAssignDroppedFiles = useCallback((target: UploadTarget, files: File[]) => {
    if (files.length === 0) return;

    if (target === 'cover') {
      const imageFile = files.find((file) => file.type.startsWith('image/')) ?? null;
      if (!imageFile) {
        setErrorMessage('La portada debe ser un archivo de imagen.');
        return;
      }

      setForm((prev) => ({ ...prev, coverImageFile: imageFile }));
      setErrorMessage(null);
      return;
    }

    setForm((prev) => ({ ...prev, attachmentFiles: [...prev.attachmentFiles, ...files] }));
    setErrorMessage(null);
  }, []);

  const handleDragOverUploadArea = useCallback((event: DragEvent<HTMLLabelElement>, target: UploadTarget) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    if (dragActiveTarget !== target) {
      setDragActiveTarget(target);
    }
  }, [dragActiveTarget]);

  const handleDragLeaveUploadArea = useCallback((event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragActiveTarget(null);
  }, []);

  const handleDropUploadArea = useCallback((event: DragEvent<HTMLLabelElement>, target: UploadTarget) => {
    event.preventDefault();
    setDragActiveTarget(null);
    const droppedFiles = Array.from(event.dataTransfer.files ?? []);
    handleAssignDroppedFiles(target, droppedFiles);
  }, [handleAssignDroppedFiles]);

  const handleDocxPrefill = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const docxFile = event.target.files?.[0] ?? null;
    if (!docxFile) return;

    setIsPrefillingFromDocx(true);
    setErrorMessage(null);
    setPrefillMessage(null);

    try {
      const parsed = await parseResearchDocxFile(docxFile);

      setForm((prev) => ({
        ...prev,
        title: parsed.title || prev.title,
        slug: parsed.title ? toSlug(parsed.title) : prev.slug,
        summary: parsed.summary || prev.summary,
        content: parsed.content || prev.content,
        category: parsed.category || prev.category,
        authorName: parsed.authorName || prev.authorName,
        institution: parsed.institution || prev.institution,
        sourceDocxFile: docxFile,
      }));

      setPrefillFileName(docxFile.name);
      setPrefillMessage('Documento procesado. Revisa y ajusta el contenido antes de guardar.');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'No se pudo procesar el archivo DOCX para prellenar el formulario.';
      setErrorMessage(message);
    } finally {
      setIsPrefillingFromDocx(false);
      event.target.value = '';
    }
  }, []);

  const handleRemoveExistingAttachment = useCallback((urlToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      attachmentUrls: prev.attachmentUrls.filter((url) => url !== urlToRemove),
    }));
  }, []);

  const handleRemovePendingAttachment = useCallback((keyToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      attachmentFiles: prev.attachmentFiles.filter((file) => getAttachmentFileKey(file) !== keyToRemove),
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setTitleSearch('');
    setDebouncedTitleSearch('');
    setStatusFilter('');
    setCategoryFilter('');
    setHighlightFilter('all');
    setShowScheduledOnly(false);
    setSortOption(DEFAULT_SORT);
    pageTokensRef.current = [null];
    setHasNextPage(false);
    setItems([]);
    setPageIndex(1);
  }, []);

  const activeFilters = useMemo(() => {
    const filters: Array<{ key: string; label: string; onRemove: () => void }> = [];

    if (debouncedTitleSearch.trim()) {
      filters.push({ key: 'search', label: `Búsqueda: "${debouncedTitleSearch.trim()}"`, onRemove: () => setTitleSearch('') });
    }
    if (statusFilter) {
      filters.push({ key: 'status', label: `Estado: ${getStatusLabel(statusFilter as Status)}`, onRemove: () => setStatusFilter('') });
    }
    if (categoryFilter.trim()) {
      filters.push({ key: 'category', label: `Categoría: ${categoryFilter}`, onRemove: () => setCategoryFilter('') });
    }
    if (highlightFilter !== 'all') {
      filters.push({ key: 'highlight', label: `Destacada: ${highlightFilter === 'true' ? 'Sí' : 'No'}`, onRemove: () => setHighlightFilter('all') });
    }
    if (showScheduledOnly) {
      filters.push({ key: 'scheduled', label: 'Programadas', onRemove: () => setShowScheduledOnly(false) });
    }
    if (sortOption !== DEFAULT_SORT) {
      const labels: Record<SortOption, string> = { recent: 'Más recientes', old: 'Más antiguas', titleAsc: 'Título A-Z' };
      filters.push({ key: 'sort', label: `Orden: ${labels[sortOption]}`, onRemove: () => setSortOption(DEFAULT_SORT) });
    }

    return filters;
  }, [categoryFilter, debouncedTitleSearch, highlightFilter, showScheduledOnly, sortOption, statusFilter]);

  const validateForm = useCallback(() => {
    if (!form.title.trim()) return 'El título es obligatorio.';
    if (!form.summary.trim()) return 'El resumen es obligatorio.';
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
      const publishedAt = toIsoFromDateTimeLocal(form.publishedAtLocal);

      let coverImageUrl = form.coverImageUrl;
      let sourceDocxUrl = form.sourceDocxUrl;
      let attachmentUrls = [...form.attachmentUrls];

      if (form.coverImageFile) {
        coverImageUrl = await uploadPublicFile(form.coverImageFile, `research/${mediaPrefix}/cover`);
      }

      if (form.sourceDocxFile) {
        sourceDocxUrl = await uploadPublicFile(form.sourceDocxFile, `research/${mediaPrefix}/source-docx`);
      }

      if (form.attachmentFiles.length > 0) {
        const uploadedAttachments: string[] = [];
        for (let i = 0; i < form.attachmentFiles.length; i += 1) {
          const file = form.attachmentFiles[i];
          const url = await uploadPublicFile(file, `research/${mediaPrefix}/attachments/${i}`);
          uploadedAttachments.push(url);
        }
        attachmentUrls = [...attachmentUrls, ...uploadedAttachments];
      }

      if (modalMode === 'create') {
        const input = {
          title: form.title.trim(),
          slug: form.slug.trim(),
          summary: form.summary.trim(),
          body: form.content.trim(),
          category: form.category.trim() || null,
          tags: null,
          coverImageUrl,
          sourceDocxUrl,
          attachmentUrls: attachmentUrls.length > 0 ? attachmentUrls : null,
          status: form.status,
          highlight: form.highlight,
          authorName: form.authorName.trim() || null,
          institution: form.institution.trim() || null,
          publishedAt,
        };

        await client.graphql({
          query: ADMIN_CREATE_RESEARCH_ITEM,
          variables: { input },
          authMode: 'userPool',
        });
      } else {
        if (!form.id) throw new Error('Falta el id de la investigación.');

        const input = {
          id: form.id,
          title: form.title.trim(),
          slug: form.slug.trim(),
          summary: form.summary.trim(),
          body: form.content.trim(),
          category: form.category.trim() || null,
          tags: null,
          coverImageUrl,
          sourceDocxUrl,
          attachmentUrls: attachmentUrls.length > 0 ? attachmentUrls : null,
          status: form.status,
          highlight: form.highlight,
          authorName: form.authorName.trim() || null,
          institution: form.institution.trim() || null,
          publishedAt,
        };

        await client.graphql({
          query: ADMIN_UPDATE_RESEARCH_ITEM,
          variables: { input },
          authMode: 'userPool',
        });
      }

      closeModal();
      await fetchResearchItems(pageIndex);
      setSuccessMessage(modalMode === 'create' ? 'Investigación creada correctamente.' : 'Investigación actualizada correctamente.');
    } catch (err) {
      const message =
        err instanceof Error ? err.stack ?? err.message : typeof err === 'string' ? err : 'Error guardando investigación.';
      setErrorMessage(message);
    } finally {
      setIsSaving(false);
    }
  }, [closeModal, fetchResearchItems, form, modalMode, pageIndex, validateForm]);

  const handleDelete = useCallback(async (id: string) => {
    const ok = window.confirm('¿Seguro que quieres eliminar esta investigación?');
    if (!ok) return;

    setIsSaving(true);
    setErrorMessage(null);

    try {
      const client = getGraphqlClient();
      await client.graphql({
        query: ADMIN_DELETE_RESEARCH_ITEM,
        variables: { input: { id } },
        authMode: 'userPool',
      });

      await fetchResearchItems(pageIndex);
      setSuccessMessage('Investigación eliminada correctamente.');
    } catch (err) {
      const message =
        err instanceof Error ? err.stack ?? err.message : typeof err === 'string' ? err : 'Error eliminando investigación.';
      setErrorMessage(message);
    } finally {
      setIsSaving(false);
    }
  }, [fetchResearchItems, pageIndex]);

  return (
    <section aria-label="Gestión de investigación">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Investigación</h2>
          <p className="text-sm text-gray-600">
            Administra publicaciones investigativas con documento principal, resumen web y adjuntos opcionales.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        >
          Nueva investigación
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

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="p-4 sm:p-5">
          <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-6">
            <input
              value={titleSearch}
              onChange={(e) => setTitleSearch(e.target.value)}
              placeholder="Buscar título..."
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm xl:col-span-2"
              aria-label="Buscar investigación por título"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
              aria-label="Filtrar por categoría"
            >
              <option value="">Categoría: Todas</option>
              {RESEARCH_CATEGORY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter((e.target.value as Status | '') ?? '')}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
              aria-label="Filtrar por estado"
            >
              <option value="">Estado: Todos</option>
              <option value={ResearchStatus.DRAFT}>Borrador</option>
              <option value={ResearchStatus.PUBLISHED}>Publicado</option>
              <option value={ResearchStatus.ARCHIVED}>Archivado</option>
            </select>
            <select
              value={highlightFilter}
              onChange={(e) => setHighlightFilter(e.target.value as HighlightFilter)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
              aria-label="Filtrar por destacada"
            >
              <option value="all">Destacada: Todas</option>
              <option value="true">Destacadas</option>
              <option value="false">No destacadas</option>
            </select>
            <button
              type="button"
              onClick={() => setShowScheduledOnly((prev) => !prev)}
              className={`rounded-lg px-3 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
                showScheduledOnly
                  ? 'border border-primary bg-primary text-white'
                  : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              }`}
              aria-pressed={showScheduledOnly}
            >
              {showScheduledOnly ? 'Ver todas' : 'Ver programadas'}
            </button>
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
              <span className="text-sm text-gray-600">Filas</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
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

          {activeFilters.length > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {activeFilters.map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  onClick={filter.onRemove}
                  className="inline-flex items-center gap-2 rounded-full border border-secondary-claro/40 bg-secondary-claro/20 px-3 py-1 text-xs font-semibold text-secondary-bosquesNublados hover:bg-secondary-claro/30"
                >
                  <span>{filter.label}</span>
                  <span aria-hidden="true">×</span>
                </button>
              ))}
            </div>
          )}

          <div className="overflow-x-auto rounded-lg border border-gray-100">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-600">
                <tr>
                  <th className="px-4 py-3">Título</th>
                  <th className="px-4 py-3">Categoría</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-gray-600">
                      Cargando investigación...
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-gray-600">
                      No hay investigaciones con los filtros actuales.
                    </td>
                  </tr>
                ) : items.map((item) => {
                  const isScheduled = isScheduledResearch(item);
                  const dateValue = item.publishedAt ?? item.createdAt ?? item.updatedAt ?? null;
                  return (
                    <tr key={item.id} className="group border-t border-gray-100 transition-colors hover:bg-gray-50/60">
                      <td className="px-4 py-4">
                        <div className="flex items-start gap-3">
                          {item.coverImageUrl ? (
                            <img
                              src={item.coverImageUrl}
                              alt={item.title}
                              className="h-12 w-16 shrink-0 rounded-md border border-gray-200 object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="h-12 w-16 shrink-0 rounded-md border border-dashed border-gray-200 bg-gray-50" />
                          )}
                          <div>
                            <div title={item.title} className="font-semibold text-gray-900 line-clamp-2">
                              {item.title}
                            </div>
                            <div className="mt-1 text-[11px] text-gray-500">/{item.slug}</div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {item.highlight && (
                                <span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                                  Destacada
                                </span>
                              )}
                              {isScheduled && (
                                <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-sky-700">
                                  Programada
                                </span>
                              )}
                              {item.sourceDocxUrl && (
                                <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                                  Documento
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-700">{item.category?.trim() ? item.category : '-'}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full border px-2 py-1 text-[11px] font-semibold ${getStatusBadgeClasses(item.status)}`}>
                          {getStatusLabel(item.status)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-700">{dateValue ? new Date(dateValue).toLocaleDateString('es-CO') : '-'}</td>
                      <td className="px-4 py-4 text-right">
                        <div className="inline-flex gap-2">
                          <button
                            type="button"
                            onClick={() => void openEditModal(item.id)}
                            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDelete(item.id)}
                            className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-gray-600">Mostrando {items.length} investigación(es) · Página {pageIndex}</span>
            <div className="inline-flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPageIndex((prev) => Math.max(1, prev - 1))}
                disabled={pageIndex <= 1}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                type="button"
                onClick={() => setPageIndex((prev) => prev + 1)}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-8 backdrop-blur-sm">
          <div className="w-full max-w-6xl overflow-hidden rounded-xl bg-white shadow-xl" role="dialog" aria-modal="true" aria-label="Crear o editar investigación">
            <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-5 py-4">
              <h3 className="text-base font-bold text-gray-900">
                {modalMode === 'create' ? 'Crear investigación' : 'Editar investigación'}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                disabled={isSaving}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 disabled:opacity-60"
              >
                Cerrar
              </button>
            </div>

            <div className="max-h-[85vh] overflow-auto px-5 py-5">
              <form
                className="space-y-5"
                onSubmit={(event) => {
                  event.preventDefault();
                  void handleSave();
                }}
              >
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                  <div className="space-y-5 lg:col-span-7">
                    <div className="rounded-xl border border-secondary-claro/40 bg-secondary-claro/10 p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-secondary-[bosques-nublados]">
                            {isPrefillingFromDocx
                              ? 'Procesando documento principal'
                              : prefillFileName
                                ? 'Documento principal cargado'
                                : 'Cargar documento principal'}
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-gray-600">
                            {isPrefillingFromDocx
                              ? 'Estamos leyendo el archivo para sugerir el titulo, el resumen y el contenido inicial del formulario.'
                              : prefillFileName
                                ? 'Puedes reemplazar el documento si quieres volver a generar el prellenado. El archivo queda guardado como fuente editorial.'
                                : 'Facilita el proceso subiendo un `.docx` o `.pdf`: extraeremos el titulo, el resumen, el contenido y una categoria sugerida.'}
                          </p>
                        </div>
                        <label
                          htmlFor="researchDocxPrefill"
                          className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-primary/30 bg-white px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                        >
                          {isPrefillingFromDocx ? 'Procesando...' : 'Cargar DOC'}
                        </label>
                        <input
                          id="researchDocxPrefill"
                          type="file"
                          accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          className="hidden"
                          onChange={(event) => void handleDocxPrefill(event)}
                          disabled={isSaving || isPrefillingFromDocx}
                        />
                      </div>

                      {prefillFileName && (
                        <p className="mt-3 text-xs text-gray-600">
                          Documento procesado: <span className="font-semibold text-gray-800">{prefillFileName}</span>
                        </p>
                      )}

                      {form.sourceDocxUrl && !form.sourceDocxFile && (
                        <div className="mt-3 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700">
                          DOCX fuente actual disponible.
                        </div>
                      )}

                      {prefillMessage && (
                        <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                          {prefillMessage}
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="researchTitle" className="mb-1 block text-sm font-medium text-gray-700">Título</label>
                      <input
                        id="researchTitle"
                        type="text"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        value={form.title}
                        onChange={(e) => handleFormChange('title', e.target.value)}
                        disabled={isSaving}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="researchSummary" className="mb-1 block text-sm font-medium text-gray-700">Resumen</label>
                      <textarea
                        id="researchSummary"
                        rows={4}
                        className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        value={form.summary}
                        onChange={(e) => handleFormChange('summary', e.target.value)}
                        disabled={isSaving}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="researchContent" className="mb-1 block text-sm font-medium text-gray-700">Contenido web</label>
                      <textarea
                        id="researchContent"
                        rows={12}
                        className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        value={form.content}
                        onChange={(e) => handleFormChange('content', e.target.value)}
                        disabled={isSaving}
                        placeholder="Pega aquí la versión editorial o resumida del documento. Separa párrafos con una línea en blanco."
                        required
                      />
                    </div>
                  </div>

                  <aside className="space-y-5 lg:col-span-5">
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                      <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">Metadatos</p>

                      <div className="space-y-4">
                        <div>
                          <label htmlFor="researchCategory" className="mb-1 block text-sm font-medium text-gray-700">Categoría</label>
                          <select
                            id="researchCategory"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            value={form.category}
                            onChange={(e) => handleFormChange('category', e.target.value)}
                            disabled={isSaving}
                          >
                            <option value="">Selecciona una categoría</option>
                            {RESEARCH_CATEGORY_OPTIONS.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label htmlFor="researchAuthor" className="mb-1 block text-sm font-medium text-gray-700">Autor</label>
                            <input
                              id="researchAuthor"
                              type="text"
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                              value={form.authorName}
                              onChange={(e) => handleFormChange('authorName', e.target.value)}
                              disabled={isSaving}
                            />
                          </div>
                          <div>
                            <label htmlFor="researchInstitution" className="mb-1 block text-sm font-medium text-gray-700">Institución</label>
                            <input
                              id="researchInstitution"
                              type="text"
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                              value={form.institution}
                              onChange={(e) => handleFormChange('institution', e.target.value)}
                              disabled={isSaving}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                          <div>
                            <label htmlFor="researchPublishedAt" className="mb-1 block text-sm font-medium text-gray-700">Fecha publicación</label>
                            <input
                              id="researchPublishedAt"
                              type="datetime-local"
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                              value={form.publishedAtLocal}
                              onChange={(e) => handleFormChange('publishedAtLocal', e.target.value)}
                              disabled={isSaving}
                            />
                          </div>
                          <div>
                            <label htmlFor="researchStatus" className="mb-1 block text-sm font-medium text-gray-700">Estado</label>
                            <select
                              id="researchStatus"
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                              value={form.status}
                              onChange={(e) => handleFormChange('status', e.target.value as Status)}
                              disabled={isSaving}
                            >
                              <option value={ResearchStatus.DRAFT}>Borrador</option>
                              <option value={ResearchStatus.PUBLISHED}>Publicado</option>
                              <option value={ResearchStatus.ARCHIVED}>Archivado</option>
                            </select>
                          </div>
                          <div className="flex items-end gap-3">
                            <div className="flex-1">
                              <label htmlFor="researchHighlight" className="mb-1 block text-sm font-medium text-gray-700">Destacada</label>
                              <input
                                id="researchHighlight"
                                type="checkbox"
                                className="h-4 w-4"
                                checked={form.highlight}
                                onChange={(e) => handleFormChange('highlight', e.target.checked)}
                                disabled={isSaving}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                      <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">Archivos</p>

                      <div className="space-y-4">
                        <label
                          htmlFor="researchCoverImage"
                          onDragOver={(event) => handleDragOverUploadArea(event, 'cover')}
                          onDragLeave={handleDragLeaveUploadArea}
                          onDrop={(event) => handleDropUploadArea(event, 'cover')}
                          className={`block cursor-pointer rounded-2xl border-2 border-dashed p-4 transition ${
                            dragActiveTarget === 'cover'
                              ? 'border-primary bg-primary/5'
                              : (coverPreviewUrl || form.coverImageUrl || form.coverImageFile)
                                ? 'border-emerald-300 bg-emerald-50/60'
                                : 'border-gray-300 bg-white hover:border-primary/50 hover:bg-primary/5'
                          }`}
                        >
                          <input
                            id="researchCoverImage"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleCoverImagePick}
                            disabled={isSaving}
                          />
                          <div className="flex items-start gap-3">
                            <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${
                              (coverPreviewUrl || form.coverImageUrl || form.coverImageFile)
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2 1.586-1.586a2 2 0 012.828 0L20 14m-6-10h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900">
                                {(coverPreviewUrl || form.coverImageUrl || form.coverImageFile) ? 'Portada lista' : 'Imagen de portada'}
                              </p>
                              <p className="mt-1 text-xs leading-relaxed text-gray-600">
                                {(coverPreviewUrl || form.coverImageUrl || form.coverImageFile)
                                  ? 'Puedes arrastrar otra imagen o hacer clic para reemplazar la portada actual.'
                                  : 'Arrastra una imagen aquí o haz clic para seleccionarla desde tu equipo.'}
                              </p>
                              <div className="mt-3 flex flex-wrap items-center gap-2">
                                <span className="inline-flex rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700">
                                  JPG, PNG, WEBP
                                </span>
                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                  (coverPreviewUrl || form.coverImageUrl || form.coverImageFile)
                                    ? 'border border-emerald-200 bg-emerald-100 text-emerald-700'
                                    : 'border border-amber-200 bg-amber-50 text-amber-700'
                                }`}>
                                  {(coverPreviewUrl || form.coverImageUrl || form.coverImageFile) ? 'Cargada' : 'Pendiente'}
                                </span>
                              </div>
                              {(form.coverImageFile?.name || getFileNameFromUrl(form.coverImageUrl)) && (
                                <p className="mt-3 truncate text-xs font-medium text-gray-700">
                                  Archivo: {form.coverImageFile?.name ?? getFileNameFromUrl(form.coverImageUrl)}
                                </p>
                              )}
                            </div>
                          </div>
                        </label>

                        <label
                          htmlFor="researchAttachments"
                          onDragOver={(event) => handleDragOverUploadArea(event, 'attachments')}
                          onDragLeave={handleDragLeaveUploadArea}
                          onDrop={(event) => handleDropUploadArea(event, 'attachments')}
                          className={`block cursor-pointer rounded-2xl border-2 border-dashed p-4 transition ${
                            dragActiveTarget === 'attachments'
                              ? 'border-primary bg-primary/5'
                              : (form.attachmentUrls.length > 0 || form.attachmentFiles.length > 0)
                                ? 'border-emerald-300 bg-emerald-50/60'
                                : 'border-gray-300 bg-white hover:border-primary/50 hover:bg-primary/5'
                          }`}
                        >
                          <input
                            id="researchAttachments"
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleAttachmentPick}
                            disabled={isSaving}
                          />
                          <div className="flex items-start gap-3">
                            <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${
                              (form.attachmentUrls.length > 0 || form.attachmentFiles.length > 0)
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828L18 9.828a4 4 0 10-5.656-5.656L5.757 10.757a6 6 0 108.486 8.486L20.5 13" />
                              </svg>
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900">
                                {(form.attachmentUrls.length > 0 || form.attachmentFiles.length > 0)
                                  ? 'Archivos adicionales listos'
                                  : 'Archivos adicionales'}
                              </p>
                              <p className="mt-1 text-xs leading-relaxed text-gray-600">
                                {(form.attachmentUrls.length > 0 || form.attachmentFiles.length > 0)
                                  ? 'Puedes seguir arrastrando más archivos o hacer clic para agregar anexos nuevos.'
                                  : 'Úsalos solo si necesitas anexos, tablas, soportes o documentos complementarios.'}
                              </p>
                              <div className="mt-3 flex flex-wrap items-center gap-2">
                                <span className="inline-flex rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700">
                                  Múltiples archivos
                                </span>
                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                  (form.attachmentUrls.length > 0 || form.attachmentFiles.length > 0)
                                    ? 'border border-emerald-200 bg-emerald-100 text-emerald-700'
                                    : 'border border-amber-200 bg-amber-50 text-amber-700'
                                }`}>
                                  {(form.attachmentUrls.length + form.attachmentFiles.length) > 0
                                    ? `${form.attachmentUrls.length + form.attachmentFiles.length} cargado(s)`
                                    : 'Opcional'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </label>
                      </div>

                      <div className="mt-4 space-y-3">
                        {(coverPreviewUrl || form.coverImageUrl) && (
                          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                            <img
                              src={coverPreviewUrl ?? form.coverImageUrl ?? ''}
                              alt="Vista previa de portada"
                              className="h-52 w-full object-cover"
                            />
                          </div>
                        )}

                        {(form.sourceDocxFile || form.sourceDocxUrl) && (
                          <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700">
                            DOCX fuente {form.sourceDocxFile ? 'listo para guardarse' : 'guardado actualmente'}.
                          </div>
                        )}

                        {form.attachmentUrls.length > 0 && (
                          <div className="space-y-2 rounded-lg border border-gray-200 bg-white p-2">
                            {form.attachmentUrls.map((url) => (
                              <div key={url} className="flex items-center justify-between gap-2 rounded-md bg-gray-50 px-2 py-2">
                                <span className="truncate text-xs text-gray-700">{url.split('/').pop()}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveExistingAttachment(url)}
                                  className="rounded-md border border-red-200 bg-white px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                                >
                                  Quitar
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {form.attachmentFiles.length > 0 && (
                          <div className="space-y-2 rounded-lg border border-gray-200 bg-white p-2">
                            {form.attachmentFiles.map((file) => {
                              const fileKey = getAttachmentFileKey(file);
                              return (
                                <div key={fileKey} className="flex items-center justify-between gap-2 rounded-md bg-gray-50 px-2 py-2">
                                  <span className="truncate text-xs text-gray-700">{file.name}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemovePendingAttachment(fileKey)}
                                    className="rounded-md border border-red-200 bg-white px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                                  >
                                    Quitar
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </aside>
                </div>

                <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={isSaving}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 disabled:opacity-60"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 disabled:opacity-60"
                  >
                    {isSaving ? 'Guardando...' : modalMode === 'create' ? 'Crear investigación' : 'Guardar cambios'}
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

export default AdminResearchManager;
