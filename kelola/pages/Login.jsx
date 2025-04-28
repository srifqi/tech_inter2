import { useAuth } from "../src/AuthContext";
import { useNavigate } from "react-router";
import { useState } from "react";

/**
 * A page showing a login form
 */
function Login() {
	const [credUser, setCredUser] = useState("");
	const [credPass, setCredPass] = useState("");
	const [errorMessage, setErrorMessage] = useState(null);

	const { login } = useAuth();
	const navigate = useNavigate();

	async function handleSubmit(ev) {
		ev.preventDefault();
		if (await login({ credUser, credPass })) {
			setErrorMessage(null);
			navigate("/");
		} else {
			setErrorMessage(
				<div>
					<p className="text-danger">Nama pengguna atau sandi salah.</p>
				</div>
			);
		}
	}

	return (
		<div className="card login-card">
			<div className="card-body">
				<h5 className="card-title text-center">Masuk</h5>
				<p className="card-text text-center">Silakan masuk menggunakan aplikasi kelola karyawan.</p>
				<form onSubmit={handleSubmit}>
					<div className="mb-3">
						<label htmlFor="username">Nama Pengguna</label>
						<input type="text" className="form-control" id="username" value={credUser} onChange={e => setCredUser(e.target.value)} required autoFocus />
					</div>
					<div className="mb-3">
						<label htmlFor="password">Sandi</label>
						<input type="password" className="form-control" id="password" value={credPass} onChange={e => setCredPass(e.target.value)} required />
					</div>
					{errorMessage}
					<div className="text-end">
						<input type="submit" className="btn btn-primary" value="Masuk Log" />
					</div>
				</form>
			</div>
		</div>
	);
}

export default Login;
