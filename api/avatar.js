export default async function handler(req, res) {
  const { path } = req.query;
  if (!path) return res.status(400).send("Missing path");

  if (!/^[\w\-./]+$/.test(path)) return res.status(400).send("Invalid path");

  const url = `https://ceoflcktscennfmmdrvp.supabase.co/storage/v1/object/public/avatars/${path}`;
  const response = await fetch(url);
  if (!response.ok) return res.status(response.status).end();

  const buffer = Buffer.from(await response.arrayBuffer());
  const contentType = response.headers.get("content-type") || "image/webp";

  res.setHeader("Content-Type", contentType);
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=31536000, max-age=86400, immutable"
  );
  res.send(buffer);
}
