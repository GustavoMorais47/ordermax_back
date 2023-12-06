import { Types } from "mongoose";

export interface IPessoa {
  nome: string;
  cpf: string;
  telefone: string;
  email: string | null;
}

export interface IConcessionaria {
  nome: string;
  cnpj: string;
  telefone: string;
  email: string | null;
  endereco: {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    UF:
      | "AC"
      | "AL"
      | "AP"
      | "AM"
      | "BA"
      | "CE"
      | "DF"
      | "ES"
      | "GO"
      | "MA"
      | "MT"
      | "MS"
      | "MG"
      | "PA"
      | "PB"
      | "PR"
      | "PE"
      | "PI"
      | "RJ"
      | "RN"
      | "RS"
      | "RO"
      | "RR"
      | "SC"
      | "SP"
      | "SE"
      | "TO";
    cep: string;
    coordenadas: {
      latitude: string;
      longitude: string;
    } | null;
  };
  status: boolean;
}

export interface IUsuario {
  id_concessionaria: Types.ObjectId;
  id_pessoa: Types.ObjectId;
  senha: string;
  role: "cl" | "ct" | "mc"; // Cliente, Consultor Técnico, Mecânico
  status: boolean;
}

export interface IModelo {
  descricao: string;
  imagem: string | null;
  cores: string[];
  status: boolean;
}

export interface IServico {
  id_concessionaria: Types.ObjectId | null;
  descricao: string;
  status: boolean;
}

export interface IOrdem {
  id_concessionaria: Types.ObjectId;
  id_modelo: Types.ObjectId;
  id_cliente: Types.ObjectId;
  id_solicitante: Types.ObjectId;
  id_responsavel: Types.ObjectId | null;
  placa: string;
  ano: string;
  cor: string;
  ano_fabricacao: string;
  servicos_solicitados: Types.ObjectId[];
  servicos_realizados: Types.ObjectId[];
  status: "Aguardando" | "Em andamento" | "Finalizado" | "Cancelado";
}

export interface IHistorico {
  id_ordem: Types.ObjectId;
  data: Date;
  titulo: string;
  descricao: string;
}

export interface IConfig {
  background_url: string;
}
