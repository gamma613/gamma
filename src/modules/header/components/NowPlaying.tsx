import { Player, PlayToggleButton, SeekBar, TrackArt, TrackArtist, TrackTitle, VolumeSlider } from '@/modules/player';
//
import { TrackDuration } from '@/modules/player/components/TrackDuration';
import { TrackPosition } from '@/modules/player/components/TrackPosition';

// ----------------------------------------------------------------------

export function NowPlaying() {
  return (
    <div aria-label="Now playing" role="Region" className="px-4">
      {/* Embed the player (hidden) */}
      <div aria-hidden="true" className="hidden">
        <Player />
      </div>

      {/* Toolbar */}
      <div role="toolbar" aria-label="Media controls" className="flex flex-row items-center gap-4">
        <TrackArt width={44} height={44} className="hidden sm:block" />
        <PlayToggleButton className="h-11 w-11" /> 
        {/* TODO: move this into a button w/ popover */}
        <div className="hidden sm-block">
          <VolumeSlider className="px-6 flex-1 max-w-[150px]" />
        </div>
        <div className="text-foreground">
          <div className="text-xs sm:text-sm">
            <TrackTitle />
            <span className="text-muted-foreground"> by <TrackArtist /></span>
          </div>
          
          <div className="flex items-center gap-2 tabular-nums leading-none text-xs">
            <TrackPosition />
            <span className="text-muted-foreground">/</span>
            <TrackDuration />
          </div>
        </div>
        {/* Sits overtop of the header */}
        <SeekBar className="fixed inset-x-0 bottom-(--header-height) z-31" />
      </div>

      
    </div>
  );
}
