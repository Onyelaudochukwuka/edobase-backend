import { ObjectId, Schema, Types, model, models } from "mongoose";
export interface IUser {
  name: string;
  username?: string;
  email: string;
  password: string;
  date: Date;
  gender?: string;
  image?: string;
  description?: string;
  confirmed: boolean;
  phone?: string;
  LGA?: string;
    posts: ObjectId[]
_id: ObjectId
}
const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    gender: {
        type: String,
        required: false,
    },
    image: {
        data: Buffer,
        contentType: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    confirmed: {
        type: Boolean,
        default: false,
    },
    phone: {
        type: String,
        required: false,
    },
    LGA: {
        type: String,
        required: false,
    },
    username: {
        type: String,
        required: false,
    },
    posts: {
        type: [{
            type: Types.ObjectId,
            ref: "Post"
        }],
        required: true,
        default: [],
    },
});
export default models.User || model("User", userSchema);