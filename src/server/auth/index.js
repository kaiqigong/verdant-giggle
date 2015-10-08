import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import compose from 'composable-middleware';
import User from '../models/User';
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
          if (err) {
            return next(err);
          }
          if (user) {
            req.user = user;
            return next();
          }
          return next({message: '无法验证用户信息', status: 401});
        });
      } else {
        return res.sendStatus(401);
      }
    })
    .use((req, res, next) => {
      User.findById(req.user._id, (err, user) => {
        if (err) return next(err);
        if (user) {
          req.user = user;
          next();
        } else {
          res.sendStatus(401);
        }
      });
    });
};


/**
 * Checks if the user role meets the minimum requirements of the route
 */
function hasRole(roleRequired) {
  if (!roleRequired) {
    throw new Error('Required role needs to be set');
  }
  return compose()
    .use(verifyTokenCookie())
    .use((req, res, next) => {
      if (req.user.roles && req.user.roles.indexOf(roleRequired) > -1) {
        return next();
      }
      return next({message: '权限不足', status: 403});
    });
}


export default {
  verifyTokenCookie,
  isAuthenticated,
  signToken,
  hasRole,
  setTokenCookie,
};

