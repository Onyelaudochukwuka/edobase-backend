import { ObjectId, Schema, Types, model, models } from "mongoose";
export interface IPost {
  date: Date;
  content: string;
  likes: string[];
  views: number;
  dislikes: string[];
  reports: {
    type: string;
    reason: string;
    frequency: number;
  }[];
  comments: ObjectId[];
  promoted?: boolean;
  author: string
  title: string
    image: string
    topic: string
    _id: ObjectId

}
const postSchema = new Schema<IPost>({
    date: { type: Date, required: true, default: Date.now() },
    content: { type: String, required: true },
    title: { type: String, required: true },
    views: { type: Number, required: true, default: 0 },
    likes: { type: [String], required: true, default: [] },
    dislikes: { type: [String], required: true, default: [] },
    comments: {
        type: [{
            type: Types.ObjectId,
            ref: "Comments"
        }],
        required: true,
        default: [],
    },
    topic: {
        type: String,
        required: true,
    },
    author: {
        type: String,
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
    },
    promoted: {
        type: Boolean
        , required: false
    },
    image: {
        image: Buffer,
        contentType: String,
        required: false,
    },
});
export default models.Post || model("Post", postSchema);