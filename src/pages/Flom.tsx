// src/pages/Flom.tsx
import { useEffect, useState } from "react";
import Kilde from "@/components/Kilde";

type FloodWarning = {
  Id: number;
  WarningText: string;
  WarningTitle?: string;
  ActivityLevel?: number | null;
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

export default function Flom() {
  const [county, setCounty] = useState<number>(3);
  const [warnings, setWarnings] = useState<FloodWarning[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buildUrl = (countyId: number) =>
    `/nve/hydrology/forecast/flood/v1.0.10/api/Warning/County/${countyId}`;

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(buildUrl(county), { headers: { Accept: "application/json" } })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : [data].filter(Boolean);
        setWarnings(list);
      })
      .catch((e: any) => setError(String(e?.message ?? e)))
      .finally(() => setLoading(false));
  }, [county]);

  return (
    <div style={{ padding: 16 }}>
      <h1>Flom (Flood)</h1>
      <p>Velg fylke for å se flomvarsler fra NVE.</p>

      <label style={{ display: "block", margin: "12px 0" }}>
        Fylke:{" "}
        <select value={county} onChange={(e) => setCounty(Number(e.target.value))}>
          {COUNTIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
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
                  {w.WarningTitle ?? "Flomvarsel"}{" "}
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
        NVE – Varsom Flood API — endpoint:{" "}
        <code>/hydrology/forecast/flood/v1.0.10/api/Warning/County/&lt;fylkeId&gt;</code>. Se også{" "}
        <a href="https://www.varsom.no" target="_blank" rel="noopener noreferrer">
          varsom.no
        </a>.
      </Kilde>
    </div>
  );
}
