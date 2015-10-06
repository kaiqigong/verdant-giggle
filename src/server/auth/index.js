import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import compose from 'composable-middleware';
import User from '../models/user';
import {sessionSecret, tokenExpireTime} from '../config/secret.js';

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
const isAuthenticated = (credentialsRequired) => {
  const validateJwt = expressJwt({ secret: sessionSecret, credentialsRequired: credentialsRequired });
  return compose()
    // Validate jwt
    .use((req, res, next) => {
      // allow access_token to be passed through query parameter as well
      if (req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }
      validateJwt(req, res, next);
    })
    // Attach user to request
    .use((req, res, next) => {
      if (!req.user) return next();
      User.findById(req.user._id, (err, user) => {
        if (err) return next(err);
        if (!user) return res.send(401);

        req.user = user;
        next();
      });
    });
};

// /**
//  * Checks if the user role meets the minimum requirements of the route
//  */
// function hasRole(roleRequired) {
//   if (!roleRequired) throw new Error('Required role needs to be set');

//   return compose()
//     .use(isAuthenticated())
//     .use(function meetsRequirements(req, res, next) {
//       if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
//         next();
//       } else {
//         res.send(403);
//       }
//     });
// }

/**
 * Returns a jwt token signed by the app secret
 */
const signToken = (id) => {
  return jwt.sign({ _id: id}, sessionSecret, { expiresInMinutes: tokenExpireTime});
};

/**
 * Set token cookie directly for oAuth strategies
 */
const setTokenCookie = (req, res, redirect) => {
  if (!req.user) return res.json(404, { message: 'Something went wrong, please try again.'});
  const token = signToken(req.user._id);
  res.cookie('token', JSON.stringify(token));
  res.redirect(redirect);
};

const verifyTokenCookie = () => {
  return compose()
    .use((req, res, next) => {
      if (req.cookies.token) {
        const token = req.cookies.token.replace(/"/g, '');
        jwt.verify(token, sessionSecret, null, (err, user) => {
          if (err) return next(err);
          if (user) req.user = user;
          next();
        });
      } else {
        next();
      }
    })
    .use((req, res, next) => {
      if (req.user) {
        User.findById(req.user._id, (err, user) => {
          if (err) return next(err);
          if (user) req.user = user;

          next();
        });
      } else {
        next();
      }
    });
};

export default {
  verifyTokenCookie,
  isAuthenticated,
  signToken,
  setTokenCookie,
};

