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
  if (!url.includes("/storage/v1/object/public/")) return url;
  // Don't double-append if the caller already added a transform.
  if (url.includes("?")) return url;
  const size = Math.round(cssPixelSize * 2);
  return `${url}?width=${size}&height=${size}&resize=cover&quality=75`;
}
