import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AdminFileUploadField,
  AdminImagePreview,
  getFileNameFromUrl,
} from './AdminFileUploadField';
import { Status } from '../../API';
import {
  CREATE_EDUCATIONAL_VIDEOCLIP,
  DELETE_EDUCATIONAL_VIDEOCLIP,
  GET_EDUCATIONAL_VIDEOCLIP,
  LIST_EDUCATIONAL_VIDEOCLIPS,
  LIST_INFORMATIVE_CAPSULES,
  UPDATE_EDUCATIONAL_VIDEOCLIP,
} from '../../graphql/capsulesVideoclips';
import { listAnnouncements, listNews, listResearchItems } from '../../graphql/queries';
import {
  formatPublishedDateEs,
  toDateTimeLocalValue,
  toIsoFromDateTimeLocal,
  toSlug,
  toStringArray,
  uploadPublicFile,
} from '../../lib/adminHelpers';
import { getGraphqlClient } from '../../lib/amplifySetup';
import { VIDEOCLIP_TOPIC_CATEGORY_OPTIONS } from '../../lib/videoclipMapper';
import { normalizeYouTubeInput } from '../../lib/youtubeEmbed';

const LIST_PODCAST_OPTIONS = /* GraphQL */ `
  query ListPodcastOptions($limit: Int, $nextToken: String) {
    listPodcastEpisodes(limit: $limit, nextToken: $nextToken) {
      items { id title }
      nextToken
    }
  }
`;

type RelatedOption = { id: string; title: string };

type AdminVideoclip = {
  id: string;
  title: string;
  slug: string;
  description: string;
  youtubeUrl: string;
  topicCategory?: string | null;
  coverImageUrl?: string | null;
  status: Status;
  highlight: boolean;
  publishedAt?: string | null;
  relatedNewsIds?: Array<string | null> | null;
  relatedAnnouncementIds?: Array<string | null> | null;
  relatedResearchIds?: Array<string | null> | null;
  relatedCapsuleIds?: Array<string | null> | null;
  relatedPodcastIds?: Array<string | null> | null;
};

type VideoclipFormState = {
  id?: string;
  title: string;
  summary: string;
  slug: string;
  youtubeUrl: string;
  topicCategory: string;
  publishedAtLocal: string;
  status: Status;
  highlight: boolean;
  coverImageUrl: string | null;
  coverFile: File | null;
  relatedNewsIds: string[];
  relatedAnnouncementIds: string[];
  relatedResearchIds: string[];
  relatedCapsuleIds: string[];
  relatedPodcastIds: string[];
};

const buildEmptyForm = (): VideoclipFormState => ({
  title: '',
  summary: '',
  slug: '',
  youtubeUrl: '',
  topicCategory: '',
  publishedAtLocal: '',
  status: Status.PUBLISHED,
  highlight: false,
  coverImageUrl: null,
  coverFile: null,
  relatedNewsIds: [],
  relatedAnnouncementIds: [],
  relatedResearchIds: [],
  relatedCapsuleIds: [],
  relatedPodcastIds: [],
});

const fetchAllOptions = async (
  query: string,
  key: string,
): Promise<RelatedOption[]> => {
  const client = getGraphqlClient();
  const options: RelatedOption[] = [];
  let nextToken: string | null = null;

  do {
    const response: any = await client.graphql({
      query,
      variables: { limit: 1000, nextToken },
      authMode: 'userPool',
    });
    const items = response?.data?.[key]?.items ?? [];
    options.push(
      ...items
        .filter((item: { id?: string; title?: string }) => item?.id && item?.title)
        .map((item: { id: string; title: string }) => ({ id: String(item.id), title: String(item.title) })),
    );
    nextToken = response?.data?.[key]?.nextToken ?? null;
  } while (nextToken);

  return options.sort((a, b) => a.title.localeCompare(b.title, 'es'));
};

