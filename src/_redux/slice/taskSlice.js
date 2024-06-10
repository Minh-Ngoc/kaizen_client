import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {v4 as uuidv4} from "uuid";
import {formatDate} from "_utils";
import NotifyMessage from "_utils/notify";
import {cloneDeep} from "lodash";
import moment from "moment";
import {getPagingMyTask} from "services/api.service";
import {getTasksForGantt} from "services/api.service";
import {getAllStatus} from "services/api.service";
import {
	deleteTaskById,
	getTaskByProjectId,
	getTasksByDate,
	uploadAttachmentsTask,
	updateTask,
	updatePositionTasks,
	getMyTask,
	getTasksByUser,
} from "services/api.service";
export const GetPagingMyTask = createAsyncThunk(
	"myTask/getMyTask",
	async (params) => {
		const res = await getPagingMyTask();

		return res.data?.result;
	}
);
export const GetPagingTaskList = createAsyncThunk(
	"tasks/getPagingTaskList",
	async (id) => {
		const res = await getTasksForGantt(id);

		return res.data?.tasks;
	}
);
export const GetTasksByStatuses = createAsyncThunk(
	"/tasks/statuses",
	async (id, {rejectWithValue}) => {
		try {
			const {data: getAllStatusData} = await getAllStatus();
			const {data: getTaskByProjectData} = await getTaskByProjectId(id);

			if (getAllStatusData.status === 1 && getTaskByProjectData.status === 1) {
				const formatStatuses = getAllStatusData?.statuses?.map((status) => {
					const tasks = getTaskByProjectData?.tasks?.filter(
						(task) => task?.statusId === status?._id
					);
					return {
						...status,
						tasks,
					};
				});

				return formatStatuses;
			}
		} catch (error) {
			console.log("error: ", error);
			rejectWithValue();
		}
	}
);

export const GetTasksByDate = createAsyncThunk(
	"/tasks/date",
	async (query, {rejectWithValue}) => {
		try {
			const {data} = await getTasksByDate(query);

			if (data.status === 1) {
				const formartTasks = data.tasks.map((task) => ({
					...task,
					date: formatDate(task?.date),
					team: !!task?.team?.length
						? task?.team
								?.map((t) => t.name)
								?.join(", ")
								.toUpperCase()
						: "",
					quantity: task?.quantity,
				}));

				return {
					total: data.total,
					tasks: formartTasks,
				};
			}
		} catch (error) {
			console.log("error: ", error);
			// NotifyMessage(
			// 	"Không thể tải danh sách Tasks. Vui lòng tải lại trang!",
			// 	"error"
			// );

			return rejectWithValue(error);
		}
	}
);

export const GetTasksByUser = createAsyncThunk(
	"/tasks/user",
	async (id, {rejectWithValue}) => {
		try {
			const {data} = await getTasksByUser();

			if (data.status === 1) {
				const sortedData = data.tasks.sort((a, b) => a.position - b.position);

				return {tasks: sortedData};
			}
		} catch (error) {
			console.log("error: ", error);
			NotifyMessage(
				"Không thể tải thông tin task. Vui lòng tải lại trang!",
				"error"
			);

			return rejectWithValue(error);
		}
	}
);

export const GetAllTaskByProjectId = createAsyncThunk(
	"/tasks/projects",
	async (id, {rejectWithValue}) => {
		try {
			const {data} = await getTaskByProjectId(id);

			if (data.status === 1) {
				const sortedData = data.tasks.sort((a, b) => a.position - b.position);

				return {
					project: data.project,
					tasks: sortedData,
				};
			}
		} catch (error) {
			console.log("error: ", error);
			// NotifyMessage(
			// 	"Không thể tải thông tin task. Vui lòng tải lại trang!",
			// 	"error"
			// );

			return rejectWithValue(error);
		}
	}
);

export const GetAllMyTask = createAsyncThunk(
	"/tasks/get-all-my-task",
	async (_, {rejectWithValue}) => {
		try {
			const {data} = await getMyTask();
			if (data.status === 1) {
				return {
					tasks: data.result,
				};
			}
		} catch (error) {
			console.log("error: ", error);
			// NotifyMessage(
			// 	"Không thể tải thông tin task. Vui lòng tải lại trang!",
			// 	"error"
			// );

			return rejectWithValue(error);
		}
	}
);

