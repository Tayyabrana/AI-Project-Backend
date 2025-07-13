const database = require("../config/database");

module.exports = class Assignment {
    static create(params) {
        return database.query(
            `INSERT INTO assignments 
       (employee_id, task_id, occupied_start_time, occupied_end_time, extra_time, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
            [
                params.employee_id,
                params.task_id,
                params.occupied_start_time,
                params.occupied_end_time,
                params.extra_time || 0,
                params.status || 0,
            ]
        );
    }

    static fetchAll() {
        return database.query(
            `SELECT a.*, e.name AS employee_name, t.task_name, f.feature_name, p.project_name
       FROM assignments a
       LEFT JOIN employees e ON a.employee_id = e.id
       LEFT JOIN tasks t ON a.task_id = t.id
       LEFT JOIN features f ON t.feature_id = f.id
       LEFT JOIN projects p ON f.project_id = p.id
       ORDER BY a.created_at DESC`
        );
    }

    static fetchById(id) {
        return database.query(
            `SELECT a.*, e.name AS employee_name, t.task_name, f.feature_name, p.project_name
       FROM assignments a
       LEFT JOIN employees e ON a.employee_id = e.id
       LEFT JOIN tasks t ON a.task_id = t.id
       LEFT JOIN features f ON t.feature_id = f.id
       LEFT JOIN projects p ON f.project_id = p.id
       WHERE a.id = ?`,
            [id]
        );
    }

    static update(id, params) {
        return database.query(
            `UPDATE assignments SET 
       employee_id = ?, task_id = ?, 
       occupied_start_time = ?, occupied_end_time = ?, 
       extra_time = ?, status = ?
       WHERE id = ?`,
            [
                params.employee_id,
                params.task_id,
                params.occupied_start_time,
                params.occupied_end_time,
                params.extra_time,
                params.status,
                id,
            ]
        );
    }

    static delete(id) {
        return database.query("DELETE FROM assignments WHERE id = ?", [id]);
    }

    static updateStatus(id, status) {
        return database.query("UPDATE assignments SET status = ? WHERE id = ?", [status, id]);
    }

    static fetchCount() {
        return database.query("SELECT COUNT(*) AS count FROM assignments");
    }

    static fetchByEmployee(employee_id) {
        return database.query(
            `SELECT a.*, t.task_name 
       FROM assignments a 
       LEFT JOIN tasks t ON a.task_id = t.id 
       WHERE a.employee_id = ? 
       ORDER BY a.created_at DESC`,
            [employee_id]
        );
    }

    static fetchByTask(task_id) {
        return database.query(
            `SELECT a.*, e.name AS employee_name 
       FROM assignments a 
       LEFT JOIN employees e ON a.employee_id = e.id 
       WHERE a.task_id = ? 
       ORDER BY a.created_at DESC`,
            [task_id]
        );
    }

    static fetchByProject(project_id) {
        return database.query(
            `SELECT a.*, e.name AS employee_name, t.task_name 
       FROM assignments a
       LEFT JOIN tasks t ON a.task_id = t.id
       LEFT JOIN features f ON t.feature_id = f.id
       WHERE f.project_id = ?
       ORDER BY a.created_at DESC`,
            [project_id]
        );
    }

    static fetchByStatus(status) {
        return database.query(
            "SELECT * FROM assignments WHERE status = ? ORDER BY created_at DESC",
            [status]
        );
    }

    static searchByEmployeeName(keyword) {
        const like = `%${keyword}%`;
        return database.query(
            `SELECT a.*, e.name AS employee_name, t.task_name 
       FROM assignments a 
       LEFT JOIN employees e ON a.employee_id = e.id 
       LEFT JOIN tasks t ON a.task_id = t.id 
       WHERE e.name LIKE ?
       ORDER BY a.created_at DESC`,
            [like]
        );
    }

    static checkTimeOverlap(employee_id, start, end) {
        return database.query(
            `SELECT * FROM assignments 
       WHERE employee_id = ? 
       AND (
         (occupied_start_time <= ? AND occupied_end_time >= ?) OR 
         (occupied_start_time <= ? AND occupied_end_time >= ?) OR 
         (occupied_start_time >= ? AND occupied_end_time <= ?)
       )`,
            [employee_id, start, start, end, end, start, end]
        );
    }
};
