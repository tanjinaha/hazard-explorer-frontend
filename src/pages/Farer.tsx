// src/pages/Farer.tsx
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import mainImg from "@/images/mainpages-unsplash.jpg";

// your local images
import snoskredImg from "@/images/unsplash_snoskred.jpg";
import flomImg from "@/images/flom_unsplash.jpg";
import jordskredImg from "@/images/jordskred_unsplash.jpg";
import kvikleireskredImg from "@/images/kvikleireskred_nve.jpg";

type Item = {
  to: string;
  title: string;
  desc: string;
  emoji: string;
  image?: string;    // use a photo if provided
  gradient?: string; // otherwise fallback to gradient
  text: string;
  ring: string;
};

const items: Item[] = [
  {
    to: "/snoskred",
    title: "Snøskred",
    desc: "Store snømengder kan rase ned fjellsider.",
    emoji: "🏔️",
    image: snoskredImg, // ← uses your photo
    text: "text-white",
    ring: "focus-visible:ring-sky-300",
  },
  {
    to: "/flom",
    title: "Flom",
    desc: "Elver og innsjøer kan gå over sine bredder.",
    emoji: "🌊",
    image: flomImg, // ← uses your photo
    text: "text-white",
    ring: "focus-visible:ring-cyan-300",
  },
  {
    to: "/jordskred",
    title: "Jordskred",
    desc: "Jord og stein kan løsne i bratte bakker.",
    emoji: "🌍",
    image: jordskredImg, // ← uses your photo
    text: "text-white",
    ring: "focus-visible:ring-amber-300",
  },
  {
    to: "/kvikleireskred",
    title: "Kvikleireskred",
    desc: "Marin leire kan kollapse og flyte som væske.",
    emoji: "⚠️",
    image: kvikleireskredImg, // ← uses your photo
    text: "text-white",
    ring: "focus-visible:ring-rose-300",
  },
];

export default function Farer() {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex justify-end"
      style={{ backgroundImage: `url(${mainImg})` }}
    >
      {/* Right panel */}
      <div className="w-full md:w-1/3 rounded-l-2xl backdrop-blur-sm shadow-2xl p-8 md:p-10 bg-gradient-to-br from-sky-50 via-white to-emerald-50">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900">
          Naturfarer i Norge 🌍
        </h1>

        <p className="mt-4 text-xl md:text-2xl text-gray-800 leading-relaxed">
          En <strong>fare</strong> betyr noe farlig som kan skje i naturen.
          For eksempel mye snø som sklir ned fra fjellet, eller vann som
          oversvømmer elver. Vi må passe på slike farer for å være trygge.
        </p>

        <p className="mt-6 text-xl md:text-2xl text-gray-900 font-semibold">
          Klikk på et kort for å lære mer:
        </p>

        {/* Cards */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((it) => (
            <Link key={it.to} to={it.to} aria-label={it.title}>
              <Card
                className={[
                  "group w-full border-0 rounded-2xl overflow-hidden",
                  "shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02]",
                  "transition-transform duration-200 ease-out",
                  "focus-visible:outline-none focus-visible:ring-4",
                  it.ring,
                ].join(" ")}
              >
                <CardContent
                  className={[
                    "relative", // for overlay
                    "p-5 md:p-6",
                    "min-h-64 md:min-h-72",
                    "flex flex-col justify-between",
                    it.text,
                    !it.image && "bg-gradient-to-br",
                    !it.image && it.gradient,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  style={
                    it.image
                      ? {
                          backgroundImage: `url(${it.image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }
                      : {}
                  }
                >
                  {/* dark overlay to keep text readable on photos */}
                  {it.image && (
                    <div
                      className="pointer-events-none absolute inset-0 bg-black/20"
                      aria-hidden
                    />
                  )}

                  {/* content */}
                  <div className="relative z-10">
                    <div className="flex items-start justify-between">
                      <h3 className="text-2xl md:text-3xl font-extrabold drop-shadow-sm">
                        {it.title}
                      </h3>
                      <span
                        className="text-3xl md:text-4xl select-none transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-3"
                        aria-hidden="true"
                      >
                        {it.emoji}
                      </span>
                    </div>

                    <p className="mt-3 text-lg md:text-xl/7">{it.desc}</p>

                    <div
                      className={[
                        "mt-4 inline-flex items-center gap-2",
                        "font-semibold underline decoration-2 underline-offset-4",
                        it.text.includes("white") ? "text-white" : "text-zinc-900",
                        "group-hover:translate-x-0.5 transition-transform",
                      ].join(" ")}
                    >
                      Les mer →
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
