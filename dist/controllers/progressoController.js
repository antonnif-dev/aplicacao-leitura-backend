import { supabase } from "../supabaseClient.js";
class ProgressoController {
    static async listarProgresso(req, res) {
        const { data, error } = await supabase
            .from("progresso")
            .select("*");
        if (error)
            return res.status(500).json({ error: error.message });
        const progresso = data;
        res.status(200).json(progresso);
    }
    static async buscarPorId(req, res) {
        const id = Number(req.params.id);
        const { data, error } = await supabase
            .from("progresso")
            .select("*")
            .eq("id", id)
            .single();
        if (error || !data)
            return res.status(404).json({ error: "Progresso não encontrado" });
        res.status(200).json(data);
    }
    static async criarProgresso(req, res) {
        const { usuarioId, tarefaId, status } = req.body; // Campos do modelo
        const { data, error } = await supabase
            .from("progresso")
            .insert([{ usuarioId, tarefaId, status }])
            .select("*"); // Retorna o row criado
        if (error)
            return res.status(500).json({ error: error.message });
        res.status(201).json(data);
    }
    static async atualizarProgresso(req, res) {
        const id = Number(req.params.id);
        const { usuarioId, tarefaId, status } = req.body;
        const { data, error } = await supabase
            .from("progresso")
            .update({ usuarioId, tarefaId, status })
            .eq("id", id)
            .select("*"); // Retorna o row atualizado
        if (error)
            return res.status(500).json({ error: error.message });
        if (!data || data.length === 0)
            return res.status(404).json({ message: "Progresso não encontrado" });
        res.status(200).json(data);
    }
    static async deletarProgresso(req, res) {
        const id = Number(req.params.id);
        const { data, error } = await supabase
            .from("progresso")
            .delete()
            .eq("id", id)
            .select("*"); // Retorna o row deletado
        if (error)
            return res.status(500).json({ error: error.message });
        if (!data || data.length === 0)
            return res.status(404).json({ message: "Progresso não encontrado" });
        res.status(200).json({ message: "Progresso removido", progresso: data[0] });
    }
}
export default ProgressoController;
