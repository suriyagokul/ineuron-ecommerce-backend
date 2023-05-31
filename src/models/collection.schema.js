import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: ["true", "Please Provide name of the Product"],
      maxLength: [120, "Name must not exceed 120 characters"],
      trim: true,
    },
  },
  {timestamps: true}
);

export default mongoose.model("Collection", collectionSchema);
