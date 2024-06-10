import Sidebar from "app/components/Sidebar";
import Navbar from "app/components/Navbar";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function AdminLayout() {
	const { userData } = useSelector((state) => state.auth);

	if (!userData) {
		return <Navigate to={'/login'} replace />;
	}

	return (
		<div className="p-2 bg-admin">
			<div className="grid grid-cols-12">
				<div className="col-span-2">
					<Sidebar />
				</div>
				<div className="col-span-10 px-4 relative">
					<Navbar />
					<Outlet />
				</div>
			</div>
		</div>
	);
}

export default AdminLayout;
