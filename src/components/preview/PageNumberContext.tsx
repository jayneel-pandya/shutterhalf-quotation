import { createContext, useContext, useRef, type ReactNode } from 'react'

interface PageContextValue {
  next: () => number
}

const PageContext = createContext<PageContextValue>({ next: () => 0 })

export function PageProvider({ children }: { children: ReactNode }) {
  const counter = useRef(0)
  const value: PageContextValue = {
    next: () => ++counter.current,
  }
  return <PageContext.Provider value={value}>{children}</PageContext.Provider>
}

export function usePageNumber(): number {
  const ctx = useContext(PageContext)
  const num = useRef<number | null>(null)
  if (num.current === null) {
    num.current = ctx.next()
  }
  return num.current
}
