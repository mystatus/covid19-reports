import {
  AddCustomColumnBody,
  ColumnInfo,
  EntityType,
  GetEntitiesQuery,
  ObservationEntryData,
  Paginated,
  RosterEntryData,
} from '@covid19-reports/shared';
import {
  BaseQueryFn,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/dist/query/react';
import _ from 'lodash';
import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import qs from 'qs';

export const apiBaseUrl = `${window.location.origin}/api/`;

export enum Tag {
  SavedLayout = 'SavedLayout',
}

export type EntityTypeData = {
  roster: RosterEntryData;
  observation: ObservationEntryData;
};

export function createEntityApi<TEntity extends EntityType>(
  args: {
    entityType: TEntity;
    hasVersionedColumns?: boolean;
  },
) {
  const { entityType, hasVersionedColumns } = args;

  return createApi({
    reducerPath: entityType,
    tagTypes: [entityType],
    baseQuery: fetchBaseQuery({
      baseUrl: `${apiBaseUrl}${_.kebabCase(entityType)}/`,
    }),
    endpoints: build => buildEntityEndpoints(build, entityType, hasVersionedColumns),
  });
}

function buildEntityEndpoints<TEntity extends EntityType, TEntityData extends EntityTypeData[TEntity]>(
  build: EndpointBuilder<BaseQueryFn, string, string>,
  entityType: TEntity,
  hasVersionedColumns?: boolean,
) {
  return {
    getColumnsInfo: build.query<ColumnInfo[], {
      orgId: number;
    }>({
      query: ({ orgId }) => `${orgId}/column`,
    }),

    getAllowedColumnsInfo: build.query<ColumnInfo[], {
      orgId: number;
      includeRelationships?: boolean;
      version?: string;
    }>({
      query: ({ orgId, includeRelationships = true, version = 'es6ddssymptomobs' }) => {
        return `${orgId}/allowed-column${hasVersionedColumns ? `/${version}` : ''}${!includeRelationships ? '?includeRelationships=false' : ''}`;
      },
    }),

    addCustomColumn: build.mutation<ColumnInfo, {
      orgId: number;
      body: AddCustomColumnBody;
    }>({
      query: ({ orgId, body }) => ({
        url: `${orgId}/column`,
        method: 'POST',
        body,
      }),
    }),

    getEntities: build.query<Paginated<TEntityData>, {
      orgId: number;
      query: GetEntitiesQuery;
    }>({
      query: ({ orgId, query }) => `${orgId}?${qs.stringify(query)}`,
      providesTags: [entityType],
    }),

    addEntity: build.mutation<TEntityData, {
      orgId: number;
      body: Partial<TEntityData>;
    }>({
      query: ({ orgId, body }) => ({
        url: `${orgId}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [entityType],
    }),

    patchEntity: build.mutation<TEntityData, {
      orgId: number;
      entityId: number;
      body: Partial<TEntityData>;
    }>({
      query: ({ orgId, entityId, body }) => ({
        url: `${orgId}/${entityId}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [entityType],
    }),

    deleteEntity: build.mutation<TEntityData, {
      orgId: number;
      entityId: number;
    }>({
      query: ({ orgId, entityId }) => ({
        url: `${orgId}/${entityId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [entityType],
    }),
  };
}
