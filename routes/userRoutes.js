
import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "User ID ntabwo ari yo.",
      });
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Banza winjire muri konti yawe.",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Seriveri ntirategurwa neza.",
      });
    }

    let decoded;

    try {
      const token = authHeader.split(" ")[1];
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({
        success: false,
        message: "Token ntabwo ari yo cyangwa yarangiye.",
      });
    }

    if (decoded.userId !== id) {
      return res.status(403).json({
        success: false,
        message: "Ntabwo wemerewe kubona amakuru y'uyu muntu.",
      });
    }

    const user = await User.findById(id).select(
      "name email phone role createdAt"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Umunyamuryango ntabashije kuboneka.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Amakuru y'umunyamuryango yabonetse neza.",
      user,
    });
  } catch (error) {
    console.error("Get user error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Habaye ikibazo mu kubona amakuru.",
    });
  }
});

export default router;
