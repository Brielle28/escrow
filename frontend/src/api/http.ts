const apiBase = import.meta.env.VITE_API_BASE_URL ?? "";

export function apiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return apiBase ? `${apiBase.replace(/\/$/, "")}${p}` : p;
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, headers, ...rest } = init;
  const mergedHeaders = new Headers(headers);
  if (token) mergedHeaders.set("Authorization", `Bearer ${token}`);
  if (rest.body && !mergedHeaders.has("content-type")) {
    mergedHeaders.set("content-type", "application/json");
  }

  let response: Response;
  try {
    response = await fetch(apiUrl(path), { ...rest, headers: mergedHeaders });
  } catch (e) {
    const hint =
      "Cannot reach the API. Start the backend: pnpm --filter escrow-backend dev";
    throw new Error(e instanceof TypeError ? `${hint} (${e.message})` : hint);
  }

  if (!response.ok) {
    let detail = response.statusText;
    try {
      const body = (await response.json()) as { error?: string };
      if (body.error) detail = body.error;
    } catch {
      /* ignore */
    }
    throw new ApiError(response.status, detail);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