export const UpdatePositionTasks = createAsyncThunk(
	"/tasks/projects/id",
	async (body, {rejectWithValue}) => {
		try {
			const {data} = await updatePositionTasks(body);

			if (data.status === 1) {
				return data?.tasks?.sort((a, b) => a.position - b.position);
			}
		} catch (error) {
			console.log("error: ", error);
			NotifyMessage("Cập nhật công việc thất bại. Vui lòng thử lại!", "error");

			return rejectWithValue(error);
		}
	}
);

export const UpdateTask = createAsyncThunk(
	"/tasks/id",
	async ({id, body}, {rejectWithValue}) => {
		try {
			const {data} = await updateTask(id, body);

			if (data.status === 1) {
				return data?.task;
			}
		} catch (error) {
			console.log("error: ", error);
			NotifyMessage("Cập nhật công việc thất bại. Vui lòng thử lại!", "error");

			return rejectWithValue(error);
		}
	}
);

export const UploadAttachmentsTask = createAsyncThunk(
	"/tasks/attachments/id",
	async ({id, body}, {rejectWithValue}) => {
		try {
			const {data} = await uploadAttachmentsTask(id, body);

			if (data.status === 1) {
				return data?.task;
			}
		} catch (error) {
			console.log("error: ", error);
			NotifyMessage(
				"Cập nhật đính kèm công việc thất bại. Vui lòng thử lại!",
				"error"
			);

			return rejectWithValue(error);
		}
	}
);

export const DeleteTask = createAsyncThunk(
	"/delete/tasks/id",
	async (id, {rejectWithValue}) => {
		try {
			const {data} = await deleteTaskById(id);

			if (data.status === 1) {
				NotifyMessage("Xóa công việc thành công!", "success");
				return id;
			}
		} catch (error) {
			console.log("error: ", error);
			NotifyMessage("Xóa công việc thất bại. Vui lòng thử lại!", "error");

			return rejectWithValue(error);
		}
	}
);

