// src/api.ts — ready to paste

/** Base path (uses your Vite proxy for NVE) */
export const NVE_BASE = "/nve/hydrology/forecast/avalanche/v6.3.0/api";

/** Generic JSON fetcher with a simple content-type check */
export async function getJson<T = any>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const ct = res.headers.get("content-type") ?? "";
  if (!ct.includes("application/json")) {
    const text = await res.text();
    throw new Error(`Expected JSON, got ${ct}. Snippet: ${text.slice(0, 120)}`);
  }
  return res.json();
}

/* ---------------- Date helpers ---------------- */
export function ymd(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
export function lastNDaysRange(n: number): { from: string; to: string } {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - (n - 1));
  return { from: ymd(start), to: ymd(end) };
}
function todayYMD(): string {
  return ymd(new Date());
}

/* ---------------- Types we use ---------------- */
export type SimpleWarningItem = {
  RegionId?: number;
  DangerLevel?: number;
  ValidFrom?: string;       // "YYYY-MM-DDTHH:mm:ss"
  ValidTo?: string;
  NextWarningTime?: string;
  MainText?: string;
};

export type AvalancheEvent = {
  date: string;             // ISO date/time
  type?: string;            // e.g., "flakskred", "løssnø", etc. (if available)
  size?: number | null;     // 1..5 if available
  place?: string;           // optional text/place/altitude
};

/* ---------------- Simple endpoints ---------------- */
export const getRegions = () => getJson(`${NVE_BASE}/Region`);

/** Keep your original "today" helper (numeric langKey style) */
export const getWarningToday = (regionId: number, langKey = 2) =>
  getJson<SimpleWarningItem[]>(
    `${NVE_BASE}/AvalancheWarningByRegion/Simple/${regionId}/${langKey}/${todayYMD()}/${todayYMD()}`
  );

/** New: Simple warnings in a date range (string language like RegionDetail uses) */
export async function getWarningsRange(
  regionId: number,
  fromYMD: string,
  toYMD: string,
  lang: "no" | "en" = "no"
): Promise<SimpleWarningItem[]> {
  const url = `${NVE_BASE}/AvalancheWarningByRegion/Simple/${encodeURIComponent(
    String(regionId)
  )}/${lang}/${fromYMD}/${toYMD}`;
  const data = await getJson(url);
  return Array.isArray(data) ? data : [];
}

/**
 * Placeholder for "last N events" per region.
 * We'll wire the real endpoint in the next step.
 * Returning [] keeps the UI safe while we build.
 */
export async function getRecentEvents(
  regionId: number,
  limit = 30
): Promise<AvalancheEvent[]> {
  // TODO: implement with the correct endpoint in the next step.
  return [];
}
