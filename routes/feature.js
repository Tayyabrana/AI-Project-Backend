const router = require("express").Router();
const featureController = require("../controllers/feature");

router.post("/create", featureController.createFeature);
router.get("/all", featureController.getAllFeatures);
router.get("/total", featureController.getTotalFeatures);
router.get("/get/:id", featureController.getFeatureById);
router.get("/project/:project_id", featureController.getFeaturesByProject);
router.put("/update/:id", featureController.updateFeature);
router.delete("/delete/:id", featureController.deleteFeature);
router.patch("/status/:id", featureController.updateStatus);
router.get("/search", featureController.searchFeatures);

module.exports = router;
