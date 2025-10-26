import { Router } from "express";
import MateriaController from "../controllers/materiaController.js";
const router = Router();
router.get("/", MateriaController.listarMaterias);
router.get("/:id", MateriaController.buscarPorId);
router.post("/", MateriaController.criarMateria);
router.put("/:id", MateriaController.atualizarMateria);
router.delete("/:id", MateriaController.deletarMateria);
export default router;
