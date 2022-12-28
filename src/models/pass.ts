import { Schema, model, models } from "mongoose";
export interface IPass {
  user_id: string;
  confirmation_id: string;
  date: Date;
}
const passSchema = new Schema<IPass>({
  user_id: {
    type: String,
    required: true,
  },
  confirmation_id: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  }
});
export default models.Pass || model("Pass", passSchema);