import { AxiosError } from "axios";
import { merge } from "lodash";
import f from "cross-fetch";
import config from "./config.json";

if (typeof globalThis !== "undefined" && globalThis.fetch == null) {
  globalThis.fetch = f;
}

export default globalThis.fetch;

const requestConfig = {
  headers: { "Passage-Version": config.version },
};

/**
 * Combine data and request config into one object for fetch
 * @param {string} method
 * @param {any} data
 * @param {RequestInit[]} configs
 * @return {any}
 */
function mergeConfigWithMethod(
  method: string = "GET",
  data?: any,
  ...configs: RequestInit[]
): any {
  const d = data ? { body: JSON.stringify(data) } : {};
  const m = merge({}, requestConfig, ...configs, d, { method });
  return m;
}

interface AxiosResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: any;
  request?: any;
  error?: any;
}

/**
 * convert Response to Axios-like response
 * @param {any} response
 * @return {Promise<AxiosResponse<any>>}
 */
async function makeAxiosResponse(
  response: Promise<Response>
): Promise<AxiosResponse> {
  const res = await response;
  const r: AxiosResponse = {
    data: null,
    status: res.status,
    statusText: res.statusText,
    headers: res.headers,
    config: requestConfig,
    request: null,
  };

  try {
    if (res.headers.get("Content-Type")?.startsWith("application/json")) {
      r.data = await res.json();
    } else {
      r.data = await res.text();
    }
  } catch (err: any) {
    const e = new AxiosError(
      err.message,
      r.statusText,
      undefined,
      undefined,
      r
    );
    r.error = e;
  }

  return r;
}

export const axios = {
  get(url: string, config: RequestInit = {}): Promise<AxiosResponse<any>> {
    const c = mergeConfigWithMethod("GET", undefined, config);
    return makeAxiosResponse(fetch(url, c));
  },
  patch<T = any>(
    url: string,
    data: T,
    config: RequestInit = {}
  ): Promise<AxiosResponse<any>> {
    const c = mergeConfigWithMethod("PATCH", data, config);
    return makeAxiosResponse(fetch(url, c));
  },
  put<T = any>(
    url: string,
    data: T,
    config: RequestInit = {}
  ): Promise<AxiosResponse<any>> {
    const c = mergeConfigWithMethod("PUT", data, config);
    return makeAxiosResponse(fetch(url, c));
  },
  post<T = any>(
    url: string,
    data: T,
    config: RequestInit = {}
  ): Promise<AxiosResponse<any>> {
    const c = mergeConfigWithMethod("POST", data, config);
    return makeAxiosResponse(fetch(url, c));
  },
  delete(url: string, config: RequestInit = {}): Promise<AxiosResponse<any>> {
    const c = mergeConfigWithMethod("DELETE", undefined, config);
    return makeAxiosResponse(fetch(url, c));
  },
};
