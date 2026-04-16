import { PageWrapper } from '@/components';
import { ROUTES } from '@/lib/routes';
import { PlayInPlayerButton } from '@/modules/player';
import { allMusic } from 'content-collections';
import Image from 'next/image';
import Link from 'next/link';

// ----------------------------------------------------------------------

export default function MusicIndexPage() {
  const items = [...allMusic].sort((a, b) => {
    const at = a.date.getTime();
    const bt = b.date.getTime();
    return bt - at || a.title.localeCompare(b.title);
  });

  return (
    <PageWrapper title="Music Library">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const href = ROUTES.music(item.slug).root;
          const coverSrc = ROUTES.music(item.slug).art('cover');

          return (
            <article key={item.slug} className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="shrink-0">
                  <PlayInPlayerButton slug={item.slug} />
                </div>
                <h2 className="min-w-0 flex-1 truncate">
                  <Link href={href} className="hover:underline">
                    {item.title}
                  </Link>
                </h2>
              </div>

              <Link href={href} className="block">
                <Image
                  width={400}
                  height={400}
                  src={coverSrc}
                  alt={`Artwork for ${item.title}`}
                  unoptimized
                  className="w-full h-auto"
                />
              </Link>
            </article>
          );
        })}
      </div>
    </PageWrapper>
  );
}
