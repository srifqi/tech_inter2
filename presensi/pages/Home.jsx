import { useAuth } from "../src/AuthContext";
import { useState } from "react";
import SubmitAttendance from "../components/SubmitAttendance";
import AttendanceTable from "../components/AttendanceTable";

/**
 * A page showing home screen or dashboard consisting of a form to submit daily attendance and a list of submitted attendance
 */
function Home() {
	const [denySubmit, setDenySubmit] = useState(true);
	const [tableLoadTime, setTableLoadTime] = useState(Date.now());

	const { user, logout } = useAuth();

	async function handleLogout() {
		await logout(); // auto-redirect
	}

	function f(n) {
		if (n < 10) {
			return "0" + n;
		}
		return n;
	}

	function handleAttendanceTableLoad(rows) {
		const now = new Date();
		const dateString = now.getFullYear() + "-" + f(now.getMonth() + 1) + "-" + f(now.getDate());
		console.log(dateString);
		setDenySubmit(rows.reduce((acc, val) => acc || (val.check_in_date === dateString), false));
	}

	return (
		<>
			<nav className="navbar navbar-expand-lg bg-body-tertiary">
				<div className="container-fluid">
					<a className="navbar-brand" href="/">Presensi Karyawan</a>
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
				<div className="d-flex flex-wrap">
					<div className="card m-2 flex-fill">
						<div className="card-body">
							<h5 className="card-title">Catat Presensi Harian</h5>
							<SubmitAttendance userId={user.user_id} denySubmit={denySubmit} setTableLoadTime={setTableLoadTime} />
						</div>
					</div>
					<div className="card m-2 flex-fill">
						<div className="card-body">
							<h5 className="card-title">Riwayat (7 Entri Terakhir)</h5>
							<AttendanceTable userId={user.user_id} limit={7} time={tableLoadTime} callback={handleAttendanceTableLoad} />
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Home;
