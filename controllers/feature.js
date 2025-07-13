const Feature = require("../models/Feature");

exports.createFeature = async (req, res, next) => {
    try {
        const [feature] = await Feature.create(req.body);
        res.status(200).json({
            responseCode: 200,
            message: "Feature Created Successfully",
            feature,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.getAllFeatures = async (req, res, next) => {
    try {
        const [features] = await Feature.fetchAll();
        res.status(200).json({
            responseCode: 200,
            message: "Features Fetched Successfully",
            features,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.getFeatureById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [feature] = await Feature.fetchById(id);
        res.status(200).json({
            responseCode: 200,
            message: "Feature Fetched Successfully",
            feature: feature[0] || null,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.getFeaturesByProject = async (req, res, next) => {
    try {
        const { project_id } = req.params;
        const [features] = await Feature.fetchByProject(project_id);
        res.status(200).json({
            responseCode: 200,
            message: "Features Fetched By Project Successfully",
            features,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.updateFeature = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [result] = await Feature.update(id, req.body);
        const success = result.affectedRows === 1;
        res.status(200).json({
            responseCode: 200,
            message: success
                ? "Feature Updated Successfully"
                : "No Feature Updated",
            success,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.deleteFeature = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [result] = await Feature.delete(id);
        const success = result.affectedRows === 1;
        res.status(200).json({
            responseCode: 200,
            message: success
                ? "Feature Deleted Successfully"
                : "No Feature Found",
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
        const [result] = await Feature.updateStatus(id, status);
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

exports.getTotalFeatures = async (req, res, next) => {
    try {
        const [[count]] = await Feature.fetchCount();
        res.status(200).json({
            responseCode: 200,
            message: "Feature Count Fetched Successfully",
            total: count.count,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.searchFeatures = async (req, res, next) => {
    try {
        const { keyword } = req.query;
        const [features] = await Feature.searchByKeyword(keyword || "");
        res.status(200).json({
            responseCode: 200,
            message: "Features Searched Successfully",
            features,
        });
    } catch (error) {
        console.log(error);
    }
};
