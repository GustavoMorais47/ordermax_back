import { Schema } from "mongoose";
import database from "../data";
import { IModelo } from "../types";

const schema = new Schema<IModelo>({
  descricao: {
    type: String,
    required: true,
  },
  imagem: {
    type: String,
    required: false,
  },
  cores: {
    type: [String],
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
});

const ModeloModel = database.model("Modelo", schema);

export default ModeloModel;
