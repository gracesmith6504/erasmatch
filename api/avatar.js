export const config = { runtime: "edge" };

export default async function handler(req) {
  const url = new URL(req.url);
  const path = url.searchParams.get("path");
  if (!path || !/^[\w\-./]+$/.test(path)) {
    return new Response("Invalid path", { status: 400 });
  }

  const supabaseUrl = `https://ceoflcktscennfmmdrvp.supabase.co/storage/v1/object/public/avatars/${path}`;
  const response = await fetch(supabaseUrl);
  if (!response.ok) return new Response(null, { status: response.status });

  return new Response(response.body, {
    headers: {
      "Content-Type": response.headers.get("content-type") || "image/webp",
      "Cache-Control": "public, s-maxage=31536000, max-age=86400, immutable",
    },
  });
}
