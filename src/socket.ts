import { Socket } from "socket.io";
import { Comments, IComments, IPost, IView, Post, Views } from "./models";
import { MongooseError, ObjectId, isValidObjectId} from "mongoose";
import { io } from "./bin/www";
const jwtSecret = process.env.JWT_SECRET ?? "";
if (!jwtSecret) throw new Error("Secret hash is missing");

// eslint-disable-next-line @typescript-eslint/no-var-requires
const startSocket = async () => {
    io.on("connection", async (socket: Socket) => {
        console.log(io.engine.clientsCount);
        console.log(`⚡: ${socket.id} user just connected! ${socket.client.conn.remoteAddress}}`);
        Views.findOne(
            { reference: "views" },
            (err: MongooseError, views: IView) => {
                if (views) {
                    console.log(views);
                    io.emit("views", views?.views);
                }
            }
        );
        const postCount = await Post.find({});
        io.emit("connections", { users: io.engine.clientsCount, posts: postCount.length });

        socket.on("disconnect", async () => {
            console.log(`⚡: ${socket.id} user just disconnected!`);
        });
        socket.on("comments", (id: string) => {
            Comments.find({ ref: id }).then((comments) => {
                if (comments) {
                    console.log(comments);
                    io.emit("comments", comments);
                }
            });
        });
        socket.on("post-view", async (id: ObjectId) => {
            if (isValidObjectId(id)) {
                Views.deleteMany({
                    date:
                    {
                        $lt: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
                    }
                });
                Views.findOneAndUpdate(
                    { reference: "views" },
                    { $inc: { views: 1 } },
                    { new: true },
                    (err, views) => {
                        if (!views) {
                            const newViews = new Views({
                                reference: "views",
                                views: 1,
                                date: new Date(),
                            });
                            newViews.save();
                            io.emit("views", newViews.views);
                        }
                        if (views) {
                            io.emit("views", views.views);
                        }
                    }
                );
                Post.findOneAndUpdate(
                    { _id: id },
                    { $inc: { views: 1 } },
                    { new: true },
                    (err, post) => {
                        if (post) {
                            console.log(post.views);
                            io.emit(`${post._id}-views`, post.views);
                        } else {
                            io.emit("success", false);
                        }
                    }
                );
            } else {
                io.emit("success", false);
            }
        });
        socket.on("post-like", ({ id, userId }: { id: ObjectId, userId: ObjectId }) => {
            console.log(id, userId);
            if (isValidObjectId(id)) {
                Post.findOneAndUpdate(
                    { _id: id, likes: { $not: { $in: [userId] } } },
                    {
                        $push: {
                            likes: userId,
                        },
                    },
                    { new: true },
                    (err, post) => {
                        console.log(post);
                        if (post) {
                            console.log(post);
                            io.emit(`${post._id}-likes`, post.likes);
                        }
                    }
                );
            }
        });
        socket.on("post-dislike", ({id, userId}: {id:ObjectId, userId: ObjectId}) => {
            if (isValidObjectId(id)) {
                Post.findOneAndUpdate(
                    { _id: id, dislikes: { $not: { $in: [userId] } } },
                    {
                        $push: {
                            dislikes: userId,
                        },
                    },
                    { new: true },
                    (err, post) => {
                        if (post) {
                            console.log(post);
                            io.emit(`${post._id}-dislikes`, post.dislikes);
                        }
                    }
                );
            }
        });
        socket.on("comment-like", ({ id, userId }: { id: ObjectId, userId: ObjectId }) => {
            console.log(id, userId);
            if (isValidObjectId(id)) {
                Comments.findOneAndUpdate(
                    { _id: id, likes: { $not: { $in: [userId] } } },
                    {
                        $push: {
                            likes: userId,
                        },
                    },
                    { new: true },
                    (err, comment) => {
                        console.log(comment);
                        if (comment) {
                            console.log(comment);
                            io.emit(`${comment._id}-likes`, comment.likes);
                        }
                    }
                );
            }
        });
        socket.on("comment-dislike", ({ id, userId }: { id: ObjectId, userId: ObjectId }) => {
            console.log(id, userId);
            if (isValidObjectId(id)) {
                Comments.findOneAndUpdate(
                    { _id: id, dislikes: { $not: { $in: [userId] } } },
                    {
                        $push: {
                            dislikes: userId,
                        },
                    },
                    { new: true },
                    (err, comments) => {
                        if (comments) {
                            console.log(comments);
                            io.emit(`${comments._id}-dislikes`, comments.dislikes);
                        }
                    }
                );
            }
        });
        socket.on("comment-delete", ({ id, userId }: { id: ObjectId, userId: ObjectId }) => {
            console.log(id, userId);
            if (isValidObjectId(id)) {
                Comments.findOneAndDelete(
                    { _id: id, author: userId },
                    (err: MongooseError, comments: IComments) => {
                        if (!err) {
                            Post.findOneAndUpdate(
                                { _id: comments.refPost },
                                { $pull: { comments: id } },
                                { new: true },
                            )
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
                                        io.emit(`${post._id}-comments`, post.comments);
                                    }
                                });
                        }
                        if (comments) {
                            console.log(comments);
                            io.emit(`${comments._id}-delete`, comments._id);
                        }
                    }
                );
            }
        });
            
        socket.on(
            "post-comment",
            ({
                id,
                comment,
                userId,
            }: {
        id: ObjectId;
        comment: string;
        userId: string;
      }) => {
                console.log(id, comment, userId);
                console.time("comment");
                console.timeLog("comment");
                if (isValidObjectId(id) && isValidObjectId(userId)) {
                    Post.findOne({ _id: id }).then((post) => {
                        if (post) {
                            Comments.create({
                                refPost: post._id,
                                content: comment,
                                author: userId,
                            }).then((comment) => {
                                if (comment) {
                                    Post.findOneAndUpdate(
                                        { _id: post._id },
                                        {
                                            $push: {
                                                comments:  comment._id ,
                                            },
                                        },
                                        { new: true }
                                    )
                                        .populate("comments")
                                        .populate({
                                            path: "comments",
                                            populate: {
                                                path: "author",
                                            },
                                        })
                                        .exec((err, post: IPost) => {
                                            if (post) {
                                                console.log(post);
                                                io.emit(`${post._id}-comments`, post.comments);
                                            }
                                        });
                                }
                            });
                        }
                    });
                }
                console.timeEnd("comment");
            }
        );
        socket.on("post-delete", ({ id, userId }: { id: ObjectId, userId: ObjectId }) => {
            console.log(id, userId);
            if (isValidObjectId(id)) {
                Post.deleteOne({ _id: id, author: userId }, (err: MongooseError) => {
                    if (!err) {
                        Comments.deleteMany({ refPost: id }, (err: MongooseError) => {
                            if (!err) {
                                io.emit(`${id}-delete`, id);
                            }
                        }
                        );
                    }
                }
                );
            }
        });

        socket.on("get-comment", (id: ObjectId) => {
            if (isValidObjectId(id)) {
                Post.findOne({ id: id })
                    .populate("comments")
                    .exec((err, post: IPost) => {
                        if (post) {
                            console.log(post);
                            io.emit(`${post._id}-comments`, post.comments);
                        }
                    });
            }
        });
        socket.on("post-report", ({ id, obj }: { id: ObjectId, obj: any }) => {
            Post.findOneAndUpdate(
                { _id: id },
                { $push: { reports: { $each: [obj], $position: 0 } } },
                { new: true },
                (err, post) => {
                    if (post) {
                        console.log(post);
                        io.emit(`${post._id}-reports`, post.reports);
                    }
                }
            );
        });
        socket.on("comment-report", ({ id, obj }: { id: ObjectId, obj: any }) => {
            Comments.findOneAndUpdate(
                {
                    _id: id,
                },
                { $push: { reports: { $each: [obj], $position: 0 } } },
                { new: true },
                (err, comment) => {
                    if (comment) {
                        console.log(comment);
                        io.emit(`${comment._id}-reports`, comment.reports);
                    }
                }
            );
        });
    });
};
export default startSocket;
