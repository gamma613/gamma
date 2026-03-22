import { getMusicItem } from "@/lib/music/getMusicItem";
import { ROUTES } from "@/lib/routes";
import { formatDateYmd } from "@/lib/formatDate";
import { PageControls } from "@/components/PageControls";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { NOT_FOUND_TITLE } from "../not-found";
import { PlayInPlayerButton } from "@/modules/player";

// ----------------------------------------------------------------------

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getMusicItem(slug);

  return {
    description: item?.description ?? "",
    title: item?.title ?? NOT_FOUND_TITLE,
  };
}

export default async function MusicItemPage({ params }: Props) {
  const { slug } = await params;
  const item = getMusicItem(slug);
  if (!item) notFound();

  const released = formatDateYmd(item.date);

  return (
    <div className="py-6 mx-auto">
      <PageControls backLink={{ path: ROUTES.music().root, title: "Music" }} />

      <div className="flex items-center gap-6">
        <h1 className="order-2 flex-1 min-w-0 text-lg sm:text-sm lg:text-2xl">
          {item.title}
          <span className="text-muted-foreground">
            <span aria-hidden="true"> — </span>
            <span className="sr-only"> by </span>
            {item.artist}
          </span>
        </h1>
        <div className="order-1 shrink-0">
          <PlayInPlayerButton slug={slug} />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <Image
          width={400}
          height={400}
          src={ROUTES.music(slug).art("cover")}
          alt={`Artwork for ${item.title}`}
          unoptimized
          className="w-full sm:max-w-1/2 max-w-[400px] h-auto"
        />
        <table className="w-full border-collapse">
          <tbody>
            <tr className="border-b">
              <MetaTh>BPM</MetaTh>
              <MetaTh>
                {item.bpm}
                {item.bpm2 && ` — ${item.bpm2}`}
              </MetaTh>
            </tr>

            <tr className="border-b">
              <MetaTh>Released</MetaTh>
              <MetaTd>{released}</MetaTd>
            </tr>

            <tr>
              <MetaTh>Duration</MetaTh>
              <MetaTd>54:12</MetaTd>
            </tr>
          </tbody>
        </table>
      </div>

      {item.content}
    </div>
  );
}

const MetaTh = ({ children }: React.PropsWithChildren) => (
  <th className="py-2 pr-4 text-left font-medium">{children}</th>
);

const MetaTd = ({ children }: React.PropsWithChildren) => (
  <td className="py-2 w-full">{children}</td>
);
