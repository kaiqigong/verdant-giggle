/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import { Router } from 'express';
import User from '../models/User';
import passport from 'passport';
import auth from '../auth/index';
import {tokenExpireTime} from '../config/secret';

// import {sessionSecret} from '../config/secret.js';

const router = new Router();

router.post('/register/', async (req, res, next) => {
  // find a user whose email is the same as the forms email
  // we are checking to see if the user trying to login already exists
  const {email, password} = req.body;
  // create the user
  const newUser = new User();

  // set the user's local credentials
  newUser.local.email = email;
  newUser.local.password = newUser.generateHash(password);

  // save the user
  newUser.save((dbErr, user) => {
    if (dbErr) {
      return next({
        status: 400,
        message: '邮箱已经被注册',
      });
    }

    const token = auth.signToken(user._id);

    res.cookie('token', JSON.stringify(token), {expires: new Date(Date.now() + tokenExpireTime * 60000)});
    res.status(200).json({token: token});
  });
});

router.post('/login/', async (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    const error = err || info;
    if (error) return res.json(401, error);
    if (!user) return res.json(404, {message: 'Something went wrong, please try again.'});

    const token = auth.signToken(user._id);

    res.cookie('token', JSON.stringify(token), {expires: new Date(Date.now() + tokenExpireTime * 60000)});
    res.status(200).json({token: token});
  })(req, res, next);
});

router.get('/profile/', auth.verifyTokenCookie(), async (req, res, next) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    next(error);
  }
});

router.get('/logout/', async (req, res, next) => {
  try {
    res.clearCookie('token');
    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

export default router;

