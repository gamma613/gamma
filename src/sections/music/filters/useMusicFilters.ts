'use client';

import type { Music } from '@/lib/music/allMusicIndex';
import { useEffect, useMemo, useRef, useState } from 'react';

type GenreOptions = Map<string, Set<string>>;
type PersistedMusicFilters = {
  /** Selected BPM slider bounds, validated before restoring from storage. */
  bpmRange?: unknown;
  /** Full BPM bounds when `bpmRange` was saved; used to detect an unrestricted range. */
  bpmDomain?: unknown;
  /** Selected duration slider bounds, validated before restoring from storage. */
  durationRange?: unknown;
  /** Full duration bounds when `durationRange` was saved. */
  durationDomain?: unknown;
  /** Selected release-year slider bounds, validated before restoring from storage. */
  yearRange?: unknown;
  /** Full release-year bounds when `yearRange` was saved; used to detect an unrestricted range. */
  yearDomain?: unknown;
  /** Selected tags; unknown or unavailable values are discarded during restoration. */
  tags?: unknown;
  /** Selected item types, including optional mix subtype values. */
  types?: unknown;
  /** Selected genre names and parent/subgenre values. */
  genres?: unknown;
};

const STORAGE_KEY = 'gamma.music.filters.v1';

function parseRange(value: unknown): [number, number] | null {
  if (!Array.isArray(value) || value.length !== 2 || !value.every(Number.isFinite)) return null;

  return [Math.min(value[0], value[1]), Math.max(value[0], value[1])];
}

function readRange(value: unknown, domain: readonly [number, number]): [number, number] | null {
  const range = parseRange(value);
  if (!range) return null;

  const low = Math.max(domain[0], Math.min(domain[1], range[0]));
  const high = Math.max(domain[0], Math.min(domain[1], range[1]));
  return [Math.min(low, high), Math.max(low, high)];
}

function restoreRange(
  value: unknown,
  savedDomainValue: unknown,
  currentDomain: readonly [number, number]
): [number, number] {
  const savedRange = parseRange(value);
  const savedDomain = parseRange(savedDomainValue);

  // Older saved filters did not record their domain, so their range may just
  // be the old catalog default. Treat it as unrestricted after this migration.
  if (!savedRange || !savedDomain) return [...currentDomain];
  if (savedRange[0] === savedDomain[0] && savedRange[1] === savedDomain[1]) {
    return [...currentDomain];
  }

  return readRange(savedRange, currentDomain) ?? [...currentDomain];
}

function getGenreOptions(items: Music[]): GenreOptions {
  const options: GenreOptions = new Map();

  for (const item of items) {
    for (const genre of item.genres ?? []) {
      if (typeof genre === 'string') {
        if (!options.has(genre)) options.set(genre, new Set());
        continue;
      }

      const [name, subgenres] = Object.entries(genre)[0] ?? [];
      if (!name) continue;
      const current = options.get(name) ?? new Set<string>();
      subgenres?.forEach((subgenre) => current.add(subgenre));
      options.set(name, current);
    }
  }

  return new Map([...options].sort(([a], [b]) => a.localeCompare(b)));
}

function getItemGenres(item: Music): Map<string, Set<string>> {
  const genres = new Map<string, Set<string>>();

  for (const genre of item.genres ?? []) {
    if (typeof genre === 'string') {
      genres.set(genre, new Set());
      continue;
    }

    const [name, subgenres] = Object.entries(genre)[0] ?? [];
    if (name) genres.set(name, new Set(subgenres));
  }

  return genres;
}

