const database = require("../config/database");

module.exports = class Project {
    static create(params) {
        return database.query(
            `INSERT INTO projects
             (project_name, tech_stack, description, project_type, project_status, status)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                params.project_name,
                params.tech_stack,
                params.description,
                params.project_type,
                params.project_status,
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
             SET project_name = ?, tech_stack = ?, description = ?, project_type = ?, project_status = ?, status = ?
             WHERE id = ?`,
            [
                params.project_name,
                params.tech_stack,
                params.description,
                params.project_type,
                params.project_status,
                params.status,
                id,
            ]
        );
    }

    static updateNameAndDescription(id, name, description) {
        return database.query(
            `UPDATE projects SET project_name = ?, description = ? WHERE id = ?`,
            [name, description, id]
        );
    }

    static updateTechStack(id, tech_stack) {
        return database.query(
            `UPDATE projects SET tech_stack = ? WHERE id = ?`,
            [tech_stack, id]
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
