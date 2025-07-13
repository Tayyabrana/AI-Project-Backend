const router = require("express").Router();
const OpenAIController = require("../controllers/openai");

router.post("/create_prompt", OpenAIController.askQuestions);
router.post("/extend_description", OpenAIController.extendDescription);
router.post("/tech_stacks",OpenAIController.getTechStacks);
router.post("/get_features",OpenAIController.generateFeatures);

module.exports = router;
