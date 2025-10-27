import express from "express";
import cors from 'cors';
import dotenv from "dotenv";
import taskRoutes from './routes/task.routes.js';
import usuarioRoutes from "./routes/usuarioRoutes.js";
import materiaRoutes from "./routes/materiaRoutes.js";
import tarefaRoutes from "./routes/tarefaRoutes.js";
import progressoRoutes from "./routes/progressoRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";


dotenv.config();

const app = express();

const allowedOrigins = [
    'https://aplicacao-leitura.vercel.app',
    'http://localhost:5173'
];

app.use(cors({
    origin: function (origin, callback) {
        // Permite requisições sem 'origin' (como Postman ou apps mobile) OU se a origem está na lista
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'] // Cabeçalhos permitidos
}));

app.use(express.json());

app.use(cors());

app.use('/api', taskRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/materias", materiaRoutes);
app.use("/tarefas", tarefaRoutes);
app.use("/progresso", progressoRoutes);

app.use(errorHandler);

export default app;