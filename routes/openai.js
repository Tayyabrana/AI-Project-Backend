const router = require("express").Router();
const OpenAIController = require("../controllers/openai");

router.post("/create_prompt", OpenAIController.askQuestions);
router.post("/extend_description", OpenAIController.extendDescription);

module.exports = router;
