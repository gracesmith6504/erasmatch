// Append Supabase storage image transform params so we serve appropriately
// sized avatars instead of full-resolution originals (which are typically
// ~100-200 KB JPEGs). Transformed thumbnails are ~5-15 KB.
// Pass the rendered CSS pixel size — we automatically request 2× for retina.
export function transformAvatarUrl(
  url: string | null | undefined,
  cssPixelSize: number,
): string | undefined {
  if (!url) return undefined;
  // Only transform Supabase storage URLs; leave external URLs untouched.
  const storagePath = "/storage/v1/object/public/";
  const renderPath = "/storage/v1/render/image/public/";
  if (url.includes(renderPath)) return url;
  if (!url.includes(storagePath)) return url;
  const size = Math.round(cssPixelSize * 2);
  const [baseUrl] = url.split("?");
  const renderUrl = baseUrl.replace(storagePath, renderPath);
  return `${renderUrl}?width=${size}&height=${size}&resize=cover&quality=75`;
}
