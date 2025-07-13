const router = require("express").Router();
const employeeController = require("../controllers/employee");

router.post("/create", employeeController.createEmployee);
router.get("/all", employeeController.getAllEmployees);
router.get("/total", employeeController.getTotalEmployees);
router.get("/get/:id", employeeController.getEmployeeById);
router.put("/update/:id", employeeController.updateEmployee);
router.delete("/delete/:id", employeeController.deleteEmployee);
router.patch("/status/:id", employeeController.updateStatus);
router.get("/search", employeeController.searchEmployees);
router.get("/designation/:designation", employeeController.getEmployeesByDesignation);
router.get("/skill/:skill", employeeController.getEmployeesBySkill);
router.get("/expertise/:expertise", employeeController.getEmployeesByExpertise);
router.get("/active", employeeController.getActiveEmployees);

module.exports = router;
