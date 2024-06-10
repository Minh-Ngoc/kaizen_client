import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {deleteBlog} from "services/api.service";

import {getPagingBlog} from "services/api.service";

export const GetPagingBlog = createAsyncThunk(
	"blog/getBlog",
	async (params) => {
		const pageSize = params?.pageSize || 10;
		const pageIndex = params?.pageIndex || 1;
		const search = params?.search || "";

		const res = await getPagingBlog(pageSize, pageIndex, search);

		return res.data?.result;
	}
);
export const DeleteBlog = createAsyncThunk(
	"delete-blog/deleteBlog",
	async (ids) => {
		const res = await deleteBlog(ids);
		return res.data?.result;
	}
);
const blogSlice = createSlice({
	name: "Blog",
	initialState: {
		data: [],
		loading: false,
		totalPage: 0,
		totalDoc: 0,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(GetPagingBlog.fulfilled, (state, action) => {
				state.data = action.payload?.result;
				state.totalPage = action.payload?.totalPage;
				state.totalDoc = action.payload?.count;
				state.loading = false;
			})
			.addCase(GetPagingBlog.pending, (state) => {
				state.loading = true;
			})
			.addCase(GetPagingBlog.rejected, (state) => {
				state.data = [];
				state.loading = false;
			})
			.addCase(DeleteBlog.fulfilled, (state, action) => {
				state.data = state.data?.filter(
					(item) => !action.payload?.ids?.includes(item._id)
				);
				state.loading = false;
			})
			.addCase(DeleteBlog.pending, (state) => {
				state.loading = true;
			})
			.addCase(DeleteBlog.rejected, (state) => {
				state.loading = false;
			});
	},
});

export default blogSlice.reducer;
