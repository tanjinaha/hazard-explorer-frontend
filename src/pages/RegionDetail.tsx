// src/pages/RegionDetail.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";

/* ---------------- Types ---------------- */
type SimpleWarning = {
  RegionId: number;
  DangerLevel: number;
  ValidFrom: string;
  ValidTo: string;
  NextWarningTime?: string;
  MainText?: string;
};

type DetailWarning = {
  ValidFrom?: string;
  AvalancheProblems?: any[];
};

/* ---------------- Page ---------------- */
export default function RegionDetail() {
  const { id } = useParams<{ id: string }>();
  const regionIdNum = id ? Number(id) : undefined;

  // Varsom (simple + detail)
  const [simple, setSimple] = useState<SimpleWarning[] | null>(null);
  const [detail, setDetail] = useState<DetailWarning | null>(null);
  const [loadWarn, setLoadWarn] = useState(true);
  const [errWarn, setErrWarn] = useState<string | null>(null);
  const [errDetail, setErrDetail] = useState<string | null>(null);

  // Varsom dates (today & tomorrow) for the main forecast
  const { from, to } = useMemo(() => {
    const pad = (n: number) => String(n).padStart(2, "0");
    const d = new Date();
    const today = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const t2 = new Date(d);
    t2.setDate(d.getDate() + 1);
    const tomorrow = `${t2.getFullYear()}-${pad(t2.getMonth() + 1)}-${pad(t2.getDate())}`;
    return { from: today, to: tomorrow };
  }, []);

  // -------- Per-period history (line chart)
  const [histFrom, setHistFrom] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().slice(0, 10);
  });
  const [histTo, setHistTo] = useState(() => new Date().toISOString().slice(0, 10));
  const [dangerHist, setDangerHist] = useState<Array<{ date: string; danger: number | null }>>([]);
  const [errHist, setErrHist] = useState<string | null>(null);

  // -------- By-winter history (stacked bars)
  type WinterBin = { winter: string; counts: number[]; total: number };
  const [winters, setWinters] = useState<WinterBin[] | null>(null);
  const [histBusy, setHistBusy] = useState(false);
  const [histErr, setHistErr] = useState<string | null>(null);

  /* ------------ Load Varsom data (today) ------------ */
  useEffect(() => {
    if (!regionIdNum) return;

    // Simple (main)
    setLoadWarn(true);
    setErrWarn(null);
    fetch(
      `/nve/hydrology/forecast/avalanche/v6.3.0/api/AvalancheWarningByRegion/Simple/${encodeURIComponent(
        String(regionIdNum)
      )}/no/${from}/${to}`,
      { headers: { Accept: "application/json" } }
    )
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((j) => setSimple(Array.isArray(j) ? j : []))
      .catch((e: any) => setErrWarn(String(e?.message ?? e)))
      .finally(() => setLoadWarn(false));

    // Detail (problems)
    setErrDetail(null);
    fetch(
      `/nve/hydrology/forecast/avalanche/v6.3.0/api/AvalancheWarningByRegion/Detail/${encodeURIComponent(
        String(regionIdNum)
      )}/no/${from}/${to}`,
      { headers: { Accept: "application/json" } }
    )
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((j) => {
        const arr = Array.isArray(j) ? j : [];
        const pick =
          arr.find((w: any) => typeof w?.ValidFrom === "string" && w.ValidFrom.startsWith(from)) ||
          arr[0] ||
          null;
        setDetail(pick);
      })
      .catch((e: any) => setErrDetail(String(e?.message ?? e)));
  }, [regionIdNum, from, to]);

  /* ------------ Load history for selected range ------------ */
  useEffect(() => {
    if (!regionIdNum || !histFrom || !histTo) return;
    (async () => {
      try {
        setErrHist(null);
        setDangerHist([]);
        const r = await fetch(
          `/nve/hydrology/forecast/avalanche/v6.3.0/api/AvalancheWarningByRegion/Simple/${encodeURIComponent(
            String(regionIdNum)
          )}/no/${histFrom}/${histTo}`,
          { headers: { Accept: "application/json" } }
        );
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const j = await r.json();

        const byDay: Record<string, number | undefined> = {};
        (Array.isArray(j) ? j : []).forEach((w: any) => {
          const day = String(w?.ValidFrom ?? "").slice(0, 10);
          const lvl = typeof w?.DangerLevel === "number" ? w.DangerLevel : undefined;
          if (day) byDay[day] = lvl;
        });

        const start = new Date(histFrom + "T00:00:00");
        const end = new Date(histTo + "T23:59:59");
        const out: Array<{ date: string; danger: number | null }> = [];
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const key = d.toISOString().slice(0, 10);
          const v = byDay[key];
          out.push({ date: key, danger: typeof v === "number" ? v : null });
        }
        setDangerHist(out);
      } catch (e: any) {
        setErrHist(String(e?.message ?? e));
      }
    })();
  }, [regionIdNum, histFrom, histTo]);

  /* ------------ Helpers ------------ */
  const todayWarning = useMemo(() => {
    if (!simple || simple.length === 0) return null;
    return simple.find((w) => w.ValidFrom?.startsWith(from)) ?? simple[0];
  }, [simple, from]);

  const fmtDateTime = (iso?: string) => {
    if (!iso) return "–";
    const d = new Date(iso);
    return d.toLocaleString("no-NO", { dateStyle: "short", timeStyle: "short" });
  };

  const badge = (lvl?: number) => {
    const base =
      "inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-semibold";
    switch (lvl) {
      case 1:
        return <span className={`${base} bg-emerald-100 text-emerald-800`}>Faregrad 1 – Liten</span>;
      case 2:
        return <span className={`${base} bg-yellow-100 text-yellow-800`}>Faregrad 2 – Moderat</span>;
      case 3:
        return <span className={`${base} bg-orange-100 text-orange-800`}>Faregrad 3 – Betydelig</span>;
      case 4:
        return <span className={`${base} bg-red-100 text-red-800`}>Faregrad 4 – Stor</span>;
      case 5:
        return (
          <span className={`${base} bg-purple-100 text-purple-800`}>Faregrad 5 – Meget stor</span>
        );
      default:
        return <span className={`${base} bg-slate-100 text-slate-700`}>Ukjent</span>;
    }
  };

  const fmtElevation = (min?: number | null, max?: number | null) => {
    const hasMin = typeof min === "number";
    const hasMax = typeof max === "number";
    if (hasMin && hasMax) return `${min}–${max} m`;
    if (hasMin) return `over ${min} m`;
    if (hasMax) return `under ${max} m`;
    return null;
  };
  const fmtAspects = (p: any): string | null => {
    const s: string | undefined =
      p?.ValidExposition?.Aspect ??
      p?.Exposition ??
      p?.Aspect ??
      p?.AspectName ??
      p?.AspectAbb ??
      undefined;
    if (typeof s === "string" && s.trim()) {
      return s.trim().replace(/-/g, "–").replace(/\s+/g, "");
    }
    return null;
  };

  // -------- helpers for winters
  const seasonRange = (y: number) => ({ from: `${y}-11-01`, to: `${y + 1}-04-30` });
  async function loadLastNWinters(n = 5) {
    if (!regionIdNum) return;
    setHistBusy(true);
    setHistErr(null);
    setWinters(null);
    try {
      const now = new Date();
      const baseYear = (now.getMonth() + 1) < 5 ? now.getFullYear() - 1 : now.getFullYear();
      const years: number[] = [];
      for (let i = 0; i < n; i++) years.push(baseYear - i);

      const results: WinterBin[] = [];
      for (const y of years) {
        const { from, to } = seasonRange(y);
        const r = await fetch(
          `/nve/hydrology/forecast/avalanche/v6.3.0/api/AvalancheWarningByRegion/Simple/${encodeURIComponent(
            String(regionIdNum)
          )}/no/${from}/${to}`,
          { headers: { Accept: "application/json" } }
        );
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const j = await r.json();

        const byDay: Record<string, number | undefined> = {};
        (Array.isArray(j) ? j : []).forEach((w: any) => {
          const day = String(w?.ValidFrom ?? "").slice(0, 10);
          const fg = typeof w?.DangerLevel === "number" ? w.DangerLevel : undefined;
          if (day) byDay[day] = fg;
        });

        const start = new Date(from + "T00:00:00");
        const end = new Date(to + "T23:59:59");
        const counts = [0, 0, 0, 0, 0]; // FG1..FG5
        let total = 0;
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const key = d.toISOString().slice(0, 10);
          const fg = byDay[key];
          if (typeof fg === "number" && fg >= 1 && fg <= 5) {
            counts[fg - 1] += 1;
            total += 1;
          }
        }
        results.push({ winter: `${y}/${String(y + 1).slice(-2)}`, counts, total });
      }

      setWinters(results);
    } catch (e: any) {
      setHistErr(String(e?.message ?? e));
    } finally {
      setHistBusy(false);
    }
  }

  /* ---------- UI ---------- */
  return (
    <div className="container mx-auto p-4 space-y-4">
      <Link to="/snoskred" className="underline text-sm">← Tilbake</Link>

      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Snøskred – Region {id}</h1>
        {!loadWarn && !errWarn && todayWarning && badge(todayWarning.DangerLevel)}
      </div>

      {errWarn && <p className="text-red-600">Feil: {errWarn}</p>}
      {loadWarn && <p>Laster varsel…</p>}

      {/* ---- Main forecast + problems ---- */}
      {!loadWarn && !errWarn && (
        <>
          {!todayWarning ? (
            <div className="space-y-3">
              <p className="text-slate-600">
                Ikke vurdert i dag. Faregrad: <strong>Ukjent</strong>. Neste varsel: –
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-slate-600">
                Gyldig fra <strong>{fmtDateTime(todayWarning.ValidFrom)}</strong> til{" "}
                <strong>{fmtDateTime(todayWarning.ValidTo)}</strong>
              </p>
              <p className="text-sm text-slate-600">
                Neste varsel: <strong>{fmtDateTime(todayWarning.NextWarningTime)}</strong>
              </p>

              <div className="rounded-xl border bg-white p-4">
                <h2 className="text-lg font-semibold mb-1">Dette er viktig i dag</h2>
                <p className="text-slate-800 whitespace-pre-line">
                  {todayWarning.MainText || "Ingen sammenfattet tekst tilgjengelig."}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  1 Liten • 2 Moderat • 3 Betydelig • 4 Stor • 5 Meget stor
                </p>
              </div>

              <div className="rounded-xl border bg-white p-4">
                <h2 className="text-lg font-semibold mb-2">Hvor er det mest utsatt i dag</h2>
                {errDetail && <p className="text-sm text-red-600">Feil: {errDetail}</p>}

                {!errDetail &&
                  (!detail?.AvalancheProblems || detail.AvalancheProblems.length === 0) && (
                    <p className="text-sm text-slate-600">Ingen spesifikke skredproblem oppgitt i dag.</p>
                  )}

                <div className="flex flex-wrap gap-2">
                  {(detail?.AvalancheProblems ?? []).slice(0, 3).map((p: any, idx: number) => {
                    const problemName =
                      p?.AvalancheProblemName ??
                      p?.AvalancheProblemTIDName ??
                      p?.ProblemName ??
                      p?.TypeName ??
                      "Skredproblem";

                    const elevText = fmtElevation(
                      p?.ValidExposition?.MinElevation ?? p?.ValidHeightMin ?? p?.ElevationMin,
                      p?.ValidExposition?.MaxElevation ?? p?.ValidHeightMax ?? p?.ElevationMax
                    );

                    const aspectsText = fmtAspects(
                      p?.ValidExposition ?? p?.Exposition ?? p?.Aspect ?? null
                    );

                    const parts = [problemName];
                    if (elevText) parts.push(elevText);
                    if (aspectsText) parts.push(aspectsText);
                    const label = parts.join(" • ");

                    return (
                      <span
                        key={idx}
                        className="inline-flex items-center rounded-full border px-3 py-1 text-sm bg-slate-50"
                        title={problemName}
                      >
                        {label}
                      </span>
                    );
                  })}
                </div>

                <p className="mt-2 text-xs text-slate-500">Kilde: varsom.no (detaljert varsel).</p>
              </div>
            </div>
          )}
        </>
      )}

      {/* ---- Faregrad i valgt periode (line chart) ---- */}
      <div className="rounded-xl border bg-white p-4">
        <div className="flex items-end justify-between gap-3 flex-wrap">
          <h3 className="font-semibold">Faregrad i valgt periode</h3>
          <div className="flex items-end gap-2">
            <label className="text-sm">
              Fra:
              <input
                className="ml-2 border rounded px-2 py-1 text-sm"
                type="date"
                value={histFrom}
                max={histTo}
                onChange={(e) => setHistFrom(e.target.value)}
              />
            </label>
            <label className="text-sm">
              Til:
              <input
                className="ml-2 border rounded px-2 py-1 text-sm"
                type="date"
                value={histTo}
                min={histFrom}
                onChange={(e) => setHistTo(e.target.value)}
              />
            </label>
            <button
              className="border rounded px-2 py-1 text-sm"
              onClick={() => {
                const end = new Date();
                const start = new Date();
                start.setDate(end.getDate() - 30);
                setHistFrom(start.toISOString().slice(0, 10));
                setHistTo(end.toISOString().slice(0, 10));
              }}
            >
              Siste 30 dager
            </button>
            <button
              className="border rounded px-2 py-1 text-sm"
              onClick={() => {
                const now = new Date();
                const y = now.getMonth() + 1 < 5 ? now.getFullYear() - 1 : now.getFullYear();
                setHistFrom(`${y}-11-01`);
                setHistTo(`${y + 1}-04-30`);
              }}
            >
              Denne vinteren
            </button>
          </div>
        </div>

        {errHist ? (
          <p className="text-sm text-red-600 mt-2">Kunne ikke hente faregradshistorikk.</p>
        ) : dangerHist.length === 0 ? (
          <p className="text-sm text-slate-600 mt-2">Laster…</p>
        ) : (
          <>
            {(() => {
              const w = 520, h = 140, pad = 24;
              const pts = dangerHist.map((p, i) => ({ i, v: p.danger ?? 0 }));
              const x = (i: number) => pad + (i * (w - 2 * pad)) / Math.max(1, pts.length - 1);
              const y = (v: number) => h - pad - (v / 5) * (h - 2 * pad);
              const d = pts.map((p, idx) => `${idx ? "L" : "M"} ${x(p.i)} ${y(p.v)}`).join(" ");
              return (
                <svg width={w} height={h} className="mt-3" role="img" aria-label="Faregrad over tid">
                  <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="#cbd5e1" />
                  {[0, 1, 2, 3, 4, 5].map((t) => (
                    <g key={t}>
                      <line x1={pad - 4} y1={y(t)} x2={w - pad} y2={y(t)} stroke="#f1f5f9" />
                      <text x={6} y={y(t) + 3} fontSize="10" fill="#64748b">{t}</text>
                    </g>
                  ))}
                  <path d={d} fill="none" stroke="#0ea5e9" strokeWidth="2" />
                </svg>
              );
            })()}
            <p className="text-xs text-slate-500 mt-1">
              Tomme dager = ingen varsel publisert. Kilde: NVE Varsom (Simple).
            </p>
          </>
        )}
      </div>

      {/* ---- Historikk (siste N vintre, stacked bars) ---- */}
      <div className="rounded-xl border bg-white p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Historikk (faregrad per vinter)</h3>
          <div className="flex gap-2">
            <button className="border rounded px-2 py-1 text-sm" onClick={() => loadLastNWinters(3)}>Siste 3</button>
            <button className="border rounded px-2 py-1 text-sm" onClick={() => loadLastNWinters(5)}>Siste 5</button>
            <button className="border rounded px-2 py-1 text-sm" onClick={() => loadLastNWinters(10)}>Siste 10</button>
          </div>
        </div>

        {histBusy && <p className="text-sm text-slate-600 mt-2">Henter …</p>}
        {histErr && <p className="text-sm text-red-600 mt-2">Feil: {histErr}</p>}

        {winters && winters.length > 0 && (
          <div className="mt-3 space-y-2">
            {winters.map((w) => {
              const total = w.total || 1;
              const pct = w.counts.map((c) => (100 * c) / total);
              const cols = ["#34d399","#fbbf24","#fb923c","#f87171","#a78bfa"]; // FG1..FG5
              return (
                <div key={w.winter}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium">{w.winter}</span>
                    <span className="text-slate-600">{w.total} publiserte dager</span>
                  </div>
                  <div className="w-full h-5 rounded bg-slate-100 overflow-hidden flex">
                    {pct.map((p, i) => (
                      <div key={i} style={{ width: `${p}%`, background: cols[i] }} title={`FG${i+1}: ${w.counts[i]} d`} />
                    ))}
                  </div>
                  <div className="mt-1 text-xs text-slate-600">
                    FG1 {w.counts[0]} • FG2 {w.counts[1]} • FG3 {w.counts[2]} • FG4 {w.counts[3]} • FG5 {w.counts[4]}
                  </div>
                </div>
              );
            })}
            <p className="text-xs text-slate-500">
              Andeler per vinter. Dager uten varsel teller ikke med. Kilde: NVE Varsom (Simple).
            </p>
          </div>
        )}
      </div>

      {/* ---- Tips + Glossary ---- */}
      <div className="grid gap-4 md:grid-cols-2 mt-6">
        <div className="rounded-xl border bg-white p-4">
          <h3 className="font-semibold">Enkle råd i dag</h3>
          <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
            <li>Sjekk dagens varsel før tur.</li>
            <li>Unngå brattere enn 30° ved faregrad ≥ 3.</li>
            <li>Tenk på <strong>utløpsområder</strong> – også flate dalbunner kan være utsatt.</li>
            <li>Gå én og én i bratte partier, møt trygt.</li>
            <li>Vend i tide – toppen venter.</li>
          </ul>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <h3 className="font-semibold">Nyttige begreper</h3>
          <dl className="text-sm text-slate-700">
            <dt className="font-medium">Flakskred</dt>
            <dd className="mb-2">Et sammenhengende snøflak glir ut.</dd>
            <dt className="font-medium">Løssnøskred</dt>
            <dd className="mb-2">Løs snø løsner punktvis.</dd>
            <dt className="font-medium">Utløpsområde</dt>
            <dd className="mb-2">Området skredet kan nå.</dd>
            <dt className="font-medium">Skredproblem</dt>
            <dd className="mb-2">Hovedårsaken (f.eks. vindtransportert snø).</dd>
            <dt className="font-medium">Aspekt</dt>
            <dd>Himmelretning på fjellsida (N, Ø, S, V).</dd>
          </dl>
        </div>
      </div>

      {/* Footer */}
      <p className="text-xs text-slate-500 mt-4">
        Kilde: NVE Varsom (skredvarsel). Dette er en opplæringsside – ikke for beredskapsbruk.
      </p>
    </div>
  );
}
