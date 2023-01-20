import { ObjectId, Schema, model, models } from "mongoose";
import { ObjectId as Id } from "mongodb";
export interface IComments {
  _id: ObjectId;
  date: Date;
  content: string;
  likes: string[];
  dislikes: string[];
  refPost: string;
  author: ObjectId;
  replyTo: ObjectId;
  reports: {
    type: string;
    reason: string;
    frequency: number;
  } [];
}

const commentSchema = new Schema<IComments>({
    refPost: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now() },
    content: { type: String, required: true },
    likes: { type: [String], required: true, default: [] },
    dislikes: { type: [String], required: true, default: [] },
    replyTo: { type: String, required: false },
    author: {
        type: Id,
        required: true,
        ref: "User",
    },
    reports: {
        type: [
            {
                type: { type: String, required: true },
                reason: { type: String, required: true },
                frequency: { type: Number, required: true },
            
            },
        
        ],
        required: false,
        default: [],
    }
});

export default models.Comments || model("Comments", commentSchema);