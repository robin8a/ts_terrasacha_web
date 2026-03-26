import { type ChangeEvent, type DragEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { uploadData } from 'aws-amplify/storage';
import type { Status } from '../../API';
import { Status as PodcastStatus } from '../../API';
import { getGraphqlClient } from '../../lib/amplifySetup';
import { buildS3PublicObjectUrl } from '../../lib/s3PublicUrl';

type AdminPodcastItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  audioUrl?: string | null;
  coverImageUrl?: string | null;
  relatedNewsIds?: Array<string | null> | null;
  relatedAnnouncementIds?: Array<string | null> | null;
  relatedResearchIds?: Array<string | null> | null;
  status: Status;
  highlight: boolean;
  publishedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type RelatedOption = {
  id: string;
  title: string;
};

type PodcastFormState = {
  id?: string;
  title: string;
  summary: string;
  slug: string;
  publishedAtLocal: string;
  status: Status;
  highlight: boolean;
  coverImageUrl: string | null;
  audioUrl: string | null;
  relatedNewsIds: string[];
  relatedAnnouncementIds: string[];
  relatedResearchIds: string[];
  coverImageFile: File | null;
  audioFile: File | null;
};

type RelationTab = 'news' | 'announcements' | 'research';
type UploadTarget = 'cover' | 'audio';

const ADMIN_LIST_PODCASTS = /* GraphQL */ `
  query AdminListPodcastEpisodes($filter: ModelPodcastEpisodeFilterInput, $limit: Int, $nextToken: String) {
    listPodcastEpisodes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        slug
        description
        audioUrl
        coverImageUrl
        relatedNewsIds
        relatedAnnouncementIds
        relatedResearchIds
        status
        highlight
        publishedAt
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

const ADMIN_GET_PODCAST = /* GraphQL */ `
  query AdminGetPodcastEpisode($id: ID!) {
    getPodcastEpisode(id: $id) {
      id
      title
      slug
      description
      audioUrl
      coverImageUrl
      relatedNewsIds
      relatedAnnouncementIds
      relatedResearchIds
      status
      highlight
      publishedAt
      createdAt
      updatedAt
    }
  }
`;

const ADMIN_CREATE_PODCAST = /* GraphQL */ `
  mutation AdminCreatePodcastEpisode($input: CreatePodcastEpisodeInput!, $condition: ModelPodcastEpisodeConditionInput) {
    createPodcastEpisode(input: $input, condition: $condition) {
      id
    }
  }
`;

const ADMIN_UPDATE_PODCAST = /* GraphQL */ `
  mutation AdminUpdatePodcastEpisode($input: UpdatePodcastEpisodeInput!, $condition: ModelPodcastEpisodeConditionInput) {
    updatePodcastEpisode(input: $input, condition: $condition) {
      id
    }
  }
`;

const ADMIN_DELETE_PODCAST = /* GraphQL */ `
  mutation AdminDeletePodcastEpisode($input: DeletePodcastEpisodeInput!, $condition: ModelPodcastEpisodeConditionInput) {
    deletePodcastEpisode(input: $input, condition: $condition) {
      id
    }
  }
`;

const LIST_NEWS_OPTIONS = /* GraphQL */ `
  query AdminPodcastNewsOptions($limit: Int, $nextToken: String) {
    listNews(limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
      }
      nextToken
    }
  }
`;

const LIST_ANNOUNCEMENT_OPTIONS = /* GraphQL */ `
  query AdminPodcastAnnouncementOptions($limit: Int, $nextToken: String) {
    listAnnouncements(limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
      }
      nextToken
    }
  }
`;

const LIST_RESEARCH_OPTIONS = /* GraphQL */ `
  query AdminPodcastResearchOptions($limit: Int, $nextToken: String) {
    listResearchItems(limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
      }
      nextToken
    }
  }
