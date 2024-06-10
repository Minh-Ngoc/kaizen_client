import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getPagingYourTicket } from "../../services/api.service";
const getAllYourTicketPaging = createAsyncThunk(
  "/tickets/get-paging-ticket",
  async (query, { rejectWithValue }) => {
    try {
      const data = await getPagingYourTicket(query);
      return data;
    } catch (error) {
      return rejectWithValue({});
    }
  }
);
export const yourTicketSlice = createSlice({
  name: "yourTicket",
  initialState: {
    isLoading: false,
    listTicket: [],
    counts: 0,
    totalPages: 1,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllYourTicketPaging.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllYourTicketPaging.fulfilled, (state, action) => {
      state.isLoading = false;
      state.listTicket = action.payload?.data?.data?.data ?? [];
      state.counts = action.payload?.data?.data?.counts || 0;
      state.totalPages = action.payload?.data?.data?.totalPages || 1;
    });
    builder.addCase(getAllYourTicketPaging.rejected, (state, action) => {
      state.isLoading = false;
      state.listTicket = [];
      state.totalPages = 1;
      state.counts = 0;
    });
  },
});
export const yourticketAction = { getAllYourTicketPaging };
export default yourTicketSlice.reducer;
