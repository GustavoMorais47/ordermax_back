import { Router } from "express";
import concessionaria_router from "./concessionaria.routes";
import cliente_router from "./cliente.routes";
import servico_router from "./servico.routes";
import modelo_router from "./modelo.routes";
import ordem_router from "./ordem.routes";

const router = Router();

router.get("/", (req, res) => res.sendStatus(200));

router.use("/concessionaria", concessionaria_router);
router.use("/cliente", cliente_router);
router.use("/servico", servico_router);
router.use("/modelo", modelo_router);
router.use("/ordem", ordem_router);

export default router;
