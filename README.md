This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The app's `<meta name="app-version">` updates to `development-{branch}` while `npm run dev` is running (or `development-commit-{sha}` for a detached Git checkout). A development-only endpoint checks the current Git branch on page load and when the browser tab regains focus; the initial value defaults to `development`.

## Media storage (Cloudflare R2)

The R2 bucket for media is `gamma-media`, in the **America East** location. Local development copies of audio and video live flat in `developer-assets/media/`, named by slug; media files are gitignored. New uploads go directly to the bucket root. Cover art and music metadata stay in `protected-assets/music/`.

To push local media to R2 or pull R2 media to this machine, install and configure [rclone](https://rclone.org/install/) with a remote named `gamma-media` using Cloudflare R2 credentials. The script previews by default. Preview a push:

```bash
bash scripts/sync-media.sh push
```

The preview lists each candidate and clearly says when there are none. To start a push or pull, add `--execute`; after the candidate list, choose `a` to transfer all candidates, enter one candidate's number to transfer only that file, or choose `q` to cancel. For example:

```bash
bash scripts/sync-media.sh push --execute
```

For a pull, use:

```bash
bash scripts/sync-media.sh pull --execute
```

Both directions copy MP3, MP4, M4A, FLAC, and WAV files, compare size and available checksums, and update changed files such as audio with edited ID3 tags. Rclone can compare hashes for objects uploaded through rclone, including multipart uploads; when a remote object has no readable checksum, it falls back to size. These copy operations do not delete files that exist only at the destination. New media is copied to the bucket root. Use a bucket-scoped Object Read & Write token for pushing; keep credentials in rclone's local config, never in tracked source files.

### Use R2 audio during local development

The app reads audio from local files by default. To switch the server-side audio route to the R2 bucket, create a separate **Object Read Only** R2 token scoped to `gamma-media`, then put its S3 credentials in the ignored `.env.local` file:

```dotenv
MEDIA_STORAGE=r2
R2_ACCOUNT_ID=your-cloudflare-account-id
R2_BUCKET=gamma-media
R2_ACCESS_KEY_ID=your-read-only-access-key-id
R2_SECRET_ACCESS_KEY=your-read-only-secret-access-key
```

Restart `npm run dev` after changing environment variables. Set `MEDIA_STORAGE=local` (or remove it) to switch back to local audio. The R2 token is used only by the Next.js server; browser requests continue through `/api/stream/music/<slug>`, including byte-range requests needed for seeking. `.env.local` is gitignored. Never use the write-enabled rclone upload token in the app; use a separate read-only token for playback.

For the Vercel deployment, add the required variables from `.env.example` in the Vercel project's **Production** environment settings, using a separate bucket-scoped **Object Read Only** token. Set `MEDIA_STORAGE=r2` and redeploy. Do not upload `.env.local` or commit credentials. The release workflow pulls Vercel's Production settings when it builds a tag.

### Analytics (Google Analytics 4)

Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` to a GA4 web stream Measurement ID (for example, `G-XXXXXXXXXX`) in `.env.local` or the hosting provider's environment settings, then restart or redeploy. When configured, the app records page views and `audio_play` / `audio_listen` events. The listen event is emitted in roughly 15-second increments during forward playback and includes the music item slug and seconds listened. Leave it unset to disable analytics. Audio download tracking is not enabled: the stream endpoint also handles normal playback, seeking, and buffering requests.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Production deploys and rollbacks (Vercel)

Production deploys are made from version tags, not ordinary branch pushes. The GitHub Actions workflow in `.github/workflows/deploy-production.yml` builds the selected tag with Vercel and deploys it to Production. It also sets `NEXT_PUBLIC_APP_VERSION` from the tag (or the short commit SHA for a manual SHA deploy); the root layout publishes this as `<meta name="app-version">`. Vercel's automatic Git deployments are disabled in `vercel.json`, so pushes and pull requests won't deploy by themselves.

### One-time setup

1. In the Vercel project, keep the GitHub repository connected and configure the Production environment variables, including `MEDIA_STORAGE=r2` and the R2 read-only credentials.
2. Create a Vercel access token in **Account Settings → Tokens**.
3. From the project directory, run `vercel link` and choose the existing Vercel project. Read `orgId` and `projectId` from the generated, gitignored `.vercel/project.json` file.
4. In the GitHub repository, open **Settings → Secrets and variables → Actions → New repository secret**. Add:
   - `VERCEL_TOKEN`: the access token from step 2
   - `VERCEL_ORG_ID`: `orgId` from `.vercel/project.json`
   - `VERCEL_PROJECT_ID`: `projectId` from `.vercel/project.json`

Keep the token private. The IDs identify the Vercel team and project but are not credentials.

### Release a version

Commit and push the release changes to GitHub, then create and push an annotated version tag at the commit you want to publish:

```bash
git checkout main
git pull
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

Use the next unused version for each release; do not move or reuse a published tag. The automatic trigger matches `vMAJOR.MINOR.PATCH` tags made of numbers, such as `v1.0.0`; tags like `v-next` or `v1.0.0-rc.1` do not trigger a production deployment. Follow the run under the repository's **Actions** tab and confirm the deployment in Vercel. You can also create a GitHub Release using a new matching version tag; that tag push triggers the same workflow.

### Roll back

On the Hobby plan, Vercel Instant Rollback can restore only the immediately previous Production deployment. In the Vercel project, use **Deployments → Instant Rollback** to restore it quickly.

To deploy a release older than the immediately previous deployment, use the GitHub workflow manually:

1. Open **Actions → Deploy production to Vercel → Run workflow**.
2. Enter the older release tag (for example, `v1.0.0`) in **Git tag or commit SHA to deploy** and run the workflow.
3. Confirm that workflow checked out the intended tag and that its deployment is serving the production domain.

This deploys the selected historical source as a new Production deployment. It does not reverse database, R2, or other external state changes; handle those separately if a release changed them. After fixing the problem, publish a new version tag rather than moving an existing tag.
