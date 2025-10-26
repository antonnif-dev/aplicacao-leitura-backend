import { Router } from "express";
import UsuarioController from "../controllers/usuarioController.js";
const router = Router();
router.get("/", UsuarioController.listarUsuarios);
router.get("/:id", UsuarioController.buscarPorId);
router.post("/", UsuarioController.criarUsuario);
router.put("/:id", UsuarioController.atualizarUsuario);
router.delete("/:id", UsuarioController.deletarUsuario);
export default router;
