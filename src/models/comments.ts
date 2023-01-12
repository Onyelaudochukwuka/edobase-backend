import { Schema, model, models } from "mongoose";
interface Comments {
  id: string;
  date: Date;
  content: string;
  likes: number;
  dislikes: number;
  ref: string;
  reports: {
    type: string;
    reason: string;
    frequency: number;
  } [];
}

const commentSchema = new Schema<Comments>({
    ref: { type: String, required: true },
    id: { type: String, required: true },
    date: { type: Date, required: true },
    content: { type: String, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    reports: [
        {
            type: { type: String, required: true },
            reason: { type: String, required: true },
            frequency: { type: Number, required: true },
        },
    ],
});

export default models.Comments || model("Comments", commentSchema);