"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthorized = exports.Validate = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const express_validator_1 = require("express-validator");
const user_1 = __importDefault(require("../models/user"));
const jwtSecret = (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : '';
if (!jwtSecret)
    throw new Error("Secret hash is missing");
function isAuthorized(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.headers.authorization) {
            (0, jsonwebtoken_1.verify)(req.headers.authorization.split(' ')[1], jwtSecret, (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    console.log(err);
                    res.status(401).json({ error: true, message: "Unauthorized" });
                }
                if (decoded) {
                    const user = yield user_1.default.findOne({ _id: decoded.userId });
                    if (user === null || user === void 0 ? void 0 : user.confirmed) {
                        next();
                    }
                    else {
                        res.status(401).json({ error: true, message: "Unauthorized" });
                    }
                }
            }));
        }
        else {
            res.status(401).send('Unauthorized');
        }
    });
}
exports.isAuthorized = isAuthorized;
function Validate(req, res, next) {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: true,
            message: "invalid request",
            data: errors.array()
        });
    }
    else {
        next();
    }
}
exports.Validate = Validate;
