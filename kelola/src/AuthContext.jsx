import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const BE_ROOT_URL = import.meta.env.VITE_BE_ROOT_URL;

/**
 * A context for managing auth
 */
const AuthContext = createContext();

/**
 * A component providing authentication functions such as login and logout as well as user data
 */
export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [checkOngoing, setCheckOngoing] = useState(true);

	useEffect(() => {
		axios.get(BE_ROOT_URL + "auth/check", { withCredentials: true })
			.then(res => setUser(res.data))
			.catch(() => setUser(null))
			.finally(() => setCheckOngoing(false));
	}, []);

	async function login({ credUser, credPass }) {
		try {
			const response = await axios.post(BE_ROOT_URL + "auth/login/admin", {
				username: credUser,
				password: credPass
			}, { withCredentials: true });
			setUser(response.data.user);
			return true;
		} catch (error) {
			setUser(null);
			return false;
		}
	}

	async function logout() {
		try {
			await axios.get(BE_ROOT_URL + "auth/logout", { withCredentials: true });
		} catch (error) {
		}
		setUser(null);
	}

	if (checkOngoing) {
		return <></>;
	}

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

/**
 * A helper function to use the context for managing auth
 */
export function useAuth() {
	return useContext(AuthContext);
}
