import { Router } from "express";
import ModeloModel from "../models/modelo";

const modelo_router = Router();

modelo_router.get("/", async (req, res) => {
  try {
    const modelos = await ModeloModel.find({ status: true });
    return res.status(200).json(modelos);
  } catch (error) {
    return res.status(500).json(error);
  }
});

export default modelo_router;
