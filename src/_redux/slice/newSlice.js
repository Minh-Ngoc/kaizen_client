import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {updateNew} from "services/api.service";
import {deleteNew} from "services/api.service";
import {addNew} from "services/api.service";
import {getNewById} from "services/api.service";
import {getPagingNew} from "services/api.service";

export const GetPagingNew = createAsyncThunk("new/getNew", async (params) => {
	const pageSize = params?.pageSize || 10;
	const pageIndex = params?.pageIndex || 1;
	const search = params?.search || "";

	const res = await getPagingNew(pageSize, pageIndex, search);

	return res.data?.result;
});
export const GetNewById = createAsyncThunk("new/getNewById", async (id) => {
	const res = await getNewById(id);
	return res.data.data;
});
export const AddNew = createAsyncThunk("add-new-new/addNew", async (body) => {
	const res = await addNew(body);
	return res.data.data;
});
export const UpdateNew = createAsyncThunk(
	"update-new/updateNew",
	async ({id, body}) => {
		const res = await updateNew(id, body);

		return res.data.data;
	}
);

export const DeleteNew = createAsyncThunk(
	"delete-new/deleteNew",
	async (ids) => {
		const res = await deleteNew(ids);
		return res.data?.result;
	}
);

const newSlice = createSlice({
	name: "new",
	initialState: {
		data: [],
		loading: false,
		totalPage: 0,
		totalDoc: 0,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(GetPagingNew.fulfilled, (state, action) => {
				state.data = action.payload?.result;
				state.totalPage = action.payload?.totalPage;
				state.totalDoc = action.payload?.count;
				state.loading = false;
			})
			.addCase(GetPagingNew.pending, (state) => {
				state.loading = true;
			})
			.addCase(GetPagingNew.rejected, (state) => {
				state.data = [];
				state.loading = false;
			})
			.addCase(AddNew.fulfilled, (state, action) => {
				state.data = [...state.data, action.payload];
				state.loading = false;
			})
			.addCase(AddNew.pending, (state) => {
				state.loading = true;
			})
			.addCase(AddNew.rejected, (state) => {
				state.loading = false;
			})
			.addCase(UpdateNew.fulfilled, (state, action) => {
				state.data = state.data.map((item) => {
					if (item.id == action.payload?.data?.id) {
						item = action.payload?.data;
					}
					return item;
				});
				state.loading = false;
			})
			.addCase(UpdateNew.pending, (state) => {
				state.loading = true;
			})
			.addCase(UpdateNew.rejected, (state) => {
				state.loading = false;
			})
			.addCase(DeleteNew.fulfilled, (state, action) => {
				state.data = state.data?.filter(
					(item) => !action.payload?.ids?.includes(item._id)
				);
				state.loading = false;
			})
			.addCase(DeleteNew.pending, (state) => {
				state.loading = true;
			})
			.addCase(DeleteNew.rejected, (state) => {
				state.loading = false;
			});
	},
});

// export const {selectWithdraw} = NewSlice.actions;

export default newSlice.reducer;
