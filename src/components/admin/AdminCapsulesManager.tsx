import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AdminFileUploadField,
  AdminImagePreview,
  AdminUploadedFileList,
  getFileNameFromUrl,
} from './AdminFileUploadField';
import { Status } from '../../API';
import {
  createInformativeCapsule,
  deleteInformativeCapsule,
  updateInformativeCapsule,
} from '../../graphql/mutations';
import { getInformativeCapsule, listInformativeCapsules } from '../../graphql/queries';
import {
  formatPublishedDateEs,
  toDateTimeLocalValue,
  toIsoFromDateTimeLocal,
  toSlug,
  uploadPublicFile,
} from '../../lib/adminHelpers';
import { getGraphqlClient } from '../../lib/amplifySetup';
import {
  CAPSULE_CONTEXT_OPTIONS,
  formatCapsuleContextLabel,
  toApiCapsuleContextType,
  type CapsuleContextType,
} from '../../lib/capsuleMapper';

type AdminCapsule = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  contextType?: string | null;
  legalReference?: string | null;
  institution?: string | null;
  category?: string | null;
  coverImageUrl?: string | null;
  attachmentUrls?: Array<string | null> | null;
  status: Status;
  highlight: boolean;
  authorName?: string | null;
  publishedAt?: string | null;
};

type CapsuleFormState = {
  id?: string;
  title: string;
  summary: string;
  body: string;
  contextType: CapsuleContextType;
  legalReference: string;
  institution: string;
  category: string;
  authorName: string;
  slug: string;
  publishedAtLocal: string;
  status: Status;
  highlight: boolean;
  coverImageUrl: string | null;
  attachmentUrls: string[];
  coverFile: File | null;
  attachmentFiles: File[];
};

const buildEmptyForm = (): CapsuleFormState => ({
  title: '',
  summary: '',
  body: '',
  contextType: 'Tec científico',
  legalReference: '',
  institution: '',
  category: '',
  authorName: '',
  slug: '',
  publishedAtLocal: '',
  status: Status.PUBLISHED,
  highlight: false,
  coverImageUrl: null,
  attachmentUrls: [],
  coverFile: null,
  attachmentFiles: [],
});