export const taskSlice = createSlice({
	name: "tasks",
	initialState: {
		task: {},
		tasksOfStatus: [],
		newTask: {},
		project: "",
		tasks: [],
		error: "",
		isLoading: false,
		tasksList: [],
		total: 0,
		api: "tasks",
		currentTab: "list",
	},
	reducers: {
		setCurrentTab: (state, action) => {
			state.currentTab = action.payload;
			state.tasks = [];
		},
		updateTaskDates: (state, action) => {
			const {taskId, dateStart, dateEnd} = action.payload;
			const task = state.tasks.find((task) => task._id === taskId);
			if (task) {
				task.dateStart = dateStart;
				task.dateEnd = dateEnd;
			}
		},

		addTask: (state, action) => {
			const newData = [...state.tasks];
			const index = newData?.findIndex(
				(item) =>
					item.statusId === action.payload?.statusId && item?.type === "add"
			);

			newData?.splice(index, 0, {
				taskId: "",
				taskName: "",
				statusId: action.payload?.statusId,
				parentID: newData[index]?.parentID,
			});
			state.tasks = newData;
		},
		addTopTask: (state, action) => {
			const newData = [...state.tasks];

			newData?.splice(1, 0, {
				taskId: "",
				taskName: "",
				statusId: action.payload?.statusId,
				parentID: newData[1]?.parentID,
			});
			state.tasks = newData;
		},
		deleteTask: (state, action) => {
			const newData = [...state.tasks];
			const index = newData?.findIndex(
				(item) =>
					item?.taskId === action.payload?.taskId &&
					item.statusId === action.payload?.statusId
			);

			newData?.splice(index, 1);
			state.tasks = newData;
		},

		updateTaskUI: (state, action) => {
			const {taskId, ...rest} = action.payload;

			const newData = [...state.tasks];

			const taskIndex = newData?.findIndex((task) => task?.taskId === taskId);
			newData[taskIndex] = {
				...newData[taskIndex],
				...rest,
			};
			state.tasks = newData;
		},
		setTask: (state, action) => {
			state.task = action.payload;
		},

		setApi: (state, action) => {
			state.api = action.payload;
		},
		setTasks: (state, action) => {
			state.tasks = action.payload.filter((item) => item);
		},

		setTasksOfStatus: (state, action) => {
			state.tasksOfStatus = action.payload.tasks.filter((item) => item);
			state.newTask = action.payload.newTask;
		},

		setLabelsOfTask: (state, action) => {
			const newTasks = state.tasks.map((task) => {
				if (task._id === action.payload.taskId) {
					return {
						...task,
						labels: action.payload.labels,
					};
				}

				return task;
			});

			state.tasks = newTasks;
		},

		setName: (state, action) => {
			const newTasks = state.tasks.map((task) => {
				if (task._id === action.payload.taskId) {
					return {
						...task,
						name: action.payload.name,
					};
				}

				return task;
			});

			state.tasks = newTasks;
		},

		setTime: (state, action) => {
			const newTasks = state.tasks.map((task) => {
				if (task._id === action.payload.taskId) {
					return {
						...task,
						dateStart: action.payload.dateStart,
						dateEnd: action.payload.dateEnd,
					};
				}

				return task;
			});

			state.tasks = newTasks;
		},

		setCheckListTitle: (state, action) => {
			const newTasks = state.tasks.map((task) => {
				if (task._id === action.payload.taskId) {
					return {
						...task,
						checklist: action.payload.checklist,
					};
				}

				return task;
			});

			state.tasks = newTasks;
		},

		setCheckListTime: (state, action) => {
			const newTasks = state.tasks.map((task) => {
				if (task._id === action.payload.taskId) {
					return {
						...task,
						checklist: action.payload.checklist,
					};
				}

				return task;
			});

			state.tasks = newTasks;
		},

		addChecklist: (state, action) => {
			const newTasks = state.tasks.map((task) => {
				if (task._id === action.payload.taskId) {
					return {
						...task,
						checklist: action.payload.checklist,
					};
				}

				return task;
			});

			state.tasks = newTasks;
		},

		setDescription: (state, action) => {
			state.task = {
				...state.task,
				description: action.payload,
			};
		},

		setAttachments: (state, action) => {
			const newTasks = state.tasks.map((task) => {
				if (task._id === action.payload.taskId) {
					return {
						...task,
						attachments: action.payload.attachments,
					};
				}

				return task;
			});

			state.tasks = newTasks;
		},

		setComments: (state, action) => {
			const newTasks = state.tasks.map((task) => {
				if (task._id === action.payload.taskId) {
					return {
						...task,
						comments: action.payload.comments,
					};
				}

				return task;
			});

			state.tasks = newTasks;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(GetPagingTaskList.fulfilled, (state, action) => {
				const newData = action.payload?.flatMap((item) => {
					const taskParentIdRandom = uuidv4();
					let tasks = [
						{
							taskName: item?.name,
							statusId: item?._id,
							taskId: taskParentIdRandom,
						},
					];

					const subtasks =
						item?.child
							?.sort((a, b) => a?.position - b?.position)
							?.map((task) => {
								return {
									statusId: task?.statusId,
									taskName: task?.name,
									taskId: task?._id,
									parentID: taskParentIdRandom,
									dateStart: task?.dateStart,
									dateEnd: task?.dateEnd,
									performers: task?.performers,
									project: task?.project,
									checklists: task?.child?.length,
									labels: task?.labels,
									position: task?.position,
								};
							}) || [];
					tasks.push(...subtasks, {
						taskId: uuidv4(),
						taskName: "Add task...",
						statusId: item?._id,
						parentID: taskParentIdRandom,
						type: "add",
					});
					return tasks;
				});

				state.tasks = newData;

				state.isLoading = false;
			})
			.addCase(GetPagingTaskList.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(GetPagingTaskList.rejected, (state) => {
				state.tasks = [];
				state.isLoading = false;
			})
			.addCase(GetPagingMyTask.fulfilled, (state, action) => {
				const newData = action.payload?.flatMap((item) => {
					const taskParentIdRandom = uuidv4();
					let tasks = [
						{
							taskName: item?.name,
							statusId: item?._id,
							taskId: taskParentIdRandom,
						},
					];

					const subtasks =
						item?.data
							?.sort((a, b) => a?.position - b?.position)
							?.map((task) => {
								return {
									taskId: task?._id,
									statusId: task?.statusId,
									taskName: task?.name,
									dateStart: task?.dateStart,
									dateEnd: task?.dateEnd,
									performers: task?.performers,
									project: task?.project,
									checklists: task?.checklists?.length,
									position: task?.position,

									parentID: taskParentIdRandom,
								};
							}) || [];
					tasks.push(...subtasks, {
						taskId: uuidv4(),
						taskName: "Add task...",
						statusId: item?._id,
						parentID: taskParentIdRandom,
						type: "add",
					});
					return tasks;
				});
				state.tasks = newData;

				state.isLoading = false;
			})
			.addCase(GetPagingMyTask.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(GetPagingMyTask.rejected, (state) => {
				state.tasks = [];
				state.isLoading = false;
			})

			.addCase(GetTasksByStatuses.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(GetTasksByStatuses.fulfilled, (state, action) => {
				state.tasksOfStatus = action.payload;
				state.isLoading = false;
				state.error = "";
			})
			.addCase(GetTasksByStatuses.rejected, (state, action) => {
				state.error = action.error.message;
				state.isLoading = false;
			})

			// Get By User
			.addCase(GetTasksByUser.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(GetTasksByUser.fulfilled, (state, action) => {
				state.tasks = action.payload.tasks;
				state.isLoading = false;
				state.error = "";
			})
			.addCase(GetTasksByUser.rejected, (state, action) => {
				state.error = action.error.message;
				state.isLoading = false;
			})

			// Get Paging
			.addCase(GetAllTaskByProjectId.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(GetAllTaskByProjectId.fulfilled, (state, action) => {
				state.tasks = action.payload.tasks;
				state.project = action.payload.project;
				state.isLoading = false;
				state.error = "";
			})
			.addCase(GetAllTaskByProjectId.rejected, (state, action) => {
				state.error = action.error.message;
				state.isLoading = false;
			})

			// My Tasks
			.addCase(GetAllMyTask.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(GetAllMyTask.fulfilled, (state, action) => {
				state.tasks = action.payload.tasks;
				state.isLoading = false;
				state.error = "";
			})
			.addCase(GetAllMyTask.rejected, (state, action) => {
				state.error = action.error.message;
				state.isLoading = false;
			})

			// Get By Date
			.addCase(GetTasksByDate.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(GetTasksByDate.fulfilled, (state, action) => {
				state.tasksList = action.payload.tasks;
				state.total = action.payload.total;
				state.isLoading = false;
			})
			.addCase(GetTasksByDate.rejected, (state) => {
				state.isLoading = false;
			})

			// Update Position Tasks
			.addCase(UpdatePositionTasks.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(UpdatePositionTasks.fulfilled, (state, action) => {
				state.tasks = action.payload;
				state.isLoading = false;
			})
			.addCase(UpdatePositionTasks.rejected, (state) => {
				state.isLoading = false;
			})

			// Update Task
			.addCase(UpdateTask.pending, (state) => {
				state.isLoading = false;
			})
			.addCase(UpdateTask.fulfilled, (state, action) => {
				state.task = action.payload;

				const newTasksOfStatuses = state.tasksOfStatus?.map((status) => {
					if (status?._id === action.payload?.statusId) {
						const newTasks = status.tasks.map((tsk) => {
							if (tsk?._id === action.payload?._id) {
								return action.payload;
							}

							return tsk;
						});

						return {...status, tasks: newTasks};
					}

					return status;
				});

				state.tasksOfStatus = newTasksOfStatuses;

				state.isLoading = false;
			})
			.addCase(UpdateTask.rejected, (state) => {
				state.isLoading = false;
			})

			// Upload Attachments Task
			.addCase(UploadAttachmentsTask.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(UploadAttachmentsTask.fulfilled, (state, action) => {
				state.task = action.payload;
				state.isLoading = false;
			})
			.addCase(UploadAttachmentsTask.rejected, (state) => {
				state.isLoading = false;
			})

			// Delete Task
			.addCase(DeleteTask.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(DeleteTask.fulfilled, (state, action) => {
				const newTasks = state.tasks.filter(
					(task) => task._id !== action.payload
				);

				state.tasks = newTasks;
				state.task = {};
				state.isLoading = false;
			})
			.addCase(DeleteTask.rejected, (state) => {
				state.isLoading = false;
			});
	},
});

export const {
	updateTaskDates,
	setTasks,
	setLabelsOfTask,
	setTask,
	setName,
	setCheckListTitle,
	setCheckListTime,
	addChecklist,
	setDescription,
	setAttachments,
	setComments,
	setTime,
	setTasksOfStatus,
	setApi,
	addTask,
	updateTaskUI,
	setCurrentTab,
	deleteTask,
	addTopTask,
} = taskSlice.actions;

export default taskSlice.reducer;
