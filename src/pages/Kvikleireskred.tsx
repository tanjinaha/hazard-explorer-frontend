// src/pages/Kvikleire.tsx
import Kilde from "@/components/Kilde";

export default function Kvikleireskred() {
  return (
    <div style={{ padding: 16 }}>
      <h1>Kvikleireskred (Quick clay landslide)</h1>

      <p>
        Kvikkeleire finnes i områder med marin leire. Når massen rystes eller
        belastes kan strukturen kollapse og flyte som væske. Dette kan gi svært
        store skred med lang utløpslengde.
      </p>

      <p>
        For kart over aktsomhetsområder (faresoner) for kvikkleireskred, bruk
        NVE sitt temakart. Der ser du soner der man må vise særlig aktsomhet ved
        planlegging og terrenginngrep.
      </p>

      {/* Optional: a simple link styled as a button */}
      <p style={{ marginTop: 12 }}>
        <a
          href="https://temakart.nve.no/link/?link=kvikkleire"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid #cbd5e1",
            background: "#f8fafc",
            textDecoration: "none",
          }}
        >
          Åpne NVE temakart for kvikkleire
        </a>
      </p>

      <Kilde>
        NVE temakart for kvikkleire (aktsomhetskart) og metadata via Geonorge.
        Se{" "}
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
