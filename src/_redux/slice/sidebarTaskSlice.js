import { createSlice } from "@reduxjs/toolkit";
import { sidebarsList } from "_constants/sidebarsList";

export const sidebarTask = createSlice({
	name: "sidebarTask",
	initialState: {
		items: sidebarsList,
		isOpen: false,
		key: "",
	},
	reducers: {
		setSidebarTask: (state, action) => {
			state.isOpen = action.payload.isOpen;
			state.key = action.payload.key;
		},
		setContentItem: (state, action) => {
			!!state?.items.length &&
				state?.items?.map((item) => {
					if (item.key === action.payload.key) {
						Object.keys(action.payload)?.map((key) => {
							item[key] = action.payload[key];
						});
					}
				});
		},

		setErrorDates: (state, action) => {
			const newItems = state?.items?.map((item) => {
				if (item.key === action.payload.key) {
					return {
						...item,
						error: action.payload.error,
					};
				}

				return item;
			});

			state.items = newItems;
		},

		setInit: (state) => {
			state.items = sidebarsList;
			state.isOpen = false;
			state.key = "";
		},
	},
});

export const { setContentItem, setInit, setErrorDates, setSidebarTask } =
	sidebarTask.actions;

export default sidebarTask.reducer;
