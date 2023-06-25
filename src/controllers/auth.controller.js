import User from "../models/user.schema.js"
import asyncHandler from "../service/asyncHandler.js";
import CustomError from "../utils/CustomError.js";
import mailHelper from "../utils/mailHelper.js"
import crypto from "crypto"


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

export const getProfile = asyncHandler(async (req, res)=> {
   const {user} = req

   if(!user){
      throw new CustomError("No User found", 401)
   }

   res.status(200).json({
      succees: true,
      user
   })

})

export const forgotPassword = asyncHandler(async (req, res)=> {
   const {email} = req.body;

   if(!email){
      throw new CustomError("Please Provide Email",400)
   }

   const user = User.findOne({email})

   if(!user){
      throw new CustomError("No user found with this email",404)
   }

   const resetToken = user.generateforgotPasswordToken()

   await user.save({validateBeforeSave: false})

   const tokenUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/password/reset/${resetToken}`;

   const message  = `Please reset your password using below link \n\n ${tokenUrl} \n\n if this was not requested by you, please ignore.`

  try {
      await mailHelper({
         email: user.email,
         subject: "Password Reset Token",
         message 
      })
  } catch (error) {
      user.forgotPasswordToken = undefined,
      user.forgotPasswordExpiry = undefined

      await user.save({validateBeforeSave: false})

      throw new CustomError(error.message || "Email could not be sent", 500)
  }
})

export const resetPassword = asyncHandler(async (req, res)=> {
   const {token: resetToken} = req.params;
   const {password, confirmPassword} = req.body;

   const resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")

   const user = User.findOne({
      forgotPasswordToken: resetPasswordToken,
      forgotPasswordExpiry: { $gt: Date.now() }
   })

   if(!user){
      throw new CustomError("passowrd token is invalid or expired",400)
   }

   if(password !== confirmPassword){
      throw new CustomError("Password doesn't match",401)
   }

   user.password = password
   user.forgotPasswordToken = undefined
   user.forgotPasswordExpiry = undefined

   await user.save();

   const token = user.getJWTtoken()

   res.cookie("token", token, cookieOptions);

   res.status(200).json({
      success: true,
      user
   })
})