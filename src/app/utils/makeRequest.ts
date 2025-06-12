'use client';

import axios, { Method, AxiosRequestConfig } from "axios";

interface MakeRequestOptions {
  method?: Method;                    // HTTP method (GET, POST, PUT, DELETE, etc.)
  headers?: Record<string, string>;   // Optional headers
  data?: any;                         // For POST, PUT, etc.
  params?: Record<string, any>;       // Query params
}

export const makeRequest = (endpoint: string, options: MakeRequestOptions = {}): Promise<any> => {
  const { method = 'GET', headers = {}, data, params } = options;

  return axios(endpoint, {
    method,
    headers,
    data,
    params,
    // Optionally add withCredentials for cookies if needed:
    // withCredentials: true
  }).then(res => res.data);
};
