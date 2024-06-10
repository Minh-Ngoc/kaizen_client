import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {deleteSeo} from "services/api.service";

import {getPagingSeo} from "services/api.service";

export const GetPagingSeo = createAsyncThunk("seo/getSeo", async (params) => {
	const pageSize = params?.pageSize || 10;
	const pageIndex = params?.pageIndex || 1;
	const search = params?.search || "";

	const res = await getPagingSeo(pageSize, pageIndex, search);

	return res.data?.result;
});
export const DeleteSeo = createAsyncThunk(
	"delete-Seo/deleteSeo",
	async (ids) => {
		const res = await deleteSeo(ids);
		return res.data?.result;
	}
);
const seoSlice = createSlice({
	name: "seo",
	initialState: {
		data: [],
		loading: false,
		totalPage: 0,
		totalDoc: 0,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(GetPagingSeo.fulfilled, (state, action) => {
				state.data = action.payload?.result;
				state.totalPage = action.payload?.totalPage;
				state.totalDoc = action.payload?.totalDoc;
				state.loading = false;
			})
			.addCase(GetPagingSeo.pending, (state) => {
				state.loading = true;
			})
			.addCase(GetPagingSeo.rejected, (state) => {
				state.data = [];
				state.loading = false;
			})
			.addCase(DeleteSeo.fulfilled, (state, action) => {
				state.data = state.data?.filter(
					(item) => !action.payload?.ids?.includes(item._id)
				);
				state.loading = false;
			})
			.addCase(DeleteSeo.pending, (state) => {
				state.loading = true;
			})
			.addCase(DeleteSeo.rejected, (state) => {
				state.loading = false;
			});
	},
});

export default seoSlice.reducer;
