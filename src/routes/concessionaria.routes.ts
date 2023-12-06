import { Router } from "express";
import ConcessionariaModel from "../models/concessionaria";

const concessionaria_router = Router();

concessionaria_router.get("/", async (req, res) => {
  try {
    const concessionarias = await ConcessionariaModel.find();

    res.status(200).json(concessionarias);
  } catch (error) {
    return res.status(500).json(error);
  }
});

export default concessionaria_router;
