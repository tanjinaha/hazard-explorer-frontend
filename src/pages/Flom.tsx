// src/pages/Flom.tsx
// "Flom for barn" – enkel, gøy og lærerik side med fakta + mini-quiz + stjerner.
// Ingen ekstra biblioteker – kun React + Tailwind.

import React, { useMemo, useState } from "react";

type Svar = "A" | "B" | "C" | null;

export default function Flom() {
  // norsk: poeng/stjerner totalt på denne siden
  const [stjerner, setStjerner] = useState(0);

  // norsk: tilfeldig morsom fakta (endre/utvid listen når du vil)
  const fakta = useMemo(
    () => [
      "Flom kan komme av mye regn på kort tid.",
      "Elver kan vokse når snø smelter fort om våren.",
      "Trær og gress kan bremse vannet og hjelpe mot flom.",
      "Ikke gå gjennom dype vannpytter – de kan være farlige.",
    ],
    []
  );
  const [faktaIdx, setFaktaIdx] = useState(0);
  const nesteFakta = () => setFaktaIdx((i) => (i + 1) % fakta.length);

  // norsk: én enkel quizoppgave (du kan legge til flere senere)
  const [valg, setValg] = useState<Svar>(null);
  const [svarLåst, setSvarLåst] = useState(false);
  const riktig: Svar = "B"; // riktig svar-alternativ

  const bekreft = () => {
    if (valg === null) return;
    setSvarLåst(true);
    if (valg === riktig) setStjerner((s) => s + 1);
  };

  const nullstill = () => {
    setValg(null);
    setSvarLåst(false);
  };

  // norsk: enkel badge-komponent
  const Badge = ({ children }: { children: React.ReactNode }) => (
    <span className="inline-flex items-center rounded-full bg-sky-100 text-sky-800 px-2.5 py-0.5 text-xs font-semibold">
      {children}
    </span>
  );

  return (
    <div className="container mx-auto max-w-3xl p-6 space-y-6">
      {/* Tittel */}
      <h1 className="text-3xl font-bold">Flom i Norge</h1>

      {/* Intro-kort */}
      <div className="rounded-2xl border bg-white shadow-sm p-5 space-y-3">
        <Badge>For barn</Badge>
        <p className="text-slate-700">
          <strong>Flom</strong> skjer når det blir så mye vann at elver renner over og
          vannet sprer seg ut. Det kan skje etter kraftig regn, rask snøsmelting
          eller når avløp blir tette. Vi kan være trygge ved å holde oss unna
          bruer og elvekanter når vannet er høyt.
        </p>

        {/* Morsom fakta + knapp */}
        <div className="rounded-xl bg-sky-50 border p-4">
          <p className="text-slate-800">
            <strong>Morsom fakta:</strong> {fakta[faktaIdx]}
          </p>
          <button
            onClick={nesteFakta}
            className="mt-2 inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm hover:bg-sky-100"
          >
            Ny fakta 🔁
          </button>
        </div>

        {/* Sikkerhetsråd – kort liste */}
        <ul className="list-disc pl-5 text-slate-700 space-y-1">
          <li>Hold deg unna elver og bekker når vannet er høyt.</li>
          <li>Ikke gå eller kjør gjennom vann som dekker veien.</li>
          <li>Følg med på værvarsel og meldinger fra kommunen.</li>
        </ul>
      </div>

      {/* Mini-quiz */}
      <div className="rounded-2xl border bg-white shadow-sm p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Mini-quiz 💧</h2>
          <div className="text-sm">
            Dine stjerner: <span className="font-bold">{stjerner} ⭐</span>
          </div>
        </div>

        <p className="mt-2 text-slate-700">
          Hvorfor kan det bli flom om våren i Norge?
        </p>

        <div className="mt-3 grid gap-2">
          <label className={`flex items-center gap-2 rounded-lg border p-2 cursor-pointer ${valg==="A" ? "ring-2 ring-slate-400" : ""}`}>
            <input
              type="radio"
              name="q1"
              disabled={svarLåst}
              checked={valg === "A"}
              onChange={() => setValg("A")}
            />
            A) Fordi vinden blåser mye.
          </label>

          <label className={`flex items-center gap-2 rounded-lg border p-2 cursor-pointer ${valg==="B" ? "ring-2 ring-slate-400" : ""}`}>
            <input
              type="radio"
              name="q1"
              disabled={svarLåst}
              checked={valg === "B"}
              onChange={() => setValg("B")}
            />
            B) Fordi snø smelter fort og mye vann renner i elver. {/* riktig */}
          </label>

          <label className={`flex items-center gap-2 rounded-lg border p-2 cursor-pointer ${valg==="C" ? "ring-2 ring-slate-400" : ""}`}>
            <input
              type="radio"
              name="q1"
              disabled={svarLåst}
              checked={valg === "C"}
              onChange={() => setValg("C")}
            />
            C) Fordi bladene faller av trærne.
          </label>
        </div>

        {/* Knapper og tilbakemelding */}
        <div className="mt-3 flex items-center gap-3">
          {!svarLåst ? (
            <button
              onClick={bekreft}
              disabled={valg === null}
              className="rounded-lg bg-emerald-600 text-white px-3 py-1.5 text-sm disabled:opacity-50"
            >
              Svar
            </button>
          ) : (
            <>
              {valg === riktig ? (
                <span className="text-emerald-700 font-semibold">
                  Riktig! ⭐ Godt jobbet!
                </span>
              ) : (
                <span className="text-rose-700 font-semibold">
                  Ikke helt – prøv igjen!
                </span>
              )}
              <button
                onClick={nullstill}
                className="rounded-lg border px-3 py-1.5 text-sm hover:bg-slate-50"
              >
                Prøv på nytt
              </button>
            </>
          )}
        </div>
      </div>

      {/* Kilde */}
      <div className="text-xs text-slate-500">
        Kilde: Meteorologisk institutt, NVE og læreplan i naturfag/geografi.
      </div>
    </div>
  );
}
