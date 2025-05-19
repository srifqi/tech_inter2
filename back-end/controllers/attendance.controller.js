import AttendanceModel from "../models/attendance.model.js";

class AttendanceController {
    static async getUserAttendances(req, res) {
        try {
            const limit = Number(req.query.limit);
            const page = req.query.page ? Number(req.query.page) : null;
            
            const attendances = await AttendanceModel.findByUserId(req.params.id, limit, page);
            res.json(attendances);
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                message: "Database query failed.",
                sqlMessage: err.sqlMessage
            });
        }
    }

    // Add other controller methods here
}

export default AttendanceController; 