import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getPagingLog } from "../../services/api.service";
const getAllPagingLog = createAsyncThunk(
  "/action-history/get-paging-action-history",
  async (query, { rejectWithValue }) => {
    try {
      const data = await getPagingLog(query);
      return data;
    } catch (error) {
      return rejectWithValue({});
    }
  }
);
export const logSlice = createSlice({
  name: "log",
  initialState: {
    isLoading: false,
    listLog: [],
    counts: 0,
    totalPages: 1,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllPagingLog.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllPagingLog.fulfilled, (state, action) => {
      state.isLoading = false;
      state.listLog = action.payload?.data?.data?.data ?? [];
      state.counts = action.payload?.data?.data?.counts || 0;
      state.totalPages = action.payload?.data?.data?.totalPages || 1;
    });
    builder.addCase(getAllPagingLog.rejected, (state, action) => {
      state.isLoading = false;
      state.listLog = [];
      state.totalPages = 1;
      state.counts = 0;
    });
  },
});
export const logAction = { getAllPagingLog };
export default logSlice.reducer;
