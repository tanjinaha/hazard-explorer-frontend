// src/models/hazard.ts

export interface HazardWarning {
  id: number;           // API: Id
  region: string;       // API: RegionName
  dangerLevel: number;  // API: DangerLevel (0–5)
  headline?: string;    // API: MainText (short text)
  date?: string;        // YYYY-MM-DD from ValidFrom/Published
}

// Convert one raw API item to our shape
export function mapHazardData(w: any): HazardWarning {
  return {
    id: Number(w?.Id ?? 0),
    region: String(w?.RegionName ?? ""),
    dangerLevel: Number(w?.DangerLevel ?? 0),
    headline: w?.MainText ? String(w.MainText) : undefined,
    date: String(w?.ValidFrom ?? w?.Published ?? "")
      .split("T")[0] || undefined,
  };
}
