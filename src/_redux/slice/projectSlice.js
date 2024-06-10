import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {
	getPagingProjectSearch,
	deleteProjectById,
	updateProject,
	getProjectById,
} from "services/api.service";
import NotifyMessage from "_utils/notify";

export const GetPagingProject = createAsyncThunk(
	"/projects/get-paging",
	async (query, {rejectWithValue}) => {
		try {
			const {data} = await getPagingProjectSearch(query);

			if (data.status === 1) {
				return {
					total: data?.total,
					projects: data?.projects,
				};
			}
		} catch (error) {
			console.log("error: ", error);
			// NotifyMessage(
			// 	"Không thể tải thông tin dự án. Vui lòng tải lại trang!",
			// 	"error"
			// );

			return rejectWithValue(error);
		}
	}
);

export const GetByProjectId = createAsyncThunk(
	"/projects/get-by-id",
	async (id, {rejectWithValue}) => {
		try {
			const {data} = await getProjectById(id);

			if (data.status === 1) {
				return data?.project;
			}
		} catch (error) {
			console.log("error: ", error);
			// NotifyMessage(
			// 	"Không thể tải thông tin dự án. Vui lòng tải lại trang!",
			// 	"error"
			// );

			return rejectWithValue(error);
		}
	}
);

export const UpdateProject = createAsyncThunk(
	"/projects/update",
	async ({id, body}, {rejectWithValue}) => {
		try {
			const {data} = await updateProject(id, body);

			if (data.status === 1) {
				NotifyMessage("Cập nhật dự án thành công!", "success");

				return data?.project;
			}
		} catch (error) {
			console.log("error: ", error);
			NotifyMessage("Cập nhật dự án thất bại. Vui lòng thử lại!", "error");

			return rejectWithValue(error);
		}
	}
);

export const DeleteProject = createAsyncThunk(
	"/projects/delete",
	async (id, {rejectWithValue}) => {
		try {
			const {data} = await deleteProjectById(id);

			if (data.status === 1) {
				NotifyMessage("Xóa dự án thành công!", "success");

				return data?.project;
			}
		} catch (error) {
			console.log("error: ", error);
			NotifyMessage("Xóa dự án thất bại. Vui lòng thử lại!", "error");

			return rejectWithValue(error);
		}
	}
);

const projectSlice = createSlice({
	name: "projects",
	initialState: {
		projects: [],
		project: "",
		isLoading: false,
		total: 0,
	},
	reducers: {
		setProjects: (state, action) => {
			const newProject = {
				...action.payload,
				tasks: 0,
			};

			state.projects = [newProject, ...state.projects];
		},
	},
	extraReducers: (builder) => {
		builder
			// Get Paging
			.addCase(GetPagingProject.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(GetPagingProject.fulfilled, (state, action) => {
				state.projects = action.payload?.projects;
				state.total = action.payload?.total;
				state.isLoading = false;
			})
			.addCase(GetPagingProject.rejected, (state) => {
				state.isLoading = false;
			})

			// Get Paging
			.addCase(GetByProjectId.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(GetByProjectId.fulfilled, (state, action) => {
				state.project = action.payload;
				state.isLoading = false;
			})
			.addCase(GetByProjectId.rejected, (state) => {
				state.isLoading = false;
			})

			// Update Project
			.addCase(UpdateProject.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(UpdateProject.fulfilled, (state, action) => {
				state.projects = state.projects.map((project) => {
					if (project._id == action.payload?._id) {
						project = action.payload;
					}
					return project;
				});
				state.isLoading = false;
			})
			.addCase(UpdateProject.rejected, (state) => {
				state.isLoading = false;
			})

			// Delete Project
			.addCase(DeleteProject.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(DeleteProject.fulfilled, (state, action) => {
				state.projects = state.projects?.filter(
					(project) => !action.payload?.includes(project._id)
				);
				state.isLoading = false;
			})
			.addCase(DeleteProject.rejected, (state) => {
				state.isLoading = false;
			});
	},
});

export const {setProjects, filterProjects} = projectSlice.actions;

export default projectSlice.reducer;
