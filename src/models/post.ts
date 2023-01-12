import { Schema, model, models } from "mongoose";
export interface IPost {
  id: string;
  date: Date;
  content: string;
  likes: number;
  views: number;
  dislikes: number;
  reports: {
    type: string;
    reason: string;
    frequency: number;
  }[];
  comments: number;
  promoted?: boolean;
  author: string
  title: string
  _id: string
}
const postSchema = new Schema<IPost>({
    date: { type: Date, required: true },
    content: { type: String, required: true },
    title: { type: String, required: true },
    likes: { type: Number, required: true },
    views: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    author: {
        type: String,
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
    promoted: {
        type: Boolean
        , required: false
    },
});
export default models.Post || model("Post", postSchema);