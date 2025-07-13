const Task = require("../models/Task");

exports.createTask = async (req, res, next) => {
    try {
        const [task] = await Task.create(req.body);
        res.status(200).json({
            responseCode: 200,
            message: "Task Created Successfully",
            task,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.getAllTasks = async (req, res, next) => {
    try {
        const [tasks] = await Task.fetchAll();
        res.status(200).json({
            responseCode: 200,
            message: "Tasks Fetched Successfully",
            tasks,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.getTaskById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [task] = await Task.fetchById(id);
        res.status(200).json({
            responseCode: 200,
            message: "Task Fetched Successfully",
            task: task[0] || null,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.getTasksByFeature = async (req, res, next) => {
    try {
        const { feature_id } = req.params;
        const [tasks] = await Task.fetchByFeature(feature_id);
        res.status(200).json({
            responseCode: 200,
            message: "Tasks Fetched By Feature Successfully",
            tasks,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.getTasksByProject = async (req, res, next) => {
    try {
        const { project_id } = req.params;
        const [tasks] = await Task.fetchByProject(project_id);
        res.status(200).json({
            responseCode: 200,
            message: "Tasks Fetched By Project Successfully",
            tasks,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.getTasksByStatus = async (req, res, next) => {
    try {
        const { status } = req.params;
        const [tasks] = await Task.fetchByStatus(status);
        res.status(200).json({
            responseCode: 200,
            message: "Tasks Fetched By Status Successfully",
            tasks,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.updateTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [result] = await Task.update(id, req.body);
        const success = result.affectedRows === 1;
        res.status(200).json({
            responseCode: 200,
            message: success ? "Task Updated Successfully" : "No Task Updated",
            success,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.deleteTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [result] = await Task.delete(id);
        const success = result.affectedRows === 1;
        res.status(200).json({
            responseCode: 200,
            message: success ? "Task Deleted Successfully" : "No Task Found",
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
        const [result] = await Task.updateStatus(id, status);
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

exports.getTotalTasks = async (req, res, next) => {
    try {
        const [[count]] = await Task.fetchCount();
        res.status(200).json({
            responseCode: 200,
            message: "Task Count Fetched Successfully",
            total: count.count,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.searchTasks = async (req, res, next) => {
    try {
        const { keyword } = req.query;
        const [tasks] = await Task.searchByKeyword(keyword || "");
        res.status(200).json({
            responseCode: 200,
            message: "Tasks Searched Successfully",
            tasks,
        });
    } catch (error) {
        console.log(error);
    }
};
