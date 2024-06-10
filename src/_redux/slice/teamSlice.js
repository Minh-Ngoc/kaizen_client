import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteTeam } from "services/api.service";

import { getPagingTeam, getAllTeam } from "services/api.service";

export const getAllTeams = createAsyncThunk(
  "teams/get-all-team",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllTeam();
      return res;
    } catch (error) {
      rejectWithValue({});
    }
  }
);
export const GetPagingTeam = createAsyncThunk(
  "team/getTeam",
  async (params) => {
    const pageSize = params?.pageSize || 10;
    const pageIndex = params?.pageIndex || 1;
    const search = params?.search || "";

    const res = await getPagingTeam(pageSize, pageIndex, search);

    return res.data?.result;
  }
);
export const DeleteTeam = createAsyncThunk(
  "delete-team/deleteTeam",
  async (ids) => {
    const res = await deleteTeam(ids);
    return res.data?.result;
  }
);
const teamSlice = createSlice({
  name: "team",
  initialState: {
    data: [],
    loading: false,
    totalPage: 0,
    totalDoc: 0,
    listTeam: [],
    isLoadingGetAllTeam: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetPagingTeam.fulfilled, (state, action) => {
        state.data = action.payload?.result;
        state.totalPage = action.payload?.totalPage;
        state.totalDoc = action.payload?.totalDoc;
        state.loading = false;
      })
      .addCase(GetPagingTeam.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetPagingTeam.rejected, (state) => {
        state.data = [];
        state.loading = false;
      })
      .addCase(DeleteTeam.fulfilled, (state, action) => {
        state.data = state.data?.filter(
          (item) => !action.payload?.ids?.includes(item._id)
        );
        state.loading = false;
      })
      .addCase(DeleteTeam.pending, (state) => {
        state.loading = true;
      })
      .addCase(DeleteTeam.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getAllTeams.pending, (state, action) => {
        state.isLoadingGetAllTeam = true;
      })
      .addCase(getAllTeams.fulfilled, (state, action) => {
        state.isLoadingGetAllTeam = true;
        state.listTeam = action.payload?.data?.data;
      })
      .addCase(getAllTeams.rejected, (state, action) => {
        state.isLoadingGetAllTeam = true;
        state.listTeam = [];
      });
  },
});

export default teamSlice.reducer;
