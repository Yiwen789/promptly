const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');

require('dotenv').config();

const app = express();
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openaiClient = new OpenAIApi(configuration);

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: "GET,POST,PUT,DELETE,OPTIONS",
  })
);

mongoose.connect(process.env.mongo_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Failed to connect to MongoDB:', err);
});

app.get("/", async (req, res) => {
  console.log("Hello!")
});

const handlePrompt = async (req, res, maxTokens) => {
  console.log(`Ask params list! max tokens: ${maxTokens}`);
  const prompt = req.body.prefixedMessage;
  try {
    if (!prompt) {
      throw new Error("Uh oh, no prompt was provided");
    }
    // trigger OpenAI completion
    const response = await openaiClient.createCompletion({
      model: "text-davinci-003",
      max_tokens: maxTokens,
      prompt,
    });

    const answer = response.data.choices[0].text
    console.log(answer)
    res.json({ answer });

    return res.status(200).json({
      success: true,
      message: response.data.choices[0].text
    });
  } catch (error) {
    console.log(error.message);
  }
};

app.post("/ask", async (req, res) => {
  await handlePrompt(req, res, 300);
});

app.post("/ask-res", async (req, res) => {
  await handlePrompt(req, res, 500);
});



app.listen(3001, () => {
  console.log('App listening on port 3001!');
});


const { OAuth2Client } = require("google-auth-library");