'use client';

import { usePageCollapse } from '../layout';
import { VisualizerBars, VisualizerBarsConfig, VisualizerBarsProps } from './VisualizerBars';

// ----------------------------------------------------------------------

/**
 * VisualizerBars, but with dynamic opacity based on `collapsed `state from
 * PageCollapseProvider
 */
export function VisualizerBarsWithDynamicOpacity({
  config,
  ...rest
}: Omit<VisualizerBarsProps, 'config'> & {
  config: Omit<VisualizerBarsConfig, 'opacity'>;
}) {
  const { collapsed } = usePageCollapse();
  return (
    <VisualizerBars
      config={{
        ...config,
        opacity: collapsed ? 0.9 : 0.25,
      }}
      {...rest}
    />
  );
}
