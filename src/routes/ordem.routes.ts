import { Router } from "express";
import { Types } from "mongoose";
import ModeloModel from "../models/modelo";
import UsuarioModel from "../models/usuario";
import OrdemModel from "../models/ordem";
import PessoaModel from "../models/pessoa";
import ServicoModel from "../models/servico";

const ordem_router = Router();

ordem_router.post("/", async (req, res) => {
  try {
    const { id } = req.query;
    const {
      id_modelo,
      id_cliente,
      placa,
      ano,
      ano_fabricacao,
      cor,
      servicos_solicitados,
    } = req.body;

    if (!id || typeof id !== "string")
      return res.status(401).json({ mensagem: "Acesso não autorizado!" });

    if (
      !id_modelo ||
      !id_cliente ||
      !placa ||
      !ano ||
      !ano_fabricacao ||
      !servicos_solicitados ||
      !cor
    )
      return res
        .status(400)
        .json({ mensagem: "Todos os campos são de preenchimento obrigatório" });

    if (!Types.ObjectId.isValid(id))
      return res.status(400).json({ mensagem: "Id do usuário inválido" });

    const usuario = await UsuarioModel.findById(id);

    if (!usuario)
      return res.status(404).json({ mensagem: "Usuário não encontrado" });

    if (!Types.ObjectId.isValid(id_modelo))
      return res.status(400).json({ mensagem: "Id do modelo inválido" });

    if (!Types.ObjectId.isValid(id_cliente))
      return res.status(400).json({ mensagem: "Id do cliente inválido" });

    const modelo = await ModeloModel.findById(id_modelo);

    if (!modelo)
      return res.status(404).json({ mensagem: "Modelo não encontrado" });

    const cliente = await PessoaModel.findById(id_cliente);

    if (!cliente)
      return res.status(404).json({ mensagem: "Cliente não encontrado" });

    await OrdemModel.create({
      id_cliente: cliente._id,
      id_modelo: modelo._id,
      id_solicitante: id,
      id_concessionaria: usuario.id_concessionaria,
      ano,
      ano_fabricacao,
      cor,
      placa,
      servicos_solicitados,
      servicos_realizados: [],
      id_responsavel: null,
      status: "Aguardando",
    });

    return res.status(200).json({ mensagem: "Cadastro realizado com sucesso" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ mensagem: "Erro interno" });
  }
});

ordem_router.put("/status/", async (req, res) => {
  try {
    const { id } = req.query;
    const { status } = req.body;

    if (!id || typeof id !== "string" || !Types.ObjectId.isValid(id))
      return res.status(401).json({ mensagem: "Id inválido" });

    if (!status)
      return res.status(400).json({ mensagem: "Status é obrigatório" });

    const ordem = await OrdemModel.findById(id);

    if (!ordem)
      return res.status(404).json({ mensagem: "Ordem não encontrada" });

    if (ordem.status === "Finalizado")
      return res.status(400).json({ mensagem: "Ordem já finalizada" });

    if (ordem.status === "Cancelado")
      return res.status(400).json({ mensagem: "Ordem já cancelada" });

    if (
      status !== "Finalizado" &&
      status !== "Cancelado" &&
      status !== "Aguardando" &&
      status !== "Em andamento"
    )
      return res.status(400).json({ mensagem: "Status inválido" });

    await OrdemModel.findByIdAndUpdate(id, { status });

    return res.status(200).json({ mensagem: "Status atualizado com sucesso" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ mensagem: "Erro interno" });
  }
});
ordem_router.put("/responsavel/", async (req, res) => {
  try {
    const { id } = req.query;
    const { id_responsavel } = req.body;

    if (!id || typeof id !== "string" || !Types.ObjectId.isValid(id))
      return res.status(401).json({ mensagem: "Id inválido" });

    if (
      !id_responsavel ||
      typeof id_responsavel !== "string" ||
      !Types.ObjectId.isValid(id_responsavel)
    )
      return res.status(401).json({ mensagem: "Id do responsável inválido" });

    const ordem = await OrdemModel.findById(id);

    if (!ordem)
      return res.status(404).json({ mensagem: "Ordem não encontrada" });

    if (ordem.status === "Finalizado")
      return res.status(400).json({ mensagem: "Ordem já finalizada" });

    if (ordem.status === "Cancelado")
      return res.status(400).json({ mensagem: "Ordem já cancelada" });

    const usuario = await UsuarioModel.findById(id_responsavel);

    if (!usuario)
      return res.status(404).json({ mensagem: "Usuário não encontrado" });

    if (usuario.role !== "mc")
      return res.status(400).json({ mensagem: "Usuário não é mecânico" });

    if (!usuario.status)
      return res.status(400).json({ mensagem: "Usuário inativo" });

    const pessoa = await PessoaModel.findById(usuario.id_pessoa);

    if (!pessoa)
      return res.status(404).json({ mensagem: "Pessoa não encontrada" });

    await ordem.updateOne({ id_responsavel: usuario._id });

    await ordem.save();

    return res
      .status(200)
      .json({ mensagem: "Responsável atualizado com sucesso" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ mensagem: "Erro interno" });
  }
});
ordem_router.put("/servicos/", async (req, res) => {
  try {
    const { id } = req.query;
    const { servicos_realizados } = req.body;

    if (!id || typeof id !== "string" || !Types.ObjectId.isValid(id))
      return res.status(401).json({ mensagem: "Id inválido" });

    if (!servicos_realizados)
      return res
        .status(400)
        .json({ mensagem: "Serviços realizados são obrigatórios" });

    const ordem = await OrdemModel.findById(id);

    if (!ordem)
      return res.status(404).json({ mensagem: "Ordem não encontrada" });

    if (ordem.status === "Finalizado")
      return res.status(400).json({ mensagem: "Ordem já finalizada" });

    if (ordem.status === "Cancelado")
      return res.status(400).json({ mensagem: "Ordem já cancelada" });

    if (!Array.isArray(servicos_realizados))
      return res
        .status(400)
        .json({ mensagem: "Serviços realizados devem ser um array" });

    for (let i = 0; i < servicos_realizados.length; i++) {
      const servico = servicos_realizados[i];
      if (!Types.ObjectId.isValid(servico))
        return res.status(400).json({ mensagem: "Id do serviço inválido" });
    }

    const servicos = await ServicoModel.find({
      _id: { $in: servicos_realizados },
    });

    if (servicos.length !== servicos_realizados.length)
      return res.status(400).json({ mensagem: "Serviços não encontrados" });

    for (let i = 0; i < servicos.length; i++) {
      if (!ordem.servicos_solicitados.includes(servicos[i]._id))
        return res.status(400).json({ mensagem: "Serviço não solicitado" });
    }

    await ordem.updateOne({ servicos_realizados });

    await ordem.save();

    return res
      .status(200)
      .json({ mensagem: "Serviços realizados atualizados com sucesso" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ mensagem: "Erro interno" });
  }
});

export default ordem_router;
