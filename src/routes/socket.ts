import { io } from "../bin/www";
import { Socket } from "socket.io";
import Post from "../models/post";
let count = 0;
io.on('connection', (socket: Socket) => {
  console.log('a user connected');
  count++;
  socket.on('disconnect', () => {
    console.log('user disconnected');
    count--;
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
        console.log(post);
        io.emit('chat message', msg);
      }
    });
  });
  socket.on('post-report', (obj: Object) => {
    Post.findOneAndUpdate({ id: "1" }, { ...obj }).then((post) => {
      if (post) {
        console.log(post);
        io.emit('chat message', post);
      }
    });
  });
});