const AdminCapsulesManager = () => {
  const [items, setItems] = useState<AdminCapsule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [titleSearch, setTitleSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [form, setForm] = useState<CapsuleFormState>(buildEmptyForm());
  const [isSaving, setIsSaving] = useState(false);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);

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
    setErrorMessage(null);
    try {
      const client = getGraphqlClient();
      const collected: AdminCapsule[] = [];
      let nextToken: string | null = null;

      do {
        const response: any = await client.graphql({
          query: listInformativeCapsules,
          variables: {
            filter: titleSearch.trim() ? { title: { contains: titleSearch.trim() } } : undefined,
            limit: 1000,
            nextToken,
          },
          authMode: 'userPool',
        });
        collected.push(...(response?.data?.listInformativeCapsules?.items ?? []));
        nextToken = response?.data?.listInformativeCapsules?.nextToken ?? null;
      } while (nextToken);

      setItems(
        collected.sort((a, b) => {
          const aTime = new Date(a.publishedAt ?? 0).getTime();
          const bTime = new Date(b.publishedAt ?? 0).getTime();
          return bTime - aTime;
        }),
      );
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No se pudieron cargar las cápsulas.');
    } finally {
      setIsLoading(false);
    }
  }, [titleSearch]);

  useEffect(() => {
    void fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    if (!successMessage) return;
    const timer = window.setTimeout(() => setSuccessMessage(null), 2800);
    return () => window.clearTimeout(timer);
  }, [successMessage]);

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
        query: getInformativeCapsule,
        variables: { id },
        authMode: 'userPool',
      });
      const item = response?.data?.getInformativeCapsule as AdminCapsule | null;
      if (!item) {
        setErrorMessage('La cápsula no existe.');
        closeModal();
        return;
      }
      setForm({
        id: item.id,
        title: item.title,
        summary: item.summary,
        body: item.body,
        contextType: CAPSULE_CONTEXT_OPTIONS.find(
          (option) => toApiCapsuleContextType(option) === String(item.contextType ?? '').toUpperCase(),
        ) ?? 'Tec científico',
        legalReference: item.legalReference ?? '',
        institution: item.institution ?? '',
        category: item.category ?? '',
        authorName: item.authorName ?? '',
        slug: item.slug,
        publishedAtLocal: toDateTimeLocalValue(item.publishedAt),
        status: item.status,
        highlight: Boolean(item.highlight),
        coverImageUrl: item.coverImageUrl ?? null,
        attachmentUrls: (item.attachmentUrls ?? []).filter((url): url is string => typeof url === 'string'),
        coverFile: null,
        attachmentFiles: [],
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No se pudo cargar la cápsula.');
      closeModal();
    }
  }, [closeModal]);

  const handleFormChange = useCallback(<K extends keyof CapsuleFormState>(key: K, value: CapsuleFormState[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'title') next.slug = toSlug(String(value));
      return next;
    });
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

  const handleAttachmentPick = useCallback((files: File[]) => {
    if (files.length === 0) return;
    setForm((prev) => ({ ...prev, attachmentFiles: [...prev.attachmentFiles, ...files] }));
  }, []);

  const handleRemoveCover = useCallback(() => {
    setForm((prev) => ({ ...prev, coverImageUrl: null, coverFile: null }));
  }, []);

  const handleRemoveExistingAttachment = useCallback((url: string) => {
    setForm((prev) => ({
      ...prev,
      attachmentUrls: prev.attachmentUrls.filter((current) => current !== url),
    }));
  }, []);

  const handleRemovePendingAttachment = useCallback((fileKey: string) => {
    setForm((prev) => ({
      ...prev,
      attachmentFiles: prev.attachmentFiles.filter(
        (file) => `${file.name}-${file.size}-${file.lastModified}` !== fileKey,
      ),
    }));
  }, []);

  const hasCoverContent = Boolean(coverPreviewUrl || form.coverImageUrl || form.coverFile);
  const attachmentCount = form.attachmentUrls.length + form.attachmentFiles.length;
  const coverFileLabel = form.coverFile?.name ?? getFileNameFromUrl(form.coverImageUrl);

  const handleSave = useCallback(async () => {
    if (!form.title.trim() || !form.summary.trim() || !form.body.trim()) {
      setErrorMessage('Título, resumen y contenido son obligatorios.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    try {
      let coverImageUrl = form.coverImageUrl;
      if (form.coverFile) {
        coverImageUrl = await uploadPublicFile(form.coverFile, 'capsules/covers');
      }

      const uploadedAttachments = await Promise.all(
        form.attachmentFiles.map((file) => uploadPublicFile(file, 'capsules/attachments')),
      );
      const attachmentUrls = [...form.attachmentUrls, ...uploadedAttachments];

      const input = {
        title: form.title.trim(),
        slug: form.slug.trim() || toSlug(form.title),
        summary: form.summary.trim(),
        body: form.body.trim(),
        contextType: toApiCapsuleContextType(form.contextType),
        legalReference: form.legalReference.trim() || null,
        institution: form.institution.trim() || null,
        category: form.category.trim() || null,
        authorName: form.authorName.trim() || null,
        coverImageUrl,
        attachmentUrls: attachmentUrls.length > 0 ? attachmentUrls : null,
        status: form.status,
        highlight: form.highlight,
        publishedAt: toIsoFromDateTimeLocal(form.publishedAtLocal),
      };

      const client = getGraphqlClient();
      if (modalMode === 'create') {
        await client.graphql({
          query: createInformativeCapsule,
          variables: { input },
          authMode: 'userPool',
        });
        setSuccessMessage('Cápsula creada.');
      } else if (form.id) {
        await client.graphql({
          query: updateInformativeCapsule,
          variables: { input: { id: form.id, ...input } },
          authMode: 'userPool',
        });
        setSuccessMessage('Cápsula actualizada.');
      }

      closeModal();
      void fetchItems();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No se pudo guardar la cápsula.');
    } finally {
      setIsSaving(false);
    }
  }, [closeModal, fetchItems, form, modalMode]);

  const handleDelete = useCallback(async (id: string) => {
    if (!window.confirm('¿Eliminar esta cápsula informativa?')) return;
    try {
      const client = getGraphqlClient();
      await client.graphql({
        query: deleteInformativeCapsule,
        variables: { input: { id } },
        authMode: 'userPool',
      });
      setSuccessMessage('Cápsula eliminada.');
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
        <button
          type="button"
          onClick={openCreateModal}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          Nueva cápsula
        </button>
      </div>

      {errorMessage ? <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p> : null}
      {successMessage ? <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{successMessage}</p> : null}

      {isLoading ? (
        <p className="text-sm text-gray-600">Cargando cápsulas...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Título</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Contexto</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Estado</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Fecha</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">{item.title}</td>
                  <td className="px-4 py-3 text-gray-600">{formatCapsuleContextLabel(item.contextType)}</td>
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
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900">
              {modalMode === 'create' ? 'Nueva cápsula informativa' : 'Editar cápsula'}
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
                placeholder="Resumen"
                rows={2}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              <textarea
                value={form.body}
                onChange={(event) => handleFormChange('body', event.target.value)}
                placeholder="Contenido (separar párrafos con línea en blanco)"
                rows={8}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />

              <div>
                <p className="mb-2 text-sm font-semibold text-gray-700">Tipo de contexto</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {CAPSULE_CONTEXT_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleFormChange('contextType', option)}
                      className={`rounded-lg border px-3 py-2 text-xs font-semibold uppercase ${
                        form.contextType === option
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-200 bg-white text-gray-700'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  value={form.legalReference}
                  onChange={(event) => handleFormChange('legalReference', event.target.value)}
                  placeholder="Referencia legal (opcional)"
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <input
                  value={form.institution}
                  onChange={(event) => handleFormChange('institution', event.target.value)}
                  placeholder="Institución (opcional)"
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

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
                  Destacada
                </label>
              </div>

              <div className="space-y-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm font-semibold text-gray-900">Medios de la cápsula</p>
                <p className="text-xs leading-relaxed text-gray-600">
                  Sube una portada y, si aplica, documentos de soporte en PDF o imagen.
                </p>

                <AdminFileUploadField
                  id="capsuleCoverImage"
                  title="Imagen de portada"
                  description="Arrastra una imagen aquí o haz clic para seleccionarla desde tu equipo."
                  descriptionWhenReady="Puedes arrastrar otra imagen o hacer clic para reemplazar la portada actual."
                  accept="image/*"
                  disabled={isSaving}
                  hasContent={hasCoverContent}
                  fileName={coverFileLabel}
                  formatBadge="JPG, PNG, WEBP"
                  pendingStatusLabel="Recomendada"
                  onFilesSelected={handleCoverPick}
                />

                <AdminFileUploadField
                  id="capsuleAttachments"
                  title="Adjuntos PDF o imagen"
                  description="Úsalos para normas, resoluciones, informes o material complementario."
                  descriptionWhenReady="Puedes seguir agregando más archivos de soporte."
                  multiple
                  disabled={isSaving}
                  variant="attachment"
                  hasContent={attachmentCount > 0}
                  contentCount={attachmentCount}
                  formatBadge="PDF, JPG, PNG"
                  pendingStatusLabel="Opcional"
                  onFilesSelected={handleAttachmentPick}
                />

                <AdminImagePreview
                  src={coverPreviewUrl ?? form.coverImageUrl}
                  alt="Vista previa de portada"
                  onRemove={hasCoverContent ? handleRemoveCover : undefined}
                  disabled={isSaving}
                />

                <AdminUploadedFileList
                  title="Adjuntos guardados"
                  items={form.attachmentUrls.map((url) => ({
                    key: url,
                    label: getFileNameFromUrl(url) ?? url,
                  }))}
                  onRemove={handleRemoveExistingAttachment}
                  disabled={isSaving}
                />

                <AdminUploadedFileList
                  title="Adjuntos por subir"
                  items={form.attachmentFiles.map((file) => ({
                    key: `${file.name}-${file.size}-${file.lastModified}`,
                    label: file.name,
                  }))}
                  onRemove={handleRemovePendingAttachment}
                  disabled={isSaving}
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

export default AdminCapsulesManager;
