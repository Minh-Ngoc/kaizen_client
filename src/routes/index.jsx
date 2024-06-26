import {createBrowserRouter} from "react-router-dom";
import DashBoard from "../app/pages/Dashboard";
import AdminLayout from "../layouts/Admin";
import Login from "../app/pages/Login";
import Projects from "../app/pages/Projects";
import Kanbans from "../app/pages/Kanbans";
import MyTasks from "../app/pages/MyTasks/MyTasks";
import Profile from "../app/pages/Profile";
import NotFound from "../app/pages/NotFound";
import Root from "../app/pages/Root";
import Team from "../app/pages/Team";
import New from "../app/pages/New";
import Blog from "../app/pages/Blog";
import UserManager from "../app/pages/User";
import ManagerPermission from "../app/pages/Manager-Permission";
import DepartmentManager from "../app/pages/Department";
import Domain from "../app/pages/Domain";
import Ticket from "../app/pages/Ticket";
import LogManage from "../app/pages/Manager-Log";
import Brand from "../app/pages/Brand";
import KpiBonus from "../app/pages/KpiBonus";
import Activity from "../app/pages/Activity";
import SeoProject from "../app/pages/SeoProject";
import Seo from "../app/pages/Seo";
const routes = createBrowserRouter([
	{
		element: <AdminLayout />,
		children: [
			{
				path: "/",
				element: <Root />,
			},
			{
				path: "/my-tasks",
				element: <MyTasks />,
			},
			{
				path: "/dashboard",
				element: <DashBoard />,
			},
			{
				path: "/projects",
				element: <Projects />,
			},
			{
				path: "/permission-manage",
				element: <ManagerPermission />,
			},
			{
				path: "/kanbans/:id",
				element: <Kanbans />,
			},
			{
				path: "/profile",
				element: <Profile />,
			},
			{
				path: "/team-manage",
				element: <Team />,
			},
			{
				path: "/seo/new-manage",
				element: <New />,
			},
			{
				path: "/seo/blog-manage",
				element: <Blog />,
			},
			{
				path: "/user-manage",
				element: <UserManager />,
			},
			{
				path: "/department-manage",
				element: <DepartmentManager />,
			},
			{
				path: "/domain-manage",
				element: <Domain />,
			},
			{
				path: "/log-manage",
				element: <LogManage />,
			},
			{
				path: "/your-ticket",
				element: <Ticket />,
			},
			{
				path: "/brand-manage",
				element: <Brand />,
			},
			{
				path: "/kpi-bonus-manage",
				element: <KpiBonus />,
			},
			{
				path: "/team-manage",
				element: <Team />,
			},
			{
				path: "/seo/new-manage",
				element: <New />,
			},
			{
				path: "/seo/blog-manage",
				element: <Blog />,
			},
			{
				path: "/seo/activity-manage",
				element: <Activity />,
			},
			{
				path: "/seo/project-manage",
				element: <SeoProject />,
			},
			{
				path: "/seo/seo-manage",
				element: <Seo />,
			},
		],
	},
	{
		path: "/login",
		element: <Login />,
	},
	{
		path: "*",
		element: <NotFound />,
	},
]);

export default routes;
