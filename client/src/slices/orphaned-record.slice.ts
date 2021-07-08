import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {OrphanedRecordClient} from '../client/api';
import {ApiOrphanedRecord} from '../models/api-response';

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

export const fetchOrphanedRecordCount = createAsyncThunk(
  'orphanedRecord/fetchCount',
  async (orgId: number) => {
    return OrphanedRecordClient.fetchCount(orgId);
  },
);

export const fetchOrphanedRecordPage = createAsyncThunk(
  'orphanedRecord/fetchPage',
  async (args: {orgId: number, page: number, limit: number, unit?: string}) => {
    return OrphanedRecordClient.fetchPage(args.orgId, args.page, args.limit, args.unit);
  },
);

export const orphanedSlice = createSlice({
  name: 'orphanedRecord',
  initialState: orphanedRecordInitialState as OrphanedRecordState,
  reducers: {
    clear: () => {
      return { ...orphanedRecordInitialState};
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchOrphanedRecordCount.pending, state => {
      return {
        ...state,
        countLoading: true,
      };
    })
      .addCase(fetchOrphanedRecordCount.fulfilled, (state, action) => {
        const count = action.payload.count;
        return {
          ...state,
          count,
          countLoading: false,
          lastUpdated: Date.now(),
        };
      })
      .addCase(fetchOrphanedRecordCount.rejected, state => {
        return {
          ...state,
          countLoading: false,
        };
      })
      .addCase(fetchOrphanedRecordPage.pending, state => {
        return {
          ...state,
          pageLoading: true,
        };
      })
      .addCase(fetchOrphanedRecordPage.fulfilled, (state, action) => {
        const {rows, totalRowsCount} = action.payload;
        return {
          ...state,
          rows,
          totalRowsCount,
          pageLoading: false,
          lastUpdated: Date.now(),
        };
      })
      .addCase(fetchOrphanedRecordPage.rejected, state => {
        return {
          ...state,
          pageLoading: false,
        };
      })
      .addDefaultCase(state => {
        return state;
      });
  },
});

export const OrphanedRecordActions = orphanedSlice.actions;
export default orphanedSlice.reducer;
