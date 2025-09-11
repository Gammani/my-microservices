import { randomUUID } from 'node:crypto';

export function generateFileName(originalName: string): string {
  const dotIndex = originalName.lastIndexOf('.');
  const ext =
    dotIndex > -1 ? originalName.slice(dotIndex + 1).toLowerCase() : '';
  return `${randomUUID()}${ext ? '.' + ext : ''}`;
}
