import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getAllDepartment,
  getPagingDepartment,
} from "../../services/api.service";
const getAllDepart = createAsyncThunk(
  "/department/get-all-departments",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAllDepartment();
      return data;
    } catch (error) {
      return rejectWithValue({});
    }
  }
);
const getAllPagingDepartment = createAsyncThunk(
  "/department/get-paging-departments",
  async (query, { rejectWithValue }) => {
    try {
      const data = await getPagingDepartment(query);
      return data;
    } catch (error) {
      return rejectWithValue({});
    }
  }
);
export const departmentSlice = createSlice({
  name: "department",
  initialState: {
    isLoading: false,
    listDepartment: [],
    isLoadingpaging: false,
    listDepartmentPaging: [],
    counts: 0,
    totalPages: 1,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllDepart.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllDepart.fulfilled, (state, action) => {
      state.listDepartment = action.payload?.data?.data;
      state.isLoading = false;
    });
    builder.addCase(getAllDepart.rejected, (state, action) => {
      state.isLoading = false;
      state.listDepartment = [];
    });
    builder.addCase(getAllPagingDepartment.pending, (state, action) => {
      state.isLoadingpaging = true;
    });
    builder.addCase(getAllPagingDepartment.fulfilled, (state, action) => {
      state.isLoadingpaging = false;
      console.log(action);
      state.listDepartmentPaging = action.payload?.data?.data?.data ?? [];
      state.counts = action.payload?.data?.data?.totalDoc ?? 0;
      state.totalPages = action.payload?.data?.data?.totalPages ?? 1;
    });
    builder.addCase(getAllPagingDepartment.rejected, (state, action) => {
      state.isLoadingpaging = false;
      state.listDepartmentPaging = [];
      state.totalPages = 1;
      state.counts = 0;
    });
  },
});
export const departmentAction = { getAllDepart, getAllPagingDepartment };
export default departmentSlice.reducer;
