/**
 * PostgREST returns at most `max-rows` rows per request (1000 by default on
 * Supabase), silently truncating anything beyond that. This helper pages
 * through a query with `.range()` until a short page comes back.
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
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await buildPage(from, from + pageSize - 1);
    if (error) throw error;
    const page = data ?? [];
    rows.push(...page);
    if (page.length < pageSize) break;
  }
  return rows;
}
