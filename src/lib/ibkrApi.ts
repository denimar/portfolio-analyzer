// utils/ibkrApi.ts

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface IBKRApiOptions {
  method?: HttpMethod;
  endpoint: string; // e.g. '/portfolio/{accountId}/positions/0'
  data?: any;       // For POST/PUT bodies
  params?: Record<string, string | number>; // For query params
  headers?: Record<string, string>;
  baseUrl?: string; // Default: 'https://localhost:5000/v1/api'
  cookies?: string; // Pass session cookies if needed
}

export async function ibkrApi<T>({
  method = 'GET',
  endpoint,
  data,
  params,
  headers = {},
  baseUrl = 'https://denimarlab.pro/api',
  cookies,
}: IBKRApiOptions): Promise<T> {
    console.log(`BaseURL: ${baseUrl}`);

  // Construct URL with params
  let url = `${baseUrl}${endpoint}`;
  if (params) {
    const query = new URLSearchParams(params as any).toString();
    url += `?${query}`;
  }

  const fetchOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    // credentials: 'include', // In case you want to send cookies
  };

  // if (cookies) {
    fetchOptions.headers = {
      ...fetchOptions.headers,
      // 'Cookie': '__next_hmr_refresh_hash__=13; SBID=eyth8qwf3p6mau89ohj; device.info=eyJpZCI6ImQ4MDFlZmNmIiwibWFjIjoiMTY6NkQ6RUQ6RjI6OTQ6NjQifQ==; TABID=AM-jg5gdbv6x4q-1749766504453; XYZAB_AM.LOGIN=521f6e23178a1422a7d1e08c891a160eb9476fd0; XYZAB=521f6e23178a1422a7d1e08c891a160eb9476fd0'
    // };
  }

  if (data && method !== 'GET') {
    fetchOptions.body = JSON.stringify(data);
  }

  console.log(`Fetching IBKR API: ${method} ${url}`);
  const res = await fetch(url, fetchOptions);

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`IBKR API error: ${res.status} - ${errorBody}`);
  }

  return res.json();
}
