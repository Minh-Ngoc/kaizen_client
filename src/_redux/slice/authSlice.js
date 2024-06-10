import { createSlice } from "@reduxjs/toolkit";

const initialState = (key) => {
  const item = window.localStorage.getItem(key);

  return item ? JSON.parse(item) : null;
};

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    userData: initialState("userData"),
    permissions: initialState("permissions"),
    accessToken: initialState("accessToken"),
    role: initialState("role"),
  },
  reducers: {
    handleLogin: (state, action) => {
      state.userData = action.payload.data;
      state.accessToken = action.payload.accessToken;
      state.permissions = action.payload.permissions;
      state.role = action.payload.data?.role;
      localStorage.setItem("userData", JSON.stringify(action.payload.data));
      localStorage.setItem("role", JSON.stringify(action.payload.data?.role));
      localStorage.setItem(
        "permissions",
        JSON.stringify(action.payload.permissions)
      );
      localStorage.setItem(
        "accessToken",
        JSON.stringify(action.payload.accessToken)
      );
    },

    handleLogout: (state) => {
      state.userData = null;
      state.permissions = null;
      state.accessToken = null;

      localStorage.removeItem("userData");
      localStorage.removeItem("permissions");
      localStorage.removeItem("accessToken");
    },

    handleUpdateUserData: (state, action) => {
      state.userData = action.payload;
      const userData = JSON.parse(localStorage.getItem("userData"));
      const finalData = { ...userData, ...action.payload };
      localStorage.setItem("userData", JSON.stringify(finalData));
    },
  },
});

export const {
  handleLogin,
  handleLogout,
  handleUpdateUserData,
} = authSlice.actions;

export default authSlice.reducer;
