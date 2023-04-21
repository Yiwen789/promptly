const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv');

const router = express.Router();
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
dotenv.config();

const openaiClient = new OpenAIApi(configuration);

router.get("/", async (req, res) => {
  console.log("Hello!");
});

router.post("/ask", async (req, res) => {
  console.log("Ask params list!");
  const prompt = req.body.prefixedMessage;
  try {
    if (prompt == null) {
      throw new Error("Uh oh, no prompt was provided");
    }
    // trigger OpenAI completion
    const response = await openaiClient.createCompletion({
      model: "text-davinci-003",
      max_tokens: 300,
      prompt,
    });

    const answer = response.data.choices[0].text
    console.log(answer)
    res.json({ answer });

    return res.status(200).json({
      success: true,
      message: response.data.choices[0].text
    });
    // ...
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/ask-res", async (req, res) => {
  console.log("Ask result!");
  const prompt = req.body.prefixedMessage;
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
    console.log(answer)
    res.json({ answer });

    return res.status(200).json({
      success: true,
      message: response.data.choices[0].text
    });
    // ...
  } catch (error) {
    console.log(error.message);
  }
});


// Configure Google authentication strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
},
function(accessToken, refreshToken, profile, cb) {
  // Handle authentication success
  cb(null, profile);
}
));

// Serialize and deserialize user information
passport.serializeUser(function(user, done) {
done(null, user);
});

passport.deserializeUser(function(user, done) {
done(null, user);
});

// Define routes for Google authentication
router.get('/auth/google',
passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
passport.authenticate('google', { failureRedirect: '/login' }),
function(req, res) {
  // Successful authentication, redirect home.
  res.redirect
  // Successful authentication, redirect home.
res.redirect('/');
console.log("Success!")
});

module.exports = router;
