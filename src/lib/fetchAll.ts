/**
 * PostgREST returns at most `max-rows` rows per request (1000 by default on
 * Supabase), silently truncating anything beyond that. This helper pages
 * through a query with `.range()` until an empty page comes back (so it
 * still works if the server's row cap is lower than `pageSize`).
 *
 * The caller builds the query for a given range and MUST order it by a stable,
 * unique column (e.g. `.order("id")`), otherwise rows can be skipped or
 * duplicated between pages.
 *
 * @example
 * const rows = await fetchAll((from, to) =>
 *   supabase.from("profiles").select("id, city").order("id").range(from, to)
 * );
 */
export const FETCH_ALL_PAGE_SIZE = 1000;

type PageResult<T> = { data: T[] | null; error: unknown };

export async function fetchAll<T>(
  buildPage: (from: number, to: number) => PromiseLike<PageResult<T>>,
  pageSize = FETCH_ALL_PAGE_SIZE
): Promise<T[]> {
  const rows: T[] = [];
  let from = 0;
  while (true) {
    const { data, error } = await buildPage(from, from + pageSize - 1);
    if (error) throw error;
    const page = data ?? [];
    if (page.length === 0) break;
    rows.push(...page);
    // Advance by rows actually returned, in case the server caps pages
    // below pageSize.
    from += page.length;
  }
  return rows;
}
