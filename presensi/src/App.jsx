import { AuthProvider } from "./AuthContext";
import AppRoutes from "./AppRoutes";

/**
 * The main app component
 */
function App() {
	return (
		<AuthProvider>
			<AppRoutes />
		</AuthProvider>
	);
}

export default App;
