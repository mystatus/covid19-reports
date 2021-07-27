import {
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import { GetOrphanedRecordsQuery } from '@covid19-reports/shared';
import { ApiOrphanedRecord } from '../models/api-response';
import { OrphanedRecordClient } from '../client/orphaned-record.client';
import {
  assign,
  exportSlice,
} from '../utility/redux-utils';

export interface OrphanedRecordState {
  rows: ApiOrphanedRecord[],
  totalRowsCount: number
  count: number
  countLoading: boolean
  pageLoading: boolean
  lastUpdated: number
}

export const orphanedRecordInitialState: OrphanedRecordState = {
  rows: [],
  totalRowsCount: 0,
  count: 0,
  countLoading: false,
  pageLoading: false,
  lastUpdated: 0,
};

const name = 'orphanedRecord';

const thunks = {
  fetchCount: createAsyncThunk(
    `${name}/fetchCount`,
    async (args: { orgId: number }) => {
      return OrphanedRecordClient.getOrphanedRecordsCount(args.orgId);
    },
  ),

  fetchPage: createAsyncThunk(
    `${name}/fetchPage`,
    async (args: {
      orgId: number
      query: GetOrphanedRecordsQuery
    }) => {
      return OrphanedRecordClient.getOrphanedRecords(args.orgId, args.query);
    },
  ),
};

export const orphanedRecordSlice = createSlice({
  name,
  initialState: orphanedRecordInitialState,
  reducers: {
    clear: () => orphanedRecordInitialState,
  },
  extraReducers: builder => builder
    .addCase(thunks.fetchCount.pending, state => {
      state.countLoading = true;
    })
    .addCase(thunks.fetchCount.fulfilled, (state, { payload }) => {
      const { count } = payload;
      assign(state, {
        count,
        countLoading: false,
        lastUpdated: Date.now(),
      });
    })
    .addCase(thunks.fetchCount.rejected, state => {
      state.countLoading = false;
    })
    .addCase(thunks.fetchPage.pending, state => {
      state.pageLoading = true;
    })
    .addCase(thunks.fetchPage.fulfilled, (state, { payload }) => {
      const { rows, totalRowsCount } = payload;
      assign(state, {
        rows,
        totalRowsCount,
        pageLoading: false,
        lastUpdated: Date.now(),
      });
    })
    .addCase(thunks.fetchPage.rejected, state => {
      state.pageLoading = false;
    }),
});

export const OrphanedRecordActions = exportSlice(orphanedRecordSlice, thunks);
