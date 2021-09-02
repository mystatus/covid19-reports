import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from 'axios';
import axiosRetry from 'axios-retry';
import qs from 'qs';

export type PossiblyAbortable = { abort?: () => void };

export type ClientPromise<T = any> = Promise<T> & PossiblyAbortable;
// export type ClientPromise<T = any, R = AxiosResponse<T>> = Promise<R> & PossiblyAbortable;

export type AxiosClient = AxiosInstance & {
  abortable(): {
    request<T = any> (config: AxiosRequestConfig): ClientPromise<T>;
    get<T = any>(url: string, config?: AxiosRequestConfig): ClientPromise<T>;
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): ClientPromise<T>;
  };
};

export function createApiClient(basePath: string): AxiosClient {
  const client: AxiosInstance & Partial<AxiosClient> = axios.create({
    baseURL: `${window.location.origin}/api/${basePath}`,
    headers: {
      Accept: 'application/json',
    },
    paramsSerializer: qs.stringify, // Allow nested objects in querystrings.
  });

  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response.data;
    },
    // eslint-disable-next-line promise/prefer-await-to-callbacks
    (error: AxiosError) => {
      if (error.response) {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw error.response;
      } else if (error.request) {
        throw error.request;
      } else {
        throw new Error(error.message);
      }
    },
  );

  axiosRetry(client, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
  });

  const request = <T>(url: string, method: Method | undefined, config?: AxiosRequestConfig) => {
    let abort: () => void;
    const promise: Promise<T> & Partial<ClientPromise<T>> = client.request({
      cancelToken: new axios.CancelToken(cancel => {
        abort = cancel;
      }),
      url,
      method,
      ...config,
    });
    promise.abort = () => {
      abort?.();
    };
    return promise as ClientPromise<T>;
  };

  client.abortable = () => ({
    request: (config: AxiosRequestConfig) => request(config.url!, config.method, config),
    get: (url: string, config?: AxiosRequestConfig) => request(url, 'get', config),
    post: (url: string, config?: AxiosRequestConfig) => request(url, 'post', config),
  });

  return client as AxiosClient;
}
