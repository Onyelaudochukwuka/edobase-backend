import { Schema, model, models } from "mongoose";
export interface IPass {
  user_id: string;
  uuid: string;
}
const passSchema = new Schema<IPass>({
  user_id: {
    type: String,
    required: true,
  },
  uuid: {
    type: String,
    required: true,
  },
});
export default models.Pass || model("Pass", passSchema);