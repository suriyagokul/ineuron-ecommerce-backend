import Collection from "../models/collection.schema.js"
import asyncHandler from "../service/asyncHandler.js"
import CustomError from "../utils/CustomError.js"

export const createCollection = asyncHandler(async(req, res) => {
    const {name} = req.body;

    if(!name){
        throw new CustomError("Collection name is required", 400);
    }
    const collection = await Collection.create({name});

    res.status(200).json({
        succcess: true,
        message:"Collection Successfully Created",
        collection
    })

})

export const updateCollection = asyncHandler(async(req, res) => {
    const {name} = req.body;
    const {id: collectionId} = req.params;

    if(!name){
        throw new CustomError("Collection name is required", 400);
    }
    let updatedCollection = await Collection.findByIdAndUpdate(collectionId, {name}, {new: true, runValidators: true});

    if (!updatedCollection) {
        throw new CustomError("Collection not found", 404);
      }

    res.status(200).json({
        succcess: true,
        message:"Collection Updated Successfully",
        updateCollection
    })

})


export const deleteCollection = asyncHandler(async(req, res) => {
    const {id: collectionId} = req.params;

    const collectionToDelete = await Collection.findByIdAndDelete(collectionId);

    if(!collectionToDelete){
        throw new CustomError("Collection not found", 404);
    }

    res.status(200).json({
        succcess: true,
        message: "Collection has been deleted successfully",
    })

})


export const getAllCollections = asyncHandler(async(req, res) => {

    const collections = await Collection.find({});

    if(!collections){
        throw new CustomError("No Collection found", 404);
    }

    res.status(200).json({
        succcess: true,
        collections
    })

})