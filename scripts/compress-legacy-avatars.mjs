#!/usr/bin/env node
/**
 * compress-legacy-avatars.mjs
 *
 * One-time migration: compresses oversized legacy avatar images in the
 * Supabase "avatars" storage bucket to 512 px max-dimension WebP at
 * quality 82 — matching the app's compressAvatar() logic in
 * src/lib/avatar.ts.
 *
 * Usage:
 *   node scripts/compress-legacy-avatars.mjs               # dry run (default)
 *   node scripts/compress-legacy-avatars.mjs --execute      # live run
 *
 * Required env vars:
 *   SUPABASE_URL          – e.g. https://ceoflcktscennfmmdrvp.supabase.co
 *   SUPABASE_SERVICE_KEY  – service_role secret (Dashboard > Project Settings > API)
 */

import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

// ── Configuration ───────────────────────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const BUCKET = "avatars";
const SIZE_THRESHOLD = 300 * 1024; // 300 KB
const MAX_DIMENSION = 512;
const WEBP_QUALITY = 82;
const EXECUTE = process.argv.includes("--execute");

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error(
    "Error: SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables are required.\n" +
      "  export SUPABASE_URL=https://ceoflcktscennfmmdrvp.supabase.co\n" +
      '  export SUPABASE_SERVICE_KEY="your-service-role-key"',
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});

