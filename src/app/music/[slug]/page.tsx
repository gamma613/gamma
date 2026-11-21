import { BackButton, DD, DL, DLRow, DT, PageWrapper, TitleArtist } from '@/components';
import { ArtworkWithBlurFill } from '@/components/music/ArtworkWithBlurFill';
import { GenreList } from '@/components/music/GenreList';
import { MusicPageActions } from '@/components/music/MusicPageActions';
import { formatDateYmd } from '@/lib/formatDate';
import { getMusicItem } from '@/lib/music/getMusicItem';
import { ROUTES } from '@/lib/routes';
import { formatTrackTime } from '@/modules/player/utils';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NOT_FOUND_TITLE } from '../../not-found';

// ----------------------------------------------------------------------

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getMusicItem(slug);
  const description = item?.description?.trim() || item?.content?.trim() || '';

  return {
    alternates: item ? { canonical: ROUTES.music(slug).root } : undefined,
    description,
    openGraph: item
      ? {
          description,
          images: [{ alt: `Artwork for ${item.title}`, url: ROUTES.music(slug).art('cover') }],
          title: `${item.artist ? `${item.artist} — ` : ''}${item.title}`,
          type: 'music.song',
          url: ROUTES.music(slug).root,
        }
      : undefined,
    title: item?.title ?? NOT_FOUND_TITLE,
    twitter: item
      ? {
          card: 'summary_large_image',
          description,
          images: [ROUTES.music(slug).art('cover')],
          title: `${item.artist ? `${item.artist} — ` : ''}${item.title}`,
        }
      : undefined,
  };
}

export default async function MusicItemPage({ params }: Props) {
  const { slug } = await params;
  const item = getMusicItem(slug);
  if (!item) notFound();

  const released = formatDateYmd(item.date);

  return (
    <PageWrapper>
      <BackButton />
      <h1 className="xs:text-lg sm:text-xl md:text-2xl lg:text-3xl">
        <TitleArtist title={item.title} artist={item.artist} />
      </h1>

      <div className="flex flex-col sm:flex-row gap-4 items-start mt-10">
        <ArtworkWithBlurFill
          src={ROUTES.music(slug).art('cover')}
          alt={`Artwork for ${item.title}`}
        />
        <div className="w-full min-w-0 sm:flex-1">
          <MusicPageActions
            slug={slug}
            artist={item.artist ?? ''}
            title={item.title}
            className="my-5"
          />
          <DL variant="table">
            <DLRow>
              <DT>BPM</DT>
              <DD>
                {item.bpm}
                {item.bpm2 && ` — ${item.bpm2}`}
              </DD>
            </DLRow>

            <DLRow>
              <DT>Released</DT>
              <DD>{released}</DD>
            </DLRow>

            <DLRow>
              <DT>Type</DT>
              <DD>
                {item.type}
                {item.type === 'mix' && item.mixType ? ` (${item.mixType})` : null}
              </DD>
            </DLRow>

            {item.durationSeconds != null ? (
              <DLRow>
                <DT>Duration</DT>
                <DD>{formatTrackTime(item.durationSeconds)}</DD>
              </DLRow>
            ) : null}

            {item.genres?.length ? (
              <DLRow>
                <DT>Genres</DT>
                <DD>
                  <GenreList genres={item.genres} layout="expanded" />
                </DD>
              </DLRow>
            ) : null}

            {item.tags?.length ? (
              <DLRow>
                <DT>Tags</DT>
                <DD>{item.tags.join(', ')}</DD>
              </DLRow>
            ) : null}
          </DL>
        </div>
      </div>

      {item.content && (
        <section className="mt-10" aria-labelledby="description-heading">
          <h2 id="description-heading" className="text-lg font-semibold">
            Description
          </h2>
          {item.content}
        </section>
      )}

      {item.tracklist?.length ? (
        <section className="mt-10" aria-labelledby="tracklist-heading">
          <h2 id="tracklist-heading" className="text-lg font-semibold">
            Tracklist
          </h2>
          <ol className="mt-3 list-decimal pl-6 space-y-1">
            {item.tracklist.map((track, index) => (
              <li key={`${index}-${track}`}>{track}</li>
            ))}
          </ol>
        </section>
      ) : null}
    </PageWrapper>
  );
}
