import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import NotifyMessage from "_utils/notify";
import { deleteDayOff } from "services/api.service";
import { getPagingDayOff, updateDayOff } from "services/api.service";

export const GetDayOff = createAsyncThunk(
	"/day-off/get",
	async (query, { rejectWithValue }) => {
        try {
			const { data } = await getPagingDayOff(query);

			if (data.status === 1) {
                return {
                    total: data?.total,
                    dayOff: data?.dayOff
                };
			}
		} catch (error) {
			console.log("error: ", error);
			NotifyMessage(
				"Không thể tải thông tin ngày nghỉ. Vui lòng tải lại trang!"
			);
			return rejectWithValue(error);
		}
	}
);

export const UpdateDayOff = createAsyncThunk(
	"/day-off/update",
	async ({ id, body }, { rejectWithValue }) => {
        try {
			const { data } = await updateDayOff(id, body);

			if (data.status === 1) {
                NotifyMessage(
                    "Cập nhật thông tin ngày nghỉ thành công!", "success"
                );

                return data?.data;
			}
		} catch (error) {
			console.log("error: ", error);
			NotifyMessage(
				"Không thể cập nhật thông tin ngày nghỉ. Vui lòng thử lại!", "error"
			);
			return rejectWithValue(error);
		}
	}
);

export const DeleteDayOff = createAsyncThunk(
	"/day-off/delete",
	async (id, { rejectWithValue }) => {
        try {
			const { data } = await deleteDayOff(id);

			if (data.status === 1) {
                NotifyMessage(
                    "Xóa ngày nghỉ thành công.!", "success"
                );

                return id;
			}
		} catch (error) {
			console.log("error: ", error);
			NotifyMessage(
				"Không thể cập nhật thông tin ngày nghỉ. Vui lòng thử lại!", "error"
			);
			return rejectWithValue(error);
		}
	}
);

export const dayOffSlice = createSlice({
	name: "dayOff",
	initialState: {
		dayOffsList: [],
        isLoading: false,
        total: 0,
	},
	reducers: {
        addDayOff: (state, action) => {
            state.dayOffsList = [...state.dayOffsList, action.payload];
        }
    },
    extraReducers: (builder) => {
		builder
			// Get Paging
			.addCase(GetDayOff.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(GetDayOff.fulfilled, (state, action) => {
				state.dayOffsList = action.payload.dayOff;
				state.total = action.payload.total;
				state.isLoading = false;
			})
			.addCase(GetDayOff.rejected, (state, action) => {
				state.isLoading = false;
			})

            // Update
			.addCase(UpdateDayOff.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(UpdateDayOff.fulfilled, (state, action) => {
				const newData = state.dayOffsList?.map(
                    item => {
                        if(item?._id === action.payload._id) {
                            return action.payload;
                        }

                        return item;
                    }
                );

                state.dayOffsList = newData;
				state.isLoading = false;
			})
			.addCase(UpdateDayOff.rejected, (state, action) => {
				state.isLoading = false;
			})

            // Delete
			.addCase(DeleteDayOff.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(DeleteDayOff.fulfilled, (state, action) => {
				const newData = state.dayOffsList.filter(
					(item) => item._id !== action.payload
				);

				state.dayOffsList = newData;
				state.total = Number(state.total) - 1;
				state.isLoading = false;
			})
			.addCase(DeleteDayOff.rejected, (state) => {
				state.isLoading = false;
			});
        }

    });
    
export const { addDayOff } = dayOffSlice.actions;

export default dayOffSlice.reducer;
