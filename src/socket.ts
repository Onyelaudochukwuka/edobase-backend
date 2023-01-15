import { Socket } from "socket.io";
import { Comments, IPost, Post, User } from "./models";
import { verify } from "jsonwebtoken";
import { ObjectId, isValidObjectId } from "mongoose";
import { io } from "./bin/www";
const jwtSecret = process.env.JWT_SECRET ?? '';
if (!jwtSecret) throw new Error("Secret hash is missing");

// eslint-disable-next-line @typescript-eslint/no-var-requires
const startSocket = async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    let count = 0;
    console.log(count);
    io.on('connection', async (socket: Socket) => {
        console.log(`⚡: ${socket.id} user just connected!`);
        count++;
        const postCount = await Post.find({});
        io.emit('connections', { users: count, posts: postCount.length });
        
        socket.on('disconnect', () => {
            console.log('user disconnected');
            count--;
        });
        socket.on('get-connections', () => {
            io.emit('connections', count);
            console.log(count);
        });
        socket.on('comments', (id: string) => {
            Comments.find({ ref: id }).then((comments) => {
                if (comments) {
                    console.log(comments);
                    io.emit('comments', comments);
                }
            }
            );
        });
        socket.on('post-view', (id: ObjectId) => {
            if (isValidObjectId(id)) {
                Post.findOneAndUpdate({ _id: id }, { $inc: { views: 1 } }).then((post) => {
                    if (post) {
                        console.log(post.views);
                        io.emit(`${post._id}-views`, post.views);
                    } else {
                        io.emit('success', false);
                    }
                });
            } else {
                io.emit('success', false);
            }
        });
        socket.on('post-like', (id: ObjectId) => {
            if (isValidObjectId(id)) {
                Post.findOneAndUpdate({ id: "1" }, { $inc: { likes: 1 } }).then((post) => {
                    if (post) {
                        console.log(post);
                        io.emit(`${post._id}-likes`, post.likes);
                    }
                });
            }
        });
        socket.on('post-dislike', (id: ObjectId) => {
            if (isValidObjectId(id)) {
                Post.findOneAndUpdate({ id: id }, { $inc: { dislikes: 1 } }).then((post) => {
                    if (post) {
                        console.log(post);
                        io.emit(`${post._id}-dislikes`, post.dislikes);
                    }
                });
            }
        });
        socket.on('post-comment', ({ id, comment, token }: { id: ObjectId, comment: string, token: string }) => {
            verify(token, jwtSecret, async (err: any, decoded: any) => {
                if (decoded) {
                    const user = await User.findOne({ _id: decoded.userId });
                    if (user.confirmed) {
                        if (isValidObjectId(id)) {
                            Post.findOne({ id: id }).then((post) => {
                                if (post) {
                                    Comments.create({
                                        ref: post._id,
                                        date: new Date(),
                                        content: comment,
                                        likes: 0,
                                        dislikes: 0,
                                        reports: []
                                    }).then((comment) => {
                                        if (comment) {
                                            Post.findOneAndUpdate({ _id: post._id }, { $push: { comments: comment._id } }).then((post) => {
                                                if (post) {
                                                    console.log(post);
                                                    io.emit('comment', post._id);
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    }
                }
            });

        });
        socket.on('get-comment', (id: ObjectId) => {
            if (isValidObjectId(id)) {
                Post.findOne({ id: id })
                    .populate('comments')
                    .exec((err, post: IPost) => {
                        if (post) {
                            console.log(post);
                            io.emit(`${post._id}-comments`, post.comments);
                        }
                    }
                    );
            }
        });
        socket.on('post-report', (obj: any) => {
            Post.findOneAndUpdate({ id: "1" }, { ...obj }).then((post) => {
                if (post) {
                    console.log(post);
                    io.emit('chat message', post);
                }
            });
        });
    });
};
export default startSocket;