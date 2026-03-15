import { cache } from "react"
import { allMixes } from "content-collections"
import { ROUTES } from "@/lib/routes"

export const getMix = cache((slug: string) => {
  const mix = allMixes.find((item) => item.slug === slug)
  if (!mix) return undefined

  return {
    ...mix,
    artwork: {
      cover: ROUTES.mixes(mix.slug).art('cover'),
    },
  }
})
