const router = require("express").Router();
const projectController = require("../controllers/project");

router.post("/create", projectController.createProject);
router.get("/all", projectController.getAllProjects);
router.get("/total", projectController.getTotalProjects);
router.get("/get/:id", projectController.getProjectById);
router.put("/update/:id", projectController.updateProject);
router.delete("/delete/:id", projectController.deleteProject);
router.patch("/status/:id", projectController.updateStatus);
router.get("/search", projectController.searchProjects);

module.exports = router;
