import { withContentCollections } from '@content-collections/next';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  outputFileTracingExcludes: {
    '/*': [
      './.git/**/*',
      './.github/**/*',
      './.env*',
      './.husky/**/*',
      './.vscode/**/*',
      './scripts/**/*',
      './tests/**/*',
      './certificates/**/*',
      './developer-assets/media/**/*',
      './protected-assets/music/**/*.md',
      './protected-assets/music/**/.DS_Store',
    ],
  },
  outputFileTracingIncludes: {
    '/music/*/art/*': [
      './public/music/default-cover.jpg',
      './protected-assets/music/**/*.{avif,webp,png,jpg,jpeg}',
    ],
  },
};

// export default nextConfig;
export default withContentCollections(nextConfig);
