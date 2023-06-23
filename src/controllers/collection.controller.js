import Collection from "../models/collection.schema.js"
import CustomError from "../utils/CustomError.js"
import asyncHandler from "../service/asyncHandler.js"


export const createCollection = asyncHandler(async (req, res) => {
    const {name} = req.body;

    if(!name){
        throw new CustomError("Collection name is required", 400)
    }

    const collection = await Collection.create({
        name
    })

    res.status(200).json({
        success:true,
        message:"Successfully Created Collection",
        collection
    })

})

export const updateCollection = asyncHandler(async (req, res) => {
    const {name} = req.body
    const {id: collectionId} = req.params

    if(!name){
        throw new CustomError("Collection name is required", 400)
    }

    const updatedCollection = await Collection.findByIdAndUpdate(collectionId, {name}, {
        new: true,
        runValidators: true
    })

    if(!updatedCollection){
        throw new CustomError("Collection not found", 400)
    }

    res.status(200).json({
        success:true,
        message:"Collection Updated Successfully",
        updatedCollection
    })

})

export const deleteCollection = asyncHandler(async (req, res) => {
    const {id: collectionId} = req.params;

    const collectionToDelete = await Collection.findById(collectionId);

    if (!collectionToDelete) {
        throw new CustomError("Collection not found", 404);
    }

    collectionToDelete.remove()

    res.status(200).json({
        success:true,
        message:"Collection Deleted Successfully",
    })

})

export const getCollection = asyncHandler(async (req, res) => {


    const collections = await Collection.find({});

    if (!collections) {
        throw new CustomError("No collection found", 404);
      }

    res.status(200).json({
        success:true,
        collections
    })

})
