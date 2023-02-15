const express = require('express');                  // import express and create 'express' function
const app = express();                               // create express application with 'express' function
const cors = require('cors');                        // cors middleware
const blogRouter = require('./routes/blog.routes');  // routes middleware
const morgan = require('morgan');                    // request logger middleware
const middleware = require('./utils/middleware');    // custom middleware for error handling and logging

app.use(cors());
app.use(express.json());


// Middleware functions have to be taken into use before routes if
// we want them to be executed before the route event handlers are called
//
// Morgan logs messages like this into terminal window:
//  GET /api/blogs 200 - 72.598 ms - agent: PostmanRuntime/7.31.0
//
morgan.token('request-log', middleware.requestLogger);
app.use(morgan(middleware.requestLoggerParams));

app.use('/', blogRouter);            // routes for blogs
app.use(middleware.unknownEndpoint); // route for unknown endpoints

// this has to be the last loaded middleware.
app.use(middleware.errorHandler);

module.exports = app;