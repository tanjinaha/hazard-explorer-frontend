// src/pages/Kvikleire.tsx
// "Kvikkleire for barn" – enkel, gøy og lærerik side med fakta + mini-quiz + stjerner.
// Kun React + Tailwind. Bruker Kilde-komponenten nederst for lenker/kilder.

import React, { useMemo, useState } from "react";
import Kilde from "@/components/Kilde";

type Svar = "A" | "B" | "C" | null;

export default function Kvikleireskred() {
  // Stjerner/poeng for mini-quiz
  const [stjerner, setStjerner] = useState(0);

  // Morsomme/nyttige fakta (kan utvides senere)
  const fakta = useMemo(
    () => [
      "Kvikkleire finnes ofte der det en gang var hav (marin leire).",
      "Når kvikkleire ristes eller belastes, kan den bli flytende som suppe.",
      "Kvikkleireskred kan bli store og gå langt – hold god avstand i bratte leirebakker.",
      "Trær og vegetasjon kan hjelpe jorda å holde seg på plass.",
    ],
    []
  );
  const [faktaIdx, setFaktaIdx] = useState(0);
  const nesteFakta = () => setFaktaIdx((i) => (i + 1) % fakta.length);

  // Én enkel quizoppgave
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

  // Liten badge-komponent
  const Badge = ({ children }: { children: React.ReactNode }) => (
    <span className="inline-flex items-center rounded-full bg-sky-100 text-sky-800 px-2.5 py-0.5 text-xs font-semibold">
      {children}
    </span>
  );

  return (
    <div className="container mx-auto max-w-3xl p-6 space-y-6">
      {/* Tittel */}
      <h1 className="text-3xl font-bold">Kvikkleireskred</h1>

      {/* Intro-kort */}
      <div className="rounded-2xl border bg-white shadow-sm p-5 space-y-3">
        <Badge>For barn</Badge>
        <p className="text-slate-700">
          <strong>Kvikkleire</strong> er en spesiell type leire som finnes i områder
          som lå under havet tidligere. Når massen rystes eller belastes kan
          strukturen kollapse og flyte som væske. Da kan det oppstå store skred som
          kan gå langt.
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
          <li>Hold deg unna bratte leireskråninger, spesielt etter mye regn.</li>
          <li>Ikke lek ved ferske sprekker i bakken eller der jorda har sklidd.</li>
          <li>Si fra til voksne/kommunen hvis du ser tegn på at bakken beveger seg.</li>
        </ul>

        {/* Lenke-knapp til temakart */}
        <a
          href="https://temakart.nve.no/link/?link=kvikkleire"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-lg border px-3 py-1.5 text-sm hover:bg-slate-50"
        >
          Åpne NVE temakart for kvikkleire
        </a>
      </div>

      {/* Mini-quiz */}
      <div className="rounded-2xl border bg-white shadow-sm p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Mini-quiz 🧱</h2>
          <div className="text-sm">
            Dine stjerner: <span className="font-bold">{stjerner} ⭐</span>
          </div>
        </div>

        <p className="mt-2 text-slate-700">
          Hva kan gjøre at kvikkleire blir farlig og kan skli ut?
        </p>

        <div className="mt-3 grid gap-2">
          <label
            className={`flex items-center gap-2 rounded-lg border p-2 cursor-pointer ${
              valg === "A" ? "ring-2 ring-slate-400" : ""
            }`}
          >
            <input
              type="radio"
              name="q1"
              disabled={svarLåst}
              checked={valg === "A"}
              onChange={() => setValg("A")}
            />
            A) Når det er veldig tørt i mange uker.
          </label>

          <label
            className={`flex items-center gap-2 rounded-lg border p-2 cursor-pointer ${
              valg === "B" ? "ring-2 ring-slate-400" : ""
            }`}
          >
            <input
              type="radio"
              name="q1"
              disabled={svarLåst}
              checked={valg === "B"}
              onChange={() => setValg("B")}
            />
            B) Når barn hopper tau på leirjord.
          </label>

          <label
            className={`flex items-center gap-2 rounded-lg border p-2 cursor-pointer ${
              valg === "C" ? "ring-2 ring-slate-400" : ""
            }`}
          >
            <input
              type="radio"
              name="q1"
              disabled={svarLåst}
              checked={valg === "C"}
              onChange={() => setValg("C")}
            />
            C) Når leira blir ristet/belastet og strukturen kollapser. {/* riktig */}
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
      <Kilde>
        NVE temakart for kvikkleire og metadata via Geonorge. Se{" "}
        <a
          href="https://temakart.nve.no/link/?link=kvikkleire"
          target="_blank"
          rel="noopener noreferrer"
        >
          temakart.nve.no (Kvikkleire)
        </a>{" "}
        og{" "}
        <a
          href="https://kartkatalog.geonorge.no/metadata/kvikkleire/a29b905c-6aaa-4283-ae2c-d167624c08a8"
          target="_blank"
          rel="noopener noreferrer"
        >
          Geonorge: Kvikkleire (metadata)
        </a>
        .
      </Kilde>
    </div>
  );
}
