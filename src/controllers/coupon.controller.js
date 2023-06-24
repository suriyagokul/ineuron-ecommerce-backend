import Coupon from "../models/coupon.schema.js"
import asyncHandler from "../service/asyncHandler.js"
import CustomError from "../utils/CustomError.js"


export const createCoupon = asyncHandler(async (req, res)=>{
   const {code, discount} = req.body

   if(!code || !discount){
    throw new CustomError("Coupon not found", 404)
   }

   const couponCreated = await Coupon.create({
     code,
     discount
   })

   res.status(200).json({
    success: true,
    message:"Coupon Created Successfully",
    couponCreated
   })

})

export const getAllCoupons = asyncHandler(async (req, res) => {
    
    const allCoupons = await Coupon.find({})

    if(!allCoupons){
        throw new CustomError("Coupon not found", 404)
    }

    res.status(200).json({
        success: true,
        coupons
    })

})