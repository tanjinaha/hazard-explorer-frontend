// src/lib/warnCache.ts
// Simple in-memory cache for "last activity per region"
// We will fill it in Step 5 when we actually fetch data.

export type LastActivityStatus = "ok" | "nodata" | "error";

export type LastActivity = {
  /** Latest date we found data for this region (YYYY-MM-DD) */
  lastDate?: string;
  /** Last known danger level (1..5) if available */
  fg?: number | null;
  /** Count of recent items (e.g., last 30 events) if available */
  count?: number;
  /** Status: ok = we found something; nodata = none found; error = fetch failed */
  status: LastActivityStatus;
  /** Optional human-friendly note (e.g., error text) */
  note?: string;
};

/** Internal cache map */
const store = new Map<string, LastActivity>();

/**
 * Creates a cache key. Examples:
 * - range key (warnings in date range):  makeKey(regionId, `range:${from}:${to}`)
 * - events key (last N events):          makeKey(regionId, `events:${limit}`)
 */
export function makeKey(regionId: number, tag: string): string {
  return `${regionId}|${tag}`;
}

/** Get a cached entry by key */
export function getCached(key: string): LastActivity | undefined {
  return store.get(key);
}

/** Put/overwrite a cached entry by key */
export function setCached(key: string, value: LastActivity): void {
  store.set(key, value);
}

/** Remove a key (not required, but handy) */
export function delCached(key: string): void {
  store.delete(key);
}

/** Clear everything (rarely needed) */
export function clearCache(): void {
  store.clear();
}
