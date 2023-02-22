"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = exports.post = exports.admin = exports.auth = void 0;
// Export all routes
var auth_1 = require("./auth");
Object.defineProperty(exports, "auth", { enumerable: true, get: function () { return __importDefault(auth_1).default; } });
var admin_1 = require("./admin");
Object.defineProperty(exports, "admin", { enumerable: true, get: function () { return __importDefault(admin_1).default; } });
var post_1 = require("./post");
Object.defineProperty(exports, "post", { enumerable: true, get: function () { return __importDefault(post_1).default; } });
var user_1 = require("./user");
Object.defineProperty(exports, "user", { enumerable: true, get: function () { return __importDefault(user_1).default; } });
