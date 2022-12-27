 import express, { Application, Response, Request, NextFunction } from 'express';
import bodyParser from "body-parser";

// Import Routes
import { admin, auth, post } from "./routes";

const path = require('path');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");
const MongoStore = require('connect-mongo');
const app: Application = express();
const Options = { limit: "10mb", extended: true };
const oneDay = 1000 * 60 * 60 * 24;
const sessions = require('express-session');
const advancedOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};
const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("uri missing");
}
app.use(sessions({
  secret: "abddb800afb24c08fed20f0aad14512138fbccc4b8d0be2ff9f3d57c12fe85d9506c37d13a64714a11c2aeaced38317d2dd31e2c2d49be6dd3778691fe551035334669f56eca6e4ccd81e5aef4a370a2ab6f0a2dc2dbd152324ba80e4082fa39c0b5b66459002173593800d8ec609dfebdd86d3f6ae88cd77298fb2e71e655d9",
  saveUninitialized: true,
  cookie: { maxAge: 30 * oneDay },
  resave: false,
  store: MongoStore.create({
    mongoUrl: uri,
    mongoOptions: advancedOptions
  }), 
}));

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
