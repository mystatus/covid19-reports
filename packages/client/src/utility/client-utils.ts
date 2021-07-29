import axios, {
  AxiosError,
  AxiosResponse,
} from 'axios';
import axiosRetry from 'axios-retry';

export function createApiClient(basePath: string) {
  const client = axios.create({
    baseURL: `${window.location.origin}/api/${basePath}`,
    headers: {
      Accept: 'application/json',
    },
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

  return client;
}
