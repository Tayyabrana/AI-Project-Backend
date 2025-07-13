const database = require("../config/database");

module.exports = class Feature {
    static create(params) {
        return database.query(
            `INSERT INTO features 
       (project_id, feature_name, feature_description, common_issues, approach, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
            [
                params.project_id,
                params.feature_name,
                params.feature_description,
                params.common_issues,
                params.approach,
                params.status || 0,
            ]
        );
    }

    static fetchAll() {
        return database.query(
            `SELECT f.*, p.project_name 
       FROM features f 
       LEFT JOIN projects p ON f.project_id = p.id 
       ORDER BY f.created_at DESC`
        );
    }

    static fetchById(id) {
        return database.query(
            `SELECT f.*, p.project_name 
       FROM features f 
       LEFT JOIN projects p ON f.project_id = p.id 
       WHERE f.id = ?`,
            [id]
        );
    }

    static fetchByProject(project_id) {
        return database.query(
            `SELECT * FROM features WHERE project_id = ? ORDER BY created_at DESC`,
            [project_id]
        );
    }

    static update(id, params) {
        return database.query(
            `UPDATE features SET 
       project_id = ?, feature_name = ?, feature_description = ?, 
       common_issues = ?, approach = ?, status = ?
       WHERE id = ?`,
            [
                params.project_id,
                params.feature_name,
                params.feature_description,
                params.common_issues,
                params.approach,
                params.status,
                id,
            ]
        );
    }

    static delete(id) {
        return database.query("DELETE FROM features WHERE id = ?", [id]);
    }

    static updateStatus(id, status) {
        return database.query("UPDATE features SET status = ? WHERE id = ?", [status, id]);
    }

    static fetchCount() {
        return database.query("SELECT COUNT(*) AS count FROM features");
    }

    static searchByKeyword(keyword) {
        const like = `%${keyword}%`;
        return database.query(
            `SELECT f.*, p.project_name 
       FROM features f 
       LEFT JOIN projects p ON f.project_id = p.id
       WHERE f.feature_name LIKE ? OR f.feature_description LIKE ? OR f.common_issues LIKE ? OR f.approach LIKE ?
       ORDER BY f.created_at DESC`,
            [like, like, like, like]
        );
    }
};
