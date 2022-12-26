import { Schema, model } from "mongoose";
interface User {
  name: string;
  email: string;
  password: string;
  date: Date;
  gender?: string;
  image?: string;
}
const userSchema = new Schema<User>({
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
    default: Date.now,
  },
  gender: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
});

export default model("User", userSchema);