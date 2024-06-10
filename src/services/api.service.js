import axios from "axios";
import config from "../config";
import { handleLogout } from "_redux/slice/authSlice";
import { store } from "_redux/store";
import NotifyMessage from "_utils/notify";

const instance = axios.create({
	baseURL: config.API_URL,
});
export default class APIService {
	constructor() {
		instance.interceptors.request.use(
			(config) => {
				const accessToken = this.getToken();
				if (accessToken) {
					config.headers.Authorization = `Bearer ${accessToken}`;
				}

				return config;
			},
			(error) => Promise.reject(error)
		);
		instance.interceptors.response.use(
			(response) => response,
			(error) => {
				if (
					error?.response?.status === 401 &&
					location.pathname !== "/login"
				) {
					NotifyMessage('Phiên đăng nhập hết hạn!', 'warning')
					return store?.dispatch(handleLogout());
				}
				if (error?.response?.status === 403) {
					NotifyMessage('Bạn không có quyền truy cập!', 'info')
				}
				return Promise.reject(error);
			}
		);
	}

	// Begin: User
	setRefreshToken(value) {
		localStorage.setItem("refreshToken", value);
	}
	getRankScore(number) {
		return instance.get(`/users/highest-score/${number}`);
	}
	getRefreshToken() {
		return localStorage.getItem("refreshToken");
	}

	refreshToken() {
		return instance.post("/users/refresh-token", {
			refreshToken: this.getRefreshToken(),
		});
	}
	logout() {
		store.dispatch(handleLogout());
		NotifyMessage('Bạn đã đăng xuất!', 'warning')
	}
	getToken() {
		return (
			JSON.parse(localStorage.getItem("accessToken") || "null") || null
		);
	}

	setToken(value) {
		localStorage.setItem("accessToken", value);
	}

	login(data) {
		return instance.post("/auth/sign-in", data);
	}

	register(data) {
		return instance.post("/auth/sign-up", data);
	}

	getUsers() {
		return instance.get("/users/get-users");
	}
	getAllUser() {
		return instance.get("/users/get-all-user");
	}

	getUsersList(query) {
		return instance.get("/users/get-users-list", { params: query });
	}

