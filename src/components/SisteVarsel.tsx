// src/components/SisteVarsel.tsx
// Viser sist publiserte snøskredvarsel (dato + faregrad) for valgt region.
// Robust: tåler at Varsom svarer som XML eller JSON og har timeout.

import { useEffect, useMemo, useState } from "react";

// farger/klasser for FG-pille
function fgKlasse(fg?: number) {
  const base =
    "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold";
  switch (fg) {
    case 1: return `${base} bg-emerald-100 text-emerald-800`; // Lav
    case 2: return `${base} bg-yellow-100 text-yellow-800`;   // Moderat
    case 3: return `${base} bg-orange-100 text-orange-800`;   // Betydelig
    case 4: return `${base} bg-red-100 text-red-800`;         // Stor
    case 5: return `${base} bg-purple-100 text-purple-800`;   // Meget stor
    default: return `${base} bg-slate-100 text-slate-700`;    // Ukjent
  }
}

type Resultat = {
  dato?: string;
  faregrad?: number; // 1–5
  status: "ok" | "nodata" | "error";
  melding?: string;
};

// for lenka til varsom.no
const REGION_NAVN: Record<number, string> = {
  3004: "Lyngen",
  3027: "Indre Sogn",
  3016: "Salten",
  3031: "Tromsø",
  3030: "Hallingdal",
};

// YYYY-MM-DD
function ymd(d: Date) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

// Robust henter: JSON eller XML + timeout
async function hentVarsomSimple(
  regionId: number,
  langKey: number,
  fra: string,
  til: string,
  timeoutMs = 10000
): Promise<any[]> {
  const url = `/nve/hydrology/forecast/avalanche/v6.2.1/api/AvalancheWarningByRegion/Simple/${regionId}/${langKey}/${fra}/${til}`;

  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    const r = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: ctrl.signal,
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);

    const txt = (await r.text()).trim();
    if (txt.startsWith("[")) {
      // JSON
      return JSON.parse(txt);
    }
    // XML
    const dom = new DOMParser().parseFromString(txt, "application/xml");
    const nodes = Array.from(dom.getElementsByTagName("AvalancheWarningSimple"));
    return nodes.map((n) => ({
      ValidFrom: n.getElementsByTagName("ValidFrom")[0]?.textContent ?? "",
      ValidFromUtc: n.getElementsByTagName("ValidFromUtc")[0]?.textContent ?? "",
      Published: n.getElementsByTagName("PublishTime")[0]?.textContent ?? "",
      DangerLevel: Number(n.getElementsByTagName("DangerLevel")[0]?.textContent ?? "0"),
      DangerLevelTmw: Number(n.getElementsByTagName("DangerLevelTmw")[0]?.textContent ?? "0"),
    }));
  } finally {
    clearTimeout(t);
  }
}

export default function SisteVarsel({
  regionId,
  monthsBack = 24, // se langt tilbake siden data er sesongbasert
  langKey = 1,      // 1=norsk
}: {
  regionId: number;
  monthsBack?: number;
  langKey?: number;
}) {
  const [res, setRes] = useState<Resultat | null>(null);
  const [laster, setLaster] = useState(true);

  const { fra, til } = useMemo(() => {
    const til = new Date();
    const fra = new Date();
    fra.setMonth(fra.getMonth() - monthsBack);
    return { fra: ymd(fra), til: ymd(til) };
  }, [monthsBack]);

  useEffect(() => {
    let aktiv = true;
    setLaster(true);
    setRes(null);

    hentVarsomSimple(regionId, langKey, fra, til)
      .then((arr) => {
        if (!aktiv) return;
        const items = (Array.isArray(arr) ? arr : [])
          .map((d: any) => ({
            dato:
              (typeof d?.ValidFrom === "string" && d.ValidFrom.slice(0, 10)) ||
              (typeof d?.ValidFromUtc === "string" && d.ValidFromUtc.slice(0, 10)) ||
              (typeof d?.Published === "string" && d.Published.slice(0, 10)) ||
              "",
            fg:
              typeof d?.DangerLevel === "number"
                ? d.DangerLevel
                : typeof d?.DangerLevelTmw === "number"
                ? d.DangerLevelTmw
                : undefined,
          }))
          .filter((x) => x.dato);

        if (items.length === 0) {
          setRes({ status: "nodata" });
          return;
        }

        items.sort((a, b) => (a.dato < b.dato ? 1 : a.dato > b.dato ? -1 : 0));
        const siste = items[0];

        setRes({
          status: "ok",
          dato: siste.dato,
          faregrad: typeof siste.fg === "number" && siste.fg > 0 ? siste.fg : undefined,
        });
      })
      .catch((e: any) => {
        if (!aktiv) return;
        setRes({ status: "error", melding: e?.message ?? "Ukjent feil" });
      })
      .finally(() => {
        if (!aktiv) return;
        setLaster(false);
      });

    return () => {
      aktiv = false;
    };
  }, [regionId, fra, til, langKey]);

  if (laster) return <div>Laster siste varsel …</div>;

  if (!res || res.status === "nodata") {
    return (
      <div className="text-sm text-slate-700">
        Ingen varsel funnet siste {monthsBack} måneder (sesongbasert).
      </div>
    );
  }

  if (res.status === "error") {
    return (
      <div className="text-sm text-red-600">
        Kunne ikke hente siste varsel: {res.melding}
      </div>
    );
  }

  const visningsnavn = REGION_NAVN[regionId] || `Region ${regionId}`;
  const href = `https://www.varsom.no/snoskred/varsling/varsel/${encodeURIComponent(visningsnavn)}/${res.dato}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm text-slate-800 flex items-center gap-2 underline hover:no-underline"
      title={`Åpne varsel for ${visningsnavn} på ${res.dato} på varsom.no`}
    >
      <span><strong>Sist varsel:</strong> {res.dato}</span>
      {typeof res.faregrad === "number" && (
        <span className={fgKlasse(res.faregrad)}>FG{res.faregrad}</span>
      )}
    </a>
  );
}
