/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import 'babel/polyfill';
import path from 'path';
import express from 'express';
import React from 'react';
import ReactDOM from 'react-dom/server';
import Router from './routes';
import Html from './components/Html';

import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';
import flash from 'connect-flash';
import mongoose from 'mongoose';
import configDB from './server/config/database.js';
import {sessionSecret} from './server/config/secret.js';
import localPassport from './server/config/passport';
const server = global.server = express();

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database
localPassport(passport); // pass passport for configuration

//
// set up our express application
// -----------------------------------------------------------------------------
server.use(morgan('dev')); // log every request to the console
server.use(cookieParser()); // read cookies (needed for auth)
server.use(bodyParser()); // get information from html forms
server.set('view engine', 'jade');

server.set('port', (process.env.PORT || 5000));
server.use(express.static(path.join(__dirname, 'public')));

//
// required for passport
// -----------------------------------------------------------------------------
server.use(session({secret: sessionSecret})); // session secret
server.use(passport.initialize());
server.use(passport.session()); // persistent login sessions
server.use(flash()); // use connect-flash for flash messages stored in session

//
// Register API middleware
// -----------------------------------------------------------------------------
server.use('/api/content', require('./server/api/content'));
server.use('/api/account', require('./server/api/account'));

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
server.get('*', async (req, res, next) => {
  try {
    let statusCode = 200;
    const data = { title: '', description: '', css: '', body: '' };
    const css = [];
    const context = {
      onInsertCss: value => css.push(value),
      onSetTitle: value => data.title = value,
      onSetMeta: (key, value) => data[key] = value,
      onPageNotFound: () => statusCode = 404,
    };

    await Router.dispatch({ path: req.path, context }, (state, component) => {
      data.body = ReactDOM.renderToString(component);
      data.css = css.join('');
    });

    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
    res.status(statusCode).send('<!doctype html>\n' + html);
  } catch (err) {
    next(err);
  }
});

//
// Launch the server
// -----------------------------------------------------------------------------

server.listen(server.get('port'), () => {
  /* eslint-disable no-console */
  console.log('The server is running at http://localhost:' + server.get('port'));
  if (process.send) {
    process.send('online');
  }
});