	getPagingUsers(query) {
		return instance.get("/users/get-paging-users", { params: query });
	}
	getPagingNew(pageSize = 10, pageIndex = 1, search = "") {
		return instance.get(
			`/news?pageSize=${pageSize}&pageIndex=${pageIndex}&search=${search}`
		);
	}
	createUser(data) {
		return instance.post("/users/create-user", data, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	}
	deleteUser(id) {
		return instance.delete(`/users/delete-user/${id}`);
	}
	deleteUsers(ids) {
		return instance.delete(`/users/deletes/${ids}`);
	}
	updateUserById(id, body) {
		return instance.put(`/users/update-user/${id}`, body, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	}
	// End: User

	// Begin: Project
	addNewProject(data) {
		return instance.post("/projects", data);
	}

	getProjectById(id) {
		return instance.get(`/projects/${id}`);
	}

	deleteProjectById(id) {
		return instance.delete(`/projects/${id}`);
	}

	getPagingProjectSearch(query) {
		return instance.get(`/projects`, { params: query });
	}

	updateProject(id, data) {
		return instance.put(`/projects/${id}`, data);
	}

	updateDueDateProject(id, data) {
		return instance.put(`/projects/${id}/date`, data);
	}

	getPerformersByProject(query) {
		return instance.get(`/projects/performers`, { params: query });
	}

	// End: Project

	// Begin: Task

	getPagingMyTask() {
		return instance.get("/tasks/my-tasks");
	}

	addNewTask(data) {
		return instance.post("/tasks", data);
	}

	getTasksByUser() {
		return instance.get(`/tasks/user`);
	}

	getTasksStatsOverview(id) {
		return instance.get(`/tasks/stats-overview/${id}`);
	}

	getTasksForGantt(id) {
		return instance.get(`/tasks/gantt/${id}`);
	}

	getTasksForGanttFlatData(id) {
		return instance.get(`/tasks/flat/${id}`);
	}

	getTaskByProjectId(id) {
		return instance.get(`/tasks/projects/${id}`);
	}
	getMyTask() {
		return instance.get("/tasks/my-tasks");
	}
	getById(id) {
		return instance.get(`/tasks/${id}`);
	}
	getTaskById(id) {
		return instance.get(`/tasks/task-by-id/${id}`);
	}

	getTasksByDate(query) {
		return instance.get(`/tasks/filter`, { params: query });
	}

	getAllTasks(query) {
		return instance.get(`/tasks/all`, { params: query });
	}

	deleteTaskById(id) {
		return instance.delete(`/tasks/${id}`);
	}

	updateTask(id, data) {
		return instance.put(`/tasks/${id}`, data);
	}

	uploadAttachmentsTask(id, body) {
		return instance.put(`/tasks/attachments/${id}`, body, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	}

	updatePositionTasks(data) {
		return instance.put(`/tasks/position`, data);
	}

	updateGantt(data) {
		return instance.put(`/tasks/gantt`, data);
	}
	// End: Task

	// Begin: Status
	getAllStatus() {
		return instance.get(`/statuses`);
	}

	getStatusById(id) {
		return instance.get(`/statuses/${id}`);
	}

	addNewStatus(data) {
		return instance.post("/statuses", data);
	}

	updateStatus(id, data) {
		return instance.put(`/statuses/${id}`, data);
	}

	deleteStatus(id) {
		return instance.delete(`/statuses/${id}`);
	}
	// End: Status

	// Begin: Label
	createNewLabel(data) {
		return instance.post("/labels", data);
	}

	getLabelsByTaskId(id) {
		return instance.get(`/labels/tasks/${id}`);
	}

	updateLabel(id, data) {
		return instance.put(`/labels/${id}`, data);
	}

	deleteLabelById(id) {
		return instance.delete(`/labels/${id}`);
	}
	// End: Label

	// Begin: Checklist
	addNewChecklist(data) {
		return instance.post("/check-list/create", data);
	}

	updateChecklist(id, data) {
		return instance.put(`/check-list/update/${id}`, data);
	}

	deleteChecklistById(id) {
		return instance.delete(`/check-list/delete/${id}`);
	}

	getChecklistOfUsersByMonth(query) {
		return instance.get(`/check-list/users/week`, {
			params: query,
		});
	}

	getChecklistReportedOfUsersByWeek(query) {
		return instance.get(`/check-list/users-reported/week`, {
			params: query,
		});
	}

	getChecklistOfUserByMonth(query) {
		return instance.get(`/check-list/user/week`, {
			params: query,
		});
	}
	// End: Checklist

	// Begin: Checklist Item
	addItemChecklist(id, data) {
		return instance.post(`/items/create/${id}`, data);
	}

	updateItemChecklist(checkListId, itemId, data) {
		return instance.put(`/items/update/${checkListId}/${itemId}`, data);
	}

	deleteItemChecklistById(checkListId, itemId) {
		return instance.delete(`/items/delete/${checkListId}/${itemId}`);
	}

	convertItemToTask(checkListId, itemId) {
		return instance.put(`/items/convert/${checkListId}/${itemId}`);
	}

	// End: Checklist Item

	// Begin: Comment
	createNewComment(data) {
		return instance.post("/comments/create", data);
	}
	createNewReply(cmtId, data) {
		return instance.put(`/comments/reply-comment/${cmtId}`, data);
	}
	updateComment(id, data) {
		return instance.put(`/comments/update/${id}`, data);
	}
	updateReply(id, data) {
		return instance.put(`/comments/update-reply-comment/${id}`, data);
	}
	deleteComment(id) {
		return instance.delete(`/comments/delete/${id}`);
	}
	deleteReplyComment(replyId, cmtId) {
		return instance.delete(
			`/comments/delete-reply-comment/${replyId}/${cmtId}`
		);
	}
	likeComment(id) {
		return instance.put(`/comments/like-comment/${id}`);
	}

	likeReply(replyId, cmtId) {
		return instance.put(`/comments/like-reply/${replyId}/${cmtId}`);
	}
	updateContentComment(id, content) {
		return instance.put(`/comments/update-content-comment/${id}`, {
			content,
		});
	}
	getAllCommentByTaskId(id) {
		return instance.get(`/comments/get-all-comment-by-task-id/${id}`);
	}
	// End: Comment

	// Begin: Day Off
	createDayOff(data) {
		return instance.post("/day-off", data);
	}

	getPagingDayOff(query) {
		return instance.get(`/day-off`, {
			params: query,
		});
	}

	getDayOffById(id) {
		return instance.get(`/day-off/${id}`);
	}

	updateDayOff(id, data) {
		return instance.put(`/day-off/${id}`, data);
	}

	deleteDayOff(id) {
		return instance.delete(`/day-off/${id}`);
	}
	// end: Day Off

	// Module Log
	getPagingLog(query) {
		return instance.get("/action-history/get-paging-action-history", {
			params: query,
		});
	}
	getPagingBrand(pageSize = 10, pageIndex = 1, search = "") {
		return instance.get(
			`/brands?pageSize=${pageSize}&pageIndex=${pageIndex}&search=${search}`
		);
	}
	getBrandById(id) {
		return instance.get(`/brands/${id}`);
	}
	getAllBrands() {
		return instance.get(`/brands/getAllBrands`);
	}
	addBrand(data) {
		return instance.post("/brands", data);
	}
	updateBrand(id, data) {
		return instance.put(`/brands/${id}`, data);
	}
	deleteBrand(ids) {
		return instance.post(`/brands/delete`, { ids });
	}
	getPagingKpiBonus(pageSize = 10, pageIndex = 1, search = "") {
		return instance.get(
			`/kpi-bonus?pageSize=${pageSize}&pageIndex=${pageIndex}&search=${search}`
		);
	}
	getAllKpiBonus() {
		return instance.get("/kpi-bonus/getAllKpiBonus");
	}
	getKpiBonusById(id) {
		return instance.get(`/kpi-bonus/${id}`);
	}
	addKpiBonus(data) {
		return instance.post("/kpi-bonus", data);
	}
	updateKpiBonus(id, data) {
		return instance.put(`/kpi-bonus/${id}`, data);
	}
	deleteKpiBonus(ids) {
		return instance.post(`/kpi-bonus/delete`, { ids });
	}
	getPagingTeam(pageSize = 10, pageIndex = 1, search = "") {
		return instance.get(
			`/teams?pageSize=${pageSize}&pageIndex=${pageIndex}&search=${search}`
		);
	}
	getTeamById(id) {
		return instance.get(`/teams/${id}`);
	}
	addTeam(data) {
		return instance.post("/teams", data);
	}
	updateTeam(id, data) {
		return instance.put(`/teams/${id}`, data);
	}
	deleteTeam(ids) {
		return instance.post(`/teams/delete`, { ids });
	}
	getAllTeams() {
		return instance.get("/teams/getAllTeams");
	}
	getPagingBlog(pageSize = 10, pageIndex = 1, search = "") {
		return instance.get(
			`/blogs?pageSize=${pageSize}&pageIndex=${pageIndex}&search=${search}`
		);
	}
	getBlogById(id) {
		return instance.get(`/blogs/get-by-id/${id}`);
	}
	addBlog(data) {
		return instance.post("/blogs", data, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	}
	updateBlog(id, data) {
		return instance.put(`/blogs/${id}`, data, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	}
	deleteBlog(ids) {
		return instance.post(`/blogs/delete`, { ids });
	}

	getDataForExportExcel() {
		return instance.get("/users/get-data-for-export-excel");
	}
	getNewsOfUser() {
		return instance.get(`/news/news-of-user`);
	}
	getNewById(id) {
		return instance.get(`/news/get-by-id/${id}`);
	}
	addNew(data) {
		return instance.post("/news", data, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	}
	updateNew(id, data) {
		return instance.put(`/news/${id}`, data, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	}
	deleteNew(ids) {
		return instance.post(`/news/delete`, { ids });
	}
	deletesNew(ids) {
		return instance.delete(`/news/deletes/${ids}`);
	}
	//Role
	getAllRole() {
		return instance.get("/roles/get-all-roles");
	}
	getAllRoleCountUsers() {
		return instance.get("/roles/get-all-roles-count-users");
	}
	// Permission
	getDetailPermissionByRoleId(id) {
		return instance.get(`/permissions/get-all-by-role-id/${id}`);
	}
	deletePermissionByRole(id) {
		return instance.delete(`/permissions/delete-by-role-id/${id}`);
	}
	updatePermissionByRoleId(id, data) {
		return instance.put(
			`/permissions/update-permission-by-role-id/${id}`,
			data
		);
	}
	createPermission(data) {
		return instance.post("/permissions/create-permission-role", data);
	}
	/// Module Department
	getDepartmentById(id) {
		return instance.get(`/department/get-department/${id}`);
	}
	getAllDepartment() {
		return instance.get("/department/get-all");
	}
	createDepartment(data) {
		return instance.post("/department/create-department", data);
	}
	deleteDepartmentById(id) {
		return instance.delete(`/department/delete/${id}`);
	}
	deletesDepartment(ids) {
		return instance.delete(`/department/deletes/${ids}`);
	}
	updateDepartment(id, data) {
		return instance.put(`department/update-department/${id}`, data);
	}
	getPagingDepartment(query) {
		return instance.get("/department/get-paging-departments", {
			params: query,
		});
	}

	// Module Log
	deletesKpiBonus(ids) {
		return instance.delete(`/kpi-bonus/deletes/${ids}`);
	}

	getTeamStats({ startDate, endDate }) {
		return instance.get(
			`/teams/get-stats?startDate=${startDate}&endDate=${endDate}`
		);
	}
	getKpiTeamStats() {
		return instance.get(`/teams/get-kpi-stats`);
	}

	deletesTeam(ids) {
		return instance.delete(`/teams/deletes/${ids}`);
	}
	
	deletesBlog(ids) {
		return instance.delete(`/blogs/deletes/${ids}`);
	}

	// Activity
	getPagingActivity(pageSize = 10, pageIndex = 1, search = "") {
		return instance.get(
			`/activities?pageSize=${pageSize}&pageIndex=${pageIndex}&search=${search}`
		);
	}
	getActivityById(id) {
		return instance.get(`/activities/get-by-id/${id}`);
	}
	addActivity(data) {
		return instance.post("/activities", data, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	}
	updateActivity(id, data) {
		return instance.put(`/activities/${id}`, data, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	}
	deleteActivity(ids) {
		return instance.post(`/activities/delete`, { ids });
	}
	deletesActivity(ids) {
		return instance.delete(`/activities/deletes/${ids}`);
	}
	// seo
	getPagingSeo(pageSize = 10, pageIndex = 1, search = "") {
		return instance.get(
			`/seos?pageSize=${pageSize}&pageIndex=${pageIndex}&search=${search}`
		);
	}
	getSeoById(id) {
		return instance.get(`/seos/${id}`);
	}
	addSeo(data) {
		return instance.post("/seos", data);
	}
	updateSeo(id, data) {
		return instance.put(`/seos/${id}`, data);
	}
	deleteSeo(ids) {
		return instance.post(`/seos/delete`, { ids });
	}
	deletesSeo(ids) {
		return instance.delete(`/seos/deletes/${ids}`);
	}
	// seo project
	getPagingSeoProject(pageSize = 10, pageIndex = 1, search = "") {
		return instance.get(
			`/seo-projects?pageSize=${pageSize}&pageIndex=${pageIndex}&search=${search}`
		);
	}
	getSeoProjectById(id) {
		return instance.get(`/seo-projects/get-by-id/${id}`);
	}
	addSeoProject(data) {
		return instance.post("/seo-projects", data, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	}
	updateSeoProject(id, data) {
		return instance.put(`/seo-projects/${id}`, data, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	}
	deleteSeoProject(ids) {
		return instance.post(`/seo-projects/delete`, { ids });
	}
	deletesSeoProject(ids) {
		return instance.delete(`/seo-projects/deletes/${ids}`);
	}

	//Domain

	createDomain(data) {
		return instance.post("/domain/create-domain", data);
	}

	updateDomain(id, data) {
		return instance.put(`/domain/update-domain-by-id/${id}`, data);
	}

	getAllDomain() {
		return instance.get("/domain/get-all-domain");
	}
	getDomainById(id) {
		return instance.get(`/domain/get-domain-by-id/${id}`);
	}
	deleteDomainBiId(id) {
		return instance.delete(`/domain/delete-domain-by-id/${id}`);
	}
	deletesDomain(ids) {
		return instance.delete(`/domain/deletes/${ids}`);
	}
	getpagingDomain(query) {
		return instance.get("/domain/get-paging-domain", { params: query });
	}
	updateKpiBonusDomainId(id, data) {
		return instance.post(
			`/domain/update-kpi-bonus-by-domain-id/${id}`,
			data,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			}
		);
	}
	getAllTeam() {
		return instance.get("/teams/get-all-team");
	}
	getAllBrand() {
		return instance.get("/brands/get-all-brand");
	}
	deletesBrand(ids) {
		return instance.delete(`/brands/deletes/${ids}`);
	}
	getAllKpiBonuses() {
		return instance.get("/kpi-bonus/get-all-kpi-bonus");
	}

	approveKpiDomain(domainId, indexKpi, body) {
		return instance.put(`/domain/accept-kpi/${domainId}/${indexKpi}`, body);
	}

	rejectKpiDomain(domainId, indexKpi, body) {
		return instance.put(`/domain/reject-kpi/${domainId}/${indexKpi}`, body);
	}

	// Module Your Ticket
	getPagingYourTicket(query) {
		return instance.get("/tickets/get-paging-ticket", {
			params: query,
		});
	}
	createTicket(body) {
		return instance.post("/tickets/create-ticket", body, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	}
}

export const {
	// User
	setRefreshToken,
	getRefreshToken,
	refreshToken,
	getToken,
	setToken,
	login,
	register,
	getRankScore,
	getUsers,
	getAllUser,
	getUsersList,
	getPagingUsers,
	createUser,
	deleteUser,
	deleteUsers,
	updateUserById,
	logout,

	// Project
	addNewProject,
	getProjectById,
	deleteProjectById,
	getPagingProjectSearch,
	updateProject,
	updateDueDateProject,
	getPerformersByProject,

	// Task
	addNewTask,
	getTasksByUser,
	getTasksForGantt,
	getTasksForGanttFlatData,
	getTaskByProjectId,
	getMyTask,
	getTaskById,
	getTasksByDate,
	getAllTasks,
	deleteTaskById,
	updateTask,
	uploadAttachmentsTask,
	updatePositionTasks,
	updateGantt,
	getTasksStatsOverview,
	getPagingMyTask,

	// Status
	getAllStatus,
	getStatusById,
	addNewStatus,
	updateStatus,
	deleteStatus,

	// Label
	createNewLabel,
	getLabelsByTaskId,
	updateLabel,
	deleteLabelById,

	// Checklist
	addNewChecklist,
	updateChecklist,
	deleteChecklistById,
	getChecklistOfUsersByMonth,
	getChecklistReportedOfUsersByWeek,
	getChecklistOfUserByMonth,

	// Checklist Item
	addItemChecklist,
	updateItemChecklist,
	convertItemToTask,
	deleteItemChecklistById,

	// Comment
	createNewComment,
	createNewReply,
	updateComment,
	updateReply,
	deleteComment,
	deleteReplyComment,
	likeComment,
	likeReply,
	updateContentComment,
	getAllCommentByTaskId,

	// Day Off
	createDayOff,
	getPagingDayOff,
	getDayOffById,
	updateDayOff,
	deleteDayOff,

	// New
	getPagingNew,
	getNewById,
	addNew,
	updateNew,
	deleteNew,
	deletesNew,

	// Role
	getAllRole,

	getAllRoleCountUsers,
	getDetailPermissionByRoleId,
	deletePermissionByRole,
	updatePermissionByRoleId,
	createPermission,

	// Module Department
	getDepartmentById,
	getAllDepartment,
	createDepartment,
	deleteDepartmentById,
	deletesDepartment,
	updateDepartment,
	getDataForExportExcel,
	getPagingDepartment,
	getPagingLog,

	// KPI Bonus
	getPagingKpiBonus,
	getKpiBonusById,
	addKpiBonus,
	updateKpiBonus,
	deleteKpiBonus,
	deletesKpiBonus,
	getAllKpiBonus,
	// Brand
	getPagingBrand,
	getBrandById,
	addBrand,
	updateBrand,
	deleteBrand,
	getAllBrands,

	// Team
	getPagingTeam,
	getTeamById,
	addTeam,
	updateTeam,
	deleteTeam,
	deletesTeam,
	getAllTeams,
	getTeamStats,
	getKpiTeamStats,
	//Blog

	getPagingBlog,
	getBlogById,
	addBlog,
	updateBlog,
	deleteBlog,
	deletesBlog,
	// Activity
	getPagingActivity,
	getActivityById,
	addActivity,
	updateActivity,
	deleteActivity,
	deletesActivity,

	// seo project
	getPagingSeoProject,
	getSeoProjectById,
	addSeoProject,
	updateSeoProject,
	deleteSeoProject,
	deletesSeoProject,

	// Domain
	createDomain,
	updateDomain,
	getAllDomain,
	getDomainById,
	deleteDomainBiId,
	deletesDomain,
	getpagingDomain,
	updateKpiBonusDomainId,
	getAllTeam,
	getAllBrand,
	deletesBrand,
	getAllKpiBonuses,
	approveKpiDomain,
	rejectKpiDomain,

	//seo
	getPagingSeo,
	getSeoById,
	addSeo,
	updateSeo,
	deleteSeo,
	deletesSeo,

	//Ticket
	getPagingYourTicket,
	createTicket,
	getNewsOfUser,
} = new APIService();
