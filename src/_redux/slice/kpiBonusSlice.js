import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getAllKpiBonuses} from "services/api.service";
import {deleteKpiBonus} from "services/api.service";
import {getPagingKpiBonus} from "services/api.service";
export const getAllKpiBonus = createAsyncThunk(
	"kpibopnus/get-all-kpi-bonus",
	async (_, {rejectWithValue}) => {
		try {
			const res = await getAllKpiBonuses();
			return res;
		} catch (error) {
			rejectWithValue({});
		}
	}
);
export const GetPagingKpiBonus = createAsyncThunk(
	"KpiBonus/getKpiBonus",
	async (params) => {
		const pageSize = params?.pageSize || 10;
		const pageIndex = params?.pageIndex || 1;
		const search = params?.search || "";

		const res = await getPagingKpiBonus(pageSize, pageIndex, search);

		return res.data?.result;
	}
);
export const DeleteKpiBonus = createAsyncThunk(
	"delete-kpi-bonus/deleteKpiBonus",
	async (ids) => {
		const res = await deleteKpiBonus(ids);
		return res.data?.result;
	}
);
const kpiBonusSlice = createSlice({
	name: "kpiBonus",
	initialState: {
		data: [],
		loading: false,
		totalPage: 0,
		totalDoc: 0,
		listKpiBonus: [],
		isLoadingGetAllListKpiBonus: false,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(GetPagingKpiBonus.fulfilled, (state, action) => {
				state.data = action.payload?.result;
				state.totalPage = action.payload?.totalPage;
				state.totalDoc = action.payload?.count;
				state.loading = false;
			})
			.addCase(GetPagingKpiBonus.pending, (state) => {
				state.loading = true;
			})
			.addCase(GetPagingKpiBonus.rejected, (state) => {
				state.data = [];
				state.loading = false;
			})
			.addCase(DeleteKpiBonus.fulfilled, (state, action) => {
				state.data = state.data?.filter(
					(item) => !action.payload?.ids?.includes(item._id)
				);
				state.loading = false;
			})
			.addCase(DeleteKpiBonus.pending, (state) => {
				state.loading = true;
			})
			.addCase(DeleteKpiBonus.rejected, (state) => {
				state.loading = false;
			})
			.addCase(getAllKpiBonus.pending, (state, action) => {
				state.isLoadingGetAllListKpiBonus = false;
			})
			.addCase(getAllKpiBonus.fulfilled, (state, action) => {
				state.isLoadingGetAllListKpiBonus = false;
				state.listKpiBonus = action.payload?.data?.data;
			})
			.addCase(getAllKpiBonus.rejected, (state, action) => {
				state.isLoadingGetAllListKpiBonus = false;
				state.listKpiBonus = [];
			});
	},
});

export default kpiBonusSlice.reducer;
