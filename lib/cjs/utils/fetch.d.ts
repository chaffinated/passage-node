declare const _default: typeof fetch;
export default _default;
interface AxiosResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: any;
  request?: any;
  error?: any;
}
export declare const axios: {
  get(url: string, config?: RequestInit): Promise<AxiosResponse<any>>;
  patch<T = any>(
    url: string,
    data: T,
    config?: RequestInit
  ): Promise<AxiosResponse<any>>;
  put<T_1 = any>(
    url: string,
    data: T_1,
    config?: RequestInit
  ): Promise<AxiosResponse<any>>;
  post<T_2 = any>(
    url: string,
    data: T_2,
    config?: RequestInit
  ): Promise<AxiosResponse<any>>;
  delete(url: string, config?: RequestInit): Promise<AxiosResponse<any>>;
};
