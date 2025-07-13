const router = require("express").Router();
const taskController = require("../controllers/task");

router.post("/create", taskController.createTask);
router.get("/all", taskController.getAllTasks);
router.get("/total", taskController.getTotalTasks);
router.get("/get/:id", taskController.getTaskById);
router.get("/feature/:feature_id", taskController.getTasksByFeature);
router.get("/project/:project_id", taskController.getTasksByProject);
router.get("/status/:status", taskController.getTasksByStatus);
router.put("/update/:id", taskController.updateTask);
router.delete("/delete/:id", taskController.deleteTask);
router.patch("/status/:id", taskController.updateStatus);
router.get("/search", taskController.searchTasks);

module.exports = router;
