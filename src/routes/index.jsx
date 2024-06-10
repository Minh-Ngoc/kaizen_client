import { createBrowserRouter } from "react-router-dom";
import DashBoard from "../app/pages/Dashboard";
import AdminLayout from "../layouts/Admin";
import Login from "../app/pages/Login";
import Projects from "../app/pages/Projects";
import Kanbans from "../app/pages/Kanbans";
import MyTasks from "../app/pages/MyTasks/MyTasks";
import Profile from "../app/pages/Profile";
import NotFound from "../app/pages/NotFound";

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
				element: <Kanbans /> 
			},
			{ 
				path: "/my-tasks", 
				element: <MyTasks /> 
			},
			{ 
				path: "/profile", 
				element: <Profile /> 
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