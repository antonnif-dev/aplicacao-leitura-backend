import { supabase } from "../supabaseClient.js";
class UsuarioController {
    static async listarUsuarios(req, res) {
        const { data, error } = await supabase
            .from("usuarios")
            .select("*");
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        const usuarios = data;
        res.status(200).json(data);
    }
    static async buscarPorId(req, res) {
        const id = Number(req.params.id);
        const { data, error } = await supabase
            .from("usuarios")
            .select("*")
            .eq("id", id)
            .single(); // retorna apenas um item
        if (error) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
        res.status(200).json(data);
    }
    static async criarUsuario(req, res) {
        const { nome, email } = req.body;
        const { data, error } = await supabase
            .from("usuarios")
            .insert([{ nome, email }]) //Rows do banco
            .select("*");
        if (error)
            return res.status(500).json({ error: error.message });
        res.status(201).json(data);
    }
    static async atualizarUsuario(req, res) {
        const id = Number(req.params.id);
        const { nome, email } = req.body;
        const { data, error } = await supabase
            .from("usuarios")
            .update({ nome, email })
            .eq("id", id)
            .select("*");
        if (error)
            return res.status(500).json({ error: error.message });
        res.status(200).json(data);
    }
    static async deletarUsuario(req, res) {
        const id = Number(req.params.id);
        const { data, error } = await supabase
            .from("usuarios")
            .delete()
            .eq("id", id)
            .select("*");
        if (error)
            return res.status(500).json({ error: error.message });
        if (!data || data.length === 0) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }
        res.status(200).json({ message: "Usuário removido", usuario: data[0] });
    }
}
export default UsuarioController;
