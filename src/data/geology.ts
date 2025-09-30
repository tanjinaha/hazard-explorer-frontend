// src/data/geology.ts
export type RegionGeology = {
  summary: string;
  terrain: ("Bratt" | "Skog" | "Dal" | "Kyst" | "Høyt fjell")[];
  reasons: string[];
  tips: string[];
};

export const GEOLOGY_BY_REGION: Record<number, RegionGeology> = {
  3018: {
    summary: "Lyngen har bratte, høye fjell og mye vind fra havet.",
    terrain: ["Høyt fjell", "Bratt"],
    reasons: [
      "Vind flytter snø og lager harde flak som kan sprekke.",
      "Store snømengder og raske værskifter fra kysten.",
    ],
    tips: [
      "Ved FG 3+: unngå brattere enn ca. 30°.",
      "Velg skog/nedre del når det blåser og snør.",
    ],
  },
  3001: {
    summary: "Tromsø har både fjell og skog. Vinden og mildvær kan variere raskt.",
    terrain: ["Bratt", "Skog"],
    reasons: [
      "Mildvær/regn gjør snøen våt og glatt.",
      "Noen bratte heng over skoggrensa.",
    ],
    tips: [
      "Søk slakere terreng når FG er høy.",
      "Gå én av gangen i brattere partier.",
    ],
  },
  3020: {
    summary: "Nord-Troms har fjell nær havet – vind og nysnø kan bygge flak.",
    terrain: ["Bratt", "Kyst"],
    reasons: ["Vindtransport av snø.", "Rask oppvarming kan svekke snølag."],
    tips: ["Unngå topp-/ryggformasjoner i sterk vind.", "Les varselet på Varsom."],
  },
  3021: {
    summary: "Tromsøfastlandet har blanding av skog og fjell. Ofte tryggere i skog.",
    terrain: ["Skog", "Bratt"],
    reasons: ["Vind i høyden, mildvær nær kysten.", "Svake lag kan finnes etter kuldeperioder."],
    tips: ["Velg skog ved FG 2–3.", "Hold avstand i grupper."],
  },
};
