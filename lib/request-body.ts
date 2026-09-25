type JsonReadResult = { value: Record<string, unknown> } | { error: 'too_large' | 'invalid' };

export async function readJsonRecord(request: Request, maxBytes: number): Promise<JsonReadResult> {
  const declaredLength = Number(request.headers.get('content-length') ?? 0);
  if (declaredLength > maxBytes) return { error: 'too_large' };
  if (!request.body) return { error: 'invalid' };

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalLength = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalLength += value.byteLength;
      if (totalLength > maxBytes) {
        await reader.cancel();
        return { error: 'too_large' };
      }
      chunks.push(value);
    }
    const parsed: unknown = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return { error: 'invalid' };
    return { value: parsed as Record<string, unknown> };
  } catch {
    return { error: 'invalid' };
  }
}
