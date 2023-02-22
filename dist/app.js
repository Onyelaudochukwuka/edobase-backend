"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
// Import Routes
const routes_1 = require("./routes");
const path_1 = __importDefault(require("path"));
const http_errors_1 = __importDefault(require("http-errors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        console.log(file);
        cb(null, __dirname);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());
    }
});
exports.upload = (0, multer_1.default)({ storage: storage });
// eslint-disable-next-line @typescript-eslint/no-var-requires
app.use(exports.upload.single('file'));
const Options = { limit: "50mb", extended: true };
// view engine setup
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// add cookie parser
app.use((0, cookie_parser_1.default)());
// add cors
app.use((0, cors_1.default)());
// add body parser
app.use(body_parser_1.default.json(Options));
app.use(body_parser_1.default.urlencoded(Options));
// Serve static files
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// Define routes
app.use('/admin', routes_1.admin);
app.use('/auth', routes_1.auth);
app.use('/post', routes_1.post);
app.use('/user', routes_1.user);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
});
// error handler
app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500).json({
        error: true
    });
});
exports.default = app;
