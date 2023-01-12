import { Request, Response } from "express";
import { IPost, Post, User } from "../models";
import { CallbackError, Error } from "mongoose";

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

const create = (req: Request, res: Response) => {
    const { title, content, author } = req.body;
    const post = new Post({
        title,
        content,
        author,
    });
    post.save((err: Error, post: IPost) => {
        User.findOneAndUpdate(
            {
                id: author,
            },
            {
                $push: {
                    posts: post._id,
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
    });
};

const update = (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, content, author, promoted } = req.body;
    Post.findOneAndUpdate(
        {
            _id: id,
        },
        {
            title,
            content,
            author,
            promoted,
        },
        (err: Error, post: IPost) => {
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

const getPost = (req: Request, res: Response) => {
    const { id } = req.params;
    Post.findOne({
        _id: id,
    })
        .populate("author")
        .exec((err: CallbackError, post: IPost) => {
            if (err) {
                res.status(500).json({
                    error: true,
                    message: "Something went wrong",
                });
            } else {
                res.status(200).json({
                    error: false,
                    message: "Post fetched successfully",
                    data: post,
                });
            }
        });
};
export { home, create, update, getPost };
