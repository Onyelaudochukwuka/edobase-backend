 import express, { Application, Response, Request, NextFunction } from 'express';
import bodyParser from "body-parser";

// Import Routes
import { admin, auth, post } from "./routes";

const path = require('path');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");

const app: Application = express();
const Options = { limit: "10mb", extended: true };

// view engine setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// add cookie parser
app.use(cookieParser());

// add cors
app.use(cors());

// add body parser
app.use(bodyParser.json(Options));
app.use(bodyParser.urlencoded(Options));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.use('/admin', admin);
app.use('/auth', auth);
app.use('/post', post);


// catch 404 and forward to error handler
app.use(function(req: Request, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err: any, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).json({
    error: true
  })
});

export default app;
