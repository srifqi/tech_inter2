import { useEffect, useState } from "react";
import axios from "axios";

const BE_ROOT_URL = import.meta.env.VITE_BE_ROOT_URL;

/**
 * A component showing an information table of an employee with given ID
 */
function UserInfo({ userId, handleNotExists }) {
	const [userInfo, setUserInfo] = useState({
		full_name: "",
		department: "",
		position: "",
		email: "",
		phone: "",
		join_date: ""
	});
	const [formMessage, setFormMessage] = useState(<></>);
	const [tableLoadTime, setTableLoadTime] = useState(Date.now());

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
			await axios.put(BE_ROOT_URL + "users/" + userInfo.user_id, {
				full_name: userInfo.full_name,
				department: userInfo.department,
				position: userInfo.position,
				email: userInfo.email,
				phone: userInfo.phone,
				join_date: userInfo.join_date
			}, { withCredentials: true });
			setTableLoadTime(Date.now());
			setFormMessage(<p className="mt-3 text-success">Informasi karyawan berhasil diubah!</p>);
		} catch (error) {
			console.error(error);
			setFormMessage(<p className="mt-3 text-danger">Informasi karyawan gagal diubah.</p>);
		}
	}

	useEffect(() => {
		if (userId >= 1) {
			const options = {
				withCredentials: true
			};
			axios.get(BE_ROOT_URL + "users/" + userId + "", options)
				.then(res => {
					setUserInfo(res.data);
				})
				.catch(() => {
					setUserInfo({});
					handleNotExists();
				});
		}
	}, [userId, tableLoadTime]);

	return (
		<form onSubmit={handleFormSubmit}>
			<table className="table">
				<tbody>
					<tr>
						<th scope="row">ID</th>
						<td>{userInfo.user_id}</td>
					</tr>
					<tr>
						<th scope="row">Nama Pengguna</th>
						<td>{userInfo.username}</td>
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
				<input type="submit" className="btn btn-primary" value="Simpan Perubahan" />
			</p>
			{formMessage}
		</form>
	);
}

export default UserInfo;
