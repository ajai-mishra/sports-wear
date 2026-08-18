/**
 * Every call here is relative to NEXT_PUBLIC_API_BASE_URL (default "/api",
 * the local Next.js Route Handlers serving mock data). Swapping to the real
 * NestJS backend later is a one-line env change — no call-site changes.
 * Only use this from Client Components; Server Components should call the
 * service layer in src/services/* directly to avoid an unnecessary network hop.
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

export class ApiRequestError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.name = "ApiRequestError";
    this.code = code;
    this.status = status;
  }
}

interface ApiErrorBody {
  error?: { code?: string; message?: string };
}

async function request<TResponse>(path: string, init?: RequestInit): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
    credentials: "include",
  });

  if (!response.ok) {
    const body: ApiErrorBody | null = await response.json().catch(() => null);
    throw new ApiRequestError(
      body?.error?.code ?? "INTERNAL_ERROR",
      body?.error?.message ?? "Something went wrong. Please try again.",
      response.status,
    );
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return response.json() as Promise<TResponse>;
}

export const apiClient = {
  get: <TResponse>(path: string): Promise<TResponse> => request<TResponse>(path, { method: "GET" }),
  post: <TResponse>(path: string, body?: unknown): Promise<TResponse> =>
    request<TResponse>(path, { method: "POST", body: body !== undefined ? JSON.stringify(body) : undefined }),
  put: <TResponse>(path: string, body?: unknown): Promise<TResponse> =>
    request<TResponse>(path, { method: "PUT", body: body !== undefined ? JSON.stringify(body) : undefined }),
  patch: <TResponse>(path: string, body?: unknown): Promise<TResponse> =>
    request<TResponse>(path, { method: "PATCH", body: body !== undefined ? JSON.stringify(body) : undefined }),
  delete: <TResponse>(path: string): Promise<TResponse> => request<TResponse>(path, { method: "DELETE" }),
};
