import "dotenv/config";
import app from "./app.js";
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Até aqui o Senhor cuidou de nós! Servidor rodando na porta ${PORT}`);
});
