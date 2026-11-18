import { PageWrapper } from '@/components';
import { resolveMusicArtFile } from '@/lib/music/resolveAsset';
import { allMusic } from 'content-collections';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// This page contains developer diagnostics and is intentionally available only
// when the app is running with Next.js's local development server.
export default async function MetadataReportPage() {
  if (process.env.NODE_ENV !== 'development') notFound();

  const missingArtwork = await Promise.all(
    allMusic.map(async (item) => ({ item, artwork: await resolveMusicArtFile(item.slug, 'cover') }))
  );

  const reports = [
    {
      heading: 'No description',
      items: allMusic.filter((item) => !item.description?.trim()),
    },
    {
      heading: 'No tags',
      items: allMusic.filter((item) => !item.tags?.length),
    },
    {
      heading: 'No artwork',
      items: missingArtwork.filter(({ artwork }) => !artwork).map(({ item }) => item),
    },
    {
      heading: 'No BPM',
      items: allMusic.filter((item) => item.bpm == null && item.bpm2 == null),
    },
    {
      heading: 'No date',
      items: allMusic.filter((item) => !Number.isFinite(item.date.getTime())),
    },
    {
      heading: 'No genres',
      items: allMusic.filter((item) => !item.genres?.length),
    },
    {
      heading: 'No tracklist',
      items: allMusic.filter((item) => !item.tracklist?.length),
    },
  ];

  return (
    <PageWrapper title="Music Metadata Report" className="max-w-4xl">
      <p className="mb-8">Music items with missing metadata. Counts are shown in each heading.</p>
      <div className="space-y-8">
        {reports.map(({ heading, items }) => (
          <section
            key={heading}
            aria-labelledby={`report-${heading.replaceAll(' ', '-').toLowerCase()}`}
          >
            <h2
              id={`report-${heading.replaceAll(' ', '-').toLowerCase()}`}
              className="text-lg font-semibold"
            >
              {heading} ({items.length})
            </h2>
            {items.length ? (
              <ul className="mt-2 list-disc pl-6">
                {items.map((item) => (
                  <li key={item.slug}>
                    <Link className="underline" href={`/music/${item.slug}`}>
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2">None</p>
            )}
          </section>
        ))}
      </div>
    </PageWrapper>
  );
}
