import axios, { AxiosError, AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';
import { UserRegisterData } from '../actions/user.actions';
import {
  ApiAccessRequest, ApiNotification, ApiRole, ApiRosterColumnInfo, ApiUser, ApiWorkspace,
} from '../models/api-response';

const client = axios.create({
  baseURL: `${window.location.origin}/api/`,
  headers: {
    Accept: 'application/json',
  },
});


client.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    if (error.response) {
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

export namespace AccessRequestClient {
  export const fetchAll = (orgId: number): Promise<ApiAccessRequest[]> => {
    return client.get(`access-request/${orgId}`);
  };
}

export namespace NotificationClient {
  export const fetchAll = (orgId: number): Promise<ApiNotification[]> => {
    return client.get(`notification/${orgId}/all`);
  };
}

export namespace RoleClient {
  export const fetchAll = (orgId: number): Promise<ApiRole[]> => {
    return client.get(`role/${orgId}`);
  };
}

export namespace RosterClient {
  export const fetchColumns = (orgId: number): Promise<ApiRosterColumnInfo[]> => {
    return client.get(`roster/${orgId}/column`);
  };
  export const upload = (orgId: number, file: File): Promise<number> => {
    const formData = new FormData();
    formData.append('roster_csv', file);
    return client.post(`api/roster/${orgId}/bulk`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };
}

export namespace UserClient {
  export const current = (): Promise<ApiUser> => {
    return client.get(`user/current`);
  };

  export const fetchAll = (orgId: number): Promise<ApiUser[]> => {
    return client.get(`user/${orgId}`);
  };

  export const register = (data: UserRegisterData): Promise<ApiUser> => {
    return client.post(`user`, data);
  };
}

export namespace WorkspaceClient {
  export const fetchAll = (orgId: number): Promise<ApiWorkspace[]> => {
    return client.get(`workspaces/${orgId}`);
  };
}

export default client;
