
DROP TABLE IF EXISTS attendances;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
	user_id INT AUTO_INCREMENT PRIMARY KEY,
	username VARCHAR(64) UNIQUE NOT NULL,
	password_hash VARCHAR(255) NOT NULL,
	email VARCHAR(128) UNIQUE NOT NULL,
	roles ENUM('employee', 'admin') NOT NULL,
	full_name VARCHAR(128) NOT NULL,
	department VARCHAR(64),
	position VARCHAR(64),
	phone VARCHAR(24),
	join_date DATE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attendances (
	attendance_id INT AUTO_INCREMENT PRIMARY KEY,
	user_id INT NOT NULL,
	check_in_date DATE NOT NULL DEFAULT CURDATE(),
	check_in_time TIME NOT NULL DEFAULT CURTIME(),
	photo_path VARCHAR(255),
	FOREIGN KEY (user_id) REFERENCES users(user_id),
	UNIQUE (user_id, check_in_date)
);

DROP VIEW IF EXISTS users_attendance_summary;

CREATE VIEW users_attendance_summary AS
SELECT users.user_id, full_name, department, position, attendances_latest.attendance_id AS attendances_latest_id, check_in_date, check_in_time, photo_path, attendances_today.attendance_id AS attendances_today_id, is_check_in_today
FROM users
LEFT JOIN (
	SELECT attendance_id, attendances.user_id, check_in_date, check_in_time, photo_path
	FROM attendances
	INNER JOIN (
		SELECT user_id, MAX(check_in_date) AS latest_check_in
		FROM attendances
		GROUP BY user_id
	) AS attendances_last ON attendances.check_in_date = attendances_last.latest_check_in
	AND attendances.user_id = attendances_last.user_id
) AS attendances_latest ON users.user_id = attendances_latest.user_id
LEFT JOIN (
	SELECT attendance_id, user_id, check_in_date AS is_check_in_today
	FROM attendances
	WHERE check_in_date = CURDATE()
) AS attendances_today ON users.user_id = attendances_today.user_id
WHERE roles = "employee"
ORDER BY user_id ASC;

INSERT INTO users (username, password_hash, email, roles, full_name, department, position, phone, join_date, created_at, modified_at) VALUES
	("admin", "$2b$10$caaOMwSdBfnyxnx4fs9iV.OBJ4sT1nE5n7QXCrcsCDzeDW8uwrUqu", "admin1@example.com", "admin", "Admin PSDM", "PSDM", "Kepala PSDM", "08123456789006", "2024-03-31", "2024-03-31 08:00:00", "2024-03-31 08:00:00");