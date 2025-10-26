import "dotenv/config";
import app from "./app.js";
const PORT = process.env.PORT || 3000;
try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
        throw new Error("Variáveis de ambiente do Supabase não foram definidas no arquivo .env");
    }
    app.listen(PORT, () => {
        console.log(`✅ Servidor rodando na porta ${PORT}`);
        console.log("   Sua mensagem: Até aqui o Senhor cuidou de nós!");
    });
}
catch (error) {
    console.error("❌ Erro fatal ao iniciar o servidor:");
    console.error(error);
    process.exit(1);
}
