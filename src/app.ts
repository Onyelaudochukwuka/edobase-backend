import bodyParser from "body-parser";
import express, { Application, Response, Request, NextFunction } from 'express';
import  indexRouter  from "./routes/index";
import  usersRouter  from "./routes/users";
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
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json(Options));
app.use(bodyParser.urlencoded(Options));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

module.exports = app;
