import { io } from "../bin/www";
import { Socket } from "socket.io";
import { Post, Comments } from "../models";
let count = 0;
io.on('connection', (socket: Socket) => {
    console.log('a user connected');
    count++;
    socket.on('disconnect', () => {
        console.log('user disconnected');
        count--;
    });
    socket.on('connections', () => {
        io.emit('connections', count);  
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
    socket.on('post-view', (msg: string) => {
        Post.findOneAndUpdate({ id: "1" }, { $inc: { views: 1 } }).then((post) => {
            if (post) {
                console.log(post);
                io.emit('chat message', msg);
            }
        });
    });
    socket.on('post-like', (msg: string) => {
        Post.findOneAndUpdate({ id: "1" }, { $inc: { likes: 1 } }).then((post) => {
            if (post) {
                console.log(post);
                io.emit('chat message', msg);
            }
        });
    });
    socket.on('post-dislike', (msg: string) => {
        Post.findOneAndUpdate({ id: "1" }, { $inc: { dislikes: 1 } }).then((post) => {
            if (post) {
                console.log(post);
                io.emit('chat message', msg);
            }
        });
    });
    socket.on('post-comment', (msg: string) => {
        Post.findOneAndUpdate({ id: "1" }, { $inc: { comments: 1 } }).then((post) => {
            if (post) {
                Comments.create({
                    ref: post.id,
                    id: "1",
                    date: new Date(),
                    content: msg,
                    likes: 0,
                    dislikes: 0,
                    reports: []
                }).then((comment) => {
                    if (comment) {
                        console.log(comment);
                        io.emit('chat message', comment);
                    }
                });
            }
        });
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