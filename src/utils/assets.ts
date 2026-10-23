/**
 * Helper to resolve media/image asset URLs with Vite's import.meta.env.BASE_URL
 * Handles both localhost ('/') and GitHub Pages ('/BuiVi/')
 */
export function resolveAssetUrl(path?: string | null): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const baseUrl = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}
