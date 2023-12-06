import { Router } from "express";
import ServicoModel from "../models/servico";

const servico_router = Router();

servico_router.get("/", async (req, res) => {
  try {
    const servicos = await ServicoModel.find({ status: true });
    return res.status(200).json(servicos);
  } catch (error) {
    return res.status(500).json(error);
  }
});

export default servico_router;
