// src/pages/Farer.tsx
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import mainImg from "@/images/mainpages-unsplash.jpg";

export default function Farer() {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex justify-end"
      style={{ backgroundImage: `url(${mainImg})` }}
    >
      {/* Right panel */}
      <div className="w-full md:w-1/3 bg-white/85 backdrop-blur-sm shadow-2xl p-8 md:p-10">
        {/* Title + definition */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900">
          Naturfarer i Norge 🌍
        </h1>

        <p className="mt-4 text-xl md:text-2xl text-gray-800 leading-relaxed">
          En <strong>fare</strong> betyr noe farlig som kan skje i naturen.
          For eksempel mye snø som sklir ned fra fjellet, eller vann som
          oversvømmer elver. Vi må passe på slike farer for å være trygge.
        </p>

        <p className="mt-6 text-xl md:text-2xl text-gray-900 font-semibold">
          Her kan du lære om:
        </p>

        {/* Four fun cards */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Snøskred */}
          <Link to="/snoskred" aria-label="Snøskred (Avalanche)">
            <Card className="group h-full border-0 rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition">
              <CardHeader className="bg-gradient-to-br from-sky-200 to-sky-300">
                <CardTitle className="text-2xl md:text-3xl">
                  🏔️ Snøskred
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 text-lg text-gray-800">
                Store snømengder kan rase ned fjellsider. (Avalanche)
                <div className="mt-2 text-blue-700 font-semibold group-hover:underline">
                  Les mer →
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Flom */}
          <Link to="/flom" aria-label="Flom (Flood)">
            <Card className="group h-full border-0 rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition">
              <CardHeader className="bg-gradient-to-br from-indigo-200 to-indigo-300">
                <CardTitle className="text-2xl md:text-3xl">
                  🌊 Flom
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 text-lg text-gray-800">
                Elver og innsjøer kan gå over sine bredder. (Flood)
                <div className="mt-2 text-blue-700 font-semibold group-hover:underline">
                  Les mer →
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Jordskred */}
          <Link to="/jordskred" aria-label="Jordskred (Landslide)">
            <Card className="group h-full border-0 rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition">
              <CardHeader className="bg-gradient-to-br from-amber-200 to-amber-300">
                <CardTitle className="text-2xl md:text-3xl">
                  🌍 Jordskred
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 text-lg text-gray-800">
                Jord og stein kan løsne i bratte bakker. (Landslide)
                <div className="mt-2 text-blue-700 font-semibold group-hover:underline">
                  Les mer →
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Kvikleire */}
          <Link to="/kvikleire" aria-label="Kvikleire (Quick clay)">
            <Card className="group h-full border-0 rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition">
              <CardHeader className="bg-gradient-to-br from-rose-200 to-rose-300">
                <CardTitle className="text-2xl md:text-3xl">
                  ⚠️ Kvikleire
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 text-lg text-gray-800">
                Marin leire kan kollapse og flyte som væske. (Quick clay)
                <div className="mt-2 text-blue-700 font-semibold group-hover:underline">
                  Les mer →
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
