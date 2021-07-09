import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { OrphanedRecordClient } from '../client/api';
import { ApiOrphanedRecord } from '../models/api-response';

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

export const fetchCount = createAsyncThunk(
  `${name}/fetchCount`,
  async (orgId: number) => {
    return OrphanedRecordClient.fetchCount(orgId);
  },
);

export const fetchPage = createAsyncThunk(
  `${name}/fetchPage`,
  async (args: {orgId: number, page: number, limit: number, unit?: string}) => {
    return OrphanedRecordClient.fetchPage(args.orgId, args.page, args.limit, args.unit);
  },
);

export const orphanedSlice = createSlice({
  name,
  initialState: orphanedRecordInitialState,
  reducers: {
    clear: () => {
      return { ...orphanedRecordInitialState};
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchCount.pending, state => {
      state.countLoading = true;
    })
      .addCase(fetchCount.fulfilled, (state, action) => {
        const count = action.payload.count;
        Object.assign(state, { count, countLoading: false, lastUpdated: Date.now()});
      })
      .addCase(fetchCount.rejected, state => {
        state.countLoading = false;
      })
      .addCase(fetchPage.pending, state => {
        state.pageLoading = true;
      })
      .addCase(fetchPage.fulfilled, (state, action) => {
        const {rows, totalRowsCount} = action.payload;
        state.pageLoading = false;
        state.rows = rows;
        state.totalRowsCount = totalRowsCount;
        state.pageLoading = false;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchPage.rejected, state => {
        state.pageLoading = false;
      })
      .addDefaultCase(state => {
        return state;
      });
  },
});

export const OrphanedRecordActions = {
  ...orphanedSlice.actions,
  fetchCount,
  fetchPage,
};
