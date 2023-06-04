import dotenv from "dotenv";

dotenv.config();

const config = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/mydb",
  JWT_SECRET: process.env.JWT_SECRET || "my_secret",
  JWT_EXPIRY: process.env.JWT_EXPIRY || "30d"
};

export default config;
