import { allMixes } from "content-collections";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { PlayInPlayerButton } from "@/modules/player";

export default function MixesIndexPage() {
  const mixes = [...allMixes].sort((a, b) => {
    const at = a.date?.getTime?.() ?? 0;
    const bt = b.date?.getTime?.() ?? 0;
    return bt - at || a.title.localeCompare(b.title);
  });

  return (
    <div className="py-6 mx-auto">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mixes.map((mix) => {
          const href = ROUTES.mixes(mix.slug).root;
          const coverSrc = ROUTES.mixes(mix.slug).art("cover");

          return (
            <article key={mix.slug} className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="shrink-0">
                  <PlayInPlayerButton kind="mixes" slug={mix.slug} />
                </div>
                <h2 className="min-w-0 flex-1 truncate">
                  <Link href={href} className="hover:underline">
                    {mix.title}
                  </Link>
                </h2>
              </div>

              <Link href={href} className="block">
                <Image
                  width={400}
                  height={400}
                  src={coverSrc}
                  alt={`Artwork for ${mix.title}`}
                  unoptimized
                  className="w-full h-auto"
                />
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
