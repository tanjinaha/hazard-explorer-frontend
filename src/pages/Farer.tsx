// Farer.tsx
import { Card, CardContent } from "@/components/ui/card";
import mainImg from "@/images/mainpages-unsplash.jpg";
import { Link } from "react-router-dom";

export default function Farer() {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex justify-end"
      style={{ backgroundImage: `url(${mainImg})` }}
    >
      {/* Right-side card, smaller width */}
      <Card className="bg-white/85 shadow-xl rounded-none w-1/3 flex items-center">
        <CardContent className="p-10">
          <h1 className="text-6xl font-bold mb-8 text-blue-900">
            Naturfarer i Norge 🌍
          </h1>

          <p className="text-3xl mb-8 text-gray-800 leading-relaxed">
            En <strong>fare</strong> betyr noe farlig som kan skje i naturen.
            For eksempel mye snø som sklir ned fra fjellet, eller vann som
            oversvømmer elver. Vi må passe på slike farer for å være trygge.
          </p>

          <p className="text-2xl mb-6">Her kan du lære om:</p>

          <ul className="list-disc list-inside space-y-5 text-3xl">
            <li>
              <Link to="/snoskred" className="text-blue-700 hover:underline">
                Snøskred (Avalanche) 🏔️
              </Link>
            </li>
            <li>
              <Link to="/flom" className="text-blue-700 hover:underline">
                Flom (Flood) 🌊
              </Link>
            </li>
            <li>
              <Link to="/jordskred" className="text-blue-700 hover:underline">
                Jordskred (Landslide) 🌍
              </Link>
            </li>
            <li>
              <Link to="/kvikleire" className="text-blue-700 hover:underline">
                Kvikleire (Quick clay) ⚠️
              </Link>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
