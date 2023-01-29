import { Schema, model, models } from "mongoose";
export interface IView {
    reference: string;
  views: number;
  date: Date;
}
const viewSchema = new Schema<IView>({
    reference: {
        type: String,
        required: true,
    },
    views: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    }
});
export default models.Views || model("Views", viewSchema);