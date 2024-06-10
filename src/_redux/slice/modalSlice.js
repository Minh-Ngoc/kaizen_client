import { createSlice } from "@reduxjs/toolkit";

export const modalSlice = createSlice({
	name: "modal",
	initialState: {
		isOpen: false,
		title: "",
		body: "",
		textConfirm: "Xác nhận",
		textCancel: "Đóng",
		onConfirm: () => {},
		onCancel: () => {},
		openConfirm: true,
		openCancel: true,
		maxWidth: "",
		bg: "bg-modal",
		isLoading: false,
		isDismissable: true,
		header: '',
		hideCloseButton: false,
		classNames: '',
		isFocused: false,
		backdrop: 'opaque'
	},
	reducers: {
		onClose: (state, action) => {
			state.isOpen = false;
			state.title = "";
			state.body = "";
		},
		setModal: (state, action) => {
			Object.keys(action.payload)?.map((key) => {
				state[key] = action.payload[key];
			});
		},
	},
});

export const { onClose, setModal } = modalSlice.actions;

export default modalSlice.reducer;
