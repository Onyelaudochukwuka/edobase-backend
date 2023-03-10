import express, { Application, Response, Request } from 'express';
import bodyParser from "body-parser";

// Import Routes
import { admin, auth, post, user } from "./routes";

import path from 'path';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from "cors";
const app: Application = express();
import multer from 'multer';
const storage = multer.diskStorage({
    destination: function (req: any, file: any, cb: any) {
        console.log(file);
        cb(null, __dirname);
    },
    filename: function (req: any, file: any, cb: any) {
        cb(null, file.fieldname + '-' + Date.now());
    }
});

export const upload = multer({ storage: storage });
// eslint-disable-next-line @typescript-eslint/no-var-requires

app.use(upload.single('file'));
const Options = { limit: "50mb", extended: true };
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
app.use('/user', user);


// catch 404 and forward to error handler
app.use(function(req: Request, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err: any, req: Request, res: Response) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500).json({
        error: true
    });
});

export default app;