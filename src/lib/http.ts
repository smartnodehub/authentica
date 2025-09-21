export async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 3,
  backoffs = [100, 500, 2000]
): Promise<Response> {
  let lastErr: unknown = null;
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, options);
      if (res.status === 429 || (res.status >= 500 && res.status < 600)) {
        if (i < retries) {
          await new Promise(r => setTimeout(r, backoffs[Math.min(i, backoffs.length - 1)]));
          continue;
        }
      }
      return res;
    } catch (err) {
      lastErr = err;
      if (i < retries) {
        await new Promise(r => setTimeout(r, backoffs[Math.min(i, backoffs.length - 1)]));
        continue;
      }
      throw err;
    }
  }
  throw lastErr ?? new Error("fetchWithRetry failed");
}
