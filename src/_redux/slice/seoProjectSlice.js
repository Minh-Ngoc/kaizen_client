import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {deleteSeoProject} from "services/api.service";

import {getPagingSeoProject} from "services/api.service";

export const GetPagingSeoProject = createAsyncThunk(
	"SeoProject/getSeoProject",
	async (params) => {
		const pageSize = params?.pageSize || 10;
		const pageIndex = params?.pageIndex || 1;
		const search = params?.search || "";

		const res = await getPagingSeoProject(pageSize, pageIndex, search);

		return res.data?.result;
	}
);
export const DeleteSeoProject = createAsyncThunk(
	"delete-seoProject/deleteSeoProject",
	async (ids) => {
		const res = await deleteSeoProject(ids);
		return res.data?.result;
	}
);
const SeoProjectSlice = createSlice({
	name: "seoProject",
	initialState: {
		data: [],
		loading: false,
		totalPage: 0,
		totalDoc: 0,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(GetPagingSeoProject.fulfilled, (state, action) => {
				state.data = action.payload?.result;
				state.totalPage = action.payload?.totalPage;
				state.totalDoc = action.payload?.count;
				state.loading = false;
			})
			.addCase(GetPagingSeoProject.pending, (state) => {
				state.loading = true;
			})
			.addCase(GetPagingSeoProject.rejected, (state) => {
				state.data = [];
				state.loading = false;
			})
			.addCase(DeleteSeoProject.fulfilled, (state, action) => {
				state.data = state.data?.filter(
					(item) => !action.payload?.ids?.includes(item._id)
				);
				state.loading = false;
			})
			.addCase(DeleteSeoProject.pending, (state) => {
				state.loading = true;
			})
			.addCase(DeleteSeoProject.rejected, (state) => {
				state.loading = false;
			});
	},
});

export default SeoProjectSlice.reducer;
