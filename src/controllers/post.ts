import { Request, Response } from "express";
import { IPost, Post } from "../models";
import { Error } from "mongoose";

const home = (req: Request, res: Response) => {
    const posts = Post.find({
        promoted: true
    });
    if (!posts) {
        res.status(404).json({
            error: true,
            message: "No post found"
        });
    } else {
        res.json({
            error: false,
            data: posts
        });
    }
};

const create = (req: Request, res: Response) => {
    const { title, content, author, promoted } = req.body;
    const post = new Post({
        title,
        content,
        author,
        promoted
    });
    post.save((err: Error, post: IPost) => {
        if (err) {
            res.status(500).json({
                error: true,
                message: "Something went wrong"
            });
        } else {
            res.status(200).json({
                error: false,
                message: "Post created successfully",
                data: post
            });
        }
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
export { home, create, update };