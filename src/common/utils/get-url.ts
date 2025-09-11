import { ContentEntity } from '../../modules/content/entity/content.entity';

export function getPublicUrl(
  content: ContentEntity | null | undefined,
): string | null {
  if (!content) return null;
  const key = content.fileKey;
  const base = process.env.PUBLIC_ASSETS_BASE ?? '';
  return key ? `${base.replace(/\/$/, '')}/${key}` : null;
}
