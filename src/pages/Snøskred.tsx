// src/pages/Snøskred.tsx
import { useEffect, useState } from "react";
import Kilde from "@/components/Kilde";

type Region = { RegionId: number; Name: string };

export default function Snøskred() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/nve/hydrology/forecast/avalanche/v6.3.0/api/Region", {
      headers: { Accept: "application/json" },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setRegions(data);
      })
      .catch((e: any) => setError(String(e?.message ?? e)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h1>Snøskred (Avalanche)</h1>
      <p>Her vises regioner med snøskredvarsling fra NVE.</p>

      {error && <p style={{ color: "crimson" }}>Feil: {error}</p>}
      {loading && <p>Laster…</p>}

      {!loading && !error && (
        <>
          <p>Fant {regions.length} snøskredregioner:</p>
          <ul>
            {regions.map((r) => (
              <li key={r.RegionId}>
                {r.Name} (ID: {r.RegionId})
              </li>
            ))}
          </ul>
        </>
      )}

      <Kilde>
        NVE – Varsom Avalanche API — endpoint:{" "}
        <code>/hydrology/forecast/avalanche/v6.3.0/api/Region</code>. Se også{" "}
        <a href="https://www.varsom.no" target="_blank" rel="noopener noreferrer">
          varsom.no
        </a>.
      </Kilde>
    </div>
  );
}
