import { useAuth } from "../src/AuthContext";
import { useNavigate } from "react-router";
import { useState } from "react";
import axios from "axios";

const BE_ROOT_URL = import.meta.env.VITE_BE_ROOT_URL;

/**
 * A page showing a form to add a new employee
 */
function NewEmployee() {
	const [userInfo, setUserInfo] = useState({
		roles: "employee",
		username: "",
		password: "",
		full_name: "",
		department: "",
		position: "",
		email: "",
		phone: "",
		join_date: ""
	});
	const [formMessage, setFormMessage] = useState(<></>);

	const navigate = useNavigate();

	function handleChange(ev) {
		const { name, value } = ev.target;
		setUserInfo((prev) => ({
			...prev,
			[name]: value
		}));
	}

	async function handleFormSubmit(ev) {
		ev.preventDefault();
		try {
			const response = await axios.post(BE_ROOT_URL + "users", {
				roles: userInfo.roles,
				username: userInfo.username,
				password: userInfo.password,
				full_name: userInfo.full_name,
				department: userInfo.department,
				position: userInfo.position,
				email: userInfo.email,
				phone: userInfo.phone,
				join_date: userInfo.join_date,
			}, { withCredentials: true });
			setFormMessage(<p className="mt-3 text-end text-success">Karyawan baru berhasil ditambahkan!</p>);
			navigate("/karyawan/" + response.data.user_id);
		} catch (error) {
			console.error(error);
			setFormMessage(<p className="mt-3 text-end text-danger">Karyawan baru gagal ditambahkan.</p>);
		}
	}

	const { user, logout } = useAuth();

	async function handleLogout() {
		await logout(); // auto-redirect
	}

	return (
		<>
			<nav className="navbar navbar-expand-lg bg-body-tertiary">
				<div className="container-fluid">
					<a className="navbar-brand" href="/">Kelola Karyawan</a>
					<button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbar" aria-controls="navbar">
						<span className="navbar-toggler-icon"></span>
					</button>
					<div className="collapse navbar-collapse" id="navbar">
						<ul className="navbar-nav ms-auto mb-2 mb-lg-0">
							<li className="nav-item">
								<button className="nav-link" onClick={handleLogout}>Keluar</button>
							</li>
						</ul>
					</div>
				</div>
			</nav>
			<div className="container">
				<p className="mt-3 mx-3">Selamat datang di aplikasi presensi, {user.full_name}!</p>
				<h4 className="mx-3">Tambah Karyawan Baru</h4>
				<p className="mx-3"><a href="/">← Kembali ke daftar karyawan</a></p>
				<div className="card m-2">
					<div className="card-body">
						<h5 className="card-title">Data Diri</h5>
						<form onSubmit={handleFormSubmit}>
							<table className="table">
								<tbody>
									<tr>
										<th scope="row">Jenis Akun</th>
										<td>
											<select className="form-select" name="roles" value={userInfo.roles} onChange={handleChange} required>
												<option value="employee" selected>Karyawan</option>
												<option value="admin">Admin</option>
											</select>
										</td>
									</tr>
									<tr>
										<th scope="row">Nama Pengguna</th>
										<td><input type="text" className="form-control" name="username" value={userInfo.username} onChange={handleChange} required /></td>
									</tr>
									<tr>
										<th scope="row">Sandi</th>
										<td><input type="password" className="form-control" name="password" value={userInfo.password} onChange={handleChange} required /></td>
									</tr>
									<tr>
										<th scope="row">Nama Lengkap</th>
										<td><input type="text" className="form-control" name="full_name" value={userInfo.full_name} onChange={handleChange} required /></td>
									</tr>
									<tr>
										<th scope="row">Divisi</th>
										<td><input type="text" className="form-control" name="department" value={userInfo.department} onChange={handleChange} required /></td>
									</tr>
									<tr>
										<th scope="row">Jabatan</th>
										<td><input type="text" className="form-control" name="position" value={userInfo.position} onChange={handleChange} required /></td>
									</tr>
									<tr>
										<th scope="row">E-mail</th>
										<td><input type="email" className="form-control" name="email" value={userInfo.email} onChange={handleChange} required /></td>
									</tr>
									<tr>
										<th scope="row">Telepon</th>
										<td><input type="text" className="form-control" name="phone" value={userInfo.phone} onChange={handleChange} required /></td>
									</tr>
									<tr>
										<th scope="row">Tanggal Masuk</th>
										<td><input type="date" className="form-control" name="join_date" value={userInfo.join_date} onChange={handleChange} required /></td>
									</tr>
								</tbody>
							</table>
							<p className="text-end">
								<input type="submit" className="btn btn-primary" value="Tambahkan Karyawan" />
							</p>
							{formMessage}
						</form>
					</div>
				</div>
			</div>
		</>
	);
}

export default NewEmployee;

