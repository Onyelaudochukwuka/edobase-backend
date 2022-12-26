import { Schema, model, models } from "mongoose";
export interface IUser {
  name: string;
  email: string;
  password: string;
  date: Date;
  gender?: string;
  image?: string;
  id: string;
  description?: string;
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
  id: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
});
export default models.User || model("User", userSchema);