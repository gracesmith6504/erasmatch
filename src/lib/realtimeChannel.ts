/**
 * Module-level counter: survives component remounts and ErrorBoundary
 * recovery, unlike useRef. supabase.channel(name) returns the EXISTING channel
 * for a topic it already knows, and realtime-js throws "cannot add
 * postgres_changes callbacks after subscribe()" when .on() is called on an
 * already-subscribed one. A fresh name per subscription avoids that.
 */
let channelSeq = 0;

export function uniqueChannelName(prefix: string): string {
  return `${prefix}-${++channelSeq}`;
}

/** Append items whose id is not already present (realtime + refetch can overlap). */
export function appendUniqueById<T extends { id: string }>(prev: T[], ...items: T[]): T[] {
  const seen = new Set(prev.map((m) => m.id));
  const fresh = items.filter((m) => {
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return true;
  });
  return fresh.length ? [...prev, ...fresh] : prev;
}
