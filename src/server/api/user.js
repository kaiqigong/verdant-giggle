/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import { Router } from 'express';
import User from '../models/User';
import auth from '../auth/index';
import UserTypes from '../../constants/UserTypes';

// import {sessionSecret} from '../config/secret.js';

const router = new Router();

router.get('/', auth.hasRole(UserTypes.ADMIN), async (req, res, next) => {
  try {
    const results = await User.find({}, '-local.password');
    res.status(200).send({results});
  } catch (error) {
    next(error);
  }
});

export default router;
