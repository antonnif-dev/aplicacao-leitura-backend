import { Router } from "express";
import ProgressoController from "../controllers/progressoController.js";
const router = Router();
router.get("/", ProgressoController.listarProgresso);
router.get("/:id", ProgressoController.buscarPorId);
router.post("/", ProgressoController.criarProgresso);
router.put("/:id", ProgressoController.atualizarProgresso);
router.delete("/:id", ProgressoController.deletarProgresso);
export default router;
