import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {deleteBrand} from "services/api.service";

import {getPagingBrand, getAllBrand} from "services/api.service";

export const getAllBrands = createAsyncThunk(
	"brands/get-all-brand",
	async (_, {rejectWithValue}) => {
		try {
			const res = await getAllBrand();
			return res;
		} catch (error) {
			rejectWithValue({});
		}
	}
);
export const GetPagingBrand = createAsyncThunk(
	"Brand/getBrand",
	async (params) => {
		const pageSize = params?.pageSize || 10;
		const pageIndex = params?.pageIndex || 1;
		const search = params?.search || "";

		const res = await getPagingBrand(pageSize, pageIndex, search);

		return res.data?.result;
	}
);
export const DeleteBrand = createAsyncThunk(
	"delete-brand/deleteBrand",
	async (ids) => {
		const res = await deleteBrand(ids);
		return res.data?.result;
	}
);
const brandSlice = createSlice({
	name: "brand",
	initialState: {
		data: [],
		loading: false,
		totalPage: 0,
		totalDoc: 0,
		listBrands: [],
		isLoadingGetAllBrand: false,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(GetPagingBrand.fulfilled, (state, action) => {
				state.data = action.payload?.result;
				state.totalPage = action.payload?.totalPage;
				state.totalDoc = action.payload?.count;
				state.loading = false;
			})
			.addCase(GetPagingBrand.pending, (state) => {
				state.loading = true;
			})
			.addCase(GetPagingBrand.rejected, (state) => {
				state.data = [];
				state.loading = false;
			})
			.addCase(DeleteBrand.fulfilled, (state, action) => {
				state.data = state.data?.filter(
					(item) => !action.payload?.ids?.includes(item._id)
				);
				state.loading = false;
			})
			.addCase(DeleteBrand.pending, (state) => {
				state.loading = true;
			})
			.addCase(DeleteBrand.rejected, (state) => {
				state.loading = false;
			})
			.addCase(getAllBrands.pending, (state, action) => {
				state.isLoadingGetAllBrand = true;
			})
			.addCase(getAllBrands.fulfilled, (state, action) => {
				state.isLoadingGetAllBrand = true;
				state.listBrands = action.payload?.data?.data;
			})
			.addCase(getAllBrands.rejected, (state, action) => {
				state.isLoadingGetAllBrand = true;
				state.listBrands = [];
			});
	},
});

export default brandSlice.reducer;
