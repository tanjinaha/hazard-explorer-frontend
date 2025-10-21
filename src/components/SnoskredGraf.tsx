// src/components/SnoskredGraf.tsx
// Graf over faregrad (1–5) for valgt region. Robust mot XML/JSON og har timeout.

import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type Punkt = { dato: string; faregrad: number };

// YYYY-MM-DD
function tilYMD(d: Date) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

// siste mnd tilbake
function periodeSisteMnd(mnd: number) {
  const slutt = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - mnd);
  return { start: tilYMD(start), slutt: tilYMD(slutt) };
}

// Slå opp tekst for FG (tooltip)
const fgTekst: Record<number, string> = {
  1: "Lav",
  2: "Moderat",
  3: "Betydelig",
  4: "Stor",
  5: "Meget stor",
};

// Robust henter (JSON eller XML) + timeout
async function hentSerie(
  regionId: number,
  start: string,
  slutt: string,
  langKey = 1,
  timeoutMs = 10000
): Promise<Punkt[]> {
  const url = `/nve/hydrology/forecast/avalanche/v6.2.1/api/AvalancheWarningByRegion/Simple/${regionId}/${langKey}/${start}/${slutt}`;

  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    const res = await fetch(url, { headers: { Accept: "application/json" }, signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const txt = (await res.text()).trim();
    let raw: any[] = [];

    if (txt.startsWith("[")) {
      // JSON
      raw = JSON.parse(txt);
    } else {
      // XML
      const dom = new DOMParser().parseFromString(txt, "application/xml");
      const nodes = Array.from(dom.getElementsByTagName("AvalancheWarningSimple"));
      raw = nodes.map((n) => ({
        ValidFrom: n.getElementsByTagName("ValidFrom")[0]?.textContent ?? "",
        ValidFromUtc: n.getElementsByTagName("ValidFromUtc")[0]?.textContent ?? "",
        Published: n.getElementsByTagName("PublishTime")[0]?.textContent ?? "",
        DangerLevel: Number(n.getElementsByTagName("DangerLevel")[0]?.textContent ?? "0"),
        DangerLevelTmw: Number(n.getElementsByTagName("DangerLevelTmw")[0]?.textContent ?? "0"),
      }));
    }

    const punkter: Punkt[] = raw
      .map((d: any) => {
        const dato: string =
          (typeof d?.ValidFrom === "string" && d.ValidFrom.slice(0, 10)) ||
          (typeof d?.ValidFromUtc === "string" && d.ValidFromUtc.slice(0, 10)) ||
          (typeof d?.Published === "string" && d.Published.slice(0, 10)) ||
          "";
        const fg: number =
          typeof d?.DangerLevel === "number"
            ? d.DangerLevel
            : typeof d?.DangerLevelTmw === "number"
            ? d.DangerLevelTmw
            : 0;

        return { dato, faregrad: fg };
      })
      // behold kun datoer med FG >= 1 (0 = "Ikke vurdert")
      .filter((p) => p.dato && p.faregrad >= 1);

    // de-dupliser per dato, sorter stigende
    const map = new Map<string, Punkt>();
    for (const p of punkter) map.set(p.dato, p);
    return Array.from(map.values()).sort((a, b) => a.dato.localeCompare(b.dato));
  } finally {
    clearTimeout(t);
  }
}

export default function SnoskredGraf({
  regionId = 3004,
  monthsBack = 24, // lengre periode gir mer å se utenfor sesong
}: {
  regionId?: number;
  monthsBack?: number;
}) {
  const [data, setData] = useState<Punkt[]>([]);
  const [laster, setLaster] = useState(true);
  const [feil, setFeil] = useState<string | null>(null);

  const { start, slutt } = useMemo(() => periodeSisteMnd(monthsBack), [monthsBack]);

  useEffect(() => {
    let aktiv = true;
    setLaster(true);
    setFeil(null);

    hentSerie(regionId!, start, slutt, 1)
      .then((serie) => {
        if (!aktiv) return;
        setData(serie);
      })
      .catch((e: any) => {
        if (!aktiv) return;
        setFeil(e?.message ?? "Ukjent feil");
      })
      .finally(() => {
        if (!aktiv) return;
        setLaster(false);
      });

    return () => {
      aktiv = false;
    };
  }, [regionId, start, slutt]);

  if (laster) return <div>Laster skreddata …</div>;
  if (feil) return <div className="text-red-600">Feil: {feil}</div>;
  if (data.length === 0)
    return <div>Ingen varsler med faregrad i valgt periode (prøv en annen region eller lengre periode).</div>;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 rounded-xl border bg-white">
      <h3 className="text-xl font-semibold mb-2">Snøskred – faregrad over tid (region {regionId})</h3>
      <p className="text-sm mb-4">Skala 1–5 (EAWS): 1=Lav, 2=Moderat, 3=Betydelig, 4=Stor, 5=Meget stor.</p>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dato" tickMargin={8} />
            <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} />
            <Tooltip
              formatter={(v: any) => [`${v} – ${fgTekst[v as number] || ""}`, "Faregrad"]}
              labelFormatter={(lbl) => `Dato: ${lbl}`}
            />
            <Line type="monotone" dataKey="faregrad" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="text-xs text-slate-500 mt-2">Kilde: NVE – Varsom (åpne data).</div>
    </div>
  );
}
