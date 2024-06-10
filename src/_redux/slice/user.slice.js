import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getPagingUsers, getAllUser } from "../../services/api.service";
const getPagination = createAsyncThunk(
  "/users/get-paging-users",
  async (query, { rejectWithValue }) => {
    try {
      const data = await getPagingUsers(query);
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(data);
        }, 100);
      });
    } catch (error) {
      return rejectWithValue({});
    }
  }
);

export const GetAllUser = createAsyncThunk(
  "/users/get-all-user",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAllUser();
      return data;
    } catch (error) {
      return rejectWithValue({});
    }
  }
);
export const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoading: false,
    listUser: [],
    counts: 0,
    totalPages: 1,
    isLoadingGetAll: false,
    listUserGetAll: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPagination.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getPagination.fulfilled, (state, action) => {
      state.listUser = action.payload?.data?.result?.user ?? [];
      state.isLoading = false;
      state.counts = action.payload?.data?.result?.totalDoc ?? 0;
      state.totalPages = action.payload?.data?.result?.totalPages ?? 1;
    });
    builder.addCase(getPagination.rejected, (state, action) => {
      state.isLoading = false;
      state.listUser = [];
    });
    builder.addCase(GetAllUser.pending, (state, action) => {
      state.isLoadingGetAll = true;
    });
    builder.addCase(GetAllUser.fulfilled, (state, action) => {
      state.isLoadingGetAll = false;

      state.listUserGetAll = action?.payload?.data?.data;
    });
    builder.addCase(GetAllUser.rejected, (state, action) => {
      state.isLoadingGetAll = false;
      state.listUserGetAll = [];
    });
  },
});
export const userAction = { getPagination, GetAllUser };
export default userSlice.reducer;
