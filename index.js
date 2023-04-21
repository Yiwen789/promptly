const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const dotenv = require('dotenv');
const routes = require('./routes');

dotenv.config();
const app = express();

// Set up session middleware
app.use(session({
  secret: 'my-secret',
  resave: false,
  saveUninitialized: false,
}));

// Set up Passport.js middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(cors());

// Use routes
app.use('/', routes);

app.listen(3001, () => {
  console.log('App listening on port 3001!');
});