const RelationSelector = ({
  title,
  options,
  selectedIds,
  onToggle,
}: {
  title: string;
  options: RelatedOption[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}) => (
  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
    <p className="text-sm font-semibold text-secondary-[bosques-nublados]">{title}</p>
    <div className="mt-3 max-h-40 space-y-2 overflow-y-auto">
      {options.length === 0 ? (
        <p className="text-xs text-gray-500">Sin contenidos disponibles.</p>
      ) : (
        options.map((option) => (
          <label key={option.id} className="flex items-start gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={selectedIds.includes(option.id)}
              onChange={() => onToggle(option.id)}
              className="mt-1"
            />
            <span>{option.title}</span>
          </label>
        ))
      )}
    </div>
  </div>
);

const AdminVideoclipsManager = () => {
  const [items, setItems] = useState<AdminVideoclip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [titleSearch, setTitleSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [form, setForm] = useState<VideoclipFormState>(buildEmptyForm());
  const [isSaving, setIsSaving] = useState(false);
  const [newsOptions, setNewsOptions] = useState<RelatedOption[]>([]);
  const [announcementOptions, setAnnouncementOptions] = useState<RelatedOption[]>([]);
  const [researchOptions, setResearchOptions] = useState<RelatedOption[]>([]);
  const [capsuleOptions, setCapsuleOptions] = useState<RelatedOption[]>([]);
  const [podcastOptions, setPodcastOptions] = useState<RelatedOption[]>([]);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);

  const topicCategorySelectOptions = useMemo(() => {
    const known = new Set<string>(VIDEOCLIP_TOPIC_CATEGORY_OPTIONS);
    const current = form.topicCategory.trim();
    if (current && !known.has(current)) {
      return [...VIDEOCLIP_TOPIC_CATEGORY_OPTIONS, current];
    }
    return [...VIDEOCLIP_TOPIC_CATEGORY_OPTIONS];
  }, [form.topicCategory]);

  useEffect(() => {
    if (!form.coverFile) {
      setCoverPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(form.coverFile);
    setCoverPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [form.coverFile]);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const client = getGraphqlClient();
      const collected: AdminVideoclip[] = [];
      let nextToken: string | null = null;

      do {
        const response: any = await client.graphql({
          query: LIST_EDUCATIONAL_VIDEOCLIPS,
          variables: {
            filter: titleSearch.trim() ? { title: { contains: titleSearch.trim() } } : undefined,
            limit: 1000,
            nextToken,
          },
          authMode: 'userPool',
        });
        collected.push(...(response?.data?.listEducationalVideoclips?.items ?? []));
        nextToken = response?.data?.listEducationalVideoclips?.nextToken ?? null;
      } while (nextToken);

      setItems(collected);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No se pudieron cargar los videoclips.');
    } finally {
      setIsLoading(false);
    }
  }, [titleSearch]);

  useEffect(() => {
    void fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    const loadOptions = async () => {
      const [news, announcements, research, capsules, podcasts] = await Promise.all([
        fetchAllOptions(listNews, 'listNews'),
        fetchAllOptions(listAnnouncements, 'listAnnouncements'),
        fetchAllOptions(listResearchItems, 'listResearchItems'),
        fetchAllOptions(LIST_INFORMATIVE_CAPSULES, 'listInformativeCapsules'),
        fetchAllOptions(LIST_PODCAST_OPTIONS, 'listPodcastEpisodes'),
      ]);
      setNewsOptions(news);
      setAnnouncementOptions(announcements);
      setResearchOptions(research);
      setCapsuleOptions(capsules);
      setPodcastOptions(podcasts);
    };
    void loadOptions();
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setForm(buildEmptyForm());
  }, []);

  const openCreateModal = useCallback(() => {
    setModalMode('create');
    setForm(buildEmptyForm());
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback(async (id: string) => {
    setModalMode('edit');
    setIsModalOpen(true);
    try {
      const client = getGraphqlClient();
      const response: any = await client.graphql({
        query: GET_EDUCATIONAL_VIDEOCLIP,
        variables: { id },
        authMode: 'userPool',
      });
      const item = response?.data?.getEducationalVideoclip as AdminVideoclip | null;
      if (!item) {
        setErrorMessage('El videoclip no existe.');
        closeModal();
        return;
      }
      setForm({
        id: item.id,
        title: item.title,
        summary: item.description,
        slug: item.slug,
        youtubeUrl: item.youtubeUrl,
        topicCategory: item.topicCategory ?? '',
        publishedAtLocal: toDateTimeLocalValue(item.publishedAt),
        status: item.status,
        highlight: Boolean(item.highlight),
        coverImageUrl: item.coverImageUrl ?? null,
        coverFile: null,
        relatedNewsIds: toStringArray(item.relatedNewsIds),
        relatedAnnouncementIds: toStringArray(item.relatedAnnouncementIds),
        relatedResearchIds: toStringArray(item.relatedResearchIds),
        relatedCapsuleIds: toStringArray(item.relatedCapsuleIds),
        relatedPodcastIds: toStringArray(item.relatedPodcastIds),
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No se pudo cargar el videoclip.');
      closeModal();
    }
  }, [closeModal]);

  const handleFormChange = useCallback(<K extends keyof VideoclipFormState>(key: K, value: VideoclipFormState[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'title') next.slug = toSlug(String(value));
      return next;
    });
  }, []);

  const handleToggleRelation = useCallback((key: keyof Pick<VideoclipFormState, 'relatedNewsIds' | 'relatedAnnouncementIds' | 'relatedResearchIds' | 'relatedCapsuleIds' | 'relatedPodcastIds'>, id: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].includes(id) ? prev[key].filter((current) => current !== id) : [...prev[key], id],
    }));
  }, []);

  const handleCoverPick = useCallback((files: File[]) => {
    const file = files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Solo se permiten imágenes para la portada.');
      return;
    }
    setErrorMessage(null);
    handleFormChange('coverFile', file);
  }, [handleFormChange]);

  const handleRemoveCover = useCallback(() => {
    setForm((prev) => ({ ...prev, coverImageUrl: null, coverFile: null }));
  }, []);

  const hasCoverContent = Boolean(coverPreviewUrl || form.coverImageUrl || form.coverFile);
  const coverFileLabel = form.coverFile?.name ?? getFileNameFromUrl(form.coverImageUrl);

  const handleSave = useCallback(async () => {
    const normalizedYoutube = normalizeYouTubeInput(form.youtubeUrl);
    if (!form.title.trim() || !form.summary.trim() || !normalizedYoutube) {
      setErrorMessage('Título, resumen y URL de YouTube válida son obligatorios.');
      return;
    }

    setIsSaving(true);
    try {
      let coverImageUrl = form.coverImageUrl;
      if (form.coverFile) {
        coverImageUrl = await uploadPublicFile(form.coverFile, 'videoclips/covers');
      }

      const input = {
        title: form.title.trim(),
        slug: form.slug.trim() || toSlug(form.title),
        description: form.summary.trim(),
        youtubeUrl: normalizedYoutube,
        topicCategory: form.topicCategory.trim() || null,
        coverImageUrl,
        status: form.status,
        highlight: form.highlight,
        publishedAt: toIsoFromDateTimeLocal(form.publishedAtLocal),
        relatedNewsIds: form.relatedNewsIds.length > 0 ? form.relatedNewsIds : null,
        relatedAnnouncementIds: form.relatedAnnouncementIds.length > 0 ? form.relatedAnnouncementIds : null,
        relatedResearchIds: form.relatedResearchIds.length > 0 ? form.relatedResearchIds : null,
        relatedCapsuleIds: form.relatedCapsuleIds.length > 0 ? form.relatedCapsuleIds : null,
        relatedPodcastIds: form.relatedPodcastIds.length > 0 ? form.relatedPodcastIds : null,
      };

      const client = getGraphqlClient();
      if (modalMode === 'create') {
        await client.graphql({ query: CREATE_EDUCATIONAL_VIDEOCLIP, variables: { input }, authMode: 'userPool' });
        setSuccessMessage('Videoclip creado.');
      } else if (form.id) {
        await client.graphql({
          query: UPDATE_EDUCATIONAL_VIDEOCLIP,
          variables: { input: { id: form.id, ...input } },
          authMode: 'userPool',
        });
        setSuccessMessage('Videoclip actualizado.');
      }

      closeModal();
      void fetchItems();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No se pudo guardar el videoclip.');
    } finally {
      setIsSaving(false);
    }
  }, [closeModal, fetchItems, form, modalMode]);

  const handleDelete = useCallback(async (id: string) => {
    if (!window.confirm('¿Eliminar este videoclip?')) return;
    try {
      const client = getGraphqlClient();
      await client.graphql({ query: DELETE_EDUCATIONAL_VIDEOCLIP, variables: { input: { id } }, authMode: 'userPool' });
      setSuccessMessage('Videoclip eliminado.');
      void fetchItems();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No se pudo eliminar.');
    }
  }, [fetchItems]);

  const filteredItems = useMemo(() => items, [items]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={titleSearch}
          onChange={(event) => setTitleSearch(event.target.value)}
          placeholder="Buscar por título..."
          className="w-full max-w-md rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <button type="button" onClick={openCreateModal} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">
          Nuevo videoclip
        </button>
      </div>

      {errorMessage ? <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p> : null}
      {successMessage ? <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{successMessage}</p> : null}

      {isLoading ? (
        <p className="text-sm text-gray-600">Cargando videoclips...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Título</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Categoría</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Estado</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Fecha</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">{item.title}</td>
                  <td className="px-4 py-3 text-gray-600">{item.topicCategory ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{item.status}</td>
                  <td className="px-4 py-3 text-gray-600">{formatPublishedDateEs(item.publishedAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" onClick={() => void openEditModal(item.id)} className="mr-3 text-primary hover:underline">
                      Editar
                    </button>
                    <button type="button" onClick={() => void handleDelete(item.id)} className="text-red-600 hover:underline">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900">
              {modalMode === 'create' ? 'Nuevo videoclip educativo' : 'Editar videoclip'}
            </h2>

            <div className="mt-6 space-y-4">
              <input
                value={form.title}
                onChange={(event) => handleFormChange('title', event.target.value)}
                placeholder="Título"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              <textarea
                value={form.summary}
                onChange={(event) => handleFormChange('summary', event.target.value)}
                placeholder="Descripción"
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              <input
                value={form.youtubeUrl}
                onChange={(event) => handleFormChange('youtubeUrl', event.target.value)}
                placeholder="URL de YouTube (watch, shorts o youtu.be)"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              <select
                value={form.topicCategory}
                onChange={(event) => handleFormChange('topicCategory', event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                aria-label="Categoría temática"
              >
                <option value="">Seleccionar categoría temática</option>
                {topicCategorySelectOptions.map((category) => {
                  const isKnown = (VIDEOCLIP_TOPIC_CATEGORY_OPTIONS as readonly string[]).includes(category);
                  return (
                    <option key={category} value={category}>
                      {isKnown ? category : `${category} (valor guardado)`}
                    </option>
                  );
                })}
              </select>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <select
                  value={form.status}
                  onChange={(event) => handleFormChange('status', event.target.value as Status)}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value={Status.DRAFT}>Borrador</option>
                  <option value={Status.PUBLISHED}>Publicado</option>
                  <option value={Status.ARCHIVED}>Archivado</option>
                </select>
                <input
                  type="datetime-local"
                  value={form.publishedAtLocal}
                  onChange={(event) => handleFormChange('publishedAtLocal', event.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.highlight}
                    onChange={(event) => handleFormChange('highlight', event.target.checked)}
                  />
                  Destacado
                </label>
              </div>

              <div className="space-y-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm font-semibold text-gray-900">Portada del videoclip</p>
                <p className="text-xs leading-relaxed text-gray-600">
                  Opcional. Si no subes una imagen, se usará la miniatura de YouTube.
                </p>

                <AdminFileUploadField
                  id="videoclipCoverImage"
                  title="Imagen de portada"
                  description="Arrastra una imagen aquí o haz clic para seleccionarla desde tu equipo."
                  descriptionWhenReady="Puedes arrastrar otra imagen o hacer clic para reemplazar la actual."
                  accept="image/*"
                  disabled={isSaving}
                  hasContent={hasCoverContent}
                  fileName={coverFileLabel}
                  formatBadge="JPG, PNG, WEBP"
                  pendingStatusLabel="Opcional"
                  onFilesSelected={handleCoverPick}
                />

                <AdminImagePreview
                  src={coverPreviewUrl ?? form.coverImageUrl}
                  alt="Vista previa de portada"
                  onRemove={hasCoverContent ? handleRemoveCover : undefined}
                  disabled={isSaving}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <RelationSelector
                  title="Noticias relacionadas"
                  options={newsOptions}
                  selectedIds={form.relatedNewsIds}
                  onToggle={(id) => handleToggleRelation('relatedNewsIds', id)}
                />
                <RelationSelector
                  title="Comunicados relacionados"
                  options={announcementOptions}
                  selectedIds={form.relatedAnnouncementIds}
                  onToggle={(id) => handleToggleRelation('relatedAnnouncementIds', id)}
                />
                <RelationSelector
                  title="Investigación relacionada"
                  options={researchOptions}
                  selectedIds={form.relatedResearchIds}
                  onToggle={(id) => handleToggleRelation('relatedResearchIds', id)}
                />
                <RelationSelector
                  title="Cápsulas relacionadas"
                  options={capsuleOptions}
                  selectedIds={form.relatedCapsuleIds}
                  onToggle={(id) => handleToggleRelation('relatedCapsuleIds', id)}
                />
                <RelationSelector
                  title="Podcasts relacionados"
                  options={podcastOptions}
                  selectedIds={form.relatedPodcastIds}
                  onToggle={(id) => handleToggleRelation('relatedPodcastIds', id)}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={closeModal} className="rounded-lg border border-gray-300 px-4 py-2 text-sm">
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={isSaving}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {isSaving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AdminVideoclipsManager;
