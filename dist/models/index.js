"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Views = exports.Pass = exports.Comments = exports.User = exports.Post = void 0;
var post_1 = require("./post");
Object.defineProperty(exports, "Post", { enumerable: true, get: function () { return __importDefault(post_1).default; } });
var user_1 = require("./user");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return __importDefault(user_1).default; } });
var comments_1 = require("./comments");
Object.defineProperty(exports, "Comments", { enumerable: true, get: function () { return __importDefault(comments_1).default; } });
var pass_1 = require("./pass");
Object.defineProperty(exports, "Pass", { enumerable: true, get: function () { return __importDefault(pass_1).default; } });
var views_1 = require("./views");
Object.defineProperty(exports, "Views", { enumerable: true, get: function () { return __importDefault(views_1).default; } });
__exportStar(require("./post"), exports);
__exportStar(require("./user"), exports);
__exportStar(require("./comments"), exports);
__exportStar(require("./pass"), exports);
__exportStar(require("./views"), exports);
