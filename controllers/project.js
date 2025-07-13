const Project = require("../models/Project");

exports.createProject = async (req, res, next) => {
    try {
        const [project] = await Project.create(req.body);
        res.status(200).json({
            responseCode: 200,
            message: "Project Created Successfully",
            project: project,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.getTotalProjects = async (req, res, next) => {
    try {
        const [[project]] = await Project.fetchCount();
        res.status(200).json({
            responseCode: 200,
            message: "Projects Count Fetched Successfully",
            total: project.count,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.getAllProjects = async (req, res, next) => {
    try {
        const [projects] = await Project.fetchAll();
        res.status(200).json({
            responseCode: 200,
            message: "Projects Fetched Successfully",
            projects: projects,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.getProjectById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [project] = await Project.fetchById(id);
        res.status(200).json({
            responseCode: 200,
            message: "Project Fetched Successfully",
            project: project[0] || null,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.updateProject = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [result] = await Project.update(id, req.body);
        const success = result.affectedRows === 1;
        res.status(200).json({
            responseCode: 200,
            message: success
                ? "Project Updated Successfully"
                : "No Project Updated",
            success,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.deleteProject = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [result] = await Project.delete(id);
        const success = result.affectedRows === 1;
        res.status(200).json({
            responseCode: 200,
            message: success
                ? "Project Deleted Successfully"
                : "No Project Found",
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
        const [result] = await Project.updateStatus(id, status);
        const success = result.affectedRows === 1;
        res.status(200).json({
            responseCode: 200,
            message: success
                ? "Status Updated Successfully"
                : "No Status Updated",
            success,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.searchProjects = async (req, res, next) => {
    try {
        const { keyword } = req.query;
        const [projects] = await Project.searchByKeyword(keyword || "");
        res.status(200).json({
            responseCode: 200,
            message: "Projects Searched Successfully",
            projects,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.getActiveProjects = async (req, res, next) => {
    try {
        const [projects] = await Project.fetchActive();
        res.status(200).json({
            responseCode: 200,
            message: "Active Projects Fetched Successfully",
            projects,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.getProjectsByType = async (req, res, next) => {
    try {
        const { type } = req.params;
        const [projects] = await Project.fetchByType(type);
        res.status(200).json({
            responseCode: 200,
            message: "Projects Fetched By Type Successfully",
            projects,
        });
    } catch (error) {
        console.log(error);
    }
};
