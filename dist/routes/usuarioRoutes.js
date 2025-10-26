import { Router } from 'express';
import { UsuarioController } from '../controllers/usuarioController.js'; // Verifique a extensão .js
import { authMiddleware } from '../middlewares/authMiddleware.js';
const usuarioRoutes = Router();
const usuarioController = new UsuarioController();
usuarioRoutes.post('/', usuarioController.criarUsuario);
usuarioRoutes.post('/login', usuarioController.loginUsuario);
usuarioRoutes.get("/", usuarioController.listarUsuarios);
usuarioRoutes.get("/:id", usuarioController.buscarPorId);
usuarioRoutes.put("/:id", usuarioController.atualizarUsuario);
usuarioRoutes.delete("/:id", usuarioController.deletarUsuario);
usuarioRoutes.put('/', authMiddleware, usuarioController.atualizarUsuario);
export default usuarioRoutes;
