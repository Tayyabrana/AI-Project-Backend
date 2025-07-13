const Assignment = require("../models/Assignment");

exports.createAssignment = async (req, res, next) => {
    try {
        const [assignment] = await Assignment.create(req.body);
        res.status(200).json({
            responseCode: 200,
            message: "Assignment Created Successfully",
            assignment,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.getAllAssignments = async (req, res, next) => {
    try {
        const [assignments] = await Assignment.fetchAll();
        res.status(200).json({
            responseCode: 200,
            message: "Assignments Fetched Successfully",
            assignments,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.getAssignmentById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [assignment] = await Assignment.fetchById(id);
        res.status(200).json({
            responseCode: 200,
            message: "Assignment Fetched Successfully",
            assignment: assignment[0] || null,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.getAssignmentsByEmployee = async (req, res, next) => {
    try {
        const { employee_id } = req.params;
        const [assignments] = await Assignment.fetchByEmployee(employee_id);
        res.status(200).json({
            responseCode: 200,
            message: "Assignments Fetched By Employee Successfully",
            assignments,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.getAssignmentsByTask = async (req, res, next) => {
    try {
        const { task_id } = req.params;
        const [assignments] = await Assignment.fetchByTask(task_id);
        res.status(200).json({
            responseCode: 200,
            message: "Assignments Fetched By Task Successfully",
            assignments,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.getAssignmentsByProject = async (req, res, next) => {
    try {
        const { project_id } = req.params;
        const [assignments] = await Assignment.fetchByProject(project_id);
        res.status(200).json({
            responseCode: 200,
            message: "Assignments Fetched By Project Successfully",
            assignments,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.getAssignmentsByStatus = async (req, res, next) => {
    try {
        const { status } = req.params;
        const [assignments] = await Assignment.fetchByStatus(status);
        res.status(200).json({
            responseCode: 200,
            message: "Assignments Fetched By Status Successfully",
            assignments,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.updateAssignment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [result] = await Assignment.update(id, req.body);
        const success = result.affectedRows === 1;
        res.status(200).json({
            responseCode: 200,
            message: success ? "Assignment Updated Successfully" : "No Assignment Updated",
            success,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.deleteAssignment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [result] = await Assignment.delete(id);
        const success = result.affectedRows === 1;
        res.status(200).json({
            responseCode: 200,
            message: success ? "Assignment Deleted Successfully" : "No Assignment Found",
            success,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.updateStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const [result] = await Assignment.updateStatus(id, status);
        const success = result.affectedRows === 1;
        res.status(200).json({
            responseCode: 200,
            message: success ? "Status Updated Successfully" : "No Status Updated",
            success,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.getTotalAssignments = async (req, res, next) => {
    try {
        const [[count]] = await Assignment.fetchCount();
        res.status(200).json({
            responseCode: 200,
            message: "Assignment Count Fetched Successfully",
            total: count.count,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.searchAssignmentsByEmployee = async (req, res, next) => {
    try {
        const { keyword } = req.query;
        const [assignments] = await Assignment.searchByEmployeeName(keyword || "");
        res.status(200).json({
            responseCode: 200,
            message: "Assignments Searched Successfully",
            assignments,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.checkTimeOverlap = async (req, res, next) => {
    try {
        const { employee_id, occupied_start_time, occupied_end_time } = req.body;
        const [conflicts] = await Assignment.checkTimeOverlap(
            employee_id,
            occupied_start_time,
            occupied_end_time
        );
        res.status(200).json({
            responseCode: 200,
            message: "Time Overlap Check Completed",
            conflicts,
        });
    } catch (error) {
        console.log(error);
    }
};
