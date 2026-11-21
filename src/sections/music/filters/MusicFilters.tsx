'use client';

import {
  Button,
  Slider,
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from '@/components';
import { formatTrackTime } from '@/modules/player/utils';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef } from 'react';
import type { MusicFiltersState } from './useMusicFilters';

function checkboxClassName() {
  return 'size-4 accent-primary';
}

export function MusicFilters({
  bpmDomain,
  bpmRange,
  clearFilters,
  durationDomain,
  durationRange,
  genreOptions,
  isFiltered,
  selectedGenres,
  selectedTags,
  selectedTypes,
  setBpmRange,
  setDurationRange,
  setSelectedGenres,
  setSelectedTags,
  setSelectedTypes,
  setYearRange,
  tags,
  toggleParentSelection,
  toggleSelection,
  types,
  yearDomain,
  yearRange,
}: MusicFiltersState) {
  const filterDetailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    function closeOnOutsideClick(event: PointerEvent) {
      const details = filterDetailsRef.current;
      if (details?.open && !details.contains(event.target as Node)) details.open = false;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape' && filterDetailsRef.current?.open) {
        filterDetailsRef.current.open = false;
      }
    }

    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  return (
    <details ref={filterDetailsRef} className="group relative">
      <Tooltip>
        <TooltipTrigger asChild>
          <summary className="relative flex size-9 cursor-pointer list-none items-center justify-center rounded-lg border border-border bg-background hover:bg-accent focus-visible:outline-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
            <FontAwesomeIcon icon={faFilter} className="size-4" />
            {isFiltered ? (
              <span className="absolute -right-1 -top-1 size-3 rounded-full border-2 border-background bg-primary" />
            ) : null}
            <span className="sr-only">Open filters</span>
          </summary>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent>Filter</TooltipContent>
        </TooltipPortal>
      </Tooltip>

      <div className="absolute left-0 z-30 mt-2 max-h-[min(75vh,42rem)] w-[min(22rem,calc(100vw-2rem))] overflow-y-auto rounded-xl border border-border bg-popover p-4 text-popover-foreground shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">Filters</h2>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={clearFilters}
            disabled={!isFiltered}
          >
            Clear
          </Button>
        </div>

        <fieldset className="mb-5">
          <legend className="mb-2 text-sm font-medium">BPM</legend>
          <div className="mb-2 flex justify-between text-xs text-muted-foreground">
            <span>{bpmRange[0]} BPM</span>
            <span>{bpmRange[1]} BPM</span>
          </div>
          <Slider
            min={bpmDomain[0]}
            max={bpmDomain[1]}
            step={1}
            value={bpmRange}
            onValueChange={(value) => setBpmRange([value[0], value[1]])}
            aria-label="BPM range"
          />
          <p className="mt-1 text-xs text-muted-foreground">Items without BPM stay visible.</p>
        </fieldset>

        <fieldset className="mb-5">
          <legend className="mb-2 text-sm font-medium">Duration</legend>
          <div className="mb-2 flex justify-between text-xs text-muted-foreground">
            <span>{formatTrackTime(durationRange[0])}</span>
            <span>{formatTrackTime(durationRange[1])}</span>
          </div>
          <Slider
            min={durationDomain[0]}
            max={durationDomain[1]}
            step={1}
            value={durationRange}
            onValueChange={(value) => setDurationRange([value[0], value[1]])}
            aria-label="Duration range"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Items without a duration stay visible.
          </p>
        </fieldset>

        <fieldset className="mb-5">
          <legend className="mb-2 text-sm font-medium">Date</legend>
          <div className="mb-2 flex justify-between text-xs text-muted-foreground">
            <span>{yearRange[0]}</span>
            <span>{yearRange[1]}</span>
          </div>
          <Slider
            min={yearDomain[0]}
            max={yearDomain[1]}
            step={1}
            value={yearRange}
            onValueChange={(value) => setYearRange([value[0], value[1]])}
            aria-label="Release year range"
          />
        </fieldset>

        <fieldset className="mb-5">
          <legend className="mb-2 text-sm font-medium">Tags</legend>
          <div className="grid max-h-36 grid-cols-2 gap-x-3 gap-y-2 overflow-y-auto text-sm">
            {tags.map((tag) => (
              <label key={tag} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className={checkboxClassName()}
                  checked={selectedTags.has(tag)}
                  onChange={() => toggleSelection(selectedTags, tag, setSelectedTags)}
                />
                <span>{tag}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="mb-5">
          <legend className="mb-2 text-sm font-medium">Types</legend>
          <div className="space-y-3 text-sm">
            {types.map((type) => (
              <div key={type}>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className={checkboxClassName()}
                    checked={selectedTypes.has(type)}
                    onChange={() =>
                      toggleParentSelection(
                        selectedTypes,
                        type,
                        type === 'mix' ? ['mix::studio', 'mix::live'] : [],
                        setSelectedTypes
                      )
                    }
                  />
                  <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                </label>
                {type === 'mix' ? (
                  <div className="ml-6 mt-1 space-y-1 border-l border-border pl-3">
                    {['studio', 'live'].map((mixType) => {
                      const key = `mix::${mixType}`;
                      return (
                        <label key={key} className="flex items-center gap-2 text-muted-foreground">
                          <input
                            type="checkbox"
                            className={checkboxClassName()}
                            checked={selectedTypes.has('mix') || selectedTypes.has(key)}
                            disabled={selectedTypes.has('mix')}
                            onChange={() => toggleSelection(selectedTypes, key, setSelectedTypes)}
                          />
                          <span>{mixType}</span>
                        </label>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm font-medium">Genres</legend>
          <div className="space-y-3 text-sm">
            {[...genreOptions].map(([parent, subgenres]) => (
              <div key={parent}>
                <label className="flex items-center gap-2 font-medium">
                  <input
                    type="checkbox"
                    className={checkboxClassName()}
                    checked={selectedGenres.has(parent)}
                    onChange={() =>
                      toggleParentSelection(
                        selectedGenres,
                        parent,
                        [...subgenres].map((subgenre) => `${parent}::${subgenre}`),
                        setSelectedGenres
                      )
                    }
                  />
                  <span>{parent}</span>
                </label>
                {subgenres.size > 0 ? (
                  <div className="ml-6 mt-1 space-y-1 border-l border-border pl-3">
                    {[...subgenres]
                      .sort((a, b) => a.localeCompare(b))
                      .map((subgenre) => {
                        const key = `${parent}::${subgenre}`;
                        return (
                          <label
                            key={key}
                            className="flex items-center gap-2 text-muted-foreground"
                          >
                            <input
                              type="checkbox"
                              className={checkboxClassName()}
                              checked={selectedGenres.has(parent) || selectedGenres.has(key)}
                              disabled={selectedGenres.has(parent)}
                              onChange={() =>
                                toggleSelection(selectedGenres, key, setSelectedGenres)
                              }
                            />
                            <span>{subgenre}</span>
                          </label>
                        );
                      })}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </fieldset>
      </div>
    </details>
  );
}
