import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { useAuth } from "./AuthContext";
import Home from "../pages/Home";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";

/**
 * A component protecting its children/routes
 */
function ProtectedRoute({ children }) {
	const { user } = useAuth();
	if (user) {
		return children;
	} else {
		return <Navigate to="/login" />
	}
}

/**
 * A component routing pages
 */
function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="/" element={
					<ProtectedRoute>
						<Home />
					</ProtectedRoute>
				} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
}

export default AppRoutes;
