import { Router } from 'express';
import { TaskController } from '../controllers/TaskController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const taskRoutes = Router();
const taskController = new TaskController();

taskRoutes.use(authMiddleware);
taskRoutes.get('/', taskController.list);
taskRoutes.post('/', taskController.create);
taskRoutes.put('/:id', taskController.update);
taskRoutes.delete('/:id', taskController.delete);

export default taskRoutes;