import { Router } from "express";
import { MateriaController } from "../controllers/materiaController.js";
import { authMiddleware } from '../middlewares/authMiddleware.js';

const materiaRoutes = Router();
const materiaController = new MateriaController();

materiaRoutes.use(authMiddleware);

materiaRoutes.get("/", materiaController.listarMaterias);
materiaRoutes.get("/:id", materiaController.buscarPorId);
materiaRoutes.post("/", materiaController.criarMateria);
materiaRoutes.put("/:id", materiaController.atualizarMateria);
materiaRoutes.delete("/:id", materiaController.deletarMateria);

export default materiaRoutes;