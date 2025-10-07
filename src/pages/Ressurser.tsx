// src/pages/Ressurser.tsx
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

type RegobsEvent = {
  DtObsTime: string;
  LocationName?: string;
  RegId?: number;
  AvalancheSizeTID?: number;
  AvalancheExt?: { SizeTID?: number } | null;
};

type SimpleWarning = {
  RegionId: number;
  DangerLevel: number;
  ValidFrom: string;
  ValidTo: string;
  NextWarningTime?: string;
  MainText?: string;
};

export default function Ressurser() {
  // --------- Inputs ----------
  const [regionId, setRegionId] = useState<string>("3010"); // default: Oslo-region-ish; change freely
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().slice(0, 10);
  });
  const [toDate, setToDate] = useState(() => new Date().toISOString().slice(0, 10));

  // Varsom runs "today -> tomorrow" (forecasts are day-based)
  const { varsomFrom, varsomTo } = useMemo(() => {
    const pad = (n: number) => String(n).padStart(2, "0");
    const d = new Date();
    const y = d.getFullYear();
    const m = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const today = `${y}-${m}-${dd}`;
    const t2 = new Date(d);
    t2.setDate(d.getDate() + 1);
    const y2 = t2.getFullYear();
    const m2 = pad(t2.getMonth() + 1);
    const d2 = pad(t2.getDate());
    const tomorrow = `${y2}-${m2}-${d2}`;
    return { varsomFrom: today, varsomTo: tomorrow };
  }, []);

  // --------- Test state ----------
  const [testingVarsom, setTestingVarsom] = useState(false);
  const [testingRegobs, setTestingRegobs] = useState(false);

  const [varsomStatus, setVarsomStatus] = useState<string | null>(null);
  const [varsomData, setVarsomData] = useState<SimpleWarning[] | null>(null);
  const [varsomError, setVarsomError] = useState<string | null>(null);

  const [regobsStatus, setRegobsStatus] = useState<string | null>(null);
  const [regobsData, setRegobsData] = useState<RegobsEvent[] | null>(null);
  const [regobsError, setRegobsError] = useState<string | null>(null);

  // --------- Actions ----------
  const testVarsom = async () => {
    setTestingVarsom(true);
    setVarsomError(null);
    setVarsomStatus("…");
    setVarsomData(null);
    try {
      const url = `/nve/hydrology/forecast/avalanche/v6.3.0/api/AvalancheWarningByRegion/Simple/${encodeURIComponent(
        regionId
      )}/no/${varsomFrom}/${varsomTo}`;

      const r = await fetch(url, { headers: { Accept: "application/json" } });
      setVarsomStatus(`${r.status} ${r.statusText}`);
      if (!r.ok) throw new Error(`Varsom feil: HTTP ${r.status}`);
      const j = await r.json();
      setVarsomData(Array.isArray(j) ? j : []);
    } catch (e: any) {
      setVarsomError(String(e?.message ?? e));
    } finally {
      setTestingVarsom(false);
    }
  };

  const testRegobs = async () => {
    setTestingRegobs(true);
    setRegobsError(null);
    setRegobsStatus("…");
    setRegobsData(null);
    try {
      const body = {
        SelectedRegionIds: regionId ? [Number(regionId)] : undefined,
        GeoHazardIds: [10],
        DateFrom: new Date(fromDate + "T00:00:00Z").toISOString(),
        DateTo: new Date(toDate + "T23:59:59Z").toISOString(),
        PageSize: 100,
        Offset: 0,
      };

      const r = await fetch(`/regobs01/Registration/Search`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setRegobsStatus(`${r.status} ${r.statusText}`);
      if (!r.ok) throw new Error(`Regobs feil: HTTP ${r.status}`);
      const j = await r.json();
      setRegobsData(Array.isArray(j) ? j : []);
    } catch (e: any) {
      setRegobsError(String(e?.message ?? e));
    } finally {
      setTestingRegobs(false);
    }
  };

  // --------- UI helpers ----------
  const count = (arr?: any[] | null) => (Array.isArray(arr) ? arr.length : 0);
  const latest = (arr?: RegobsEvent[] | null) =>
    Array.isArray(arr) && arr.length > 0
      ? [...arr].sort(
          (a, b) => new Date(b.DtObsTime).getTime() - new Date(a.DtObsTime).getTime()
        )[0]
      : undefined;

  const fmtDateTime = (iso?: string) =>
    iso ? new Date(iso).toLocaleString("no-NO", { dateStyle: "short", timeStyle: "short" }) : "–";

  // --------- Render ----------
  return (
    <div className="container mx-auto p-4 space-y-6">
      <Link to="/" className="underline text-sm">
        ← Til forsiden
      </Link>

      <h1 className="text-2xl font-semibold">Ressurser &amp; API-test</h1>

      {/* Controls */}
      <div className="rounded-2xl border bg-white p-4 space-y-3">
        <h2 className="font-semibold">Innstillinger</h2>
        <div className="flex flex-wrap gap-3">
          <label className="text-sm">
            RegionId:
            <input
              className="ml-2 border rounded px-2 py-1 text-sm w-28"
              value={regionId}
              onChange={(e) => setRegionId(e.target.value)}
            />
          </label>

          <label className="text-sm">
            Fra:
            <input
              className="ml-2 border rounded px-2 py-1 text-sm"
              type="date"
              value={fromDate}
              max={toDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </label>

          <label className="text-sm">
            Til:
            <input
              className="ml-2 border rounded px-2 py-1 text-sm"
              type="date"
              value={toDate}
              min={fromDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </label>

          <div className="flex gap-2">
            <button
              className="border rounded px-3 py-1 text-sm"
              onClick={() => {
                const end = new Date();
                const start = new Date();
                start.setDate(end.getDate() - 7);
                setFromDate(start.toISOString().slice(0, 10));
                setToDate(end.toISOString().slice(0, 10));
              }}
            >
              Siste 7 dager
            </button>
            <button
              className="border rounded px-3 py-1 text-sm"
              onClick={() => {
                const end = new Date();
                const start = new Date();
                start.setMonth(end.getMonth() - 1);
                setFromDate(start.toISOString().slice(0, 10));
                setToDate(end.toISOString().slice(0, 10));
              }}
            >
              Siste 30 dager
            </button>
            <button
              className="border rounded px-3 py-1 text-sm"
              onClick={() => {
                // Simple “vinter” rule: 1 Nov – 30 Apr spanning year
                const now = new Date();
                const year = now.getMonth() + 1 < 5 ? now.getFullYear() - 1 : now.getFullYear();
                const start = new Date(`${year}-11-01T00:00:00Z`);
                const end = new Date(`${year + 1}-04-30T23:59:59Z`);
                setFromDate(start.toISOString().slice(0, 10));
                setToDate(end.toISOString().slice(0, 10));
              }}
            >
              Denne vinteren
            </button>
          </div>
        </div>
        <p className="text-xs text-slate-500">
          Varsom-forecast hentes for i dag → i morgen. Regobs-observasjoner bruker datoene over.
        </p>
      </div>

      {/* Varsom test */}
      <div className="rounded-2xl border bg-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Test Varsom (AvalancheWarningByRegion / Simple)</h2>
          <button
            className="border rounded px-3 py-1 text-sm"
            onClick={testVarsom}
            disabled={testingVarsom}
          >
            {testingVarsom ? "Tester…" : "Kjør test"}
          </button>
        </div>

        <p className="text-sm mt-2">
          Status:{" "}
          <span className={varsomError ? "text-red-600" : "text-slate-700"}>
            {varsomStatus || "—"}
          </span>
        </p>
        {varsomError && <p className="text-sm text-red-600">Feil: {varsomError}</p>}

        {varsomData && (
          <div className="mt-2 text-sm">
            <p>Antall varsler i respons: {count(varsomData)}</p>
            {varsomData[0] && (
              <ul className="list-disc pl-5">
                <li>RegionId: {varsomData[0].RegionId}</li>
                <li>Faregrad: {varsomData[0].DangerLevel ?? "–"}</li>
                <li>
                  Gyldig: {new Date(varsomData[0].ValidFrom).toLocaleDateString("no-NO")} →{" "}
                  {new Date(varsomData[0].ValidTo).toLocaleDateString("no-NO")}
                </li>
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Regobs test */}
      <div className="rounded-2xl border bg-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Test Regobs (Registration/Search)</h2>
          <button
            className="border rounded px-3 py-1 text-sm"
            onClick={testRegobs}
            disabled={testingRegobs}
          >
            {testingRegobs ? "Tester…" : "Kjør test"}
          </button>
        </div>

        <p className="text-sm mt-2">
          Status:{" "}
          <span className={regobsError ? "text-red-600" : "text-slate-700"}>
            {regobsStatus || "—"}
          </span>
        </p>
        {regobsError && <p className="text-sm text-red-600">Feil: {regobsError}</p>}

        {regobsData && (
          <div className="mt-2 text-sm">
            <p>Antall observasjoner: {count(regobsData)}</p>
            {latest(regobsData) ? (
              <ul className="list-disc pl-5">
                <li>Siste dato: {fmtDateTime(latest(regobsData)!.DtObsTime)}</li>
                <li>Sted: {latest(regobsData)!.LocationName || "–"}</li>
              </ul>
            ) : (
              <p>Ingen i valgt periode.</p>
            )}
          </div>
        )}
      </div>

      {/* Learning links */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border bg-white p-4">
          <h2 className="font-semibold">Nyttige lenker (offisielle)</h2>
          <ul className="list-disc pl-5 text-sm">
            <li>
              <a className="underline text-blue-700" href="https://www.varsom.no/" target="_blank">
                Varsom – skredvarsling
              </a>
            </li>
            <li>
              <a className="underline text-blue-700" href="https://www.regobs.no/" target="_blank">
                Regobs – observasjoner
              </a>
            </li>
            <li>
              <a
                className="underline text-blue-700"
                href="https://developer.yr.no/doc/locationforecast/"
                target="_blank"
              >
                MET/yr – Locationforecast (vær)
              </a>
            </li>
            <li>
              <a className="underline text-blue-700" href="https://www.ngu.no/en/topic/open-data" target="_blank">
                NGU – Open data (geologi)
              </a>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border bg-white p-4">
          <h2 className="font-semibold">Begreper</h2>
          <ul className="list-disc pl-5 text-sm">
            <li><strong>Faregrad (1–5):</strong> Liten → Meget stor.</li>
            <li><strong>Skredproblem:</strong> Hva gjør snøen ustabil (f.eks. vindtransportert snø).</li>
            <li><strong>Aspekt:</strong> Himmelhimmelretning (N, Ø, S, V).</li>
            <li><strong>Utløpsområde:</strong> Området skredet kan nå.</li>
          </ul>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Kilder: NVE Varsom (skredvarsel) og Regobs (observasjoner). Dette er en opplæringsside – ikke for
        beredskapsbruk.
      </p>
    </div>
  );
}
