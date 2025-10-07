import { useEffect, useState } from "react";

type Props = {
  regionId: number;          // e.g. 3031 (Lyngen), 3029 (Voss)
  regionName: string;        // label on the card
  date: string;              // "YYYY-MM-DD" — pick a day with data, e.g. "2024-03-22"
  langKey?: 1 | 2;           // 1=Bokmål, 2=English (default 2)
};

type SimpleWarning = {
  DangerLevel: number;       // 1..5
  ValidFrom: string;
  ValidTo: string;
  RegionName: string;
  MainText?: string;
};

// FG → color + emoji + kid sentence
const FG_STYLES: Record<number, { color: string; emoji: string; line: string }> = {
  1: { color: "#8BC34A", emoji: "🟢", line: "Trygt de fleste steder. Unngå veldig bratte bakker." },
  2: { color: "#FFEB3B", emoji: "🟡", line: "Vær litt forsiktig i bratte bakker." },
  3: { color: "#FF9800", emoji: "🟠", line: "Vær forsiktig! Hold deg unna bratte fjellsider." },
  4: { color: "#F44336", emoji: "🔴", line: "Farlig! Ikke gå i bratte fjellområder i dag." },
  5: { color: "#9C27B0", emoji: "🟣", line: "Svært farlig! Hold deg på trygt og flatt terreng." },
};

export default function FaregradCard({ regionId, regionName, date, langKey = 2 }: Props) {
  const [data, setData] = useState<SimpleWarning[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const url = `https://api01.nve.no/hydrology/forecast/avalanche/v6.3.0/api/AvalancheWarningByRegion/Simple/${regionId}/${langKey}/${date}/${date}`;

  useEffect(() => {
    setLoading(true);
    setErr(null);
    fetch(url, { headers: { Accept: "application/json" } })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d: SimpleWarning[]) => setData(d))
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [url]);

  const box: React.CSSProperties = {
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 16,
    minWidth: 260,
    background: "#f8fafc",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  };

  return (
    <div style={box}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{regionName}</h3>
        <span style={{ fontSize: 12, color: "#64748b" }}>{date}</span>
      </div>

      {loading && <p style={{ marginTop: 12 }}>Laster…</p>}
      {err && <p style={{ marginTop: 12, color: "#b91c1c" }}>Feil: {err}</p>}

      {!loading && !err && (!data || data.length === 0) && (
        <p style={{ marginTop: 12, color: "#334155" }}>Ingen varsel publisert denne dagen.</p>
      )}

      {!loading && !err && data && data.length > 0 && (
        <CardContent level={data[0].DangerLevel} mainText={data[0].MainText} />
      )}
    </div>
  );
}

function CardContent({ level, mainText }: { level: number; mainText?: string }) {
  const s = FG_STYLES[level] ?? { color: "#9CA3AF", emoji: "⚪", line: "Ingen data." };

  return (
    <>
      {/* Big FG pill */}
      <div
        style={{
          marginTop: 12,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 12px",
          borderRadius: 999,
          background: s.color,
          color: "white",
          fontWeight: 800,
        }}
      >
        <span style={{ fontSize: 18 }}>{s.emoji}</span>
        <span>FG{level}</span>
      </div>

      {/* 5-box mini bar */}
      <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <div
            key={n}
            title={`FG${n}`}
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              border: "1px solid #e2e8f0",
              background: n <= level ? s.color : "#ffffff",
            }}
          />
        ))}
      </div>

      {/* Kid sentence */}
      <p style={{ marginTop: 10, fontSize: 14, color: "#0f172a" }}>{s.line}</p>

      {/* Short text from NVE (optional) */}
      {mainText && (
        <details style={{ marginTop: 6 }}>
          <summary style={{ cursor: "pointer", color: "#2563eb" }}>Les mer</summary>
          <p style={{ marginTop: 6, fontSize: 13, color: "#334155" }}>{mainText}</p>
        </details>
      )}
    </>
  );
}
