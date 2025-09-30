import { createContext, useContext, useState, type ReactNode } from "react"

type HazardContextType = {
  count: number
  setCount: (n: number) => void
}

const HazardContext = createContext<HazardContextType | undefined>(undefined)

export function HazardProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0)
  return (
    <HazardContext.Provider value={{ count, setCount }}>
      {children}
    </HazardContext.Provider>
  )
}

export function useHazard() {
  const ctx = useContext(HazardContext)
  if (!ctx) throw new Error("useHazard must be used inside <HazardProvider>")
  return ctx
}
