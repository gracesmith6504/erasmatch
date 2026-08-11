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
    console.warn("Avatar compression failed, trying Canvas fallback", err);
    // Fallback: use Canvas to convert to JPEG (handles HEIC on Safari,
    // odd formats, etc.) so we never upload an un-displayable original.
    try {
      const bitmap = await createImageBitmap(file);
      const size = Math.min(512, bitmap.width, bitmap.height);
      const scale = size / Math.max(bitmap.width, bitmap.height);
      const w = Math.round(bitmap.width * scale);
      const h = Math.round(bitmap.height * scale);
      const canvas = new OffscreenCanvas(w, h);
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(bitmap, 0, 0, w, h);
      bitmap.close();
      const blob = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.82 });
      const newName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
      return new File([blob], newName, { type: "image/jpeg" });
    } catch (fallbackErr) {
      console.warn("Canvas fallback also failed, uploading original", fallbackErr);
      return file;
    }
  }
}
