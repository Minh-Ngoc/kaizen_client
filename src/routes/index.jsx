import {createBrowserRouter} from "react-router-dom";
import DashBoard from "../app/pages/Dashboard";
import AdminLayout from "../layouts/Admin";
import Login from "../app/pages/Login";
import Projects from "../app/pages/Projects";
import Kanbans from "../app/pages/Kanbans";
import MyTasks from "../app/pages/MyTasks/MyTasks";
import Profile from "../app/pages/Profile";
import NotFound from "../app/pages/NotFound";
import TableTeamList from "../app/pages/Team/components/TableTeamList";
import Team from "../app/pages/Team";

const routes = createBrowserRouter([
	{
		element: <AdminLayout />,
		children: [
			{
				path: "/",
				element: <DashBoard />,
			},
			{
				path: "/projects",
				element: <Projects />,
			},
			{
				path: "/kanbans/:id",
				element: <Kanbans />,
			},
			{
				path: "/my-tasks",
				element: <MyTasks />,
			},
			{
				path: "/profile",
				element: <Profile />,
			},
			{
				path: "/team-manage",
				element: <Team />,
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
