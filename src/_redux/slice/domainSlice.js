import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getpagingDomain } from "../../services/api.service";
const getAllPagingDomain = createAsyncThunk(
  "/domain/get-paging-domain",
  async (query, { rejectWithValue }) => {
    try {
      const data = await getpagingDomain(query);
      return data;
    } catch (error) {
      return rejectWithValue({});
    }
  }
);
export const domainSlice = createSlice({
  name: "domain",
  initialState: {
    isLoading: false,
    listDomain: [],
    counts: 0,
    totalPages: 1,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllPagingDomain.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllPagingDomain.fulfilled, (state, action) => {
      console.log(action);
      state.isLoading = false;
      state.listDomain = action.payload?.data?.data ?? [];
      state.counts = action.payload?.data?.total ?? 0;
      state.totalPages = action.payload?.data?.totalPage ?? 1;
    });
    builder.addCase(getAllPagingDomain.rejected, (state, action) => {
      state.isLoading = false;
      state.listDomain = [];
      state.totalPages = 1;
      state.counts = 0;
    });
  },
});
export const domainAction = { getAllPagingDomain };
export default domainSlice.reducer;
