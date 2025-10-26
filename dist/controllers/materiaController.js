import { supabase } from "../supabaseClient.js";
class MateriaController {
    static async listarMaterias(req, res) {
        const { data, error } = await supabase
            .from("materias")
            .select("*");
        if (error)
            return res.status(500).json({ error: error.message });
        const materias = data;
        res.status(200).json(materias);
    }
    static async buscarPorId(req, res) {
        const id = Number(req.params.id);
        const { data, error } = await supabase
            .from("materias")
            .select("*")
            .eq("id", id)
            .single();
        if (error || !data)
            return res.status(404).json({ error: "Matéria não encontrada" });
        res.status(200).json(data);
    }
    static async criarMateria(req, res) {
        const { titulo, descricao, tipo } = req.body; // Ajuste de campos do modelo
        const { data, error } = await supabase
            .from("materias")
            .insert([{ titulo, descricao, tipo }])
            .select("*"); // Retorna o row criado
        if (error)
            return res.status(500).json({ error: error.message });
        res.status(201).json(data);
    }
    static async atualizarMateria(req, res) {
        const id = Number(req.params.id);
        const { titulo, descricao, tipo } = req.body;
        const { data, error } = await supabase
            .from("materias")
            .update({ titulo, descricao, tipo })
            .eq("id", id)
            .select("*"); // Retorna o row atualizado
        if (error)
            return res.status(500).json({ error: error.message });
        if (!data || data.length === 0)
            return res.status(404).json({ message: "Matéria não encontrada" });
        res.status(200).json(data);
    }
    static async deletarMateria(req, res) {
        const id = Number(req.params.id);
        const { data, error } = await supabase
            .from("materias")
            .delete()
            .eq("id", id)
            .select("*"); // Retorna o row deletado
        if (error)
            return res.status(500).json({ error: error.message });
        if (!data || data.length === 0)
            return res.status(404).json({ message: "Matéria não encontrada" });
        res.status(200).json({ message: "Matéria removida", materia: data[0] });
    }
}
export default MateriaController;
