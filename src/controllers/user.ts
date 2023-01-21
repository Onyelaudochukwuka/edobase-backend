/* eslint-disable no-unused-vars */
import { Request, Response } from "express";
import { IPost, IUser, User } from "../models";
import { CallbackError } from "mongoose";

const getUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await User.findOne(
        {
            _id: id,
        });
      
    if (!user) {
        res.status(500).json({
            error: true,
            message: "Something went wrong",
        });
    } else {
        res.status(200).json({
            error: false,
            message: "User retrieved successfully",
            data: user,
        });
    }
};

const getUserDetails = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await User.findOne(
        {
            _id: id,
        },
    )
        .populate("posts")
        .populate({
            path: "posts",
            populate: {
                path: "author",
            },
        })
        .exec((err: CallbackError, user: IPost) => {
            if (err) {
                res.status(500).json({
                    error: true,
                    message: "Something went wrong",
                });
            } else {
                res.status(200).json({
                    error: false,
                    message: "User retrieved successfully",
                    data: user,
                });
            }
        });
};


const getUsers = async (req: Request, res: Response) => {
    const users = await User.find({}, (err: Error, users: IUser[]) => {
        if (err) {
            res.status(500).json({
                error: true,
                message: "Something went wrong",
            });
        } else {
            res.status(200).json({
                error: false,
                message: "Users retrieved successfully",
                data: users,
            });
        }
    });
};

const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await User.findOneAndDelete(
        {
            _id: id,
        },
        (err: Error, user: IUser) => {
            if (err) {
                res.status(500).json({
                    error: true,
                    message: "Something went wrong",
                });
            } else {
                res.status(200).json({
                    error: false,
                    message: "User deleted successfully",
                    data: user,
                });
            }
        }
    );
};


export { getUser, getUsers, deleteUser, getUserDetails };