import { Player, PlayToggleButton, SeekBar, TrackArt, TrackArtist, TrackTitle, VolumeSlider } from '@/modules/player';
//
import { TrackDuration } from '@/modules/player/components/TrackDuration';
import { TrackPosition } from '@/modules/player/components/TrackPosition';

// ----------------------------------------------------------------------

export function NowPlaying() {
  return (
    <div aria-label="Now playing" role="Region">
      {/* Embed the player (hidden) */}
      <div aria-hidden="true" className="hidden">
        <Player />
      </div>

      {/* Toolbar */}
      <div role="toolbar" aria-label="Media controls" className="flex flex-row items-center">
        <TrackArt width={50} height={50} />
        <PlayToggleButton /> 
        {/* TODO: move this into a button w/ popover */}
        <VolumeSlider className="px-6 flex-1 max-w-[150px]" />
        <div className="">
          <TrackArtist aria-labelledby="now-playing-title" className="w-full max-w-[12rem] sm:max-w-[16rem] truncate text-xs leading-none text-muted-foreground" />
          <TrackTitle className="w-full max-w-[12rem] sm:max-w-[16rem] truncate text-xs leading-none text-muted-foreground" />
          <div className="flex items-center gap-2 tabular-nums text-xs leading-none text-muted-foreground">
            <TrackPosition className="text-foreground" />
            <span className="hidden sm:inline">/</span>
            <TrackDuration className="text-foreground" />
          </div>
        </div>
        {/* Sits overtop of the header */}
        <SeekBar className="fixed inset-x-0 bottom-(--header-height) z-31" />
      </div>

      
    </div>
  );
}
