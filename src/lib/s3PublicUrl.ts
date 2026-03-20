import amplifyConfig from '../amplifyconfiguration.json';

type AmplifyConfigShape = {
  aws_user_files_s3_bucket?: string;
  aws_user_files_s3_bucket_region?: string;
};

const getBucketAndRegion = (): { bucket: string; region: string } => {
  const cfg = amplifyConfig as AmplifyConfigShape;
  const bucket = cfg.aws_user_files_s3_bucket ?? '';
  const region = cfg.aws_user_files_s3_bucket_region ?? '';
  return { bucket, region };
};

/**
 * URL estable (sin firma) para objetos bajo la clave `path` en el bucket de Amplify Storage.
 * Requiere política de bucket que permita s3:GetObject público en `public/*` (o CloudFront delante).
 */
export const buildS3PublicObjectUrl = (objectKey: string): string => {
  const { bucket, region } = getBucketAndRegion();
  if (!bucket || !region) {
    throw new Error('Falta aws_user_files_s3_bucket o región en amplifyconfiguration.json');
  }

  const trimmed = objectKey.replace(/^\/+/, '');
  const encodedKey = trimmed
    .split('/')
    .filter((segment) => segment.length > 0)
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  return `https://${bucket}.s3.${region}.amazonaws.com/${encodedKey}`;
};

/**
 * Si la URL es de nuestro bucket y trae query de firma presignada, devuelve solo origin+pathname
 * para que no caduque. Solo funciona si el objeto es legible públicamente sin firma.
 */
export const stripPresignedQueryFromOurBucketUrl = (url: string | null | undefined): string | undefined => {
  if (!url || typeof url !== 'string') return undefined;

  const { bucket, region } = getBucketAndRegion();
  if (!bucket || !region) return url;

  try {
    const parsed = new URL(url);
    const expectedHost = `${bucket}.s3.${region}.amazonaws.com`;
    if (parsed.hostname !== expectedHost) return url;
    if (!parsed.search) return url;
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return url;
  }
};
