import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';

type TokenPayload = { purpose: string; resource: string; expiresAt: number };

function secret() {
  const value = process.env.DOWNLOAD_TOKEN_SECRET;
  if (!value || value.length < 32) throw new Error('DOWNLOAD_TOKEN_SECRET debe tener al menos 32 caracteres.');
  return value;
}

export function createSignedToken(purpose: string, resource: string, expiresAt: number) {
  const payload = Buffer.from(JSON.stringify({ purpose, resource, expiresAt } satisfies TokenPayload)).toString('base64url');
  const signature = createHmac('sha256', secret()).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

export function verifySignedToken(token: string, purpose: string) {
  const [payload, providedSignature, extra] = token.split('.');
  if (!payload || !providedSignature || extra) return null;

  const expected = createHmac('sha256', secret()).update(payload).digest();
  let provided: Buffer;
  try { provided = Buffer.from(providedSignature, 'base64url'); } catch { return null; }
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) return null;

  try {
    const value = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as TokenPayload;
    if (value.purpose !== purpose || value.expiresAt < Math.floor(Date.now() / 1000)) return null;
    return value;
  } catch {
    return null;
  }
}
