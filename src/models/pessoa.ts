import { Schema } from "mongoose";
import database from "../data";
import { IPessoa } from "../types";

const schema = new Schema<IPessoa>({
  nome: {
    type: String,
    required: true,
  },
  cpf: {
    type: String,
    required: true,
  },
  telefone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
});

const PessoaModel = database.model("Pessoa", schema);

export default PessoaModel;
