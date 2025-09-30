// src/api/nve.ts
//
// NVE Varsom "SnøskredAPI" helpers (through your /nve proxy).
// - Regions list:   /hydrology/forecast/avalanche/{ver}/api/Region/{regionTypeId}
// - Warnings XML:   /hydrology/forecast/avalanche/{ver}/api/warning/region/{regionId}/{lang}/{from}/{to}
//   (also tries AvalancheWarningByRegion/Simple as a fallback)
//
// Notes:
// * We try multiple API versions and regionTypeIds and return the first that works.
// * Region names come as JSON, warnings come as XML text.

const BASE = "/nve/hydrology/forecast/avalanche";
const VERSIONS = ["v6.3.0", "v6.2.1"]; // known working
const REGION_TYPE_IDS = [2, 1, 0, 3]; // try common types until one returns a list
const LANG = 2; // 1 = Norwegian, 2 = English

type Region = { id: number; name: string };

function pickRegionId(x: any): number | null {
  const v = x?.id ?? x?.Id ?? x?.regionId ?? x?.RegionId ?? x?.RegionID;
  return typeof v === "number" ? v : null;
}
function pickRegionName(x: any): string | null {
  const v =
    x?.name ??
    x?.Name ??
    x?.regionName ??
    x?.RegionName ??
    x?.region ??
    x?.Region;
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

async function fetchJson(url: string): Promise<any> {
  const res = await fetch(url, { headers: { accept: "application/json" } });
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url} — ${text.slice(0, 120)}`);
  // Some endpoints return application/json; others still return JSON with text/plain.
  try {
    return JSON.parse(text);
  } catch {
    // Try to eval XML? No—regions MUST be JSON; if not JSON, treat as failure.
    throw new Error(`Non-JSON at ${url}: ${text.slice(0, 120)}`);
  }
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, { headers: { accept: "*/*" } });
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url} — ${text.slice(0, 120)}`);
  return text;
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Try to get forecast regions (no hardcoded names). */
export async function getRegions(): Promise<{ regions: Region[]; sourceUrl: string }> {
  const attempts: string[] = [];

  for (const ver of VERSIONS) {
    for (const typeId of REGION_TYPE_IDS) {
      const url = `${BASE}/${ver}/api/Region/${typeId}`;
      try {
        const data = await fetchJson(url);
        if (Array.isArray(data)) {
          const list = (data as any[])
            .map((r) => {
              const id = pickRegionId(r);
              const name = pickRegionName(r);
              return id != null && name ? { id, name } : null;
            })
            .filter(Boolean) as Region[];
          if (list.length) {
            const unique = Array.from(new Map(list.map((r) => [r.id, r.name]))).map(
              ([id, name]) => ({ id, name })
            );
            unique.sort((a, b) => a.name.localeCompare(b.name, "no"));
            return { regions: unique, sourceUrl: url };
          }
        }
        attempts.push(`${url} — not an array or empty`);
      } catch (e: any) {
        attempts.push(`${url} — ${String(e.message || e)}`);
      }
    }
  }

  throw new Error(
    `Could not fetch regions from NVE.\nTried:\n${attempts.map((a) => `- ${a}`).join("\n")}`
  );
}

/** Get warnings (XML text) for a region + date. */
export async function getWarningsXML(
  regionId: number,
  dateISO: string
): Promise<{ xml: string; sourceUrl: string }> {
  const attempts: string[] = [];

  // We query same start/end date to get the daily forecast.
  for (const ver of VERSIONS) {
    const paths = [
      `${BASE}/${ver}/api/warning/region/${regionId}/${LANG}/${dateISO}/${dateISO}`,
      `${BASE}/${ver}/api/AvalancheWarningByRegion/Simple/${regionId}/${LANG}/${dateISO}/${dateISO}`,
    ];

    for (const url of paths) {
      try {
        const xml = await fetchText(url);
        // Basic sanity: XML should begin with '<?xml' or contain a root element
        if (xml.trim().startsWith("<") || xml.includes("<?xml")) {
          return { xml, sourceUrl: url };
        }
        attempts.push(`${url} — unexpected response: ${xml.slice(0, 120)}`);
      } catch (e: any) {
        attempts.push(`${url} — ${String(e.message || e)}`);
      }
    }
  }

  throw new Error(
    `Could not fetch warnings for region.\nTried:\n${attempts.map((a) => `- ${a}`).join("\n")}`
  );
}
