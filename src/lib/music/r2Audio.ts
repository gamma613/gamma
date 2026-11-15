import { createHash, createHmac } from 'crypto';
import { audioContentTypeFromExt } from './supported';

const R2_REGION = 'auto';
const R2_SERVICE = 's3';
const SIGNED_URL_TTL_SECONDS = 60;

function awsEncode(value: string): string {
  return encodeURIComponent(value).replace(
    /[!'()*]/g,
    (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`
  );
}

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function hmac(key: Buffer | string, value: string): Buffer {
  return createHmac('sha256', key).update(value).digest();
}

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function createPresignedGetUrl(key: string): URL {
  const accountId = requiredEnv('R2_ACCOUNT_ID');
  const bucket = process.env.R2_BUCKET || 'gamma-media';
  const accessKeyId = requiredEnv('R2_ACCESS_KEY_ID');
  const secretAccessKey = requiredEnv('R2_SECRET_ACCESS_KEY');
  const endpoint = new URL(`https://${accountId}.r2.cloudflarestorage.com`);
  const canonicalUri = `/${awsEncode(bucket)}/${key.split('/').map(awsEncode).join('/')}`;
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);
  const credentialScope = `${dateStamp}/${R2_REGION}/${R2_SERVICE}/aws4_request`;

  const query = [
    ['X-Amz-Algorithm', 'AWS4-HMAC-SHA256'],
    ['X-Amz-Credential', `${accessKeyId}/${credentialScope}`],
    ['X-Amz-Date', amzDate],
    ['X-Amz-Expires', String(SIGNED_URL_TTL_SECONDS)],
    ['X-Amz-SignedHeaders', 'host'],
  ] as const;
  const canonicalQuery = [...query]
    .map(([name, value]) => [awsEncode(name), awsEncode(value)] as const)
    .sort(([leftName, leftValue], [rightName, rightValue]) =>
      leftName === rightName
        ? leftValue.localeCompare(rightValue)
        : leftName.localeCompare(rightName)
    )
    .map(([name, value]) => `${name}=${value}`)
    .join('&');

  const canonicalRequest = [
    'GET',
    canonicalUri,
    canonicalQuery,
    `host:${endpoint.host}\n`,
    'host',
    'UNSIGNED-PAYLOAD',
  ].join('\n');
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    sha256(canonicalRequest),
  ].join('\n');

  const dateKey = hmac(`AWS4${secretAccessKey}`, dateStamp);
  const regionKey = hmac(dateKey, R2_REGION);
  const serviceKey = hmac(regionKey, R2_SERVICE);
  const signingKey = hmac(serviceKey, 'aws4_request');
  const signature = createHmac('sha256', signingKey).update(stringToSign).digest('hex');

  const url = new URL(canonicalUri, endpoint);
  url.search = `${canonicalQuery}&X-Amz-Signature=${signature}`;
  return url;
}

export async function fetchR2Audio(slug: string, range: string | null): Promise<Response> {
  const response = await fetch(createPresignedGetUrl(`${slug}.mp3`), {
    headers: range ? { Range: range } : undefined,
    cache: 'no-store',
  });

  if (!response.ok && response.status !== 206) {
    await response.body?.cancel();
    if (response.status === 404) return response;
    throw new Error(`R2 audio request failed with status ${response.status}`);
  }

  return response;
}

export function r2AudioContentType(): string {
  return audioContentTypeFromExt('mp3');
}
