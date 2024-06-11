import { createBrowserRouter } from "react-router-dom";
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
