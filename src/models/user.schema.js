import mongoose from "mongoose";
import AuthRoles from "../utils/authRoles.js";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import crypto from "crypto"

import config from "../config"

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
  comparePassword: async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  },
  getJWTtoken: function(){
    JWT.sign({_id: this._id, role: this.role}, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRY
    })
  },
  //generate forgot password token

  generateforgotPasswordToken: function(){
    const forgotToken = crypto.randomBytes(20).toString("hex");

    this.forgotPasswordToken = crypto.createHash("sha256").update(forgotToken).digest("hex")

    this.forgotPasswordExpiry = Date.now() + 30 * 60 * 1000;

    return forgotToken;
  }
};

export default mongoose.model("User", userSchema);
