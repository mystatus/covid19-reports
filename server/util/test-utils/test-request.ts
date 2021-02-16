import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { User } from '../../api/user/user.model';

export class TestRequest {

  static readonly edipiHeader = 'test-edipi';

  readonly baseUrl = 'http://localhost:4000';
  readonly client: AxiosInstance;
  readonly mock: MockAdapter;

  constructor(basePath: string) {
    this.client = axios.create({
      baseURL: `${this.baseUrl}${basePath}`,
    });
    this.mock = new MockAdapter(axios, {
      onNoMatch: 'passthrough',
    });
  }

  setUser(userOrEdipi: User | string | undefined) {
    let edipi: string | undefined;
    if (typeof userOrEdipi === 'string') {
      edipi = userOrEdipi;
    } else {
      edipi = userOrEdipi?.edipi;
    }

    if (edipi) {
      this.client.defaults.headers[TestRequest.edipiHeader] = edipi;
    } else {
      delete this.client.defaults.headers[TestRequest.edipiHeader];
    }
  }

  async get(path: string, config?: AxiosRequestConfig) {
    const stack = new Error().stack;
    try {
      return await this.client.get(path, config);
    } catch (err) {
      return getAxiosErrorResponse(err, stack);
    }
  }

  async post(path: string, data?: any, config?: AxiosRequestConfig) {
    const stack = new Error().stack;
    try {
      return await this.client.post(path, data, config);
    } catch (err) {
      return getAxiosErrorResponse(err, stack);
    }
  }

  async put(path: string, data?: any, config?: AxiosRequestConfig) {
    const stack = new Error().stack;
    try {
      return await this.client.put(path, data, config);
    } catch (err) {
      return getAxiosErrorResponse(err, stack);
    }
  }

  async patch(path: string, data?: any, config?: AxiosRequestConfig) {
    const stack = new Error().stack;
    try {
      return await this.client.patch(path, data, config);
    } catch (err) {
      return getAxiosErrorResponse(err, stack);
    }
  }

  async delete(path: string, config?: AxiosRequestConfig) {
    const stack = new Error().stack;
    try {
      return await this.client.delete(path, config);
    } catch (err) {
      return getAxiosErrorResponse(err, stack);
    }
  }

}

function getAxiosErrorResponse(err: any, stack: string | undefined) {
  if (err.response?.data?.errors) {
    return err.response as AxiosResponse;
  }

  // The request was rejected before it reached the API, which probably means the url/method was incorrect. Set the
  // original stack here manually, since it'll get blown away otherwise.
  const error = new Error(`${err.message} (the url/method may be incorrect)`);
  error.stack = stack;
  throw error;
}
