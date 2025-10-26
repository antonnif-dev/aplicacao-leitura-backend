import { Request, Response } from 'express';
import { getSupabaseClient } from '../config/supabase.js';

export class TarefaController {

  async listarTarefas(req: Request, res: Response) {
    try {
      const supabase = getSupabaseClient();
      const userId = req.user.id;
      const { data, error } = await supabase
        .from('tarefas')
        .select('*')
        .eq('user_id', userId);
      if (error) throw error;
      return res.status(200).json(data);
    } catch (err: any) {
      console.error('Erro ao listar todas as tarefas:', err);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  async listarPorMateria(req: Request, res: Response) {
    try {
      const supabase = getSupabaseClient();
      const userId = req.user.id;
      const materiaId = Number(req.params.materiaId);
      if (!materiaId) {
        return res.status(400).json({ error: 'O ID da matéria é obrigatório.' });
      }
      const { data, error } = await supabase
        .from('tarefas')
        .select('*')
        .eq('user_id', userId)
        .eq('materiaId', materiaId);
      if (error) throw error;
      return res.status(200).json(data);
    } catch (err: any) {
      console.error('Erro ao listar tarefas por matéria:', err);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  async buscarPorId(req: Request, res: Response) {
    try {
      const supabase = getSupabaseClient();
      const userId = req.user.id;
      const taskId = Number(req.params.id);
      const { data, error } = await supabase
        .from("tarefas")
        .select("*")
        .eq("id", taskId)
        .eq("user_id", userId)
        .single();
      if (error) throw error;
      if (!data) return res.status(404).json({ error: "Tarefa não encontrada." });
      return res.status(200).json(data);
    } catch (err: any) {
      console.error(`Erro ao buscar tarefa ${req.params.id}:`, err);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  async criarTarefa(req: Request, res: Response) {
    try {
      const supabase = getSupabaseClient();
      const userId = req.user.id;
      // Adiciona 'prazo' (opcional) e 'status' (opcional, default é 'pendente')
      const { titulo, descricao, materiaId, prazo, status } = req.body;

      if (!titulo) {
        return res.status(400).json({ error: 'O título é obrigatório.' });
      }
      if (!materiaId) {
        return res.status(400).json({ error: 'O ID da matéria é obrigatório.' });
      }

      const dadosInsert = {
        titulo,
        descricao,
        materiaId, // Certifique-se que o nome da coluna no DB é materiaId ou materia_id
        prazo,
        status: status || 'pendente', // Usa o status enviado ou o default
        user_id: userId
      };

      const { data, error } = await supabase
        .from('tarefas')
        .insert(dadosInsert)
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(data);
    } catch (err: any) {
      console.error('Erro ao criar tarefa:', err);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  async atualizarTarefa(req: Request, res: Response) {
    try {
      const supabase = getSupabaseClient();
      const userId = req.user.id;
      const taskId = Number(req.params.id);
      const { titulo, descricao, materiaId, prazo, status } = req.body;

      // Define o tipo explicitamente para ajudar o TypeScript
      const dadosUpdate: {
        titulo?: string;
        descricao?: string | null;
        materiaId?: number;
        prazo?: string | null;
        status?: 'pendente' | 'em andamento' | 'concluida';
      } = { titulo, descricao, materiaId, prazo, status };

      // Remove campos undefined para não sobrescrever com null no banco
      (Object.keys(dadosUpdate) as Array<keyof typeof dadosUpdate>).forEach((key) => {
        if (dadosUpdate[key] === undefined) {
          delete dadosUpdate[key];
        }
      });

      // Verifica se sobrou alguma chave para atualizar
      if (Object.keys(dadosUpdate).length === 0) {
        return res.status(400).json({ error: 'Nenhum dado válido para atualizar foi fornecido.' });
      }

      const { data, error } = await supabase
        .from("tarefas")
        .update(dadosUpdate) // Agora passa o objeto limpo
        .eq("id", taskId)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw error;
      if (!data) return res.status(404).json({ message: "Tarefa não encontrada ou não pertence a você." });

      return res.status(200).json(data);
    } catch (err: any) {
      console.error(`Erro ao atualizar tarefa ${req.params.id}:`, err);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  async atualizarStatusTarefa(req: Request, res: Response) {
    try {
      const supabase = getSupabaseClient();
      const userId = req.user.id;
      const taskId = Number(req.params.id);
      const { status } = req.body; // Espera apenas o status no body

      if (!status) {
        return res.status(400).json({ error: 'O novo status é obrigatório.' });
      }
      // Aqui você pode adicionar validação para garantir que 'status' é um valor válido

      const { data, error } = await supabase
        .from("tarefas")
        .update({ status }) // Atualiza SÓ o status
        .eq("id", taskId)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw error;
      if (!data) return res.status(404).json({ message: "Tarefa não encontrada ou não pertence a você." });

      return res.status(200).json(data);

    } catch (err: any) {
      console.error(`Erro ao atualizar status da tarefa ${req.params.id}:`, err);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  async deletarTarefa(req: Request, res: Response) {
    try {
      const supabase = getSupabaseClient();
      const userId = req.user.id;
      const taskId = Number(req.params.id);
      const { error, count } = await supabase
        .from("tarefas")
        .delete({ count: 'exact' })
        .eq("id", taskId)
        .eq("user_id", userId);
      if (error) throw error;
      if (count === 0) return res.status(404).json({ message: "Tarefa não encontrada ou não pertence a você." });
      return res.status(204).send();
    } catch (err: any) {
      console.error(`Erro ao deletar tarefa ${req.params.id}:`, err);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }
}