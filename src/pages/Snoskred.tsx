// src/pages/Snoskred.tsx
// Enkel, elevvennlig side for snøskred.
// Viser: tittel/intro, region-velger, "Siste varsel", graf, læringskort og kilde.

import React, { useMemo, useState } from "react";
import SisteVarsel from "@/components/SisteVarsel";
import SnoskredGraf from "@/components/SnoskredGraf";

// Norsk: noen vanlige skredregioner (du kan utvide senere)
const REGIONS = [
  { id: 3004, navn: "Lyngen" },
  { id: 3027, navn: "Indre Sogn" },
  { id: 3016, navn: "Salten" },
  { id: 3031, navn: "Tromsø" },
  { id: 3030, navn: "Hallingdal" },
];

export default function Snøskred() {
  // Valgt region-ID styrer både "Siste varsel" og grafen
  const [regionId, setRegionId] = useState<number>(3004);

  // Visningsnavn for valgt region
  const regionNavn = useMemo(
    () => REGIONS.find((r) => r.id === regionId)?.navn || `Region ${regionId}`,
    [regionId]
  );

  return (
    <div className="container mx-auto max-w-3xl p-6 space-y-6">
      {/* --- Tittel og introduksjonstekst --- */}
      <h1 className="text-3xl font-bold">Snøskred i Norge</h1>

      <p className="text-slate-700">
        Snøskred skjer når store mengder snø løsner og sklir raskt ned fjellsider.
        Slike skred kan utløses naturlig (på grunn av vær, vind og temperatur)
        eller av mennesker. Snøskred er en viktig naturfare i Norge, spesielt i fjellområder.
      </p>

      <p className="text-slate-700">
        Gjennom vinteren endrer forholdene seg raskt. Vind, nysnø og temperatur
        påvirker stabiliteten i snødekket, og dermed hvor stor risikoen for skred er.
      </p>

      {/* --- Sikkerhetsråd-boks --- */}
      <div className="rounded-lg border bg-amber-50 p-4 text-sm">
        <strong>Råd:</strong> Unngå <em>brattheng</em> (bratte fjellsider over 30°),
        og hold avstand til utløpsområder når faregraden er høy.
      </div>

      {/* --- Velger for region (nedtrekk) --- */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-slate-700">Velg region:</label>
        <select
          className="border rounded px-2 py-1"
          value={regionId}
          onChange={(e) => setRegionId(Number(e.target.value))}
        >
          {REGIONS.map((r) => (
            <option key={r.id} value={r.id}>
              {r.navn}
            </option>
          ))}
        </select>
      </div>

      {/* --- Siste varsel (ser langt nok tilbake for å alltid finne sesongdata) --- */}
      <SisteVarsel regionId={regionId} monthsBack={24} />

      {/* --- Grafen som viser faregrad over tid --- */}
      {/* Merk: Vi bruker 24 måneder for å få historikk også utenfor sesong. */}
      <SnoskredGraf regionId={regionId} monthsBack={24} />

      {/* --- Liten forklaring under grafen (med regionnavn) --- */}
      <p className="text-sm text-slate-600">
        Grafen viser utviklingen i skredfare (faregrad) for regionen <strong>{regionNavn}</strong>.
        Snøskreddata er sesongbasert (mest i vinterhalvåret), derfor vises en lengre periode.
      </p>

      {/* --- Læringskort: Enkle råd + Nyttige begreper --- */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Enkle råd i dag */}
        <div className="rounded-lg border p-4 bg-white">
          <h3 className="text-lg font-semibold mb-2">Enkle råd i dag</h3>
          <ul className="list-disc pl-5 space-y-1 text-slate-700">
            <li>Sjekk alltid dagens varsel på varsom.no før tur.</li>
            <li>Unngå brattheng (bratte fjellsider over 30°).</li>
            <li>Hold avstand til utløpsområder (der snøen kan stoppe).</li>
            <li>Gå én og én i bratte partier – ikke samlet.</li>
            <li>Vær fleksibel – snu hvis forholdene er utrygge.</li>
          </ul>
        </div>

        {/* Nyttige begreper */}
        <div className="rounded-lg border p-4 bg-white">
          <h3 className="text-lg font-semibold mb-2">Nyttige begreper</h3>
          <ul className="list-disc pl-5 space-y-1 text-slate-700">
            <li><strong>Brattheng:</strong> Bratt fjell- eller bakkeside (&gt; 30°).</li>
            <li><strong>Faregrad:</strong> Skala 1–5 (Lav → Meget stor).</li>
            <li><strong>Utløsningsområde:</strong> Området der skredet starter.</li>
            <li><strong>Utløpsområde:</strong> Området der snømassene ender.</li>
            <li><strong>Skredproblem:</strong> Hovedårsaken (f.eks. fokksnø, våte løssnøskred).</li>
          </ul>
        </div>
      </section>

      {/* --- Kilde (datakilde) --- */}
      <div className="text-xs text-slate-500 mt-2">
        Kilde: NVE Varsom (offentlige data).
      </div>
    </div>
  );
}
