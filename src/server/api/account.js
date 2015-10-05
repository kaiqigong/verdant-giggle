/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import { Router } from 'express';
import passport from 'passport';

const router = new Router();

router.post('/register/', passport.authenticate('local-signup'), async (req, res, next) => {
  console.log(req.user);
  try {
    console.log(req.body);
    res.status(200).send({
      email: 'cage',
      id: 1,
    });
  } catch (err) {
    next(err);
  }
});

export default router;

