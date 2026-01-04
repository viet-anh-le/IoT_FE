import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
} from "axios";
import axios from "axios";

class AxiosBuilder {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create();
  }

  public setBaseUrl(baseUrl: AxiosInstance["defaults"]["baseURL"]) {
    this.instance.defaults.baseURL = baseUrl;
    return this;
  }

  public setHeaders(headers: Record<string, AxiosRequestHeaders>) {
    this.instance.defaults.headers.common = {
      ...this.instance.defaults.headers.common,
      ...headers,
    };

    return this;
  }

  public addInterceptor(interceptor: any) {
    this.instance.interceptors.request.use(interceptor);
    return this;
  }

  public setResponseInterceptor(interceptor: any) {
    this.instance.interceptors.response.use(interceptor, undefined);
    return this;
  }

  public setErrorInterceptor<T>(interceptor: (error: T) => Promise<T> | void) {
    this.instance.interceptors.response.use(undefined, interceptor);
    return this;
  }

  public setToken(token: string) {
    this.setHeaders({
      Authorization: `Bearer ${token}`,
    } as AxiosRequestHeaders);
    return this;
  }

  public get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.get(url, config);
  }

  public post<T>(
    url: string,
    data: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.post(url, data, config);
  }

  public put<T>(
    url: string,
    data: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.put(url, data, config);
  }

  public patch<T>(
    url: string,
    data?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.patch(url, data, config);
  }

  public delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.delete(url, config);
  }

  public build(): AxiosInstance {
    return this.instance;
  }
}

const axiosBuilder = new AxiosBuilder();
export default axiosBuilder;
