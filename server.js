
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;


app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:5174",
      "http://127.0.0.1:5174",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "IKIMINA Backend irakora neza!",
  });
});


app.use("/api/auth", authRoutes);


app.use("/api/v1/users", userRoutes);


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} ntiyabonetse.`,
  });
});


app.use((error, req, res, next) => {
  console.error("Server Error:", error);

  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
});

async function startServer() {
  try {
    if (!DATABASE_URL) {
      throw new Error("DATABASE_URL ntabwo iboneka muri .env");
    }

    await mongoose.connect(DATABASE_URL);

    console.log("MongoDB ihujwe neza na IKIMINA!");

    app.listen(PORT, () => {
      console.log(
        `IKIMINA backend iri gukora kuri http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Ikosa mu gutangiza backend:",
      error.message
    );

    process.exit(1);
  }
}

startServer();
