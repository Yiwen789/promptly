const express = require('express');
const { Configuration, OpenAIApi, ChatCompletionRequestMessageRoleEnum } = require('openai');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

require('dotenv').config();

const configuration = new Configuration({
  apiKey:process.env.OPENAI_API_KEY
})

const openaiClient = new OpenAIApi(configuration);

app.get("/", async(req, res) => {
  console.log("Hello!")
})

app.post("/ask", async (req, res) => {
  console.log("Ask!")
  const prompt = req.body.question;
  try {
    if (prompt == null) {
      throw new Error("Uh oh, no prompt was provided");
    }
    // trigger OpenAI completion
    const response = await openaiClient.createCompletion({
      model: "text-davinci-003",
      max_tokens: 500,
      prompt,

    });
    
    const answer = response.data.choices[0].text
    res.json({ answer });

    return res.status(200).json({
      success: true,
      message: response.data.choices[0].text
    })
    // ...
  } catch (error) {
    console.log(error.message);
  }
});

// app.get('/', async (req, res) => {
//   const prompt = 'Hello, OpenAI!';
//   const completions = await openaiClient.completions.create({
//     engine: 'davinci',
//     prompt,
//     maxTokens: 5,
//     n: 1,
//     stop: '\n',
//   });

//   const message = completions.choices[0].text.trim();
//   res.send(message);
// });

app.listen(3001, () => {
  console.log('App listening on port 3001!');
});