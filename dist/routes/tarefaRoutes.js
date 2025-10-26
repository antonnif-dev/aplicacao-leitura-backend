import { Router } from 'express';
import { TarefaController } from '../controllers/tarefaController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
const tarefaRoutes = Router();
const tarefaController = new TarefaController();
tarefaRoutes.use(authMiddleware);
tarefaRoutes.get('/', tarefaController.listarTarefas);
tarefaRoutes.get('/materia/:materiaId', tarefaController.listarPorMateria);
tarefaRoutes.get('/:id', tarefaController.buscarPorId);
tarefaRoutes.post('/', tarefaController.criarTarefa);
tarefaRoutes.put('/:id', tarefaController.atualizarTarefa);
tarefaRoutes.patch('/:id/status', tarefaController.atualizarStatusTarefa); // Usando PATCH
tarefaRoutes.delete('/:id', tarefaController.deletarTarefa);
export default tarefaRoutes;
