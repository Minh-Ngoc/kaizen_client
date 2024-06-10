import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllRole, getAllRoleCountUsers } from "../../services/api.service";
const getAllRoles = createAsyncThunk(
  "/roles/get-all-roles",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAllRole();
      return data;
    } catch (error) {
      return rejectWithValue({});
    }
  }
);
const GetAllRolesCounterUser = createAsyncThunk(
  "/roles/get-all-roles-counter-user",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAllRoleCountUsers();
      return data;
    } catch (error) {
      return rejectWithValue({});
    }
  }
);
export const roleSlice = createSlice({
  name: "role",
  initialState: {
    isLoading: false,
    listRole: [],
  },
  reducers: {
    removeRoleById: (state, action) => {
      state.listRole = state.listRole.filter(
        (role) => role?._id !== action.payload
      );
    },
    addNewRole: (state, action) => {
      state.listRole.push(action.payload);
    },
    updateNameByRoleId: (state, action) => {
      let thatRole = state.listRole.find(
        (role) => role._id === action.payload?.id
      );
      const index = state.listRole.findIndex(
        (role) => role._id === action.payload?.id
      );
      if (thatRole && index !== -1) {
        thatRole = { ...thatRole, name: action.payload?.name };
        state.listRole[index] = thatRole;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllRoles.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllRoles.fulfilled, (state, action) => {
      state.listRole = action.payload.data?.data;
      state.isLoading = false;
    });
    builder.addCase(getAllRoles.rejected, (state, action) => {
      state.isLoading = false;
      state.listRole = [];
    });
    builder.addCase(GetAllRolesCounterUser.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(GetAllRolesCounterUser.fulfilled, (state, action) => {
      state.listRole = action.payload.data?.data;
      state.isLoading = false;
    });
    builder.addCase(GetAllRolesCounterUser.rejected, (state, action) => {
      state.isLoading = false;
      state.listRole = [];
    });
  },
});
export const {
  removeRoleById,
  addNewRole,
  updateNameByRoleId,
} = roleSlice.actions;
export const roleAction = { getAllRoles, GetAllRolesCounterUser };
export default roleSlice.reducer;
