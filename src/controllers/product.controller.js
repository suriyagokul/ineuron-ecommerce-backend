import Product from "../models/product.schema.js"
import asyncHandler from "../service/asyncHandler.js"
import CustomError from "../utils/CustomError.js"
import Mongoose from "mongoose"
import formidable from "formidable"


export const addProduct = asyncHandler(async (req, res) => {
    const form = formidable({multiples: true, keepExtensions: true});

    form.parse(req, async function(err, fields, files){
        if(err){
            throw new CustomError(err.message || "something went wrong", 500)
        }
        let productId = new Mongoose.Types.ObjectId().toHexString();

        console.log(fields, files);
    })
})