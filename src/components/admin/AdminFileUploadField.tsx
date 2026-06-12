import { type DragEvent, type ChangeEvent, useCallback, useState } from 'react';

export type AdminFileUploadVariant = 'image' | 'attachment';

export type AdminFileUploadFieldProps = {
  id: string;
  title: string;
  description: string;
  descriptionWhenReady?: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  variant?: AdminFileUploadVariant;
  formatBadge?: string;
  readyStatusLabel?: string;
  pendingStatusLabel?: string;
  hasContent: boolean;
  contentCount?: number;
  fileName?: string | null;
  onFilesSelected: (files: File[]) => void;
};

const ImageIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2 1.586-1.586a2 2 0 012.828 0L20 14m-6-10h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const AttachmentIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828L18 9.828a4 4 0 10-5.656-5.656L5.757 10.757a6 6 0 108.486 8.486L20.5 13"
    />
  </svg>
);

export const getFileNameFromUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  const segment = url.split('/').pop()?.split('?')[0]?.trim();
  return segment || null;
};

export const AdminFileUploadField = ({
  id,
  title,
  description,
  descriptionWhenReady,
  accept,
  multiple = false,
  disabled = false,
  variant = 'image',
  formatBadge,
  readyStatusLabel,
  pendingStatusLabel,
  hasContent,
  contentCount,
  fileName,
  onFilesSelected,
}: AdminFileUploadFieldProps) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files ?? []);
      event.target.value = '';
      if (files.length > 0) onFilesSelected(files);
    },
    [onFilesSelected],
  );

  const handleDragOver = useCallback(
    (event: DragEvent<HTMLLabelElement>) => {
      if (disabled) return;
      event.preventDefault();
      setIsDragActive(true);
    },
    [disabled],
  );

  const handleDragLeave = useCallback(() => {
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLLabelElement>) => {
      if (disabled) return;
      event.preventDefault();
      setIsDragActive(false);
      const files = Array.from(event.dataTransfer.files ?? []);
      if (files.length > 0) onFilesSelected(files);
    },
    [disabled, onFilesSelected],
  );

  const readyLabel =
    readyStatusLabel ??
    (contentCount != null && contentCount > 0 ? `${contentCount} cargado(s)` : 'Cargada');
  const pendingLabel = pendingStatusLabel ?? 'Pendiente';
  const helperText = hasContent ? (descriptionWhenReady ?? description) : description;

  return (
    <label
      htmlFor={id}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`block rounded-2xl border-2 border-dashed p-4 transition ${
        disabled
          ? 'cursor-not-allowed border-gray-200 bg-gray-50 opacity-70'
          : isDragActive
            ? 'cursor-pointer border-primary bg-primary/5'
            : hasContent
              ? 'cursor-pointer border-emerald-300 bg-emerald-50/60 hover:border-emerald-400'
              : 'cursor-pointer border-gray-300 bg-white hover:border-primary/50 hover:bg-primary/5'
      }`}
      aria-label={title}
    >
      <input
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={handleInputChange}
        disabled={disabled}
      />
      <div className="flex items-start gap-3">
        <div
          className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            hasContent ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
          }`}
        >
          {variant === 'attachment' ? <AttachmentIcon /> : <ImageIcon />}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900">{hasContent ? `${title} lista` : title}</p>
          <p className="mt-1 text-xs leading-relaxed text-gray-600">{helperText}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {formatBadge ? (
              <span className="inline-flex rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700">
                {formatBadge}
              </span>
            ) : null}
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                hasContent
                  ? 'border border-emerald-200 bg-emerald-100 text-emerald-700'
                  : 'border border-amber-200 bg-amber-50 text-amber-700'
              }`}
            >
              {hasContent ? readyLabel : pendingLabel}
            </span>
          </div>
          {fileName ? (
            <p className="mt-3 truncate text-xs font-medium text-gray-700">Archivo: {fileName}</p>
          ) : null}
        </div>
      </div>
    </label>
  );
};

type AdminUploadedFileListProps = {
  items: Array<{ key: string; label: string }>;
  onRemove: (key: string) => void;
  disabled?: boolean;
  title?: string;
};

export const AdminUploadedFileList = ({
  items,
  onRemove,
  disabled = false,
  title = 'Archivos seleccionados',
}: AdminUploadedFileListProps) => {
  if (items.length === 0) return null;

  return (
    <div className="space-y-2 rounded-lg border border-gray-200 bg-white p-2">
      <p className="px-1 text-xs font-semibold uppercase tracking-wide text-gray-500">{title}</p>
      {items.map((item) => (
        <div key={item.key} className="flex items-center justify-between gap-2 rounded-md bg-gray-50 px-2 py-2">
          <span className="truncate text-xs text-gray-700">{item.label}</span>
          <button
            type="button"
            onClick={() => onRemove(item.key)}
            disabled={disabled}
            className="shrink-0 rounded-md border border-red-200 bg-white px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
          >
            Quitar
          </button>
        </div>
      ))}
    </div>
  );
};

type AdminImagePreviewProps = {
  src: string | null;
  alt: string;
  onRemove?: () => void;
  disabled?: boolean;
};

export const AdminImagePreview = ({ src, alt, onRemove, disabled = false }: AdminImagePreviewProps) => {
  if (!src) return null;

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <img src={src} alt={alt} className="h-52 w-full object-cover" />
      {onRemove ? (
        <div className="border-t border-gray-100 px-3 py-2">
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            className="text-xs font-semibold text-red-700 hover:underline disabled:opacity-50"
          >
            Quitar imagen
          </button>
        </div>
      ) : null}
    </div>
  );
};
