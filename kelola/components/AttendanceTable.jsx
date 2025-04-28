import { useEffect, useState } from "react";
import axios from "axios";

const BE_ROOT_URL = import.meta.env.VITE_BE_ROOT_URL;

/**
 * A component showing an attendance table of a user with given ID
 */
function AttendanceTable({ userId, limit, page }) {
	const [attendanceHistory, setAttendanceHistory] = useState([]);

	useEffect(() => {
		if (userId >= 1) {
			const options = {
				withCredentials: true,
				params: { limit, page }
			};
			axios.get(BE_ROOT_URL + "users/" + userId + "/attendances", options)
				.then(res => {
					setAttendanceHistory(res.data);
				})
				.catch(() => setAttendanceHistory([]));
		}
	}, [userId, limit, page]);

	return (
		<table className="table">
			<thead>
				<tr>
					<th scope="role">Tanggal</th>
					<th scope="role">Waktu</th>
					<th scope="role">Lihat Foto</th>
				</tr>
			</thead>
			<tbody>
				{attendanceHistory.map((item, index) => (
					<tr key={item.attendance_id}>
						<td>{item.check_in_date}</td>
						<td>{item.check_in_time}</td>
						<td><a href={BE_ROOT_URL + "uploads/" + item.photo_path} target="_blank">📷 Lihat Foto</a></td>
					</tr>
				))}
				{attendanceHistory.length < 1 && <tr key="0"><td colSpan="3" className="text-center">(tabel kosong)</td></tr>}
			</tbody>
		</table>
	);
}

export default AttendanceTable;
