'use client';

import type { ComponentProps } from 'react';

type MusicResultsCountProps = {
  filteredCount: number;
  totalCount: number;
  isFiltered: boolean;
  onClear: () => void;
} & Pick<ComponentProps<'p'>, 'className'>;

export function MusicResultsCount({
  filteredCount,
  totalCount,
  isFiltered,
  onClear,
  className,
}: MusicResultsCountProps) {
  return (
    <p className={`text-left text-sm text-muted-foreground ${className ?? ''}`}>
      {isFiltered ? (
        <>
          {filteredCount} {filteredCount === 1 ? 'result' : 'results'} / {totalCount} items ·{' '}
          <button type="button" className="underline underline-offset-2" onClick={onClear}>
            Clear filters
          </button>
        </>
      ) : (
        <>{totalCount} items</>
      )}
    </p>
  );
}
