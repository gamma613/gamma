import Image from 'next/image';

export function ArtworkWithBlurFill({ alt, src }: { alt: string; src: string }) {
  return (
    <div className="relative isolate w-full overflow-hidden sm:w-1/2 sm:max-w-[400px]">
      <Image
        fill
        src={src}
        alt=""
        aria-hidden="true"
        sizes="(max-width: 639px) 100vw, 400px"
        unoptimized
        className="scale-110 object-cover opacity-60 blur-2xl"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-background/25" />
      <Image
        width={400}
        height={400}
        src={src}
        alt={alt}
        unoptimized
        className="relative z-10 mx-auto block h-auto w-full max-w-[400px]"
      />
    </div>
  );
}
