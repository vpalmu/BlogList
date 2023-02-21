const jwt = require('jsonwebtoken');
const User = require('../model/user');
const logger = require('./logger');

// eslint-disable-next-line no-unused-vars
const connect = require('../model/connectDb'); // 'connect' is used just to open connection with db

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  if (error.name === 'JsonWebTokenError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

const unknownEndpoint = (request, response) => {
  logger.info('error: \'unknown endpoint\'');
  response.status(404).send({ error: 'unknown endpoint' });
};

const requestLogger = (request, response) => {
  if (request.method === 'POST' && request.url === '/api/persons') {
    logger.info('morgal request-log: POST /api/persons ', request.body.name);

    return JSON.stringify({ number: request.body.number });
  }

  return '- agent: ' + request.headers['user-agent'];
};

// Remember that a normal middleware function is a function with three parameters,
// that at the end calls the last parameter next to move the control to the next middleware
const tokenExtractor  = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer')) {
    request.token = authorization.replace('Bearer ','');
  }

  next();
};

const userExtractor  = async (request, response, next) => {
  if (request.token) {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid.' });
    }

    const user = await User.findById(decodedToken.id);

    if (!user) {
      response.statusMessage = 'User not found';
      return response.status(400).end();
    }

    request.user = user; // save user data into request object
  }
  next();
};

const requestLoggerParams = ':method :url :status - :response-time ms :request-log';

module.exports = {
  errorHandler,
  unknownEndpoint,
  requestLogger,
  tokenExtractor,
  userExtractor,
  requestLoggerParams
};