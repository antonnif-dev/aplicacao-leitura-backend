import { getSupabaseClient } from '../config/supabase.js';
export class MateriaController {
    async listarMaterias(req, res) {
        try {
            const supabase = getSupabaseClient();
            const userId = req.user.id;
            const { data, error } = await supabase
                .from("materias")
                .select("*")
                .eq("user_id", userId);
            if (error)
                throw error;
            return res.status(200).json(data);
        }
        catch (err) {
            console.error('Erro ao listar matérias:', err);
            return res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    }
    async buscarPorId(req, res) {
        try {
            const supabase = getSupabaseClient();
            const userId = req.user.id;
            const materiaId = Number(req.params.id);
            const { data, error } = await supabase
                .from("materias")
                .select("*")
                .eq("id", materiaId)
                .eq("user_id", userId)
                .single();
            if (error)
                throw error;
            if (!data)
                return res.status(404).json({ error: "Matéria não encontrada." });
            return res.status(200).json(data);
        }
        catch (err) {
            console.error(`Erro ao buscar matéria ${req.params.id}:`, err);
            return res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    }
    async criarMateria(req, res) {
        try {
            const supabase = getSupabaseClient();
            const userId = req.user.id;
            const { titulo, descricao, tipo, prazo } = req.body;
            const { data, error } = await supabase
                .from("materias")
                .insert({ titulo, descricao, tipo, prazo, user_id: userId })
                .select()
                .single();
            if (error)
                throw error;
            return res.status(201).json(data);
        }
        catch (err) {
            console.error('Erro ao criar matéria:', err);
            return res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    }
    async atualizarMateria(req, res) {
        try {
            const supabase = getSupabaseClient();
            const userId = req.user.id;
            const materiaId = Number(req.params.id);
            const { titulo, descricao, tipo, prazo, status } = req.body;
            const { data, error } = await supabase
                .from("materias")
                .update({ titulo, descricao, tipo, prazo, status })
                .eq("id", materiaId)
                .eq("user_id", userId)
                .select()
                .single();
            if (error)
                throw error;
            if (!data)
                return res.status(404).json({ message: "Matéria não encontrada ou não pertence a você." });
            return res.status(200).json(data);
        }
        catch (err) {
            console.error(`Erro ao atualizar matéria ${req.params.id}:`, err);
            return res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    }
    async deletarMateria(req, res) {
        try {
            const supabase = getSupabaseClient();
            const userId = req.user.id;
            const materiaId = Number(req.params.id);
            const { error, count } = await supabase
                .from("materias")
                .delete({ count: 'exact' })
                .eq("id", materiaId)
                .eq("user_id", userId);
            if (error)
                throw error;
            if (count === 0)
                return res.status(404).json({ message: "Matéria não encontrada ou não pertence a você." });
            return res.status(204).send();
        }
        catch (err) {
            console.error(`Erro ao deletar matéria ${req.params.id}:`, err);
            return res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    }
}
