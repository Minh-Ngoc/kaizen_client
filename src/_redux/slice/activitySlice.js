import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {deleteActivity} from "services/api.service";

import {getPagingActivity} from "services/api.service";

export const GetPagingActivity = createAsyncThunk(
	"activity/getActivity",
	async (params) => {
		const pageSize = params?.pageSize || 10;
		const pageIndex = params?.pageIndex || 1;
		const search = params?.search || "";

		const res = await getPagingActivity(pageSize, pageIndex, search);

		return res.data?.result;
	}
);
export const DeleteActivity = createAsyncThunk(
	"delete-activity/deleteActivity",
	async (ids) => {
		const res = await deleteActivity(ids);
		return res.data?.result;
	}
);
const ActivitySlice = createSlice({
	name: "Activity",
	initialState: {
		data: [],
		loading: false,
		totalPage: 0,
		totalDoc: 0,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(GetPagingActivity.fulfilled, (state, action) => {
				state.data = action.payload?.result;
				state.totalPage = action.payload?.totalPage;
				state.totalDoc = action.payload?.count;
				state.loading = false;
			})
			.addCase(GetPagingActivity.pending, (state) => {
				state.loading = true;
			})
			.addCase(GetPagingActivity.rejected, (state) => {
				state.data = [];
				state.loading = false;
			})
			.addCase(DeleteActivity.fulfilled, (state, action) => {
				state.data = state.data?.filter(
					(item) => !action.payload?.ids?.includes(item._id)
				);
				state.loading = false;
			})
			.addCase(DeleteActivity.pending, (state) => {
				state.loading = true;
			})
			.addCase(DeleteActivity.rejected, (state) => {
				state.loading = false;
			});
	},
});

export default ActivitySlice.reducer;
