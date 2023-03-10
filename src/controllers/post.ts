import { Request, Response } from "express";
import { IPost, Post, User } from "../models";
import { CallbackError, Error, MongooseError } from "mongoose";
import fs from "fs";
const home = (req: Request, res: Response) => {
    const posts = Post.find({
        promoted: true,
    });
    if (!posts) {
        res.status(404).json({
            error: true,
            message: "No post found",
        });
    } else {
        res.json({
            error: false,
            data: posts,
        });
    }
};

const create = async (req: Request, res: Response) => {
    const { title, content, author, topic } = req.body;
    const post = await new Post({
        title,
        content,
        author,
        topic: topic.toLowerCase(),
    });
    await post.save();
    console.log(post);
    User.findOneAndUpdate(
        {
            _id: author,
        },
        {
            $push: {
                posts: { $each: [post._id], $position: 0 },
            },
        },
        (err: Error) => {
            if (err) {
                res.status(500).json({
                    error: true,
                    message: "Something went wrong",
                });
            } else {
                res.status(200).json({
                    error: false,
                    message: "Post created successfully",
                    data: post,
                });
            }
        }
    );
    console.log(post);
};

const update = (req: Request, res: Response) => {
    const { id } = req.params;
    Post.findOneAndUpdate(
        {
            _id: id,
        },
        {
            promoted: true,
            image: '',
        },
        (err: MongooseError, post: IPost) => {
            if (err) {
                res.status(500).json({
                    error: true,
                    message: "Something went wrong",
                });
            } else {
                res.status(200).json({
                    error: false,
                    message: "Post updated successfully",
                    data: post,
                });
            }
        }
    );
};

const DeletePost = (req: Request, res: Response) => {
    const { id } = req.params;
    Post.findOneAndDelete(
        {
            _id: id,
        },
        (err: MongooseError, post: IPost) => {
            if (err) {
                res.status(500).json({
                    error: true,
                    message: "Something went wrong",
                });
            } else {
                res.status(200).json({
                    error: false,
                    message: "Post deleted successfully",
                    data: post,
                });
            }
        }
    );
};
const getPost = (req: Request, res: Response) => {
    const { id } = req.params;
    Post.findOne({
        _id: id,
    })
        .populate(["author", "comments"])
        .populate({
            path: "comments",
            populate: {
                path: "author",
            },
        })
        .exec((err: CallbackError, post: IPost) => {
            if (err) {
                res.status(500).json({
                    error: true,
                    message: "Something went wrong",
                });
            } else {
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
const getTrending = (req: Request, res: Response) => {
    const { limit, page } = req.query;
    Post.find({
        date: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
        },
    })
        .sort({
            likes: -1,
        })
        .limit(limit ? parseInt(limit as string) : 10)
        .skip(page ? parseInt(page as string) * 10 : 0)
        .populate("author")
        .exec((err: CallbackError, posts: any) => {
            if (err) {
                res.status(500).json({
                    error: true,
                    message: "Something went wrong",
                });
            } else {
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
const getRecent = (req: Request, res: Response) => {
    const { limit, page } = req.query;
    Post.find({
        date: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
        },
    })
        .sort({
            date: -1,
        })
        .limit(limit ? parseInt(limit as string) : 10)
        .skip(page ? parseInt(page as string) * 10 : 0)
        .populate("author")
        .exec((err: CallbackError, posts: any) => {
            if (err) {
                res.status(500).json({
                    error: true,
                    message: "Something went wrong",
                });
            } else {
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
const getCategory = (req: Request, res: Response) => {
    const { category } = req.params;
    const { limit, page } = req.query;
    Post.find({
        topic: category,
    })
        .sort({
            date: -1,
        })
        .limit(limit ? parseInt(limit as string) : 10)
        .skip(page ? parseInt(page as string) * 10 : 0)
        .populate("author")
        .exec((err: CallbackError, posts: any) => {
            console.log(posts);
            if (err) {
                res.status(500).json({
                    error: true,
                    message: "Something went wrong",
                });
            } else {
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

const getSearch = (req: Request, res: Response) => {
    const { query } = req.params;
    const { limit, page } = req.query;
    Post.find({
        title: {
            $regex: query,
            $options: "i",
        },
    })
        .sort({
            date: -1,
        })
        .limit(limit ? parseInt(limit as string) : 10)
        .skip(page ? parseInt(page as string) * 10 : 0)
        .populate("author")
        .exec((err: CallbackError, posts: any) => {
            console.log(posts);
            if (err) {
                res.status(500).json({
                    error: true,
                    message: "Something went wrong",
                });
            } else {
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

export { home, create, update, getPost, getCategory, getTrending, getRecent, getSearch, DeletePost };
