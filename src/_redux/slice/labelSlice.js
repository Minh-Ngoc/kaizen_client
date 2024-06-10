import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { updateLabel } from "services/api.service";
import { getLabelsByTaskId } from "services/api.service";

export const GetLablesByTaskId = createAsyncThunk(
	"/labels/projects",
	async (id, { rejectWithValue }) => {
		try {
			const { data } = await getLabelsByTaskId(id);

			if (data.status === 1) {
				return data?.labels;
			}
		} catch (error) {
			console.log("error: ", error);
			NotifyMessage(
				"Không thể tải thông tin nhãn. Vui lòng tải lại trang!",
				"error"
			);

			return rejectWithValue(error);
		}
	}
);

export const UpdateLabel = createAsyncThunk(
	"/labels/id",
	async ({ id, body }, { rejectWithValue }) => {
		try {
			const { data } = await updateLabel(id, body);

			if (data.status === 1) {
				return data?.label;
			}
		} catch (error) {
			console.log("error: ", error);
			NotifyMessage(
				"Cập nhật nhãn thất bại. Vui lòng thử lại!",
				"error"
			);

			return rejectWithValue(error);
		}
	}
);

export const labelSlice = createSlice({
	name: "labels",
	initialState: {
		label: {},
		labels: [],
		isLoading: false,
	},
	reducers: {
		setLabels: (state, action) => {
			state.labels = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			// Get Paging
			.addCase(GetLablesByTaskId.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(GetLablesByTaskId.fulfilled, (state, action) => {
				state.labels = action.payload;
				state.isLoading = false;
			})
			.addCase(GetLablesByTaskId.rejected, (state) => {
				state.isLoading = false;
			})

			// Update Task
			.addCase(UpdateLabel.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(UpdateLabel.fulfilled, (state, action) => {
				state.label = action.payload;
				state.isLoading = false;
			})
			.addCase(UpdateLabel.rejected, (state) => {
				state.isLoading = false;
			});
	},
});

export const { setLabels } = labelSlice.actions;

export default labelSlice.reducer;
