import mongoose from "mongoose";
import AuthRoles from "../utils/authRoles.js";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: ["true", "Please Provide User Name"],
      maxLength: [120, "Name must not exceed 120 chars"],
    },
    email: {
      type: String,
      required: ["true", "Please Provide Email"],
    },
    password: {
      type: String,
      required: ["true", "Please Provide Password"],
      select: false,
    },
    role: {
      type: String,
      enum: [AuthRoles],
      default: [AuthRoles.USER],
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
  },
  { timestamps: true }
);

// mongoose hook Encrypt the password before saving into db
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// custom hook to compare password
userSchema.methods = {
  comparePassword: async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  },
  getJWTToken: async function (){
    
  }
};

export default mongoose.model("User", userSchema);