export function useMusicFilters(items: Music[]) {
  const tags = useMemo(
    () => [...new Set(items.flatMap((item) => item.tags ?? []))].sort((a, b) => a.localeCompare(b)),
    [items]
  );
  const types = useMemo(
    () => [...new Set(items.map((item) => item.type))].sort((a, b) => a.localeCompare(b)),
    [items]
  );
  const genreOptions = useMemo(() => getGenreOptions(items), [items]);
  const bpmDomain = useMemo(() => {
    const values = items.flatMap((item) => [item.bpm, item.bpm2]).filter((value) => value != null);
    const min = Math.floor(values.length ? Math.min(...values) : 0);
    const max = Math.ceil(values.length ? Math.max(...values) : 1);
    return [min, Math.max(min + 1, max)] as const;
  }, [items]);
  const durationDomain = useMemo(() => {
    const values = items
      .map((item) => item.durationSeconds)
      .filter((value): value is number => value != null);
    const min = Math.floor(values.length ? Math.min(...values) : 0);
    const max = Math.ceil(values.length ? Math.max(...values) : 1);
    return [min, Math.max(min + 1, max)] as const;
  }, [items]);
  const yearDomain = useMemo(() => {
    const years = items.map((item) => item.date.getFullYear());
    const min = years.length ? Math.min(...years) : new Date().getFullYear();
    const max = years.length ? Math.max(...years) : new Date().getFullYear();
    return [min, Math.max(min + 1, max)] as const;
  }, [items]);

  const [bpmRange, setBpmRange] = useState<[number, number]>([...bpmDomain]);
  const [durationRange, setDurationRange] = useState<[number, number]>([...durationDomain]);
  const [yearRange, setYearRange] = useState<[number, number]>([...yearDomain]);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(() => new Set());
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(() => new Set());
  const [selectedGenres, setSelectedGenres] = useState<Set<string>>(() => new Set());
  const [didLoadPersisted, setDidLoadPersisted] = useState(false);
  const previousDomains = useRef({ bpm: bpmDomain, duration: durationDomain, year: yearDomain });

  useEffect(() => {
    const previous = previousDomains.current;
    const bpmDomainChanged = bpmDomain[0] !== previous.bpm[0] || bpmDomain[1] !== previous.bpm[1];
    const durationDomainChanged =
      durationDomain[0] !== previous.duration[0] || durationDomain[1] !== previous.duration[1];
    const yearDomainChanged =
      yearDomain[0] !== previous.year[0] || yearDomain[1] !== previous.year[1];
    const hadFullBpmRange = bpmRange[0] === previous.bpm[0] && bpmRange[1] === previous.bpm[1];
    const hadFullDurationRange =
      durationRange[0] === previous.duration[0] && durationRange[1] === previous.duration[1];
    const hadFullYearRange = yearRange[0] === previous.year[0] && yearRange[1] === previous.year[1];

    if (bpmDomainChanged && hadFullBpmRange) setBpmRange([...bpmDomain]);
    if (durationDomainChanged && hadFullDurationRange) setDurationRange([...durationDomain]);
    if (yearDomainChanged && hadFullYearRange) setYearRange([...yearDomain]);

    previousDomains.current = { bpm: bpmDomain, duration: durationDomain, year: yearDomain };
  }, [bpmDomain, bpmRange, durationDomain, durationRange, yearDomain, yearRange]);

  useEffect(() => {
    if (didLoadPersisted) return;

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const persisted = raw ? (JSON.parse(raw) as PersistedMusicFilters) : null;
      if (persisted && typeof persisted === 'object') {
        setBpmRange(restoreRange(persisted.bpmRange, persisted.bpmDomain, bpmDomain));
        setDurationRange(
          restoreRange(persisted.durationRange, persisted.durationDomain, durationDomain)
        );
        setYearRange(restoreRange(persisted.yearRange, persisted.yearDomain, yearDomain));

        if (Array.isArray(persisted.tags)) {
          setSelectedTags(
            new Set(persisted.tags.filter((tag): tag is string => tags.includes(tag)))
          );
        }
        if (Array.isArray(persisted.types)) {
          const validTypes = new Set<string>([...types, 'mix::studio', 'mix::live']);
          setSelectedTypes(
            new Set(
              persisted.types.filter(
                (type): type is string => typeof type === 'string' && validTypes.has(type)
              )
            )
          );
        }
        if (Array.isArray(persisted.genres)) {
          const validGenres = new Set<string>();
          for (const [parent, subgenres] of genreOptions) {
            validGenres.add(parent);
            subgenres.forEach((subgenre) => validGenres.add(`${parent}::${subgenre}`));
          }
          setSelectedGenres(
            new Set(
              persisted.genres.filter(
                (genre): genre is string => typeof genre === 'string' && validGenres.has(genre)
              )
            )
          );
        }
      }
    } catch {
      // Ignore malformed or unavailable local storage.
    }

    setDidLoadPersisted(true);
  }, [bpmDomain, didLoadPersisted, durationDomain, genreOptions, tags, types, yearDomain]);

  useEffect(() => {
    if (!didLoadPersisted) return;

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          bpmRange,
          bpmDomain,
          durationRange,
          durationDomain,
          yearRange,
          yearDomain,
          tags: [...selectedTags],
          types: [...selectedTypes],
          genres: [...selectedGenres],
        })
      );
    } catch {
      // Ignore unavailable local storage.
    }
  }, [
    bpmDomain,
    bpmRange,
    didLoadPersisted,
    durationDomain,
    durationRange,
    selectedGenres,
    selectedTags,
    selectedTypes,
    yearDomain,
    yearRange,
  ]);

  const isFiltered =
    bpmRange[0] !== bpmDomain[0] ||
    bpmRange[1] !== bpmDomain[1] ||
    durationRange[0] !== durationDomain[0] ||
    durationRange[1] !== durationDomain[1] ||
    yearRange[0] !== yearDomain[0] ||
    yearRange[1] !== yearDomain[1] ||
    selectedTags.size > 0 ||
    selectedTypes.size > 0 ||
    selectedGenres.size > 0;

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        if (bpmRange[0] !== bpmDomain[0] || bpmRange[1] !== bpmDomain[1]) {
          const itemBpms = [item.bpm, item.bpm2].filter((value): value is number => value != null);
          if (itemBpms.length) {
            const itemMin = Math.min(...itemBpms);
            const itemMax = Math.max(...itemBpms);
            if (itemMax < bpmRange[0] || itemMin > bpmRange[1]) return false;
          }
        }

        if (
          item.durationSeconds != null &&
          (durationRange[0] !== durationDomain[0] || durationRange[1] !== durationDomain[1]) &&
          (item.durationSeconds < durationRange[0] || item.durationSeconds > durationRange[1])
        ) {
          return false;
        }

        const year = item.date.getFullYear();
        if (
          (yearRange[0] !== yearDomain[0] || yearRange[1] !== yearDomain[1]) &&
          (year < yearRange[0] || year > yearRange[1])
        ) {
          return false;
        }

        if (selectedTags.size && !item.tags?.some((tag) => selectedTags.has(tag))) return false;
        if (selectedTypes.size) {
          const matchesType = selectedTypes.has(item.type);
          const matchesMixType = item.type === 'mix' && selectedTypes.has(`mix::${item.mixType}`);
          if (!matchesType && !matchesMixType) return false;
        }

        if (selectedGenres.size) {
          const itemGenres = getItemGenres(item);
          const matches = [...selectedGenres].some((selection) => {
            if (!selection.includes('::')) return itemGenres.has(selection);
            const [parent, subgenre] = selection.split('::');
            return itemGenres.get(parent)?.has(subgenre) ?? false;
          });
          if (!matches) return false;
        }

        return true;
      }),
    [
      bpmDomain,
      bpmRange,
      durationDomain,
      durationRange,
      items,
      selectedGenres,
      selectedTags,
      selectedTypes,
      yearDomain,
      yearRange,
    ]
  );

  function toggleSelection(current: Set<string>, value: string, set: (next: Set<string>) => void) {
    const next = new Set(current);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    set(next);
  }

  function toggleParentSelection(
    current: Set<string>,
    parent: string,
    children: string[],
    set: (next: Set<string>) => void
  ) {
    const next = new Set(current);
    if (next.has(parent)) {
      next.delete(parent);
    } else {
      next.add(parent);
      children.forEach((child) => next.delete(child));
    }
    set(next);
  }

  function clearFilters() {
    setBpmRange([...bpmDomain]);
    setDurationRange([...durationDomain]);
    setYearRange([...yearDomain]);
    setSelectedTags(new Set());
    setSelectedTypes(new Set());
    setSelectedGenres(new Set());
  }

  return {
    bpmDomain,
    bpmRange,
    durationDomain,
    durationRange,
    clearFilters,
    filteredItems,
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
  };
}

export type MusicFiltersState = ReturnType<typeof useMusicFilters>;
