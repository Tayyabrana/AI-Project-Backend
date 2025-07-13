const Employee = require("../models/Employee");

exports.createEmployee = async (req, res, next) => {
    try {
        const [employee] = await Employee.create(req.body);
        res.status(200).json({
            responseCode: 200,
            message: "Employee Created Successfully",
            employee: employee,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.getAllEmployees = async (req, res, next) => {
    try {
        const [employees] = await Employee.fetchAll();
        res.status(200).json({
            responseCode: 200,
            message: "Employees Fetched Successfully",
            employees,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.getEmployeeById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [employee] = await Employee.fetchById(id);
        res.status(200).json({
            responseCode: 200,
            message: "Employee Fetched Successfully",
            employee: employee[0] || null,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.updateEmployee = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [result] = await Employee.update(id, req.body);
        const success = result.affectedRows === 1;
        res.status(200).json({
            responseCode: 200,
            message: success
                ? "Employee Updated Successfully"
                : "No Employee Updated",
            success,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.deleteEmployee = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [result] = await Employee.delete(id);
        const success = result.affectedRows === 1;
        res.status(200).json({
            responseCode: 200,
            message: success
                ? "Employee Deleted Successfully"
                : "No Employee Found",
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
        const [result] = await Employee.updateStatus(id, status);
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

exports.getTotalEmployees = async (req, res, next) => {
    try {
        const [[count]] = await Employee.fetchCount();
        res.status(200).json({
            responseCode: 200,
            message: "Employee Count Fetched Successfully",
            total: count.count,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.searchEmployees = async (req, res, next) => {
    try {
        const { keyword } = req.query;
        const [employees] = await Employee.searchByName(keyword || "");
        res.status(200).json({
            responseCode: 200,
            message: "Employees Searched Successfully",
            employees,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.getEmployeesByDesignation = async (req, res, next) => {
    try {
        const { designation } = req.params;
        const [employees] = await Employee.fetchByDesignation(designation);
        res.status(200).json({
            responseCode: 200,
            message: "Employees Filtered By Designation",
            employees,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.getEmployeesBySkill = async (req, res, next) => {
    try {
        const { skill } = req.params;
        const [employees] = await Employee.fetchBySkill(skill);
        res.status(200).json({
            responseCode: 200,
            message: "Employees Filtered By Skill",
            employees,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.getEmployeesByExpertise = async (req, res, next) => {
    try {
        const { expertise } = req.params;
        const [employees] = await Employee.fetchByExpertise(expertise);
        res.status(200).json({
            responseCode: 200,
            message: "Employees Filtered By Expertise",
            employees,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.getActiveEmployees = async (req, res, next) => {
    try {
        const [employees] = await Employee.fetchActive();
        res.status(200).json({
            responseCode: 200,
            message: "Active Employees Fetched Successfully",
            employees,
        });
    } catch (error) {
        console.log(error);
    }
};
