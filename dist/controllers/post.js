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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearch = exports.getRecent = exports.getTrending = exports.getCategory = exports.getPost = exports.update = exports.create = exports.home = void 0;
const models_1 = require("../models");
const fs_1 = __importDefault(require("fs"));
const home = (req, res) => {
    const posts = models_1.Post.find({
        promoted: true,
    });
    if (!posts) {
        res.status(404).json({
            error: true,
            message: "No post found",
        });
    }
    else {
        res.json({
            error: false,
            data: posts,
        });
    }
};
exports.home = home;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, author, topic } = req.body;
    const post = yield new models_1.Post({
        title,
        content,
        author,
        topic: topic.toLowerCase(),
    });
    yield post.save();
    console.log(post);
    models_1.User.findOneAndUpdate({
        _id: author,
    }, {
        $push: {
            posts: { $each: [post._id], $position: 0 },
        },
    }, (err) => {
        if (err) {
            res.status(500).json({
                error: true,
                message: "Something went wrong",
            });
        }
        else {
            res.status(200).json({
                error: false,
                message: "Post created successfully",
                data: post,
            });
        }
    });
    console.log(post);
});
exports.create = create;
const update = (req, res) => {
    var _a;
    console.log(req.file, req.files);
    const img = fs_1.default.readFileSync((req === null || req === void 0 ? void 0 : req.file) ? req === null || req === void 0 ? void 0 : req.file.path : req === null || req === void 0 ? void 0 : req.body);
    const encode_img = img.toString("base64");
    const final_img = {
        contentType: (_a = req.file) === null || _a === void 0 ? void 0 : _a.mimetype,
        image: Buffer.from(encode_img, "base64"),
    };
    const { id } = req.params;
    models_1.Post.findOneAndUpdate({
        _id: id,
    }, {
        promoted: true,
        image: final_img,
    }, (err, post) => {
        if (err) {
            res.status(500).json({
                error: true,
                message: "Something went wrong",
            });
        }
        else {
            res.status(200).json({
                error: false,
                message: "Post updated successfully",
                data: post,
            });
        }
    });
};
exports.update = update;
const getPost = (req, res) => {
    const { id } = req.params;
    models_1.Post.findOne({
        _id: id,
    })
        .populate(["author", "comments"])
        .populate({
        path: "comments",
        populate: {
            path: "author",
        },
    })
        .exec((err, post) => {
        if (err) {
            res.status(500).json({
                error: true,
                message: "Something went wrong",
            });
        }
        else {
            if (!post) {
                res.status(404).json({
                    error: true,
                    message: "Post not found",
                });
            }
            else {
                res.status(200).json({
                    error: false,
                    message: "Post fetched successfully",
                    data: post,
                });
            }
        }
    });
};
exports.getPost = getPost;
const getTrending = (req, res) => {
    const { limit, page } = req.query;
    models_1.Post.find({
        date: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
        },
    })
        .sort({
        likes: -1,
    })
        .limit(limit ? parseInt(limit) : 10)
        .skip(page ? parseInt(page) * 10 : 0)
        .populate("author")
        .exec((err, posts) => {
        if (err) {
            res.status(500).json({
                error: true,
                message: "Something went wrong",
            });
        }
        else {
            if (posts.length === 0 || !posts) {
                res.status(404).json({
                    error: true,
                    message: "Post not found",
                });
            }
            else {
                res.status(200).json({
                    error: false,
                    message: "Posts fetched successfully",
                    data: posts,
                });
            }
        }
    });
};
exports.getTrending = getTrending;
const getRecent = (req, res) => {
    const { limit, page } = req.query;
    models_1.Post.find({
        date: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
        },
    })
        .sort({
        date: -1,
    })
        .limit(limit ? parseInt(limit) : 10)
        .skip(page ? parseInt(page) * 10 : 0)
        .populate("author")
        .exec((err, posts) => {
        if (err) {
            res.status(500).json({
                error: true,
                message: "Something went wrong",
            });
        }
        else {
            if (posts.length === 0 || !posts) {
                res.status(404).json({
                    error: true,
                    message: "Post not found",
                });
            }
            else {
                res.status(200).json({
                    error: false,
                    message: "Posts fetched successfully",
                    data: posts,
                });
            }
        }
    });
};
exports.getRecent = getRecent;
const getCategory = (req, res) => {
    const { category } = req.params;
    const { limit, page } = req.query;
    models_1.Post.find({
        topic: category,
    })
        .sort({
        date: -1,
    })
        .limit(limit ? parseInt(limit) : 10)
        .skip(page ? parseInt(page) * 10 : 0)
        .populate("author")
        .exec((err, posts) => {
        console.log(posts);
        if (err) {
            res.status(500).json({
                error: true,
                message: "Something went wrong",
            });
        }
        else {
            if (posts.length === 0 || !posts) {
                res.status(404).json({
                    error: true,
                    message: "Post not found",
                });
            }
            else {
                res.status(200).json({
                    error: false,
                    message: "Posts fetched successfully",
                    data: posts,
                });
            }
        }
    });
};
exports.getCategory = getCategory;
const getSearch = (req, res) => {
    const { query } = req.params;
    const { limit, page } = req.query;
    models_1.Post.find({
        title: {
            $regex: query,
            $options: "i",
        },
    })
        .sort({
        date: -1,
    })
        .limit(limit ? parseInt(limit) : 10)
        .skip(page ? parseInt(page) * 10 : 0)
        .populate("author")
        .exec((err, posts) => {
        console.log(posts);
        if (err) {
            res.status(500).json({
                error: true,
                message: "Something went wrong",
            });
        }
        else {
            if (posts.length === 0 || !posts) {
                res.status(404).json({
                    error: true,
                    message: "Post not found",
                });
            }
            else {
                res.status(200).json({
                    error: false,
                    message: "Posts fetched successfully",
                    data: posts,
                });
            }
        }
    });
};
exports.getSearch = getSearch;
