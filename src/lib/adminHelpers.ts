import { uploadData } from 'aws-amplify/storage';
import { buildS3PublicObjectUrl } from './s3PublicUrl';

export const sanitizeFileName = (name: string): string =>
  name.replace(/[^\w.-]+/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '');

export const toSlug = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

export const toDateTimeLocalValue = (iso?: string | null): string => {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 16);
};

export const toIsoFromDateTimeLocal = (value: string): string | null => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
};

export const uploadPublicFile = async (file: File, pathPrefix: string): Promise<string> => {
  const safeName = sanitizeFileName(file.name) || 'file';
  const fullPath = `public/${pathPrefix}/${Date.now()}-${safeName}`;
  const task = uploadData({ path: fullPath, data: file });
  await task.result;
  return buildS3PublicObjectUrl(fullPath);
};

export const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item: unknown) => typeof item === 'string' || typeof item === 'number')
    .map((item) => String(item).trim())
    .filter((item) => item.length > 0);
};

export const formatPublishedDateEs = (value?: string | null): string => {
  if (!value) return 'Sin fecha';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Sin fecha';
  return date.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};
