const database = require("../config/database");

module.exports = class Employee {
    static create(params) {
        return database.query(
            `INSERT INTO employees 
       (name, age, experience, max_hours, designation, skills, expertise, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                params.name,
                params.age,
                params.experience,
                params.max_hours,
                params.designation,
                params.skills,
                params.expertise,
                params.status || 1,
            ]
        );
    }

    static fetchAll() {
        return database.query("SELECT * FROM employees ORDER BY created_at DESC");
    }

    static fetchById(id) {
        return database.query("SELECT * FROM employees WHERE id = ?", [id]);
    }

    static update(id, params) {
        return database.query(
            `UPDATE employees SET 
       name = ?, age = ?, experience = ?, max_hours = ?, 
       designation = ?, skills = ?, expertise = ?, status = ? 
       WHERE id = ?`,
            [
                params.name,
                params.age,
                params.experience,
                params.max_hours,
                params.designation,
                params.skills,
                params.expertise,
                params.status,
                id,
            ]
        );
    }

    static delete(id) {
        return database.query("DELETE FROM employees WHERE id = ?", [id]);
    }

    static updateStatus(id, status) {
        return database.query("UPDATE employees SET status = ? WHERE id = ?", [status, id]);
    }

    static fetchCount() {
        return database.query("SELECT COUNT(*) AS count FROM employees");
    }

    static searchByName(keyword) {
        const likeKeyword = `%${keyword}%`;
        return database.query(
            "SELECT * FROM employees WHERE name LIKE ? ORDER BY created_at DESC",
            [likeKeyword]
        );
    }

    static fetchActive() {
        return database.query("SELECT * FROM employees WHERE status = 1 ORDER BY created_at DESC");
    }

    static fetchByDesignation(designation) {
        return database.query(
            "SELECT * FROM employees WHERE designation = ? ORDER BY created_at DESC",
            [designation]
        );
    }

    static fetchBySkill(skill) {
        return database.query(
            "SELECT * FROM employees WHERE FIND_IN_SET(?, skills) ORDER BY created_at DESC",
            [skill]
        );
    }

    static fetchByExpertise(expertise) {
        return database.query(
            "SELECT * FROM employees WHERE FIND_IN_SET(?, expertise) ORDER BY created_at DESC",
            [expertise]
        );
    }
};
