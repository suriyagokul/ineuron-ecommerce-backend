import mongoose from "mongoose";
import app from "./app.js";
import config from "./config/index.js";

(async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("MongoDB Connected");

    app.on("error", (err) => console.log(err));

    const onlistening = () => {
      console.log(`Server listening on ${config.PORT}`);
    };

    app.listen(config.PORT, onlistening);
  } catch (error) {
    console.error(error);
    throw error;
  }
})();
