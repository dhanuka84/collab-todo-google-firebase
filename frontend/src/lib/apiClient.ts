import { useAuth } from "./authContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export const useApi = () => {
  const { getIdToken } = useAuth();

  const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
    const token = await getIdToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
    if (!res.ok) {
      let errorMessage = res.statusText;
      try {
        const errorBody = await res.json();
        if (errorBody.error) errorMessage = errorBody.error;
      } catch {
        // ignore
      }
      throw new Error(errorMessage);
    }
    if (res.status === 204) return undefined as unknown as T;
    return res.json();
  };

  return {
    get: <T>(path: string) => request<T>(path),
    post: <T>(path: string, body?: unknown) =>
      request<T>(path, { method: "POST", body: JSON.stringify(body) }),
    patch: <T>(path: string, body?: unknown) =>
      request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
    del: <T>(path: string) => request<T>(path, { method: "DELETE" })
  };
};
