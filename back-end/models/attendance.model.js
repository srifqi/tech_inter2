import dbPool from "../db.js";

class AttendanceModel {
    static async findByUserId(userId, limit, page) {
        let queryString = "SELECT attendance_id, check_in_date, check_in_time, photo_path " +
            "FROM attendances " +
            "WHERE user_id = ? " +
            "ORDER BY check_in_date DESC " +
            "LIMIT ?";
        let queryParameters = [userId, limit];

        if (page) {
            queryString += " OFFSET ?;";
            queryParameters.push((page - 1) * limit);
        } else {
            queryString += ";";
        }

        const [rows] = await dbPool.query(queryString, queryParameters);
        return rows;
    }

    // Add other model methods here 
}

export default AttendanceModel; 