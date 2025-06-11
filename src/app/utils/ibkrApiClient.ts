'use client';

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

export async function ibkrApiClient<T>({
  method = 'GET',
  endpoint,
  data,
  params,
  headers = {},
  baseUrl = 'https://localhost:5055/v1/api'
}: IBKRApiOptions): Promise<T> {
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
    credentials: 'include', // In case you want to send cookies
  };

  const cookies = document.cookie; // Get cookies from the browser
  if (cookies) {
    fetchOptions.headers = {
      ...fetchOptions.headers,
      'Cookie': cookies,
    };
  }

  if (data && method !== 'GET') {
    fetchOptions.body = JSON.stringify(data);
  }

  debugger
  const res = await fetch(url, fetchOptions);
  debugger

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`IBKR API error: ${res.status} - ${errorBody}`);
  }

  return res.json();
}
