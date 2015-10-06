// config/passport.js

// load all the things we need
import {Strategy as LocalStrategy} from 'passport-local';

// load up the user model
import User from '../models/user';

// expose this function to our app using module.exports
export default (passport) => {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  },
  (req, email, password, done) => { // callback with email and password from our form

    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    User.findOne({'local.email': email}, (err, user) => {
      // if there are any errors, return the error before anything else
      if (err) {
        return done(err);
      }

      // if no user is found, return the message
      if (!user) {
        return done(null, false, { message: 'This username is not registered.' });
      }

      // if the user is found but the password is wrong
      if (!user::user.validPassword(password)) {
        return done(null, false, { message: 'This password is not correct.' });
      }

      // all is well, return successful user
      return done(null, user);
    });
  }));
};
