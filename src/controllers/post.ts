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
            id: author,
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
    console.log(req.file, req.files);
    const img = fs.readFileSync(req?.file ? req?.file.path : req?.body);
    const encode_img = img.toString("base64");
    const final_img = {
        contentType: req.file?.mimetype,
        image: Buffer.from(encode_img, "base64"),
    };
    const { id } = req.params;
    Post.findOneAndUpdate(
        {
            _id: id,
        },
        {
            promoted: true,
            image: final_img,
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
                res.status(200).json({
                    error: false,
                    message: "Post fetched successfully",
                    data: post,
                });
            }
        });
};

const getCategory = (req: Request, res: Response) => {
    const { category } = req.params;
    Post.find({
        topic: category,
    })
        .sort({
            date: -1,
        })
        .populate("author")
        .exec((err: CallbackError, posts: any) => {
            if (err) {
                res.status(500).json({
                    error: true,
                    message: "Something went wrong",
                });
            } else {
                res.status(200).json({
                    error: false,
                    message: "Posts fetched successfully",
                    data: posts,
                });
            }
        });
};

export { home, create, update, getPost, getCategory };
