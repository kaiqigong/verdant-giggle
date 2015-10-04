/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import { Router } from 'express';

const router = new Router();

router.post('/register/', async (req, res, next) => {
  try {
    res.status(200).send({
      username: 'cage',
      id: 1,
    });
  } catch (err) {
    next(err);
  }
});

export default router;

