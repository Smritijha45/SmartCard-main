import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from '../errors/AppError';
import logger from '../lib/logger';
import { ZodError } from 'zod';

export const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let errorCode = 'INTERNAL_SERVER_ERROR';
  let message = 'An unexpected error occurred';
  let details: any[] = [];
  let isOperational = false;

  // Handle Custom AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    errorCode = err.errorCode;
    message = err.message;
    details = err.details;
    isOperational = err.isOperational;
  }
  // Handle Zod Schema Validation Errors
  else if (err instanceof ZodError) {
    statusCode = 422;
    errorCode = 'VALIDATION_ERROR';
    message = 'Request validation failed';
    details = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
      code: e.code
    }));
    isOperational = true;
  }
  // Handle Mongoose ValidationError
  else if (err.name === 'ValidationError') {
    statusCode = 400;
    errorCode = 'DB_VALIDATION_ERROR';
    message = 'Database validation failed';
    details = Object.keys(err.errors).map((key) => ({
      field: key,
      message: err.errors[key].message
    }));
    isOperational = true;
  }
  // Handle Mongoose CastError (e.g. invalid ObjectId)
  else if (err.name === 'CastError') {
    statusCode = 400;
    errorCode = 'INVALID_ID';
    message = `Invalid value for ${err.path}: ${err.value}`;
    isOperational = true;
  }
  // Handle JWT Expiry
  else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    errorCode = 'TOKEN_EXPIRED';
    message = 'Authentication token expired';
    isOperational = true;
  }
  // Handle JWT Invalid signature
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    errorCode = 'INVALID_TOKEN';
    message = 'Authentication token signature invalid';
    isOperational = true;
  }

  // Log non-operational errors as errors, operational ones as warnings
  if (isOperational) {
    logger.warn({
      method: req.method,
      url: req.url,
      statusCode,
      errorCode,
      message,
      details
    }, 'Operational error handled');
  } else {
    logger.error({
      method: req.method,
      url: req.url,
      statusCode,
      errorCode,
      message,
      stack: err.stack,
      err
    }, 'Unhandled system error caught');
  }

  const responseBody = {
    success: false,
    error: {
      code: errorCode,
      message,
      ...(details.length > 0 ? { details } : {}),
      ...(process.env.NODE_ENV === 'development' && !isOperational ? { stack: err.stack } : {})
    }
  };

  res.status(statusCode).json(responseBody);
};

export default errorHandler;
