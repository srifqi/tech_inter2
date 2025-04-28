import { useEffect, useState } from "react";
import axios from "axios";

const BE_ROOT_URL = import.meta.env.VITE_BE_ROOT_URL;

/**
 * A component showing a list of registered employees
 */
function UserTable({ limit, page }) {
	const [userList, setUserList] = useState([]);

	useEffect(() => {
		const options = {
			withCredentials: true,
			params: { limit, page }
		};
		axios.get(BE_ROOT_URL + "users", options)
			.then(res => {
				setUserList(res.data);
			})
			.catch(() => setUserList([]));
	}, [limit, page]);

	return (
		<table className="table">
			<thead>
				<tr>
					<th scope="role">Nama</th>
					<th scope="role">Divisi</th>
					<th scope="role">Jabatan</th>
					<th scope="role">Laporan Terakhir</th>
					<th scope="role">Bukti Foto Terakhir</th>
					<th scope="role">Status Hari Ini</th>
				</tr>
			</thead>
			<tbody>
				{userList.map((item, index) => (
					<tr key={item.user_id}>
						<td><a href={"/karyawan/" + item.user_id}>{item.full_name}</a></td>
						<td>{item.department}</td>
						<td>{item.position}</td>
						<td>{item.check_in_date === null ? "-" : item.check_in_date}</td>
						<td>{item.photo_path === null ? "-" : <a href={BE_ROOT_URL + "uploads/" + item.photo_path} target="_blank">📷 Lihat Foto</a>}</td>
						<td>{item.is_check_in_today === null ? <span className="text-danger">Absen</span> : <span className="text-success">Hadir</span>}</td>
					</tr>
				))}
				{userList.length < 1 && <tr key="0"><td colSpan="6" className="text-center">(tabel kosong)</td></tr>}
			</tbody>
		</table>
	);
}

export default UserTable;
