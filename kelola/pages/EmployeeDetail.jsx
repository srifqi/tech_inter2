import { useState } from "react";
import { useParams } from "react-router";
import { useAuth } from "../src/AuthContext";
import UserInfo from "../components/UserInfo";
import AttendanceTable from "../components/AttendanceTable";
import NotFound from "./NotFound";

/**
 * A page showing an information table and a list of submitted attendance of an employee with given ID
 */
function EmployeeDetail() {
	const params = useParams();
	const { user, logout } = useAuth();
	const [userExists, setUserExists] = useState(true);

	async function handleLogout() {
		await logout(); // auto-redirect
	}

	function handleUserNotExists() {
		setUserExists(false);
	}

	if (!userExists) {
		return NotFound();
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
				<h4 className="mx-3">Detail Karyawan</h4>
				<p className="mx-3"><a href="/">← Kembali ke daftar karyawan</a></p>
				<div className="d-flex flex-wrap">
					<div className="card m-2 flex-fill">
						<div className="card-body">
							<h5 className="card-title">Data Diri</h5>
							<UserInfo userId={params.employeeId} handleNotExists={handleUserNotExists} />
						</div>
					</div>
					<div className="card m-2 flex-fill">
						<div className="card-body">
							<h5 className="card-title">Kehadiran (7 Entri Terakhir)</h5>
							<AttendanceTable userId={params.employeeId} limit={7} />
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default EmployeeDetail;
