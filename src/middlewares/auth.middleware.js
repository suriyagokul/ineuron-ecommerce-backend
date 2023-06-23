import asyncHandler from "../service/asyncHandler.js"
import CustomError from "../utils/CustomError.js"
import JWT from "jsonwebtoken";
import config from "../config/"
import User from "../models/user.schema.js"

export const isLoggedIn = asyncHandler(async (req, res, next) => {
    let token;
    
    if(req.cookies.token || (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) ){
        token = req.cookies.token || req.headers.authorization.split(" ")[1];    // In header we pass {authorization: "Bearer dsjnk38"}
    }

    if(!token){
        throw new CustomError("Not authorised to access the resource", 402);
    }

    try {
        const decodedJWTPayload = JWT.verify(token, config.JWT_SECRET);

        req.user = await User.findById(decodedJWTPayload._id, "name email role");
        next();
    } catch (error) {
        throw new CustomError("Not authorised to access the resource", 402);
        
    }


})

export const authorize = (...requiredRoles) => asyncHandler(async (req, res, next) => {
    if(!requiredRoles.includes(req.user.role)){
        throw new CustomError("You are not authorized to access this resource", 400)
    }
    next();
})