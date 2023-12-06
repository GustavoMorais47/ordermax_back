import { Schema } from "mongoose";
import { IOrdem } from "../types";
import database from "../data";

const schema = new Schema<IOrdem>({
  id_concessionaria: {
    type: Schema.Types.ObjectId,
    ref: "Concessionaria",
    required: true,
  },
  id_modelo: {
    type: Schema.Types.ObjectId,
    ref: "Modelo",
    required: true,
  },
  id_cliente: {
    type: Schema.Types.ObjectId,
    ref: "Pessoa",
    required: true,
  },
  id_solicitante: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  id_responsavel: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: false,
  },
  placa: {
    type: String,
    required: true,
  },
  ano: {
    type: String,
    required: true,
  },
  cor: {
    type: String,
    required: true,
  },
  ano_fabricacao: {
    type: String,
    required: true,
  },
  servicos_solicitados: [
    {
      type: Schema.Types.ObjectId,
      ref: "Servico",
      required: true,
    },
  ],
  servicos_realizados: [
    {
      type: Schema.Types.ObjectId,
      ref: "Servico",
      required: false,
    },
  ],
  status: {
    type: String,
    required: true,
    enum: ["Aguardando", "Em andamento", "Finalizado", "Cancelado"],
    default: "Aguardando",
  },
});

const OrdemModel = database.model("Ordens", schema);

export default OrdemModel;
