require('dotenv').config();
const fs = require('fs');
const OpenAI = require('openai');
const Project = require('../models/project.js');

const openai = new OpenAI({
  apiKey: process.env.APIKEY
});

exports.askQuestions = async (req, res) => {
  try {
    const { projectTitle, projectType, description } = req.body;

    if (!projectTitle || !projectType || !description) {
      return res.status(400).json({
        message: "projectTitle, projectType, and description are required"
      });
    }

    await Project.create({
      project_name: projectTitle,
      tech_stack: null,
      description: description,
      project_type: projectType,
      project_status: "SCRATCH",
      status: 0
    })

    const projectDescription = `
Project Title:
${projectTitle}

Project Type:
${projectType}

Description:
${description}
`;

    const prompt = `
${projectDescription}

Above is my project description.
Your task is to ask general questions about the project.
Questions must be short, like "Do you want to integrate Google Sign-in?".
Give randomly between 5 to 20 questions.
You must also provide the options of answers for each question.

Provide the response in this JSON format:
{
  "questions": [
    {
      "question": "....",
      "answers": ["option1", "option2", ...]
    },
    ...
  ]
}
`;

    // Request questions from OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    let rawContent = response.choices[0].message.content.trim();

    // Remove code block markers if present
    if (rawContent.startsWith("```")) {
      rawContent = rawContent.replace(/```(?:json)?\n?/, '').replace(/```$/, '').trim();
    }

    // Try parsing the JSON
    let parsed;
    try {
      parsed = JSON.parse(rawContent);
    } catch (err) {
      return res.status(500).json({
        message: "Failed to parse JSON from OpenAI response",
        error: err.message,
        raw: rawContent
      });
    }

    // Validate structure
    try {
        validateQuestions(parsed);
    } catch (err) {
      return res.status(400).json({
        message: "Validation error in generated JSON",
        error: err.message,
        raw: rawContent
      });
    }

    // Return response
    res.status(200).json({
      responseCode: 200,
      message: "Questions generated successfully",
      data: parsed
    });

  } catch (error) {
    console.error("❌ Error in askQuestions:", error.message);
    res.status(500).json({
      responseCode: 500,
      message: "Failed to generate project questions",
      error: error.message
    });
  }
};

exports.extendDescription = async (req, res, next) => {
  try {
    const { projectTitle, projectType, description, selected_answers } = req.body;

    // Validate input
    if (!projectTitle || !description || !Array.isArray(selected_answers)) {
      return res.status(400).json({
        responseCode: 400,
        message: "Request must include 'projectTitle', 'description', and 'selected_answers' array."
      });
    }

    // Format selected answers
    let formattedAnswers = "";
    selected_answers.forEach((item, index) => {
      formattedAnswers += `${index + 1}. ${item.question}\nAnswer: ${item.answer}\n\n`;
    });

    // Compose prompt
    const prompt = `
Project Title:
${projectTitle}

Project Type:
${projectType || "N/A"}

Description:
${description}

Above is my project description.
Your task is to extend the project description according to the following answers to the questions.
That means you have to extend the requirements of the project.

${formattedAnswers}

Provide the response in the following JSON format:
{
  "projectTitle": "string",
  "description": "string"
}
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    });

    let content = response.choices[0].message.content.trim();

    // Clean up code blocks
    if (content.startsWith("```")) {
      content = content.replace(/```(?:json)?\n?/, '').replace(/```$/, '').trim();
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (err) {
      return res.status(500).json({
        responseCode: 500,
        message: "Failed to parse OpenAI JSON response",
        rawResponse: content,
        error: err.message
      });
    }

    // Success
    return res.status(200).json({
      responseCode: 200,
      message: "Extended project description generated successfully",
      data: parsed
    });

  } catch (error) {
    console.error("❌ OpenAI API error:", error.message);
    return res.status(500).json({
      responseCode: 500,
      message: "Internal server error",
      error: error.message
    });
  }
};


exports.getTechStacks = async (req, res, next) => {
  try {
    const { projectTitle, description } = req.body;

    if (!projectTitle || !description) {
      return res.status(400).json({
        responseCode: 400,
        message: "Missing required fields: projectTitle or description"
      });
    }

    const project_description = `
Project Title:
${projectTitle}

Description:
${description}
`;

    const prompt = `
${project_description}

Above is my project description.
Your task is to provide tech stacks for this project
Also provide the benifits of using the tech stack and recommended tech stack

Provide me almost all the alternatives and techstacks that can be used

The response must be in json

Here is the example format which you must provide

{
  "tech_stacks": {
    "category": {
      "description": "text",
      "recommended": "tech_name",
      "alternatives": ["tech1", "tech2", ...],
      "benefits": {
        "tech1": "benefit description",
        "tech2": "benefit description",
        ...
      }
    },
    ...
  }
}

Following are the categories
* Frontend
* Backend
* Database
* DevOps

`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    let rawContent = response.choices[0].message.content.trim();

    // Remove code block formatting if present
    if (rawContent.startsWith("```")) {
      rawContent = rawContent.replace(/```(?:json)?\n?/, '').replace(/```$/, '').trim();
    }

    let parsed;
    try {
      parsed = JSON.parse(rawContent);
    } catch (err) {
      return res.status(500).json({
        responseCode: 500,
        message: "Failed to parse OpenAI JSON response",
        rawResponse: rawContent,
        error: err.message
      });
    }

    try {
      validateTechStackStructure(parsed);
    } catch (err) {
      return res.status(422).json({
        responseCode: 422,
        message: "Invalid tech stack format",
        error: err.message
      });
    }

    // Success
    res.status(200).json({
      responseCode: 200,
      message: "Tech stacks generated successfully",
      data: parsed
    });

  } catch (error) {
    console.error("❌ OpenAI API error:", error.message);
    res.status(500).json({
      responseCode: 500,
      message: "Internal server error",
      error: error.message
    });
  }
};

