import User from "../models/user.schema.js"
import asyncHandler from "../service/asyncHandler.js";
import CustomError from "../utils/CustomError.js";

export const cookieOptions = {
   expires: new Date(Date.now() + 3*24*60*60*1000),  // 3 days
   httpOnly: true
}

export const signUp = asyncHandler(async(req, res) => {
    
   const {name,email, password} = req.body;

   if(!name || !email || !password){
    throw new CustomError("Please add all fields", 400)
   }
   const existingUser = await User.findOne({email});

   if(existingUser){
    throw new CustomError("User already exists ",400)
   }

   const user = await User.create({
    name, email, password
   });

   const token = user.getJWTtoken();

   // For safety while sending user obj to frontend

   user.password = undefined;

   res.cookie("token", token, cookieOptions)

   res.status(200).json({
      success: true,
      token,
      user,
   })


})

export const login = asyncHandler(async(req,res)=> {
   const {email, password} = req.body;

   if(!email || !password) {
      throw new CustomError("Please Provide all Fields", 400);
   }

   const user = User.findOne({email}).select("+password");

   if(!user) {
      throw new CustomError("Invalid Credentials", 400);
   }

   const isPasswordMatched = user.comparePassword(password);

   if(isPasswordMatched){
      const token = user.getJWTtoken();
      user.password = undefined;
      res.cookie("token", token, cookieOptions);
      return res.status(200).json({
         success: true,
         token,
         user
      })
   }

   throw new CustomError("Password is incorrect", 400)


})

export const logout = asyncHandler(async(req,res)=> {

   res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true
   });

   res.status(200).json({
      success: true,
      message: "Logged Out"
   })
})