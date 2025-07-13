const database = require("../config/database");

module.exports = class Project {
    static create(params) {
        return database.query(
            `INSERT INTO projects
             (project_name, tech_stack, description, project_type, project_status, start_time, end_time, estimated_end_time, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                params.project_name,
                params.tech_stack,
                params.description,
                params.project_type,
                params.project_status,
                params.start_time,
                params.end_time,
                params.estimated_end_time,
                params.status || 0,
            ]
        );
    }

    static fetchAll() {
        return database.query("SELECT * FROM projects ORDER BY created_at DESC");
    }

    static fetchById(id) {
        return database.query("SELECT * FROM projects WHERE id = ?", [id]);
    }

    static update(id, params) {
        return database.query(
            `UPDATE projects
             SET project_name = ?, tech_stack = ?, description = ?, project_type = ?, project_status = ?,
                 start_time = ?, end_time = ?, estimated_end_time = ?, status = ?
             WHERE id = ?`,
            [
                params.project_name,
                params.tech_stack,
                params.description,
                params.project_type,
                params.project_status,
                params.start_time,
                params.end_time,
                params.estimated_end_time,
                params.status,
                id,
            ]
        );
    }

    static delete(id) {
        return database.query("DELETE FROM projects WHERE id = ?", [id]);
    }

    static updateStatus(id, status) {
        return database.query("UPDATE projects SET status = ? WHERE id = ?", [status, id]);
    }

    static fetchCount() {
        return database.query("SELECT COUNT(*) AS count FROM projects");
    }

    static searchByKeyword(keyword) {
        const likeKeyword = `%${keyword}%`;
        return database.query(
            `SELECT * FROM projects 
       WHERE project_name LIKE ? OR description LIKE ? 
       ORDER BY created_at DESC`,
            [likeKeyword, likeKeyword]
        );
    }

    static fetchActive() {
        return database.query("SELECT * FROM projects WHERE status = 1 ORDER BY created_at DESC");
    }

    static fetchByType(project_type) {
        return database.query(
            "SELECT * FROM projects WHERE project_type = ? ORDER BY created_at DESC",
            [project_type]
        );
    }
};
