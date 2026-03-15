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

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const { slug } = await params;
  
  // query the mix
  const mix = getMix(slug);

  return {
    description: mix?.description ?? '',
    title: mix?.title ?? NOT_FOUND_TITLE,
  };
}

export default async function MixPage({ params }: Props,) {
  const { slug } = await params;
  const mix = getMix(slug);
  if (!mix) notFound();

  return (
    <div className="py-6 mx-auto max-w-sm sm:max-w-none">
      <div className="flex items-center gap-3">
        <h1 className="flex-1">{mix.title}</h1>
        <PlayInPlayerButton slug={slug} title={mix.title ?? slug} artist={mix.artist ?? undefined} cover={mix.artwork?.cover} />
      </div>
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <Image 
          width={400}
          height={400}
          src={ROUTES.mixes(slug).art('cover')}
          alt={`Artwork for ${mix.title}`}
          // the art route manages its own cache
          unoptimized
          className="w-full sm:max-w-1/2 max-w-[400px] h-auto"
        />
        <table className="w-full border-collapse">
          <tbody>
            <tr className="border-b">
              <MetaTh>
                Artist
              </MetaTh>
              <MetaTd>
                {mix.artist ?? 'Gamma'}
              </MetaTd>
            </tr>

            <tr className="border-b">
              <MetaTh>
                Released
              </MetaTh>
              <MetaTd>
                2026
              </MetaTd>
            </tr>

            <tr>
              <MetaTh>
                Duration
              </MetaTh>
              <MetaTd>
                54:12
              </MetaTd>
            </tr>
          </tbody>
        </table>
      </div>
      
      {mix.content}
      
    </div>
  );
}

const MetaTh = ({children} : React.PropsWithChildren) => (
  <th className="py-2 pr-4 text-left font-medium">{children}</th>
)

const MetaTd = ({children} : React.PropsWithChildren) => (
  <td className="py-2 w-full">{children}</td>
)
