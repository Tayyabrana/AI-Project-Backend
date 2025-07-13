const router = require("express").Router();
const assignmentController = require("../controllers/assignment");

router.post("/create", assignmentController.createAssignment);
router.get("/all", assignmentController.getAllAssignments);
router.get("/total", assignmentController.getTotalAssignments);
router.get("/get/:id", assignmentController.getAssignmentById);
router.get("/employee/:employee_id", assignmentController.getAssignmentsByEmployee);
router.get("/task/:task_id", assignmentController.getAssignmentsByTask);
router.get("/project/:project_id", assignmentController.getAssignmentsByProject);
router.get("/status/:status", assignmentController.getAssignmentsByStatus);
router.put("/update/:id", assignmentController.updateAssignment);
router.delete("/delete/:id", assignmentController.deleteAssignment);
router.patch("/status/:id", assignmentController.updateStatus);
router.get("/search", assignmentController.searchAssignmentsByEmployee);
router.post("/check-time-overlap", assignmentController.checkTimeOverlap);

module.exports = router;
