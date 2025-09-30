// src/pages/Info.tsx
import Kilde from "@/components/Kilde";

export default function Info() {
  return (
    <div style={{ padding: 16 }}>
      <h1>Info (Information)</h1>
      <p>
        Denne appen viser naturfarer i Norge: skred (avalanche) og flom (flood).
        Data hentes fra NVE sine åpne API-er.
      </p>

      <Kilde>
        Tekst og data: NVE (Norges vassdrags- og energidirektorat) – Varsom.{" "}
        <a href="https://www.varsom.no" target="_blank" rel="noopener noreferrer">
          varsom.no
        </a>
      </Kilde>
    </div>
  );
}
