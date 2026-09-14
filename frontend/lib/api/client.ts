const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api'

// Helper construir query strings limpias
export function buildQuery(params?: Record<string, string | number | boolean | undefined>): string {
  if (!params) return '';
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, String(value));
    }
  });
  const qs = query.toString();
  return qs ? `?${qs}` : '';
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { 
    ...init, 
    headers: { 'Content-Type': 'application/json', ...init?.headers } 
  });
  
  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message = errorBody?.message ?? `API request failed: ${response.status}`;
    throw new Error(Array.isArray(message) ? message.join(', ') : message);
  }
  
  return response.json() as Promise<T>;
}