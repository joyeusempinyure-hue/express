
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()


const app = express();
const db = proccess.env.DATABASE_URL
const port = process.env.PORT

app.get("/user", (req, res) => {
  return res.status(200).json({
    message: "morning guys",
  });
});

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});

mongoose.connect(DATABASE_URL).then(()=>{
  console.log("Database successfuly connected")

}).catch((error)=>{
  console.log(`Fail to connect to database because: ${error}`)
}
)


