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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserDetails = exports.deleteUser = exports.getUsers = exports.getUser = void 0;
const models_1 = require("../models");
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield models_1.User.findOne({
        _id: id,
    });
    if (!user) {
        res.status(500).json({
            error: true,
            message: "Something went wrong",
        });
    }
    else {
        res.status(200).json({
            error: false,
            message: "User retrieved successfully",
            data: user,
        });
    }
});
exports.getUser = getUser;
const getUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield models_1.User.findOne({
        _id: id,
    })
        .populate("posts")
        .populate({
        path: "posts",
        populate: {
            path: "author",
        },
    })
        .exec((err, user) => {
        if (err) {
            res.status(500).json({
                error: true,
                message: "Something went wrong",
            });
        }
        else {
            res.status(200).json({
                error: false,
                message: "User retrieved successfully",
                data: user,
            });
        }
    });
});
exports.getUserDetails = getUserDetails;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield models_1.User.find({}, (err, users) => {
        if (err) {
            res.status(500).json({
                error: true,
                message: "Something went wrong",
            });
        }
        else {
            res.status(200).json({
                error: false,
                message: "Users retrieved successfully",
                data: users,
            });
        }
    });
});
exports.getUsers = getUsers;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield models_1.User.findOneAndDelete({
        _id: id,
    }, (err, user) => {
        if (err) {
            res.status(500).json({
                error: true,
                message: "Something went wrong",
            });
        }
        else {
            res.status(200).json({
                error: false,
                message: "User deleted successfully",
                data: user,
            });
        }
    });
});
exports.deleteUser = deleteUser;
