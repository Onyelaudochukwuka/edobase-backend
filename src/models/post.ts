import { Schema, model, models } from "mongoose";
export interface IPost {
}
const postSchema = new Schema<IPost>({
  
});
export default models.Post || model("Post", postSchema);