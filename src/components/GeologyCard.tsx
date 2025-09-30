// src/components/GeologyCard.tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { GEOLOGY_BY_REGION } from "@/data/geology"

const TAG_STYLES: Record<string, string> = {
  Bratt: "bg-orange-100 text-orange-700",
  Skog: "bg-emerald-100 text-emerald-700",
  Dal: "bg-sky-100 text-sky-700",
  Kyst: "bg-teal-100 text-teal-700",
  "Høyt fjell": "bg-purple-100 text-purple-700",
}

export default function GeologyCard({ regionId }: { regionId: number }) {
  const g = GEOLOGY_BY_REGION[regionId]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Hvorfor her? (terreng & snø)</CardTitle>
        <CardDescription>Kort forklart for barn og foreldre.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 text-slate-700">
        {!g ? (
          <p className="text-sm text-muted-foreground">
            Ingen geologi-notater for valgt region ennå. (Legg til i <code>GEOLOGY_BY_REGION</code>.)
          </p>
        ) : (
          <>
            <p>{g.summary}</p>

            <div className="flex flex-wrap gap-2">
              {g.terrain.map((t) => (
                <Badge key={t} className={TAG_STYLES[t] || "bg-slate-100 text-slate-700"}>
                  {t}
                </Badge>
              ))}
            </div>

            <Separator />

            <section>
              <div className="font-medium mb-1">Hvorfor øker skredfaren?</div>
              <ul className="list-disc pl-5 space-y-1">
                {g.reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </section>

            <section>
              <div className="font-medium mb-1">Hva gjør jeg i dag?</div>
              <ul className="list-disc pl-5 space-y-1">
                {g.tips.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </section>

            <p className="text-xs text-muted-foreground">Kilde: NVE / Varsom (uoffisiell forenkling).</p>
          </>
        )}
      </CardContent>
    </Card>
  )
}
