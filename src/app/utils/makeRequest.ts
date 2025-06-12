'use client'

import axios from "axios";
import { getCookie } from "./getCookie";

export const makeRequest = (endpoint: string): Promise<any> => {
  return axios.get(endpoint, {
    headers: {
      "Authorization": `Bearer ${document.cookie}`
    }
  }).then(res => res.data)
}