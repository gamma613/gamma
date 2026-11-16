'use client';

import type { Music } from '@/lib/music/allMusicIndex';
import { useMemo, useState } from 'react';

type GenreOptions = Map<string, Set<string>>;

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
  const yearDomain = useMemo(() => {
    const years = items.map((item) => item.date.getFullYear());
    const min = years.length ? Math.min(...years) : new Date().getFullYear();
    const max = years.length ? Math.max(...years) : new Date().getFullYear();
    return [min, Math.max(min + 1, max)] as const;
  }, [items]);

  const [bpmRange, setBpmRange] = useState<[number, number]>([...bpmDomain]);
  const [yearRange, setYearRange] = useState<[number, number]>([...yearDomain]);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(() => new Set());
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(() => new Set());
  const [selectedGenres, setSelectedGenres] = useState<Set<string>>(() => new Set());

  const isFiltered =
    bpmRange[0] !== bpmDomain[0] ||
    bpmRange[1] !== bpmDomain[1] ||
    yearRange[0] !== yearDomain[0] ||
    yearRange[1] !== yearDomain[1] ||
    selectedTags.size > 0 ||
    selectedTypes.size > 0 ||
    selectedGenres.size > 0;

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        if (bpmRange[0] !== bpmDomain[0] || bpmRange[1] !== bpmDomain[1]) {
          if (item.bpm == null) return false;
          const itemMin = Math.min(item.bpm, item.bpm2 ?? item.bpm);
          const itemMax = Math.max(item.bpm, item.bpm2 ?? item.bpm);
          if (itemMax < bpmRange[0] || itemMin > bpmRange[1]) return false;
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
    [bpmDomain, bpmRange, items, selectedGenres, selectedTags, selectedTypes, yearDomain, yearRange]
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
    setYearRange([...yearDomain]);
    setSelectedTags(new Set());
    setSelectedTypes(new Set());
    setSelectedGenres(new Set());
  }

  return {
    bpmDomain,
    bpmRange,
    clearFilters,
    filteredItems,
    genreOptions,
    isFiltered,
    selectedGenres,
    selectedTags,
    selectedTypes,
    setBpmRange,
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
