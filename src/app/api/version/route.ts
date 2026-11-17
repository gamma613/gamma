import { execFileSync } from 'node:child_process';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return new NextResponse(null, { status: 404 });
  }

  try {
    const branch = execFileSync('git', ['branch', '--show-current'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    const commit = branch
      ? ''
      : execFileSync('git', ['rev-parse', '--short', 'HEAD'], {
          encoding: 'utf8',
          stdio: ['ignore', 'pipe', 'ignore'],
        }).trim();
    const version = branch ? `development-${branch}` : `development-commit-${commit}`;

    return NextResponse.json({ version }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
  } catch {
    return NextResponse.json(
      { version: 'development-unknown' },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  }
}
