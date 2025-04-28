import { useAuth } from "../src/AuthContext";
import UserTable from "../components/UserTable";

/**
 * A page showing home screen or dashboard consisting of a list of registered employees
 */
function Home() {
	const { user, logout } = useAuth();

	function handleLogout() {
		logout(); // auto-redirect
	}

	return (
		<>
			<nav className="navbar navbar-expand-lg bg-body-tertiary">
				<div className="container-fluid">
					<a className="navbar-brand" href="/">Kelola Karyawan</a>
					<button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbar">
						<span className="navbar-toggler-icon"></span>
					</button>
					<div className="collapse navbar-collapse" id="navbarContent">
						<ul className="navbar-nav ms-auto mb-2 mb-lg-0">
							<li className="nav-item">
								<button className="nav-link" onClick={handleLogout}>Keluar</button>
							</li>
						</ul>
					</div>
				</div>
			</nav>
			<div className="container">
				<p className="mt-3 mx-3">Selamat datang di aplikasi kelola karyawan, {user.full_name}!</p>
				<div className="card m-2">
					<div className="card-body overflow-x-auto">
						<div className="card-title d-flex">
							<h5 className="flex-fill">Daftar Karyawan</h5>
							<div className="flex-fill text-end">
								<a className="btn btn-success" href="/karyawan/baru">+ Tambah Karyawan Baru</a>
							</div>
						</div>
						<UserTable limit={7} page={1} />
					</div>
				</div>
			</div>
		</>
	);
}

export default Home;
