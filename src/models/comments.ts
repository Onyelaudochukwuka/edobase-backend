import { ObjectId, Schema, model, models } from "mongoose";
import { ObjectId as Id } from "mongodb";
interface Comments {
  _id: ObjectId;
  date: Date;
  content: string;
  likes: number;
  dislikes: number;
  refPost: string;
  author: ObjectId;
  reports: {
    type: string;
    reason: string;
    frequency: number;
  } [];
}

const commentSchema = new Schema<Comments>({
    refPost: { type: String, required: true },
    date: { type: Date, required: true },
    content: { type: String, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    author: {
        type: Id,
        required: true,
        ref: "User",
    },
    reports: [
        {
            type: { type: String, required: true },
            reason: { type: String, required: true },
            frequency: { type: Number, required: true },
        },
    ],
});

export default models.Comments || model("Comments", commentSchema);