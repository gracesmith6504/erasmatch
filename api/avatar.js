export const config = { runtime: "edge" };

// Map file extensions to safe image MIME types — nothing else is served.
const IMAGE_TYPES = {
  webp: "image/webp",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  jfif: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  avif: "image/avif",
  heic: "image/heic",
  heif: "image/heif",
};

export default async function handler(req) {
  const url = new URL(req.url);
  const path = url.searchParams.get("path");

  // 1. Basic shape check: alphanumeric, hyphens, underscores, dots, slashes
  if (!path || !/^[\w\-./]+$/.test(path)) {
    return new Response("Invalid path", { status: 400 });
  }

  // 2. Block path traversal — no ".." anywhere in the path
  if (path.includes("..")) {
    return new Response("Invalid path", { status: 400 });
  }

  // 3. Require an image extension and derive the content type from it
  const ext = path.split(".").pop()?.toLowerCase();
  const contentType = IMAGE_TYPES[ext];
  if (!contentType) {
    return new Response("Unsupported file type", { status: 400 });
  }

  const supabaseUrl = `https://ceoflcktscennfmmdrvp.supabase.co/storage/v1/object/public/avatars/${path}`;
  const response = await fetch(supabaseUrl);
  if (!response.ok) return new Response(null, { status: response.status });

  return new Response(response.body, {
    headers: {
      "Content-Type": contentType,
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": "inline",
      "Cache-Control": "public, s-maxage=31536000, max-age=86400, immutable",
    },
  });
}
