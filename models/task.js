const database = require("../config/database");

module.exports = class Task {
    static create(params) {
        return database.query(
            `INSERT INTO tasks 
       (feature_id, task_name, task_description, task_time, status, issues, approach)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                params.feature_id,
                params.task_name,
                params.task_description,
                params.task_time,
                params.status || 0,
                params.issues,
                params.approach,
            ]
        );
    }

    static fetchAll() {
        return database.query(
            `SELECT t.*, f.feature_name, f.project_id 
       FROM tasks t 
       LEFT JOIN features f ON t.feature_id = f.id 
       ORDER BY t.created_at DESC`
        );
    }

    static fetchById(id) {
        return database.query(
            `SELECT t.*, f.feature_name, f.project_id 
       FROM tasks t 
       LEFT JOIN features f ON t.feature_id = f.id 
       WHERE t.id = ?`,
            [id]
        );
    }

    static fetchByFeature(feature_id) {
        return database.query(
            `SELECT * FROM tasks WHERE feature_id = ? ORDER BY created_at DESC`,
            [feature_id]
        );
    }

    static update(id, params) {
        return database.query(
            `UPDATE tasks SET 
       feature_id = ?, task_name = ?, task_description = ?, 
       task_time = ?, status = ?, issues = ?, approach = ?
       WHERE id = ?`,
            [
                params.feature_id,
                params.task_name,
                params.task_description,
                params.task_time,
                params.status,
                params.issues,
                params.approach,
                id,
            ]
        );
    }

    static delete(id) {
        return database.query("DELETE FROM tasks WHERE id = ?", [id]);
    }

    static updateStatus(id, status) {
        return database.query("UPDATE tasks SET status = ? WHERE id = ?", [status, id]);
    }

    static fetchCount() {
        return database.query("SELECT COUNT(*) AS count FROM tasks");
    }

    static searchByKeyword(keyword) {
        const like = `%${keyword}%`;
        return database.query(
            `SELECT t.*, f.feature_name 
       FROM tasks t 
       LEFT JOIN features f ON t.feature_id = f.id
       WHERE t.task_name LIKE ? OR t.task_description LIKE ? OR t.issues LIKE ? OR t.approach LIKE ?
       ORDER BY t.created_at DESC`,
            [like, like, like, like]
        );
    }

    static fetchByStatus(status) {
        return database.query(
            "SELECT * FROM tasks WHERE status = ? ORDER BY created_at DESC",
            [status]
        );
    }

    static fetchByProject(project_id) {
        return database.query(
            `SELECT t.* 
       FROM tasks t 
       JOIN features f ON t.feature_id = f.id 
       WHERE f.project_id = ?
       ORDER BY t.created_at DESC`,
            [project_id]
        );
    }
};
