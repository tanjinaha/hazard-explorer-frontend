import { useEffect, useState } from "react";
import Kilde from "@/components/Kilde";

type LandslideWarning = {
  Id: number;
  WarningTitle?: string;
  WarningText: string;
  ActivityLevel?: number | null; // 1=Gul, 2=Oransje, 3=Rød
  ValidFrom?: string;
  ValidTo?: string;
};

const COUNTIES = [
  { id: 3,  name: "Oslo" },
  { id: 30, name: "Viken" },
  { id: 34, name: "Innlandet" },
  { id: 46, name: "Vestland" },
  { id: 54, name: "Troms og Finnmark" },
];

// Build URL for NVE Landslide Warning API
// langkey: 1 = Norsk, 2 = Engelsk
function buildUrl(countyId: number) {
  const today = new Date();
  const start = today.toISOString().slice(0, 10);           // YYYY-MM-DD
  const end = new Date(today.getTime() + 3*86400000)        // +3 dager
                 .toISOString().slice(0, 10);
  return `/nve/hydrology/forecast/landslide/v1.0.10/api/Warning/County/${countyId}/1/${start}/${end}`;
}

export default function Jordskred() {
  const [county, setCounty] = useState<number>(30); // Viken som default
  const [warnings, setWarnings] = useState<LandslideWarning[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(buildUrl(county), { headers: { Accept: "application/json" } })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        // API kan returnere ett objekt eller en liste
        const list: LandslideWarning[] = Array.isArray(data) ? data : [data].filter(Boolean);
        setWarnings(list);
      })
      .catch((e: any) => setError(String(e?.message ?? e)))
      .finally(() => setLoading(false));
  }, [county]);

  return (
    <div style={{ padding: 16 }}>
      <h1>Jordskred (Landslides)</h1>
      <p>
        Her vises jordskredvarsler fra NVE for valgt fylke i inneværende periode.
      </p>

      <label style={{ display: "block", margin: "12px 0" }}>
        Fylke:{" "}
        <select value={county} onChange={(e) => setCounty(Number(e.target.value))}>
          {COUNTIES.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </label>

      {loading && <p>Laster…</p>}
      {error && <p style={{ color: "crimson" }}>Feil: {error}</p>}

      {!loading && !error && (
        <>
          <p>
            Fant {warnings.length} varsel{warnings.length === 1 ? "" : "er"} for{" "}
            {COUNTIES.find((c) => c.id === county)?.name}.
          </p>
          <ul style={{ marginTop: 12 }}>
            {warnings.map((w) => (
              <li key={w.Id} style={{ marginBottom: 12 }}>
                <strong>
                  {w.WarningTitle ?? "Jordskredvarsel"}{" "}
                  {typeof w.ActivityLevel === "number" ? `(nivå ${w.ActivityLevel})` : ""}
                </strong>
                <div>{w.WarningText}</div>
                <small>
                  Gyldig:{" "}
                  {w.ValidFrom ? new Date(w.ValidFrom).toLocaleString() : "ukjent"} –{" "}
                  {w.ValidTo ? new Date(w.ValidTo).toLocaleString() : "ukjent"}
                </small>
              </li>
            ))}
          </ul>
        </>
      )}

      <Kilde>
        NVE – Varsom Jordskred API (gratis, åpent). Eksempel-endepunkt:
        <code> /hydrology/forecast/landslide/v1.0.10/api/Warning/County/&lt;fylke&gt;/1/&lt;start&gt;/&lt;slutt&gt; </code>
        . Se dokumentasjon/Swagger for jordskredvarsling. 
      </Kilde>
    </div>
  );
}
