import Product from "../models/product.schema.js"
import asyncHandler from "../service/asyncHandler.js"
import CustomError from "../utils/CustomError.js"
import config from "../config"
import Mongoose from "mongoose"
import {s3FileUpload} from "../service/imageUpload.js"
import formidable from "formidable"
import fs from "fs"



export const addProduct = asyncHandler(async (req, res) => {
    const form = formidable({multiples: true, keepExtensions: true});

    form.parse(req, async function(err, fields, files){
        if(err){
            throw new CustomError(err.message || "something went wrong", 500)
        }
        let productId = new Mongoose.Types.ObjectId().toHexString();

        console.log(fields, files);

        if(!fields.name || !fields.price || !fields.collectionId){
            throw new CustomError("Please fill all the fields", 400)
        }

        const imgArrayResp = Promise.all(
            Object.keys(files).map( async (file, index) => {
                const element = file[fileKey];
                console.log(element);
                const data = fs.readFileSync(element.filepath)

                const upload = await s3FileUpload({
                    bucketName: config.S3_BUCKET_NAME,
                    key: `products/${productId}/photo_${index + 1}.png`,
                    body: data,
                    contentType: element.mimetype
                })
                console.log(upload);

                return {
                    secure_url: upload.Location;
                }

            })
        )

        const imgArray = await imgArrayResp

        const product = Product.create({
            _id: productId,
            photos: imgArray,
            ...fields
        })

        if(!product) {
            throw new CustomError("Product failed to be created in db", 400)
        }

        res.status(200).json({
            success: true;
            product
        })

    })
})