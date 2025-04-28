import { useEffect, useRef, useState } from "react";
import axios from "axios";

const BE_ROOT_URL = import.meta.env.VITE_BE_ROOT_URL;

/**
 * A component showing a form to submit attendance
 */
function SubmitAttendance({ userId, denySubmit, setTableLoadTime }) {
	const [attendanceDate, setAttendanceDate] = useState("");
	const [attendanceTime, setAttendanceTime] = useState("");
	const [selectedFile, setSelectedFile] = useState(null);
	const [formMessage, setFormMessage] = useState(null);

	const fileSelectionRef = useRef();

	function handleFileChange(ev) {
		setSelectedFile(ev.target.files[0]);
	}

	async function handleSubmitAttendance(ev) {
		ev.preventDefault();

		const formData = new FormData();
		formData.append("image", selectedFile);

		let hasUpload = false;
		try {
			const resFileUpload = await axios.post(BE_ROOT_URL + "users/" + userId + "/attendances/upload", formData, {
				headers: {
					"Content-Type": "multipart/form-data"
				},
				withCredentials: true
			});

			fileSelectionRef.current.value = "";
			setFormMessage(<p>Foto berhasil diunggah!</p>);
			hasUpload = true;

			await axios.post(BE_ROOT_URL + "users/" + userId + "/attendances",
				{ photo_path: resFileUpload.data.fileName },
				{ withCredentials: true });

			setFormMessage(<p className="mt-3 text-success">Foto berhasil diunggah dan presensi berhasil disimpan!</p>);
			setTableLoadTime(Date.now());
		} catch (error) {
			console.error(error);
			if (!hasUpload) {
				setFormMessage(<p className="mt-3 text-danger">Foto gagal diunggah.</p>);
			} else {
				setFormMessage(<p className="mt-3 text-danger">Foto berhasil diunggah, tetapi gagal menyimpan presensi.</p>);
			}
		}
	}

	useEffect(() => {
		function updateDateTime() {
			const now = new Date();
			setAttendanceDate(`${now.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`);
			setAttendanceTime(`${now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`);
		}

		updateDateTime();

		const intervalId = setInterval(() => {
			updateDateTime();
		}, 200);

		return () => clearInterval(intervalId);
	}, []);

	return (
		<>
			<form onSubmit={handleSubmitAttendance}>
				<div className="mb-3">
					<label htmlFor="attendanceDate">Tanggal</label>
					<input type="text" className="form-control" id="attendanceDate" value={attendanceDate} readOnly />
				</div>
				<div className="mb-3">
					<label htmlFor="attendanceTime">Waktu</label>
					<input type="text" className="form-control" id="attendanceTime" value={attendanceTime} readOnly />
				</div>
				<div className="mb-3">
					<label htmlFor="attendancePhoto">Dokumentasi (Bukti Foto)</label>
					<input type="file" className="form-control" id="attendancePhoto" accept="image/*" onChange={handleFileChange} ref={fileSelectionRef} required disabled={denySubmit} />
				</div>
				<input type="submit" className="btn btn-primary" value="Catat Presensi" disabled={denySubmit} />
			</form>
			{formMessage}
			{denySubmit ? <p className="mt-3 text-success">Anda sudah presensi hari ini.</p> : <p className="mt-3 text-primary">Silakan presensi untuk hari ini.</p>}
		</>
	);
}

export default SubmitAttendance;
