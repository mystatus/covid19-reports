import {
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import {
  AddSavedLayoutBody,
  GetSavedLayoutsQuery,
  SavedLayoutSerialized,
  UpdateSavedLayoutBody,
} from '@covid19-reports/shared';
import qs from 'qs';
import {
  apiBaseUrl,
  Tag,
} from './api-utils';

export const savedLayoutApi = createApi({
  reducerPath: 'savedLayout',
  baseQuery: fetchBaseQuery({ baseUrl: `${apiBaseUrl}/saved-layout` }),
  tagTypes: [Tag.SavedLayout],
  endpoints: build => ({
    getSavedLayouts: build.query<SavedLayoutSerialized[], {
      orgId: number;
      query: GetSavedLayoutsQuery;
    }>({
      query: ({ orgId, query }) => `${orgId}?${qs.stringify(query)}`,
      providesTags: result => (
        result != null
          ? [
            ...result.map(({ id }) => ({ id, type: Tag.SavedLayout })),
            Tag.SavedLayout,
          ]
          : [Tag.SavedLayout]
      ),
    }),

    addSavedLayout: build.mutation<SavedLayoutSerialized, {
      orgId: number;
      body: AddSavedLayoutBody;
    }>({
      query: ({ orgId, body }) => ({
        url: `${orgId}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [Tag.SavedLayout],
    }),

    updateSavedLayout: build.mutation<SavedLayoutSerialized, {
      orgId: number;
      savedLayoutId: number;
      body: UpdateSavedLayoutBody;
    }>({
      query: ({ orgId, savedLayoutId, body }) => ({
        url: `${orgId}/${savedLayoutId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_, __, { savedLayoutId }) => [{
        type: Tag.SavedLayout,
        id: savedLayoutId,
      }],
    }),

    deleteSavedLayout: build.mutation<SavedLayoutSerialized, {
      orgId: number;
      savedLayoutId: number;
    }>({
      query: ({ orgId, savedLayoutId }) => ({
        url: `${orgId}/${savedLayoutId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [Tag.SavedLayout],
    }),
  }),
});
