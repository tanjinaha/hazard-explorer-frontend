// src/pages/Snoskred.tsx
// "Snøskred for barn" – enkel, gøy og lærerik side med fakta + mini-quiz + stjerner.

import React, { useMemo, useState } from "react";

type Svar = "A" | "B" | "C" | null;

export default function Snoskred() {
  const [stjerner, setStjerner] = useState(0);

  const fakta = useMemo(
    () => [
      "Snøskred skjer når mye snø plutselig raser ned en bakke.",
      "Vind kan flytte snø og lage farlige fokksnøflak.",
      "Sol og mildvær kan gjøre snøen våt og tung – da øker faren.",
      "Hold avstand til bratte fjellsider når varselet sier fare.",
    ],
    []
  );
  const [faktaIdx, setFaktaIdx] = useState(0);
  const nesteFakta = () => setFaktaIdx((i) => (i + 1) % fakta.length);

  const [valg, setValg] = useState<Svar>(null);
  const [svarLåst, setSvarLåst] = useState(false);
  const riktig: Svar = "C";

  const bekreft = () => {
    if (valg === null) return;
    setSvarLåst(true);
    if (valg === riktig) setStjerner((s) => s + 1);
  };

  const nullstill = () => {
    setValg(null);
    setSvarLåst(false);
  };

  const Badge = ({ children }: { children: React.ReactNode }) => (
    <span className="inline-flex items-center rounded-full bg-sky-100 text-sky-800 px-2.5 py-0.5 text-xs font-semibold">
      {children}
    </span>
  );

  return (
    <div className="container mx-auto max-w-3xl p-6 space-y-6">
      <h1 className="text-3xl font-bold">Snøskred i Norge</h1>

      <div className="rounded-2xl border bg-white shadow-sm p-5 space-y-3">
        <Badge>For barn</Badge>
        <p className="text-slate-700">
          <strong>Snøskred</strong> kan skje i bratte fjellsider når snøen blir ustabil.
          Faren øker ved mye nysnø, sterk vind, eller når været blir varmt. Vi kan være
          trygge ved å følge varsel, holde avstand til bratte sider og ikke gå i skredbaner.
        </p>

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

        <ul className="list-disc pl-5 text-slate-700 space-y-1">
          <li>Følg med på snøskredvarsel før du går på tur.</li>
          <li>Unngå bratte heng når faren er høy.</li>
          <li>Hold god avstand til utløpsområder.</li>
        </ul>
      </div>

      <div className="rounded-2xl border bg-white shadow-sm p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Mini-quiz 🏔️</h2>
          <div className="text-sm">
            Dine stjerner: <span className="font-bold">{stjerner} ⭐</span>
          </div>
        </div>

        <p className="mt-2 text-slate-700">
          Hva kan gjøre snøen mer ustabil og øke skredfaren?
        </p>

        <div className="mt-3 grid gap-2">
          <label className={`flex items-center gap-2 rounded-lg border p-2 cursor-pointer ${valg==="A" ? "ring-2 ring-slate-400" : ""}`}>
            <input type="radio" name="q1" disabled={svarLåst} checked={valg==="A"} onChange={() => setValg("A")} />
            A) Kuldegrader hele tiden.
          </label>

          <label className={`flex items-center gap-2 rounded-lg border p-2 cursor-pointer ${valg==="B" ? "ring-2 ring-slate-400" : ""}`}>
            <input type="radio" name="q1" disabled={svarLåst} checked={valg==="B"} onChange={() => setValg("B")} />
            B) Ingen vind og gammel, hard snø.
          </label>

          <label className={`flex items-center gap-2 rounded-lg border p-2 cursor-pointer ${valg==="C" ? "ring-2 ring-slate-400" : ""}`}>
            <input type="radio" name="q1" disabled={svarLåst} checked={valg==="C"} onChange={() => setValg("C")} />
            C) Sterk vind som flytter snø, mye nysnø eller brå varme. {/* riktig */}
          </label>
        </div>

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
                <span className="text-emerald-700 font-semibold">Riktig! ⭐ Godt jobbet!</span>
              ) : (
                <span className="text-rose-700 font-semibold">Ikke helt – prøv igjen!</span>
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

      <div className="text-xs text-slate-500">
        Kilde: Varsom og læreplan i naturfag/geografi.
      </div>
    </div>
  );
}
