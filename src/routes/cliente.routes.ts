import { Router } from "express";
import PessoaModel from "../models/pessoa";
import UsuarioModel from "../models/usuario";
import { IPessoa } from "../types";

const cliente_router = Router();

cliente_router.get("/", async (req, res) => {
  try {
    const pessoas = await PessoaModel.find();

    const usuarios = await UsuarioModel.find();

    const clientes: IPessoa[] = [];
    pessoas.forEach((pessoa) => {
      usuarios.forEach((usuario) => {
        if (
          String(pessoa._id) === String(usuario.id_pessoa) &&
          usuario.role === "cl"
        ) {
          clientes.push(pessoa);
        }
      });
    });
    return res.status(200).json(clientes);
  } catch (error) {
    return res.status(500).json(error);
  }
});

export default cliente_router;
