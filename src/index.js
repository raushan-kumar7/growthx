import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";

dotenv.config();

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(
        `Server running on port: http://localhost:${process.env.PORT}`
      );
    });
  })
  .catch((error) => {
    console.log("MONGODB connection failed !!! ", error);
  });