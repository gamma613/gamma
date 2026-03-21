import { getMix } from "@/lib/mixes/getMix";
import { ROUTES } from "@/lib/routes";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { NOT_FOUND_TITLE } from "../not-found";
import { PlayInPlayerButton } from "./PlayInPlayerButton";

// ----------------------------------------------------------------------

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // query the mix
  const mix = getMix(slug);

  return {
    description: mix?.description ?? "",
    title: mix?.title ?? NOT_FOUND_TITLE,
  };
}

export default async function MixPage({ params }: Props) {
  const { slug } = await params;
  const mix = getMix(slug);
  if (!mix) notFound();

  const released = mix.date ? mix.date.toISOString().slice(0, 10) : "—";

  return (
    <div className="py-6 mx-auto">
      <div className="flex items-center gap-6">
        <h1 className="order-2 flex-1 min-w-0 text-lg sm:text-sm lg:text-2xl">
          {mix.title}
          <span className="text-muted-foreground">
            <span aria-hidden="true"> — </span>
            <span className="sr-only"> by </span>
            {mix.artist}
          </span>
        </h1>
        <div className="order-1 shrink-0">
          <PlayInPlayerButton
            slug={slug}
            title={mix.title}
            artist={mix.artist}
            cover={mix.artwork.cover}
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <Image
          width={400}
          height={400}
          src={ROUTES.mixes(slug).art("cover")}
          alt={`Artwork for ${mix.title}`}
          unoptimized
          className="w-full sm:max-w-1/2 max-w-[400px] h-auto"
        />
        <table className="w-full border-collapse">
          <tbody>
            <tr className="border-b">
              <MetaTh>BPM</MetaTh>
              <MetaTh>
                {mix.bpm}
                {mix.bpm2 && ` — ${mix.bpm2}`}
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

      {mix.content}
    </div>
  );
}

const MetaTh = ({ children }: React.PropsWithChildren) => (
  <th className="py-2 pr-4 text-left font-medium">{children}</th>
);

const MetaTd = ({ children }: React.PropsWithChildren) => (
  <td className="py-2 w-full">{children}</td>
);
