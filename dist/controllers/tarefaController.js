import { supabase } from "../supabaseClient.js";
class TarefaController {
    static async listarTarefas(req, res) {
        const { data, error } = await supabase
            .from("tarefas")
            .select("*");
        if (error)
            return res.status(500).json({ error: error.message });
        const tarefas = data;
        res.status(200).json(tarefas);
    }
    static async buscarPorId(req, res) {
        const id = Number(req.params.id);
        const { data, error } = await supabase
            .from("tarefas")
            .select("*")
            .eq("id", id)
            .single();
        if (error || !data)
            return res.status(404).json({ error: "Tarefa não encontrada" });
        res.status(200).json(data);
    }
    static async listarPorMateria(req, res) {
        const materiaId = Number(req.params.materiaId);
        const { data, error } = await supabase
            .from("tarefas")
            .select("*")
            .eq("materiaId", materiaId);
        if (error)
            return res.status(500).json({ error: error.message });
        const tarefas = data;
        res.status(200).json(tarefas);
    }
    static async criarTarefa(req, res) {
        const { titulo, descricao, materiaId } = req.body; // Campos do modelo
        const { data, error } = await supabase
            .from("tarefas")
            .insert([{ titulo, descricao, materiaId }])
            .select("*");
        if (error)
            return res.status(500).json({ error: error.message });
        res.status(201).json(data);
    }
    static async atualizarTarefa(req, res) {
        const id = Number(req.params.id);
        const { titulo, descricao, materiaId } = req.body;
        const { data, error } = await supabase
            .from("tarefas")
            .update({ titulo, descricao, materiaId })
            .eq("id", id)
            .select("*");
        if (error)
            return res.status(500).json({ error: error.message });
        if (!data || data.length === 0)
            return res.status(404).json({ message: "Tarefa não encontrada" });
        res.status(200).json(data);
    }
    static async deletarTarefa(req, res) {
        const id = Number(req.params.id);
        const { data, error } = await supabase
            .from("tarefas")
            .delete()
            .eq("id", id)
            .select("*");
        if (error)
            return res.status(500).json({ error: error.message });
        if (!data || data.length === 0)
            return res.status(404).json({ message: "Tarefa não encontrada" });
        res.status(200).json({ message: "Tarefa removida", tarefa: data[0] });
    }
}
export default TarefaController;
