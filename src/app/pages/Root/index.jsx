import { Navigate } from "react-router-dom";

function Root() {
    return <Navigate to="/my-tasks" replace />
}

export default Root;