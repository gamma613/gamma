import { cache } from "react"
import { allMixes } from "content-collections"

export const getMix = cache((slug: string) => {
  return allMixes.find((item) => item.slug === slug)
})