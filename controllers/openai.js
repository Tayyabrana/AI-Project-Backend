require('dotenv').config();
const fs = require('fs');
const OpenAI = require('openai');

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
    // Read the selected answers from the JSON file
    const selectedAnswers = JSON.parse(fs.readFileSync("selected_answers.json", "utf-8")).selected_answers;

    // Convert selected answers to formatted text
    let outputText = "";
    selectedAnswers.forEach((item, index) => {
      outputText += `${index + 1}. ${item.question}\nAnswer: ${item.answer}\n\n`;
    });

    // Static project description
    const projectDescription = `
Project Title:
EcoTrack: Smart Carbon Footprint Tracker

Description:
EcoTrack is a web-based application that helps individuals and businesses monitor and reduce their carbon footprint. By analyzing daily activities such as transportation, energy consumption, and food choices, EcoTrack provides insights and suggestions to promote more sustainable living. The platform aims to raise environmental awareness and encourage eco-friendly habits through data-driven feedback.
`;

    // Compose the prompt
    const prompt = `
${projectDescription}

Above is my project description.
Your task is to extend the project description according to the following answers to the questions.
That means you have to extend the requirements of the project.

${outputText}

provide the response in a JSON format


Please return the extended description in the following JSON format only:
{
  "projectTitle": "text",
  "description": "text"
}
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    let content = response.choices[0].message.content.trim();

    // Remove code block formatting if present
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

    // Success response
    res.status(200).json({
      responseCode: 200,
      message: "Extended project description generated successfully",
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
