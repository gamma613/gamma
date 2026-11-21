import { BackButton, DD, DL, DLRow, DT, PageWrapper, TitleArtist } from '@/components';
import { GenreList } from '@/components/music/GenreList';
import { formatDateYmd } from '@/lib/formatDate';
import { getMusicItem } from '@/lib/music/getMusicItem';
import { ROUTES } from '@/lib/routes';
import { PlayInPlayerButton } from '@/modules/player';
import { formatTrackTime } from '@/modules/player/utils';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { NOT_FOUND_TITLE } from '../../not-found';

// ----------------------------------------------------------------------

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getMusicItem(slug);

  return {
    description: item?.description ?? '',
    title: item?.title ?? NOT_FOUND_TITLE,
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
      <div className="flex items-center gap-6">
        <h1 className="order-2 flex-1 min-w-0 text-lg sm:text-sm lg:text-2xl">
          <TitleArtist title={item.title} artist={item.artist} />
        </h1>
        <div className="order-1 shrink-0">
          <PlayInPlayerButton slug={slug} />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start mt-10">
        <Image
          width={400}
          height={400}
          src={ROUTES.music(slug).art('cover')}
          alt={`Artwork for ${item.title}`}
          unoptimized
          className="w-full sm:max-w-1/2 max-w-[400px] h-auto"
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
