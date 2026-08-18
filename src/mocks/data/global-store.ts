/**
 * Next.js's bundler does not guarantee a single shared module instance for a
 * file across every route that imports it — a Route Handler and a Page can
 * each end up with their own separately-evaluated copy of the same "shared"
 * mock-data module (confirmed in both `next dev` and a production
 * `next build && next start`: a product created via an admin Route Handler
 * was visible on /search but 404'd on its own /products/[slug] page).
 * `globalThis`, unlike a module-level `const`, is guaranteed to be the same
 * object for the lifetime of the Node.js process no matter how many separate
 * bundle copies of this file exist — so every mock dataset is stored there
 * instead of as a plain top-level array. This whole file (and the pattern)
 * disappears once a real database backs these reads/writes.
 */
export function getOrCreateGlobalSingleton<T>(key: string, initializer: () => T): T {
  const globalKey = `__sportsWearMockData_${key}`;
  const store = globalThis as unknown as Record<string, T | undefined>;
  if (store[globalKey] === undefined) {
    store[globalKey] = initializer();
  }
  return store[globalKey] as T;
}
