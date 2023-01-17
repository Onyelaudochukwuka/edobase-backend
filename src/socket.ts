import { Socket } from "socket.io";
import { Comments, IPost, Post } from "./models";
import { ObjectId, isValidObjectId } from "mongoose";
import { io } from "./bin/www";
const jwtSecret = process.env.JWT_SECRET ?? "";
if (!jwtSecret) throw new Error("Secret hash is missing");

// eslint-disable-next-line @typescript-eslint/no-var-requires
const startSocket = async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    let count = 0;
    const connectedDevices: string[] = [];
    console.log(count);
    io.on("connection", async (socket: Socket) => {
        if (!connectedDevices.includes(socket.client.conn.remoteAddress)) {
            console.log(`⚡: ${socket.id} user just connected!`);
            connectedDevices.push(socket.client.conn.remoteAddress);
            count = count + 1;
        }
        const postCount = await Post.find({});
        io.emit("connections", { users: count, posts: postCount.length });

        socket.on("disconnect", () => {
            if (!connectedDevices.includes(socket.client.conn.remoteAddress)) {
                connectedDevices.splice(connectedDevices.indexOf(socket.client.conn.remoteAddress), 1);
                console.log("user disconnected");
                count--;
            }
        });
        socket.on("get-connections", () => {
            io.emit("connections", count);
            console.log(count);
        });
        socket.on("comments", (id: string) => {
            Comments.find({ ref: id }).then((comments) => {
                if (comments) {
                    console.log(comments);
                    io.emit("comments", comments);
                }
            });
        });
        socket.on("post-view", (id: ObjectId) => {
            if (isValidObjectId(id)) {
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
            if (isValidObjectId(id)) {
                Post.findOneAndUpdate(
                    { _id: id },
                    {
                        $push: {
                            likes: userId,
                        },
                    },
                    { new: true },
                    (err, post) => {
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
                    { _id: id },
                    {
                        $push: {
                            likes: userId,
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
                    Post.findOne({ id: id }).then((post) => {
                        if (post) {
                            Comments.create({
                                refPost: post._id,
                                date: new Date(),
                                content: comment,
                                likes: 0,
                                dislikes: 0,
                                author: userId,
                                reports: [],
                            }).then((comment) => {
                                if (comment) {
                                    Post.findOneAndUpdate(
                                        { _id: post._id },
                                        {
                                            $push: {
                                                comments: { $each: [comment._id], $position: 0 },
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
        socket.on("post-report", (obj: any) => {
            Post.findOneAndUpdate(
                { id: "1" },
                { ...obj },
                { new: true },
                (err, post) => {
                    if (post) {
                        console.log(post);
                        io.emit("chat message", post);
                    }
                }
            );
        });
    });
};
export default startSocket;
