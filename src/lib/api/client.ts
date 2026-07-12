// src/lib/api/client.ts
type FetchOptions = RequestInit & {
  token?: string;
};

class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
    message: string
  ) {
    super(message);
  }
}

async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token, headers, ...rest } = options;
  console.log("API Fetch called with path:", path, "and options:", options, "{process.env.API_BASE_URL}", process.env.API_BASE_URL);
  const response = await fetch(`${process.env.API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });
  console.log("API Fetch response status:", response.status, "for path:", path);
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiError(response.status, body, `API error: ${response.status}`);
  }

  if (response.status === 204) return null as T;
  return response.json();
}

export const apiClient = {
  get: <T>(path: string, options?: FetchOptions) =>
    apiFetch<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body: unknown, options?: FetchOptions) =>
    apiFetch<T>(path, { ...options, method: "POST", body: JSON.stringify(body) }),
  // put, delete...
};

export { ApiError };