`;

const sanitizeFileName = (name: string) =>
  name.replace(/[^\w.-]+/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '');

const uploadPublicFile = async (file: File, pathPrefix: string): Promise<string> => {
  const safeName = sanitizeFileName(file.name) || 'file';
  const fullPath = `public/${pathPrefix}/${Date.now()}-${safeName}`;
  const task = uploadData({ path: fullPath, data: file });
  await task.result;
  return buildS3PublicObjectUrl(fullPath);
};

const toSlug = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

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

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.filter((item: unknown): item is string => typeof item === 'string' && item.trim().length > 0);
};

const getFileNameFromUrl = (url: string | null): string | null => {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    return decodeURIComponent(parsed.pathname.split('/').pop() ?? '').trim() || 'archivo actual';
  } catch {
    return url.split('/').pop() ?? 'archivo actual';
  }
};

const buildEmptyForm = (): PodcastFormState => ({
  title: '',
  summary: '',
  slug: '',
  publishedAtLocal: '',
  status: PodcastStatus.PUBLISHED,
  highlight: false,
  coverImageUrl: null,
  audioUrl: null,
  relatedNewsIds: [],
  relatedAnnouncementIds: [],
  relatedResearchIds: [],
  coverImageFile: null,
  audioFile: null,
});

const getStatusLabel = (status: Status): string => {
  if (status === PodcastStatus.DRAFT) return 'Borrador';
  if (status === PodcastStatus.PUBLISHED) return 'Publicado';
  if (status === PodcastStatus.ARCHIVED) return 'Archivado';
  return String(status);
};

const getStatusBadgeClasses = (status: Status): string => {
  if (status === PodcastStatus.DRAFT) return 'border-yellow-200 bg-yellow-50 text-yellow-800';
  if (status === PodcastStatus.PUBLISHED) return 'border-emerald-200 bg-emerald-50 text-emerald-800';
  if (status === PodcastStatus.ARCHIVED) return 'border-gray-200 bg-gray-100 text-gray-700';
  return 'border-gray-200 bg-gray-100 text-gray-700';
};

const isScheduledPodcast = (item: { publishedAt?: string | null }) => {
  if (!item.publishedAt) return false;
  const publishedTime = new Date(item.publishedAt).getTime();
  if (Number.isNaN(publishedTime)) return false;
  return publishedTime > Date.now();
};

const sortRelatedOptions = (items: RelatedOption[]): RelatedOption[] =>
  [...items].sort((a, b) => a.title.localeCompare(b.title, 'es', { sensitivity: 'base' }));

type SearchableRelationSelectorProps = {
  title: string;
  helperText: string;
  options: RelatedOption[];
  selectedIds: string[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  onToggle: (id: string) => void;
  emptyText?: string;
};

const SearchableRelationSelector = ({
  title,
  helperText,
  options,
  selectedIds,
  searchValue,
  onSearchChange,
  onToggle,
  emptyText = 'No hay contenidos disponibles todavía.',
}: SearchableRelationSelectorProps) => (
  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-secondary-[bosques-nublados]">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-gray-600">{helperText}</p>
      </div>
      <div className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-600">
        {selectedIds.length} seleccionado(s)
      </div>
    </div>

    <div className="mt-4">
      <input
        type="search"
        value={searchValue}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={`Buscar en ${title.toLowerCase()}`}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
      />
    </div>

    <div className="mt-4 max-h-52 space-y-2 overflow-y-auto pr-1">
      {options.length > 0 ? (
        options.map((option) => {
          const isChecked = selectedIds.includes(option.id);
          return (
            <label
              key={option.id}
              className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2"
            >
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={isChecked}
                onChange={() => onToggle(option.id)}
              />
              <span className="text-sm text-gray-700">{option.title}</span>
            </label>
          );
        })
      ) : (
        <p className="text-sm text-gray-500">{emptyText}</p>
      )}
    </div>
  </div>
);

const AdminPodcastManager = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<AdminPodcastItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [titleSearch, setTitleSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | ''>('');
  const [showScheduledOnly, setShowScheduledOnly] = useState(false);

  const [newsOptions, setNewsOptions] = useState<RelatedOption[]>([]);
  const [announcementOptions, setAnnouncementOptions] = useState<RelatedOption[]>([]);
  const [researchOptions, setResearchOptions] = useState<RelatedOption[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [form, setForm] = useState<PodcastFormState>(buildEmptyForm());
  const [isSaving, setIsSaving] = useState(false);
  const [activeRelationTab, setActiveRelationTab] = useState<RelationTab>('news');
  const [relationSearch, setRelationSearch] = useState('');
  const [dragActiveTarget, setDragActiveTarget] = useState<UploadTarget | null>(null);

  const fetchRelationOptions = useCallback(async () => {
    const client = getGraphqlClient();

    const fetchOptions = async (
      query: string,
      extractItems: (response: any) => Array<{ id?: string | null; title?: string | null }>,
    ): Promise<RelatedOption[]> => {
      const options: RelatedOption[] = [];
      let nextToken: string | null = null;

      do {
        const response: any = await client.graphql({
          query,
          variables: { limit: 1000, nextToken },
          authMode: 'userPool',
        });

        const items = extractItems(response);
        options.push(
          ...items
            .filter((item) => item?.id && item?.title)
            .map((item) => ({
              id: String(item.id),
              title: String(item.title),
            })),
        );

        const payload = response?.data ?? {};
        const connection = Object.values(payload)[0] as { nextToken?: string | null } | undefined;
        nextToken = connection?.nextToken ?? null;
      } while (nextToken);

      return sortRelatedOptions(options);
    };

    const [nextNews, nextAnnouncements, nextResearch] = await Promise.all([
      fetchOptions(LIST_NEWS_OPTIONS, (response) => response?.data?.listNews?.items ?? []),
      fetchOptions(LIST_ANNOUNCEMENT_OPTIONS, (response) => response?.data?.listAnnouncements?.items ?? []),
      fetchOptions(LIST_RESEARCH_OPTIONS, (response) => response?.data?.listResearchItems?.items ?? []),
    ]);

    setNewsOptions(nextNews);
    setAnnouncementOptions(nextAnnouncements);
    setResearchOptions(nextResearch);
  }, []);

  const fetchPodcasts = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const client = getGraphqlClient();
      const collected: AdminPodcastItem[] = [];
      let nextToken: string | null = null;

      do {
        const filter =
          titleSearch.trim() || statusFilter || showScheduledOnly
            ? {
                ...(titleSearch.trim() ? { title: { contains: titleSearch.trim() } } : {}),
                ...(statusFilter ? { status: { eq: statusFilter } } : {}),
                ...(showScheduledOnly ? { publishedAt: { gt: new Date().toISOString() } } : {}),
              }
            : undefined;

        const response: any = await client.graphql({
          query: ADMIN_LIST_PODCASTS,
          variables: { filter, limit: 1000, nextToken },
          authMode: 'userPool',
        });

        const pageItems = (response?.data?.listPodcastEpisodes?.items ?? []) as AdminPodcastItem[];
        collected.push(...pageItems);
        nextToken = response?.data?.listPodcastEpisodes?.nextToken ?? null;
      } while (nextToken);

      const sorted = [...collected].sort((a, b) => {
        const aTime = new Date(a.publishedAt ?? a.createdAt ?? a.updatedAt ?? 0).getTime();
        const bTime = new Date(b.publishedAt ?? b.createdAt ?? b.updatedAt ?? 0).getTime();
        return bTime - aTime;
      });

      setItems(sorted);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'No se pudieron cargar los podcasts.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, [showScheduledOnly, statusFilter, titleSearch]);

  useEffect(() => {
    void fetchPodcasts();
  }, [fetchPodcasts]);

  useEffect(() => {
    void fetchRelationOptions();
  }, [fetchRelationOptions]);

  useEffect(() => {
    if (!successMessage) return;
    const timeoutId = window.setTimeout(() => setSuccessMessage(null), 2800);
    return () => window.clearTimeout(timeoutId);
  }, [successMessage]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setForm(buildEmptyForm());
    setActiveRelationTab('news');
    setRelationSearch('');
  }, []);

  const openCreateModal = useCallback(() => {
    setModalMode('create');
    setForm(buildEmptyForm());
    setErrorMessage(null);
    setActiveRelationTab('news');
    setRelationSearch('');
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback(async (id: string) => {
    setErrorMessage(null);
    setModalMode('edit');
    setIsModalOpen(true);

    try {
      const client = getGraphqlClient();
      const response: any = await client.graphql({
        query: ADMIN_GET_PODCAST,
        variables: { id },
        authMode: 'userPool',
      });

      const item = response?.data?.getPodcastEpisode as AdminPodcastItem | null;
      if (!item) {
        setErrorMessage('El podcast no existe o fue eliminado.');
        closeModal();
        return;
      }

      setForm({
        id: item.id,
        title: item.title ?? '',
        summary: item.description ?? '',
        slug: item.slug ?? '',
        publishedAtLocal: toDateTimeLocalValue(item.publishedAt),
        status: item.status ?? PodcastStatus.PUBLISHED,
        highlight: Boolean(item.highlight),
        coverImageUrl: item.coverImageUrl ?? null,
        audioUrl: item.audioUrl ?? null,
        relatedNewsIds: toStringArray(item.relatedNewsIds),
        relatedAnnouncementIds: toStringArray(item.relatedAnnouncementIds),
        relatedResearchIds: toStringArray(item.relatedResearchIds),
        coverImageFile: null,
        audioFile: null,
      });
      setActiveRelationTab('news');
      setRelationSearch('');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'No se pudo cargar el podcast.';
      setErrorMessage(message);
      closeModal();
    }
  }, [closeModal]);

  const handleFormChange = useCallback(<K extends keyof PodcastFormState>(key: K, value: PodcastFormState[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'title') {
        next.slug = toSlug(String(value));
      }
      return next;
    });
  }, []);

  const handleCoverImagePick = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, coverImageFile: nextFile }));
    setErrorMessage(null);
  }, []);

  const handleAudioPick = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, audioFile: nextFile }));
    setErrorMessage(null);
  }, []);

  const handleAssignDroppedFile = useCallback((target: UploadTarget, file: File | null) => {
    if (!file) return;

    if (target === 'cover') {
      if (!file.type.startsWith('image/')) {
        setErrorMessage('La portada debe ser un archivo de imagen.');
        return;
      }

      setForm((prev) => ({ ...prev, coverImageFile: file }));
      setErrorMessage(null);
      return;
    }

    if (!file.type.startsWith('audio/')) {
      setErrorMessage('El archivo principal debe ser un audio válido.');
      return;
    }

    setForm((prev) => ({ ...prev, audioFile: file }));
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
    const droppedFile = event.dataTransfer.files?.[0] ?? null;
    handleAssignDroppedFile(target, droppedFile);
  }, [handleAssignDroppedFile]);

  const handleToggleRelation = useCallback((
    key: 'relatedNewsIds' | 'relatedAnnouncementIds' | 'relatedResearchIds',
    id: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].includes(id)
        ? prev[key].filter((currentId) => currentId !== id)
        : [...prev[key], id],
    }));
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    const shouldDelete = window.confirm('¿Seguro que quieres eliminar este podcast?');
    if (!shouldDelete) return;

    try {
      const client = getGraphqlClient();
      await client.graphql({
        query: ADMIN_DELETE_PODCAST,
        variables: { input: { id } },
        authMode: 'userPool',
      });

      setSuccessMessage('Podcast eliminado.');
      void fetchPodcasts();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'No se pudo eliminar el podcast.';
      setErrorMessage(message);
    }
  }, [fetchPodcasts]);

  const handleSave = useCallback(async () => {
    if (!form.title.trim()) {
      setErrorMessage('El título es obligatorio.');
      return;
    }

    if (!form.summary.trim()) {
      setErrorMessage('El resumen es obligatorio.');
      return;
    }

    if (!form.audioUrl && !form.audioFile) {
      setErrorMessage('Debes subir un archivo de audio.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      const client = getGraphqlClient();
      const mediaPrefix = crypto.randomUUID();
      const publishedAt = toIsoFromDateTimeLocal(form.publishedAtLocal);

      let coverImageUrl = form.coverImageUrl;
      let audioUrl = form.audioUrl;

      if (form.coverImageFile) {
        coverImageUrl = await uploadPublicFile(form.coverImageFile, `podcast/${mediaPrefix}/cover`);
      }

      if (form.audioFile) {
        audioUrl = await uploadPublicFile(form.audioFile, `podcast/${mediaPrefix}/audio`);
      }

      const input = {
        ...(modalMode === 'edit' ? { id: form.id } : {}),
        title: form.title.trim(),
        slug: toSlug(form.title),
        description: form.summary.trim(),
        audioUrl,
        coverImageUrl,
        relatedNewsIds: form.relatedNewsIds,
        relatedAnnouncementIds: form.relatedAnnouncementIds,
        relatedResearchIds: form.relatedResearchIds,
        status: form.status,
        highlight: form.highlight,
        publishedAt,
      };

      await client.graphql({
        query: modalMode === 'create' ? ADMIN_CREATE_PODCAST : ADMIN_UPDATE_PODCAST,
        variables: { input },
        authMode: 'userPool',
      });

      setSuccessMessage(modalMode === 'create' ? 'Podcast creado.' : 'Podcast actualizado.');
      closeModal();
      void fetchPodcasts();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'No se pudo guardar el podcast.';
      setErrorMessage(message);
    } finally {
      setIsSaving(false);
    }
  }, [closeModal, fetchPodcasts, form, modalMode]);

  const stats = useMemo(() => ({
    total: items.length,
    highlighted: items.filter((item) => item.highlight).length,
    scheduled: items.filter((item) => isScheduledPodcast(item)).length,
  }), [items]);

  const relationTabs = useMemo(() => ([
    {
      key: 'news' as const,
      label: 'Noticias',
      helperText: 'Selecciona las noticias donde este podcast debe aparecer como relacionado.',
      options: newsOptions,
      selectedIds: form.relatedNewsIds,
      onToggle: (id: string) => handleToggleRelation('relatedNewsIds', id),
    },
    {
      key: 'announcements' as const,
      label: 'Comunicados',
      helperText: 'Usa esta pestaña para conectar el episodio con comunicados específicos.',
      options: announcementOptions,
      selectedIds: form.relatedAnnouncementIds,
      onToggle: (id: string) => handleToggleRelation('relatedAnnouncementIds', id),
    },
    {
      key: 'research' as const,
      label: 'Investigación',
      helperText: 'Relaciona el podcast con publicaciones de investigación cuando aporte contexto adicional.',
      options: researchOptions,
      selectedIds: form.relatedResearchIds,
      onToggle: (id: string) => handleToggleRelation('relatedResearchIds', id),
    },
  ]), [announcementOptions, form.relatedAnnouncementIds, form.relatedNewsIds, form.relatedResearchIds, handleToggleRelation, newsOptions, researchOptions]);

  const activeRelationConfig = useMemo(
    () => relationTabs.find((tab) => tab.key === activeRelationTab) ?? relationTabs[0],
    [activeRelationTab, relationTabs],
  );

  const filteredActiveOptions = useMemo(() => {
    if (!activeRelationConfig) return [];
    const normalizedSearch = relationSearch.trim().toLowerCase();
    if (!normalizedSearch) return activeRelationConfig.options;
    return activeRelationConfig.options.filter((option) =>
      option.title.toLowerCase().includes(normalizedSearch),
    );
  }, [activeRelationConfig, relationSearch]);

  const selectedRelationGroups = useMemo(() => relationTabs.map((tab) => ({
    key: tab.key,
    label: tab.label,
    items: tab.options.filter((option) => tab.selectedIds.includes(option.id)),
  })), [relationTabs]);

  const coverFileLabel = form.coverImageFile?.name ?? getFileNameFromUrl(form.coverImageUrl);
  const audioFileLabel = form.audioFile?.name ?? getFileNameFromUrl(form.audioUrl);
  const hasCoverFile = Boolean(form.coverImageFile || form.coverImageUrl);
  const hasAudioFile = Boolean(form.audioFile || form.audioUrl);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Podcast</h2>
          <p className="text-sm text-gray-600">
            Administra episodios con resumen, imagen, audio y relaciones hacia noticias, comunicados e investigación.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        >
          Nuevo podcast
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Total</p>
          <p className="mt-2 text-2xl font-black text-secondary-[bosques-nublados]">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Destacados</p>
          <p className="mt-2 text-2xl font-black text-secondary-[bosques-nublados]">{stats.highlighted}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Programados</p>
          <p className="mt-2 text-2xl font-black text-secondary-[bosques-nublados]">{stats.scheduled}</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <input
            type="search"
            value={titleSearch}
            onChange={(event) => setTitleSearch(event.target.value)}
            placeholder="Buscar por título"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter((event.target.value || '') as Status | '')}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">Todos los estados</option>
            <option value={PodcastStatus.PUBLISHED}>Publicado</option>
            <option value={PodcastStatus.DRAFT}>Borrador</option>
            <option value={PodcastStatus.ARCHIVED}>Archivado</option>
          </select>

          <button
            type="button"
            onClick={() => setShowScheduledOnly((prev) => !prev)}
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${
              showScheduledOnly
                ? 'border border-primary bg-primary text-white'
                : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            }`}
            aria-pressed={showScheduledOnly}
            aria-label={showScheduledOnly ? 'Ver todos los podcasts' : 'Ver podcasts programados'}
          >
            {showScheduledOnly ? 'Ver todas' : 'Ver programadas'}
          </button>

          <button
            type="button"
            onClick={() => {
              setTitleSearch('');
              setStatusFilter('');
              setShowScheduledOnly(false);
            }}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Podcast</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Relaciones</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Publicación</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                    Cargando podcasts...
                  </td>
                </tr>
              ) : items.length > 0 ? (
                items.map((item) => {
                  const relationCount =
                    toStringArray(item.relatedNewsIds).length
                    + toStringArray(item.relatedAnnouncementIds).length
                    + toStringArray(item.relatedResearchIds).length;
                  const isScheduled = isScheduledPodcast(item);

                  return (
                    <tr key={item.id} className="align-top">
                      <td className="px-4 py-4">
                        <div className="flex items-start gap-3">
                          <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                            {item.coverImageUrl ? (
                              <img src={item.coverImageUrl} alt={item.title} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[10px] font-bold uppercase tracking-wide text-gray-500">
                                Podcast
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-900">{item.title}</p>
                            <p className="mt-1 line-clamp-2 text-sm text-gray-600">{item.description}</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {item.highlight && (
                                <span className="inline-flex rounded-full border border-secondary-claro/40 bg-secondary-claro/15 px-2 py-0.5 text-[11px] font-semibold text-secondary-[bosques-nublados]">
                                  Destacado
                                </span>
                              )}
                              {isScheduled && (
                                <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-sky-700">
                                  Programado
                                </span>
                              )}
                              {item.audioUrl && (
                                <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                                  Audio listo
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusBadgeClasses(item.status)}`}>
                          {getStatusLabel(item.status)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {relationCount > 0 ? `${relationCount} vínculo(s)` : 'Sin vínculos'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {item.publishedAt ? new Date(item.publishedAt).toLocaleString('es-CO') : 'Sin fecha'}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => void openEditModal(item.id)}
                            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDelete(item.id)}
                            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                    No hay podcasts registrados con los filtros actuales.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/45 px-4 py-10">
          <div className="w-full max-w-5xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {modalMode === 'create' ? 'Nuevo podcast' : 'Editar podcast'}
                </h3>
                <p className="text-sm text-gray-500">
                  Define el resumen del episodio, sube el audio y conecta el contenido relacionado.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50"
                aria-label="Cerrar modal"
              >
                <span aria-hidden="true" className="text-xl leading-none">×</span>
              </button>
            </div>

            <div className="space-y-6 px-6 py-6">
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                <section className="space-y-4 xl:col-span-7">
                  <div className="rounded-2xl border border-gray-200 bg-white p-5">
                    <div className="flex flex-col gap-4">
                      <div>
                        <label htmlFor="podcastTitle" className="mb-1 block text-sm font-medium text-gray-700">Título</label>
                        <input
                          id="podcastTitle"
                          type="text"
                          value={form.title}
                          onChange={(event) => handleFormChange('title', event.target.value)}
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                          placeholder="Escribe el nombre del episodio"
                        />
                      </div>

                      <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Slug generado</p>
                        <p className="mt-1 break-all text-sm text-gray-700">
                          {form.slug || 'Se generará automáticamente con el título'}
                        </p>
                      </div>

                      <div>
                        <label htmlFor="podcastSummary" className="mb-1 block text-sm font-medium text-gray-700">Resumen</label>
                        <textarea
                          id="podcastSummary"
                          value={form.summary}
                          onChange={(event) => handleFormChange('summary', event.target.value)}
                          rows={7}
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                          placeholder="Resume de forma clara de qué trata este episodio"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                    <p className="text-sm font-semibold text-secondary-[bosques-nublados]">Publicación</p>
                    <p className="mt-1 text-xs leading-relaxed text-gray-600">
                      Define si el episodio se publica ahora, queda como borrador o se programa.
                    </p>

                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div>
                        <label htmlFor="podcastPublishedAt" className="mb-1 block text-sm font-medium text-gray-700">Fecha de publicación</label>
                        <input
                          id="podcastPublishedAt"
                          type="datetime-local"
                          value={form.publishedAtLocal}
                          onChange={(event) => handleFormChange('publishedAtLocal', event.target.value)}
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                        />
                      </div>

                      <div>
                        <label htmlFor="podcastStatus" className="mb-1 block text-sm font-medium text-gray-700">Estado</label>
                        <select
                          id="podcastStatus"
                          value={form.status}
                          onChange={(event) => handleFormChange('status', event.target.value as Status)}
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                        >
                          <option value={PodcastStatus.PUBLISHED}>Publicado</option>
                          <option value={PodcastStatus.DRAFT}>Borrador</option>
                          <option value={PodcastStatus.ARCHIVED}>Archivado</option>
                        </select>
                      </div>

                      <div className="flex items-end">
                        <label className="flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-3">
                          <input
                            type="checkbox"
                            checked={form.highlight}
                            onChange={(event) => handleFormChange('highlight', event.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className="text-sm font-medium text-gray-700">Destacar episodio</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </section>

                <aside className="space-y-4 xl:col-span-5">
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                    <p className="text-sm font-semibold text-secondary-[bosques-nublados]">Archivos del episodio</p>
                    <p className="mt-1 text-xs leading-relaxed text-gray-600">
                      Arrastra archivos aquí o haz clic para cargarlos. Solo necesitas una portada y el audio principal.
                    </p>

                    <div className="mt-4 space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <label
                          htmlFor="podcastCoverImage"
                          onDragOver={(event) => handleDragOverUploadArea(event, 'cover')}
                          onDragLeave={handleDragLeaveUploadArea}
                          onDrop={(event) => handleDropUploadArea(event, 'cover')}
                          className={`block cursor-pointer rounded-2xl border-2 border-dashed p-4 transition ${
                            dragActiveTarget === 'cover'
                              ? 'border-primary bg-primary/5'
                              : hasCoverFile
                                ? 'border-emerald-300 bg-emerald-50/60'
                                : 'border-gray-300 bg-white hover:border-primary/50 hover:bg-primary/5'
                          }`}
                        >
                          <input
                            id="podcastCoverImage"
                            type="file"
                            accept="image/*"
                            onChange={handleCoverImagePick}
                            className="hidden"
                          />
                          <div className="flex items-start gap-3">
                            <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${
                              hasCoverFile ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2 1.586-1.586a2 2 0 012.828 0L20 14m-6-10h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900">
                                {hasCoverFile ? 'Portada lista' : 'Imagen de portada'}
                              </p>
                              <p className="mt-1 text-xs leading-relaxed text-gray-600">
                                {hasCoverFile
                                  ? 'Puedes arrastrar otra imagen o hacer clic para reemplazar la actual.'
                                  : 'Arrastra una imagen aquí o haz clic para seleccionarla desde tu equipo.'}
                              </p>
                              <div className="mt-3 flex flex-wrap items-center gap-2">
                                <span className="inline-flex rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700">
                                  JPG, PNG, WEBP
                                </span>
                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                  hasCoverFile
                                    ? 'border border-emerald-200 bg-emerald-100 text-emerald-700'
                                    : 'border border-amber-200 bg-amber-50 text-amber-700'
                                }`}>
                                  {hasCoverFile ? 'Cargada' : 'Pendiente'}
                                </span>
                              </div>
                              {coverFileLabel && (
                                <p className="mt-3 truncate text-xs font-medium text-gray-700">
                                  Archivo: {coverFileLabel}
                                </p>
                              )}
                            </div>
                          </div>
                        </label>

                        <label
                          htmlFor="podcastAudioFile"
                          onDragOver={(event) => handleDragOverUploadArea(event, 'audio')}
                          onDragLeave={handleDragLeaveUploadArea}
                          onDrop={(event) => handleDropUploadArea(event, 'audio')}
                          className={`block cursor-pointer rounded-2xl border-2 border-dashed p-4 transition ${
                            dragActiveTarget === 'audio'
                              ? 'border-primary bg-primary/5'
                              : hasAudioFile
                                ? 'border-emerald-300 bg-emerald-50/60'
                                : 'border-gray-300 bg-white hover:border-primary/50 hover:bg-primary/5'
                          }`}
                        >
                          <input
                            id="podcastAudioFile"
                            type="file"
                            accept="audio/*"
                            onChange={handleAudioPick}
                            className="hidden"
                          />
                          <div className="flex items-start gap-3">
                            <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${
                              hasAudioFile ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-2v13M9 19a2 2 0 11-4 0 2 2 0 014 0zm12-2a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900">
                                {hasAudioFile ? 'Audio listo' : 'Archivo de audio'}
                              </p>
                              <p className="mt-1 text-xs leading-relaxed text-gray-600">
                                {hasAudioFile
                                  ? 'Puedes arrastrar otro audio o hacer clic para reemplazar el episodio actual.'
                                  : 'Arrastra el audio aquí o haz clic para buscarlo. Este será el archivo principal del podcast.'}
                              </p>
                              <div className="mt-3 flex flex-wrap items-center gap-2">
                                <span className="inline-flex rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700">
                                  MP3, WAV, M4A
                                </span>
                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                  hasAudioFile
                                    ? 'border border-emerald-200 bg-emerald-100 text-emerald-700'
                                    : 'border border-amber-200 bg-amber-50 text-amber-700'
                                }`}>
                                  {hasAudioFile ? 'Cargado' : 'Pendiente'}
                                </span>
                              </div>
                              {audioFileLabel && (
                                <p className="mt-3 truncate text-xs font-medium text-gray-700">
                                  Archivo: {audioFileLabel}
                                </p>
                              )}
                            </div>
                          </div>
                        </label>
                      </div>

                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white p-5">
                    <p className="text-sm font-semibold text-secondary-[bosques-nublados]">Resumen de vínculos</p>
                    <p className="mt-1 text-xs leading-relaxed text-gray-600">
                      Aquí ves rápido cuántos contenidos quedarán conectados con este podcast.
                    </p>

                    <div className="mt-4 grid grid-cols-3 gap-3">
                      {selectedRelationGroups.map((group) => (
                        <div key={group.key} className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-center">
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{group.label}</p>
                          <p className="mt-1 text-xl font-black text-secondary-[bosques-nublados]">{group.items.length}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </aside>
              </div>

              <section className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-secondary-[bosques-nublados]">Contenido relacionado</p>
                    <p className="mt-1 text-xs leading-relaxed text-gray-600">
                      Elige en qué secciones del sitio quieres mostrar un acceso hacia este podcast.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {relationTabs.map((tab) => {
                      const isActive = tab.key === activeRelationTab;
                      return (
                        <button
                          key={tab.key}
                          type="button"
                          onClick={() => {
                            setActiveRelationTab(tab.key);
                            setRelationSearch('');
                          }}
                          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                            isActive
                              ? 'bg-primary text-white'
                              : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {tab.label} ({tab.selectedIds.length})
                        </button>
                      );
                    })}
                  </div>
                </div>

                {activeRelationConfig && (
                  <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                    <SearchableRelationSelector
                      title={activeRelationConfig.label}
                      helperText={activeRelationConfig.helperText}
                      options={filteredActiveOptions}
                      selectedIds={activeRelationConfig.selectedIds}
                      searchValue={relationSearch}
                      onSearchChange={setRelationSearch}
                      onToggle={activeRelationConfig.onToggle}
                      emptyText={
                        relationSearch.trim()
                          ? 'No hay resultados para esa búsqueda.'
                          : 'No hay contenidos disponibles todavía.'
                      }
                    />

                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                      <p className="text-sm font-semibold text-secondary-[bosques-nublados]">
                        Selección actual
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-gray-600">
                        Revisa y desmarca fácilmente lo que ya elegiste en esta categoría.
                      </p>

                      <div className="mt-4 max-h-72 overflow-y-auto">
                        {activeRelationConfig.selectedIds.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {activeRelationConfig.options
                              .filter((option) => activeRelationConfig.selectedIds.includes(option.id))
                              .map((option) => (
                                <button
                                  key={option.id}
                                  type="button"
                                  onClick={() => activeRelationConfig.onToggle(option.id)}
                                  className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-2 text-left text-xs font-semibold text-primary"
                                >
                                  <span className="max-w-[220px] truncate">{option.title}</span>
                                  <span aria-hidden="true">×</span>
                                </button>
                              ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">
                            Aún no has seleccionado elementos en esta categoría.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </div>

            <div className="flex flex-col gap-3 border-t border-gray-100 px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={isSaving}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSaving ? 'Guardando...' : modalMode === 'create' ? 'Crear podcast' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPodcastManager;
