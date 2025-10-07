// src/pages/Snøskred.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Kilde from "@/components/Kilde";

// shadcn/ui
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import FaregradCard from "@/components/FaregradCard";

type Region = { RegionId: number; Name: string };

export default function Snøskred() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    // direct fetch (no proxy)
    fetch("https://api01.nve.no/hydrology/forecast/avalanche/v6.3.0/api/Region", {
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

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return regions;
    return regions.filter((r) => r.Name.toLowerCase().includes(needle));
  }, [q, regions]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Title + search */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Snøskred (Avalanche)</h1>
          <p className="text-sm text-slate-600">
            Snøskred er når mye snø sklir raskt ned fra fjellet. Her finner du
            regionene i Norge som har skredvarsling, og en enkel, barnevennlig
            visning av dagens faregrad.
          </p>
        </div>

        <div className="w-full max-w-xs">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Søk region…"
            aria-label="Søk region"
          />
        </div>
      </div>

      {/* Dagens faregrad – kid-friendly cards */}
      <section>
        <h2 className="text-lg font-extrabold mb-3">Dagens faregrad</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Use a date with confirmed data */}
          <FaregradCard regionId={3031} regionName="Lyngen" date="2024-03-22" />
          <FaregradCard regionId={3029} regionName="Voss" date="2024-03-22" />
          <FaregradCard regionId={3041} regionName="Buskerud sør" date="2024-03-22" />
          <FaregradCard regionId={3030} regionName="Hallingdal" date="2024-03-22" />
        </div>

        <p className="text-xs text-slate-500 mt-2">
          Kilde: NVE – Varsom Avalanche API. Datoen 2024-03-22 er valgt fordi den
          har ekte data for demo.
        </p>
      </section>

      {/* Region list */}
      {error && <p className="text-red-600">Feil: {error}</p>}
      {loading && <p>Laster…</p>}

      {!loading && !error && (
        <>
          <p className="text-sm text-slate-600">
            Fant {filtered.length} snøskredregioner
            {q ? ` (av ${regions.length})` : ""}.
          </p>
          <p className="text-sm text-slate-700">
            Velg en region for mer informasjon om skredfare og siste aktivitet.
          </p>

          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
            {filtered.map((r) => (
              <Link
                key={r.RegionId}
                to={`/snoskred/region/${encodeURIComponent(r.RegionId)}`}
                className="block group"
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-200 border-slate-200">
                  <div className="aspect-[4/3] w-full bg-slate-100 flex items-center justify-center text-3xl text-slate-500">
                    🏔️
                  </div>

                  <CardHeader className="py-3">
                    <CardTitle className="text-base leading-tight">
                      {r.Name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pt-0 pb-4">
                    <p className="text-xs text-slate-500">
                      Region ID: {r.RegionId}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}

      <Kilde>
        NVE – Varsom Avalanche API — endpoint:{" "}
        <code>https://api01.nve.no/hydrology/forecast/avalanche/v6.3.0/api/Region</code>.
        Se også{" "}
        <a href="https://www.varsom.no" target="_blank" rel="noopener noreferrer">
          varsom.no
        </a>.
      </Kilde>
    </div>
  );
}
