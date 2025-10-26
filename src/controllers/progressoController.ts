// Em src/controllers/progressoController.ts
import { Request, Response } from "express";
import { getSupabaseClient } from '../config/supabase.js';

export class ProgressoController {

  async listarProgressoGeral(req: Request, res: Response) {
    try {
      const supabase = getSupabaseClient();
      const userId = req.user.id;

      const { data, error } = await supabase
        .from("progresso")
        .select("*, tarefas ( titulo )") // Puxa o título da tarefa junto
        .eq("user_id", userId)
        .order('created_at', { ascending: false }); // Mais recentes primeiro

      if (error) throw error;
      return res.status(200).json(data);
    } catch (err: any) {
      console.error('Erro ao listar progresso geral:', err);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  async listarProgressoPorTarefa(req: Request, res: Response) {
    try {
      const supabase = getSupabaseClient();
      const userId = req.user.id;
      const tarefaId = Number(req.params.tarefaId);

       if (!tarefaId) {
        return res.status(400).json({ error: 'O ID da tarefa é obrigatório.' });
      }

      const { data, error } = await supabase
        .from("progresso")
        .select("*")
        .eq("user_id", userId)
        .eq("tarefa_id", tarefaId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json(data);
    } catch (err: any) {
      console.error(`Erro ao listar progresso da tarefa ${req.params.tarefaId}:`, err);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }
  
  async buscarProgressoPorId(req: Request, res: Response) {
    try {
      const supabase = getSupabaseClient();
      const userId = req.user.id;
      const progressoId = Number(req.params.id);

      const { data, error } = await supabase
        .from("progresso")
        .select("*")
        .eq("id", progressoId)
        .eq("user_id", userId)
        .single();

      if (error) throw error;
      if (!data) return res.status(404).json({ error: "Registro de progresso não encontrado." });
      
      return res.status(200).json(data);
    } catch (err: any) {
      console.error(`Erro ao buscar progresso ${req.params.id}:`, err);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  async criarRegistroProgresso(req: Request, res: Response) {
    try {
      const supabase = getSupabaseClient();
      const userId = req.user.id;
      const { tarefa_id, status_novo, status_anterior, duracao_minutos, notas } = req.body; 

      if (!tarefa_id || !status_novo) {
        return res.status(400).json({ error: 'ID da tarefa e novo status são obrigatórios.' });
      }

      const { data, error } = await supabase
        .from("progresso")
        .insert({ 
          tarefa_id, 
          status_novo, 
          status_anterior, 
          duracao_minutos, 
          notas, 
          user_id: userId 
        })
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(data);
    } catch (err: any) {
      console.error('Erro ao criar registro de progresso:', err);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  async deletarRegistroProgresso(req: Request, res: Response) {
    try {
      const supabase = getSupabaseClient();
      const userId = req.user.id;
      const progressoId = Number(req.params.id);

      const { error, count } = await supabase
        .from("progresso")
        .delete({ count: 'exact' })
        .eq("id", progressoId)
        .eq("user_id", userId);

      if (error) throw error;
      if (count === 0) return res.status(404).json({ message: "Registro de progresso não encontrado ou não pertence a você." });
      
      return res.status(204).send();
    } catch (err: any) {
      console.error(`Erro ao deletar registro de progresso ${req.params.id}:`, err);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }
}