import Product from "../models/product.schema.js"
import asyncHandler from "../service/asyncHandler.js"
import CustomError from "../utils/CustomError.js"
import config from "../config"
import Mongoose from "mongoose"
import {s3FileUpload, s3deleteFile} from "../service/imageUpload.js"
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
                    secure_url: upload.Location,
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
            success: true,
            product
        })

    })
})

export const getAllProducts = asyncHandler(async (req, res) => {
   
    const products = await Product.find({})

    if(!products){
        throw new CustomError("No Products Found", 404)
    }

    res.status(200).json({
        success: true,
        products
    })
})

export const getProductById = asyncHandler(async (req, res) => {

    const {id: productId} = req.params

    const product = await Product.findById(productId);

    if(!product){
        throw new CustomError("No Product Found", 404)
    }

    res.status(200).json({
        success: true,
        product
    })
})

export const getProductByCollectionId = asyncHandler(async (req, res)=> {
    const {id: collectionId} = req.params;

    const products = await Product.find({collectionId})

    if(!products){
        throw new CustomError("No Products Found", 404)
    }

    res.status(200).json({
        success: true,
        products
    })
})

export const deleteProduct = asyncHandler(async (req, res)=> {
    const {id: productId} = req.params;

    const productToDelete = await Product.findById(productId)

    if(!productToDelete){
        throw new CustomError("No Product Found To Delete", 400)
    }

    /* steps to delete photos of this corresponding product
    
            1) Resolve Promise

            2) Loop Through this product photos

            3) Delete photos from aws 
    */

    const deletePhotos = Promise.all(
        productToDelete.photos.map(async (elem, index)=> {
            await s3deleteFile({
                bucketName: config.S3_BUCKET_NAME,
                key: `products/${productToDelete._id}/photo_${index + 1}.png`
            })
        })
    )

    await deletePhotos;

    await productToDelete.remove() 

    res.status(200).json({
        succes: true,
        message: 'Product has been deleted successfully'
    })
})