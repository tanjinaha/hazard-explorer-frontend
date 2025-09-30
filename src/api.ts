// src/api.ts — fresh, minimal

export const NVE_BASE = "/nve/hydrology/forecast/avalanche/v6.3.0/api";

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

export const getRegions = () => getJson(`${NVE_BASE}/Region`);

const todayYMD = () => {
  const d = new Date(); const p = (n:number)=>String(n).padStart(2,"0");
  return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`;
};

export const getWarningToday = (regionId: number, langKey = 2) =>
  getJson(`${NVE_BASE}/AvalancheWarningByRegion/Simple/${regionId}/${langKey}/${todayYMD()}/${todayYMD()}`);

