// Avatars are compressed/resized at upload time (see compressAvatar) so we
// can serve the original files directly from Supabase Storage without
// hitting the paid `/render/image/` transformation endpoint.
//
// This helper is kept as a no-op pass-through so existing callers continue
// to work — they no longer trigger billable image transformations.
export function transformAvatarUrl(
  url: string | null | undefined,
  _cssPixelSize?: number,
): string | undefined {
  if (!url) return undefined;
  return url;
}

import imageCompression from "browser-image-compression";

// Compress + resize an uploaded avatar to keep storage small and avoid the
// need for runtime image transformations. Targets ~50–80 KB WebP at 512px.
export async function compressAvatar(file: File): Promise<File> {
  try {
    const compressed = await imageCompression(file, {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 512,
      useWebWorker: true,
      fileType: "image/webp",
      initialQuality: 0.82,
    });
    // Ensure the file has a sensible name + extension for the storage path.
    const newName = file.name.replace(/\.[^.]+$/, "") + ".webp";
    return new File([compressed], newName, { type: "image/webp" });
  } catch (err) {
    console.warn("Avatar compression failed, uploading original", err);
    return file;
  }
}
