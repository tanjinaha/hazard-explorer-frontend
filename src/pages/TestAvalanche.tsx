import { useEffect, useState } from "react";

// Define the structure of the data we get from NVE
type SimpleWarning = {
  DangerLevel: number;
  ValidFrom: string;
  ValidTo: string;
  RegionName: string;
  MainText?: string;
};

export default function TestAvalanche() {
  const [data, setData] = useState<SimpleWarning[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    // This is a known date & region that has avalanche data
    const url =
      "https://api01.nve.no/hydrology/forecast/avalanche/v6.3.0/api/AvalancheWarningByRegion/Simple/3031/2/2024-03-22/2024-03-22";

    fetch(url, { headers: { Accept: "application/json" } })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setData)
      .catch((e) => setErr(e.message));
  }, []);

  if (err) return <div>❌ Feil: {err}</div>;
  if (!data) return <div>⏳ Laster data…</div>;

  const w = data[0];
  return (
    <div style={{ border: "1px solid #ccc", padding: 16, borderRadius: 8 }}>
      <h2>Avalanche test data</h2>
      <p><strong>Region:</strong> {w.RegionName}</p>
      <p><strong>Faregrad:</strong> FG{w.DangerLevel}</p>
      <p>
        <strong>Gyldig:</strong> {w.ValidFrom} → {w.ValidTo}
      </p>
      {w.MainText && <p><strong>Info:</strong> {w.MainText}</p>}
    </div>
  );
}
