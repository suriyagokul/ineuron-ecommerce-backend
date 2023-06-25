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

export const updateCoupon = asyncHandler(async (req, res)=> {
    const {id: couponId} = req.params
    const {action} = req.body

    const coupon = await Coupon.findByIdAndUpdate(couponId, {active: action}, {new: true,  runValidators: true})

    if (!coupon) {
        throw new CustomError("Coupon not found", 404)
    }

    res.status(200).json({
        success: true,
        message: "Coupon updated",
        coupon
    })

})

export const deleteCoupon = asyncHandler(async (req, res)=> {
    const {id: couponId} = req.params;

    const coupon = await Coupon.findByIdAndDelete(couponId)

    if (!coupon) {
        throw new CustomError("Coupon not found", 404)
    }

    res.status(200).json({
        success: true,
        message: "Coupon deleted", 
    })
})

export const getAllCoupons = asyncHandler(async (req, res) => {
    
    const allCoupons = await Coupon.find({})

    if(!allCoupons){
        throw new CustomError("Coupon not found", 404)
    }

    res.status(200).json({
        success: true,
        allCoupons
    })

})