exports.generateFeatures = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        responseCode: 400,
        message: "Missing required fields: title or description"
      });
    }

    const project_description = `
Project Title:
${title}

Description:
${description}
`;

    const prompt = `
${project_description}

Above is my project description.
Your task is to provide features for this project.

Provide me almost all the feature ideas. Include more than 15 and be specific.
Focus on core features with detail.

Respond in JSON format like this:

{
  "title": "text",
  "description": "text",
  "features": [
    {
      "name": "text",
      "description": "text",
      "commonIssues": "text",
      "approach": "text",
      "estimated_time": number of days (int)
    },
    ...
  ]
}
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    });

    let content = response.choices[0].message.content.trim();

    // Remove markdown code fences
    if (content.startsWith("```")) {
      content = content.replace(/```(?:json)?\n?/, '').replace(/```$/, '').trim();
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (err) {
      return res.status(500).json({
        responseCode: 500,
        message: "Failed to parse JSON from OpenAI response",
        rawResponse: content,
        error: err.message
      });
    }

    // ✅ Send parsed result
    res.status(200).json({
      responseCode: 200,
      message: "Features generated successfully",
      data: parsed
    });

  } catch (err) {
    console.error("❌ OpenAI API error:", err.message);
    res.status(500).json({
      responseCode: 500,
      message: "Internal server error",
      error: err.message
    });
  }
};

exports.generateFeatureTasks = async (req, res) => {
  try {
    const features = req.body.features;

    if (!features || !Array.isArray(features)) {
      return res.status(400).json({
        responseCode: 400,
        message: "Invalid or missing 'features' in request body. Must be an array of features.",
      });
    }

    // Function to create prompt
    function taskPrompt(featureName, description) {
      return `
Your job is to break the following software feature into detailed development tasks.

Feature: ${featureName}
Description: ${description}

Each task must include:
- title (string)
- description (string)
- estimatedHours (number between 2–20)
- priority (High, Medium, Low)
- dependencies (array of strings)

Return only valid raw JSON (no markdown, no extra text), in this format:
{
  "feature": "${featureName}",
  "tasks": [
    {
      "title": "Example Task",
      "description": "What to build",
      "estimatedHours": 6,
      "priority": "High",
      "dependencies": []
    }
  ]
}

⚠️ Output must be valid JSON directly parsable by JSON.parse(). Minimum 5 tasks.
`;
    }

    // Function to generate tasks for a single feature
    async function generateTasks(feature) {
      const prompt = taskPrompt(feature.name, feature.description);
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
      });

      let content = response.choices[0].message.content.trim();
      if (content.startsWith("```")) {
        content = content.replace(/```(?:json)?\n?/, "").replace(/```$/, "").trim();
      }

      try {
        return JSON.parse(content);
      } catch (err) {
        return {
          feature: feature.name,
          tasks: [],
          error: true,
          raw: content,
          errorMessage: err.message,
        };
      }
    }

    const results = [];
    for (const feature of features) {
      const result = await generateTasks(feature);
      results.push(result);
    }

    return res.status(200).json({
      responseCode: 200,
      message: "Feature tasks generated successfully",
      data: { featureTasks: results },
    });
  } catch (error) {
    console.error("❌ API error:", error.message);
    return res.status(500).json({
      responseCode: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};


function validateQuestions(json) {
  const expectedTopKey = 'questions';

  if (!json.hasOwnProperty(expectedTopKey)) {
    throw new Error(`Missing top-level key: '${expectedTopKey}'`);
  }

  if (!Array.isArray(json[expectedTopKey])) {
    throw new Error(`'${expectedTopKey}' must be an array`);
  }

  json[expectedTopKey].forEach((item, index) => {
    if (!item.hasOwnProperty('question')) {
      throw new Error(`Missing 'question' field at index ${index}`);
    }

    if (!item.hasOwnProperty('answers')) {
      throw new Error(`Missing 'answers' field at index ${index}`);
    }

    if (!Array.isArray(item.answers)) {
      throw new Error(`'answers' must be an array at index ${index}`);
    }

    if (item.answers.length === 0) {
      throw new Error(`'answers' array must not be empty at index ${index}`);
    }
  });
}

function validateTechStackStructure(json) {
  const expectedTopKey = 'tech_stacks';
  const stackCategories = ['Frontend', 'Backend', 'Database', 'DevOps'];
  const requiredKeys = ['description', 'recommended', 'alternatives', 'benefits'];

  if (!json.hasOwnProperty(expectedTopKey)) {
    throw new Error(`Missing top-level key: ${expectedTopKey}`);
  }

  const stacks = json[expectedTopKey];

  stackCategories.forEach((category) => {
    if (!stacks.hasOwnProperty(category)) {
      throw new Error(`Missing tech stack category: ${category}`);
    }

    const categoryData = stacks[category];

    requiredKeys.forEach((key) => {
      if (!categoryData.hasOwnProperty(key)) {
        throw new Error(`Missing key '${key}' in category '${category}'`);
      }
    });

    if (!Array.isArray(categoryData.alternatives)) {
      throw new Error(`'alternatives' must be an array in '${category}'`);
    }

    if (typeof categoryData.benefits !== 'object' || Array.isArray(categoryData.benefits)) {
      throw new Error(`'benefits' must be an object in '${category}'`);
    }

    const allTechs = [categoryData.recommended, ...categoryData.alternatives];
    allTechs.forEach((tech) => {
      if (!categoryData.benefits.hasOwnProperty(tech)) {
        throw new Error(`Missing benefit for technology '${tech}' in '${category}'`);
      }
    });
  });
}

