const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    const user = await User.findOne({ email });
    if (user) {
      // If the user already exists, update their profile information
      user.name = profile.displayName;
      user.picture = profile.photos[0].value;
      await user.save();
      return done(null, user);
    } else {
      // If the user doesn't exist, create a new user with their profile information
      const newUser = new User({
        name: profile.displayName,
        email,
        picture: profile.photos[0].value
      });
      await newUser.save();
      return done(null, newUser);
    }
  } catch (err) {
    console.error(err);
    done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    console.error(err);
    done(err);
  }
});