const PUBLIC_BASE = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`;

// ── Helpers ─────────────────────────────────────────────────────────

/** Paginated listing at a single directory level inside the bucket. */
async function listDir(prefix) {
  const PAGE = 1000;
  let offset = 0;
  const items = [];
  while (true) {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list(prefix, { limit: PAGE, offset });
    if (error) throw new Error(`listDir("${prefix}"): ${error.message}`);
    if (!data || data.length === 0) break;
    items.push(...data);
    if (data.length < PAGE) break;
    offset += PAGE;
  }
  return items;
}

/**
 * Walk the bucket (two levels deep: userId/file) and collect every file
 * whose metadata.size exceeds SIZE_THRESHOLD.
 */
async function findOversizedFiles() {
  console.log("Scanning bucket for oversized files…");
  const topLevel = await listDir("");
  const oversized = [];

  for (const entry of topLevel) {
    // Folders have id === null in Supabase Storage list responses.
    if (entry.id !== null) continue;

    const files = await listDir(entry.name);
    for (const file of files) {
      if (file.id === null) continue; // skip nested folders
      const size = file.metadata?.size;
      if (typeof size === "number" && size > SIZE_THRESHOLD) {
        oversized.push({
          path: `${entry.name}/${file.name}`,
          size,
          mimetype: file.metadata?.mimetype ?? "unknown",
        });
      }
    }
  }
  return oversized;
}

/** Download a file buffer from the bucket. */
async function downloadFile(path) {
  const { data, error } = await supabase.storage.from(BUCKET).download(path);
  if (error) throw new Error(`download("${path}"): ${error.message}`);
  return Buffer.from(await data.arrayBuffer());
}

/** Compress a buffer to WebP via sharp. */
async function compressBuffer(buffer) {
  return sharp(buffer)
    .resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();
}

function replaceExt(filePath, newExt) {
  return filePath.replace(/\.[^.]+$/, newExt);
}

function fmt(bytes) {
  if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  return (bytes / 1024).toFixed(1) + " KB";
}

// ── Main ────────────────────────────────────────────────────────────

async function main() {
  console.log(
    `\n${"═".repeat(60)}\n` +
      `  Avatar Compression Migration\n` +
      `  Mode:      ${EXECUTE ? "🔴 EXECUTE" : "🟡 DRY RUN (pass --execute to apply)"}\n` +
      `  Bucket:    ${BUCKET}\n` +
      `  Threshold: > ${fmt(SIZE_THRESHOLD)}\n` +
      `  Target:    ${MAX_DIMENSION}px max, WebP q${WEBP_QUALITY}\n` +
      `${"═".repeat(60)}\n`,
  );

  const files = await findOversizedFiles();
  console.log(`Found ${files.length} file(s) over ${fmt(SIZE_THRESHOLD)}.\n`);

  if (files.length === 0) {
    console.log("Nothing to do — all files are within the size threshold.");
    return;
  }

  let totalOriginal = 0;
  let totalCompressed = 0;
  let processed = 0;
  let skipped = 0;
  let errors = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const tag = `[${i + 1}/${files.length}]`;

    try {
      // 1. Download the original
      const original = await downloadFile(file.path);
      totalOriginal += original.length;

      // 2. Compress to WebP
      const compressed = await compressBuffer(original);

      // 3. Skip if compression would make the file larger
      if (compressed.length >= original.length) {
        console.log(
          `${tag} SKIP  ${file.path}\n` +
            `       Compressed (${fmt(compressed.length)}) ≥ original (${fmt(original.length)}) — no savings`,
        );
        skipped++;
        continue;
      }

      const oldExt = (file.path.match(/\.[^.]+$/)?.[0] ?? "").toLowerCase();
      const extChanges = oldExt !== ".webp";
      const newPath = extChanges ? replaceExt(file.path, ".webp") : file.path;
      const savings = ((1 - compressed.length / original.length) * 100).toFixed(1);

      console.log(
        `${tag} ${EXECUTE ? "COMPRESS" : "WOULD COMPRESS"}  ${file.path}\n` +
          `       ${fmt(original.length)} → ${fmt(compressed.length)}  (−${savings}%)` +
          (extChanges ? `  [rename → …/${newPath.split("/").pop()}]` : ""),
      );

      if (!EXECUTE) {
        totalCompressed += compressed.length;
        processed++;
        continue;
      }

      // ── Live execution ────────────────────────────────────────

      // 4. Upload compressed file
      const { error: uploadErr } = await supabase.storage
        .from(BUCKET)
        .upload(newPath, compressed, {
          upsert: true,
          cacheControl: "31536000",
          contentType: "image/webp",
        });
      if (uploadErr) throw new Error(`upload("${newPath}"): ${uploadErr.message}`);

      // 5. If the extension changed, update profiles.avatar_url then delete old file
      if (extChanges) {
        const oldUrl = `${PUBLIC_BASE}${file.path}`;
        const newUrl = `${PUBLIC_BASE}${newPath}`;

        const { error: updateErr, count } = await supabase
          .from("profiles")
          .update({ avatar_url: newUrl })
          .eq("avatar_url", oldUrl);

        if (updateErr) {
          // Rollback: delete the newly uploaded file, keep the original intact
          console.error(
            `       ⚠ Profile update FAILED: ${updateErr.message}\n` +
              `       ↩ Rolling back — deleting new file, keeping original`,
          );
          await supabase.storage.from(BUCKET).remove([newPath]);
          errors++;
          continue;
        }

        // Delete old file only after a successful profile update
        const { error: deleteErr } = await supabase.storage
          .from(BUCKET)
          .remove([file.path]);
        if (deleteErr) {
          console.warn(`       ⚠ Could not delete old file: ${deleteErr.message}`);
        }

        console.log(
          `       ✓ Uploaded .webp, updated ${count ?? "?"} profile row(s), deleted old ${oldExt} file`,
        );
      } else {
        console.log(`       ✓ Upserted in place`);
      }

      totalCompressed += compressed.length;
      processed++;
    } catch (err) {
      console.error(`${tag} ERROR  ${file.path}: ${err.message}`);
      errors++;
    }
  }

  // ── Summary ───────────────────────────────────────────────────────
  console.log(
    `\n${"─".repeat(60)}\n` +
      `  Summary\n` +
      `${"─".repeat(60)}\n` +
      `  ✅ Processed:       ${processed}\n` +
      `  ⏭  Skipped:         ${skipped} (no savings)\n` +
      (errors ? `  ❌ Errors:          ${errors}\n` : "") +
      `  📦 Original total:  ${fmt(totalOriginal)}\n` +
      `  📦 Compressed total:${fmt(totalCompressed)}\n` +
      `  💾 Savings:         ${fmt(totalOriginal - totalCompressed)}\n` +
      (EXECUTE
        ? ""
        : `\n  ⚠  DRY RUN — re-run with --execute to apply changes.\n`),
  );
}

main().catch((err) => {
  console.error("\nFatal error:", err);
  process.exit(1);
});
