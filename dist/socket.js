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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("./models");
const mongoose_1 = require("mongoose");
const www_1 = require("./bin/www");
const jwtSecret = (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : "";
if (!jwtSecret)
    throw new Error("Secret hash is missing");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const startSocket = () => __awaiter(void 0, void 0, void 0, function* () {
    www_1.io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(www_1.io.engine.clientsCount);
        console.log(`⚡: ${socket.id} user just connected! ${socket.client.conn.remoteAddress}}`);
        models_1.Views.findOne({ reference: "views" }, (err, views) => {
            if (views) {
                console.log(views);
                www_1.io.emit("views", views === null || views === void 0 ? void 0 : views.views);
            }
        });
        const postCount = yield models_1.Post.find({});
        www_1.io.emit("connections", { users: www_1.io.engine.clientsCount, posts: postCount.length });
        socket.on("disconnect", () => __awaiter(void 0, void 0, void 0, function* () {
            console.log(`⚡: ${socket.id} user just disconnected!`);
        }));
        socket.on("comments", (id) => {
            models_1.Comments.find({ ref: id }).then((comments) => {
                if (comments) {
                    console.log(comments);
                    www_1.io.emit("comments", comments);
                }
            });
        });
        socket.on("post-view", (id) => __awaiter(void 0, void 0, void 0, function* () {
            if ((0, mongoose_1.isValidObjectId)(id)) {
                models_1.Views.deleteMany({
                    date: {
                        $lt: Date.now() - 24 * 60 * 60 * 1000,
                    }
                }).then(() => {
                    console.log(new Date(Date.now() - 24 * 60 * 60 * 1000));
                    console.log("Deleted");
                });
                models_1.Views.findOneAndUpdate({ reference: "views" }, { $inc: { views: 1 } }, { new: true }, (err, views) => {
                    if (!views) {
                        const newViews = new models_1.Views({
                            reference: "views",
                            views: 1,
                            date: new Date(),
                        });
                        newViews.save();
                        www_1.io.emit("views", newViews.views);
                    }
                    if (views) {
                        www_1.io.emit("views", views.views);
                    }
                });
                models_1.Post.findOneAndUpdate({ _id: id }, { $inc: { views: 1 } }, { new: true }, (err, post) => {
                    if (post) {
                        console.log(post.views);
                        www_1.io.emit(`${post._id}-views`, post.views);
                    }
                    else {
                        www_1.io.emit("success", false);
                    }
                });
            }
            else {
                www_1.io.emit("success", false);
            }
        }));
        socket.on("post-like", ({ id, userId }) => {
            console.log(id, userId);
            if ((0, mongoose_1.isValidObjectId)(id)) {
                models_1.Post.findOneAndUpdate({ _id: id, likes: { $not: { $in: [userId] } } }, {
                    $push: {
                        likes: userId,
                    },
                }, { new: true }, (err, post) => {
                    console.log(post);
                    if (post) {
                        console.log(post);
                        www_1.io.emit(`${post._id}-likes`, post.likes);
                    }
                });
            }
        });
        socket.on("post-dislike", ({ id, userId }) => {
            if ((0, mongoose_1.isValidObjectId)(id)) {
                models_1.Post.findOneAndUpdate({ _id: id, dislikes: { $not: { $in: [userId] } } }, {
                    $push: {
                        dislikes: userId,
                    },
                }, { new: true }, (err, post) => {
                    if (post) {
                        console.log(post);
                        www_1.io.emit(`${post._id}-dislikes`, post.dislikes);
                    }
                });
            }
        });
        socket.on("comment-like", ({ id, userId }) => {
            console.log(id, userId);
            if ((0, mongoose_1.isValidObjectId)(id)) {
                models_1.Comments.findOneAndUpdate({ _id: id, likes: { $not: { $in: [userId] } } }, {
                    $push: {
                        likes: userId,
                    },
                }, { new: true }, (err, comment) => {
                    console.log(comment);
                    if (comment) {
                        console.log(comment);
                        www_1.io.emit(`${comment._id}-likes`, comment.likes);
                    }
                });
            }
        });
        socket.on("comment-dislike", ({ id, userId }) => {
            console.log(id, userId);
            if ((0, mongoose_1.isValidObjectId)(id)) {
                models_1.Comments.findOneAndUpdate({ _id: id, dislikes: { $not: { $in: [userId] } } }, {
                    $push: {
                        dislikes: userId,
                    },
                }, { new: true }, (err, comments) => {
                    if (comments) {
                        console.log(comments);
                        www_1.io.emit(`${comments._id}-dislikes`, comments.dislikes);
                    }
                });
            }
        });
        socket.on("comment-delete", ({ id, userId }) => {
            console.log(id, userId);
            if ((0, mongoose_1.isValidObjectId)(id)) {
                models_1.Comments.findOneAndDelete({ _id: id, author: userId }, (err, comments) => {
                    if (!err) {
                        models_1.Post.findOneAndUpdate({ _id: comments.refPost }, { $pull: { comments: id } }, { new: true })
                            .populate("comments")
                            .populate({
                            path: "comments",
                            populate: {
                                path: "author",
                            },
                        })
                            .exec((err, post) => {
                            if (post) {
                                console.log(post);
                                www_1.io.emit(`${post._id}-comments`, post.comments);
                            }
                        });
                    }
                    if (comments) {
                        console.log(comments);
                        www_1.io.emit(`${comments._id}-delete`, comments._id);
                    }
                });
            }
        });
        socket.on("post-comment", ({ id, comment, userId, }) => {
            console.log(id, comment, userId);
            console.time("comment");
            console.timeLog("comment");
            if ((0, mongoose_1.isValidObjectId)(id) && (0, mongoose_1.isValidObjectId)(userId)) {
                models_1.Post.findOne({ _id: id }).then((post) => {
                    if (post) {
                        models_1.Comments.create({
                            refPost: post._id,
                            content: comment,
                            author: userId,
                        }).then((comment) => {
                            if (comment) {
                                models_1.Post.findOneAndUpdate({ _id: post._id }, {
                                    $push: {
                                        comments: comment._id,
                                    },
                                }, { new: true })
                                    .populate("comments")
                                    .populate({
                                    path: "comments",
                                    populate: {
                                        path: "author",
                                    },
                                })
                                    .exec((err, post) => {
                                    if (post) {
                                        console.log(post);
                                        www_1.io.emit(`${post._id}-comments`, post.comments);
                                    }
                                });
                            }
                        });
                    }
                });
            }
            console.timeEnd("comment");
        });
        socket.on("post-delete", ({ id, userId }) => {
            console.log(id, userId);
            if ((0, mongoose_1.isValidObjectId)(id)) {
                models_1.Post.deleteOne({ _id: id, author: userId }, (err) => {
                    if (!err) {
                        models_1.Comments.deleteMany({ refPost: id }, (err) => {
                            if (!err) {
                                www_1.io.emit(`${id}-delete`, id);
                            }
                        });
                    }
                });
            }
        });
        socket.on("get-comment", (id) => {
            if ((0, mongoose_1.isValidObjectId)(id)) {
                models_1.Post.findOne({ id: id })
                    .populate("comments")
                    .exec((err, post) => {
                    if (post) {
                        console.log(post);
                        www_1.io.emit(`${post._id}-comments`, post.comments);
                    }
                });
            }
        });
        socket.on("post-report", ({ id, obj }) => {
            models_1.Post.findOneAndUpdate({ _id: id }, { $push: { reports: { $each: [obj], $position: 0 } } }, { new: true }, (err, post) => {
                if (post) {
                    console.log(post);
                    www_1.io.emit(`${post._id}-reports`, post.reports);
                }
            });
        });
        socket.on("comment-report", ({ id, obj }) => {
            models_1.Comments.findOneAndUpdate({
                _id: id,
            }, { $push: { reports: { $each: [obj], $position: 0 } } }, { new: true }, (err, comment) => {
                if (comment) {
                    console.log(comment);
                    www_1.io.emit(`${comment._id}-reports`, comment.reports);
                }
            });
        });
    }));
});
exports.default = startSocket;
