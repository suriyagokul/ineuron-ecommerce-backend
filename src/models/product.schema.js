import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: ["true", "Please Provide Product Name"],
        trim: true
    },
    price: {
        type: Number,
        required: ["true", "Please Provide Price Of Product"],
    },
    decsription: {
        type: String
    },
    photos: {
        type: Array,
        secure_url: {
            type: String,
            required: true
        }
    },
    stock: {
        type: Number,
        default: 0
    },
    sold: {
        type: Number,
        default: 0
    },
    collectionId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Collection"
    }
}, {timestamps: true})

export default mongoose.model("Product", productSchema);