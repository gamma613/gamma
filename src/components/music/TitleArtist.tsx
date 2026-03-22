import type React from "react";

// ----------------------------------------------------------------------

export type TitleArtistProps = {
  artist?: React.ReactNode;
  className?: string;
  title: React.ReactNode;
};

export function TitleArtist({ artist, className, title }: TitleArtistProps) {
  return (
    <span className={className}>
      {title}
      {artist && (
        <span className="text-muted-foreground">
          <span aria-hidden="true"> — </span>
          <span className="sr-only"> by </span>
          {artist}
        </span>
      )}
    </span>
  );
}
