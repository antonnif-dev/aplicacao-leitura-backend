import { Request, Response } from 'express';
import { getSupabaseClient } from '../config/supabase.js'; 

export class TaskController {
    async list(req: Request, res: Response) {
    try {
      const supabase = getSupabaseClient();
      const userId = req.user.id;
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId);
      if (error) throw error;
      return res.status(200).json(data);
    } catch (err: any) {
      console.error('Erro ao listar tasks:', err);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const supabase = getSupabaseClient(); // Adicionado
      const userId = req.user.id;
      const { title, description, due_date } = req.body;
      if (!title) {
        return res.status(400).json({ error: 'Title is required.' });
      }
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title,
          description,
          due_date,
          user_id: userId,
        })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    } catch (err: any) {
      console.error('Erro ao criar task:', err);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const supabase = getSupabaseClient();
      const userId = req.user.id;
      const { id } = req.params;
      const { title, description, due_date, completed } = req.body;
      const { data, error } = await supabase
        .from('tasks')
        .update({
          title,
          description,
          due_date,
          completed
        })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      if (!data) {
        return res.status(404).json({ error: 'Task not found or you do not have permission to edit it.' });
      }
      return res.status(200).json(data);
    } catch (err: any) {
      console.error(`Erro ao atualizar task ${req.params.id}:`, err);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const supabase = getSupabaseClient();
      const userId = req.user.id;
      const { id } = req.params;
      const { error, count } = await supabase
        .from('tasks')
        .delete({ count: 'exact' })
        .eq('id', id)
        .eq('user_id', userId);
      if (error) throw error;
      if (count === 0) {
        return res.status(404).json({ error: 'Task not found or you do not have permission to delete it.' });
      }
      return res.status(204).send();
    } catch (err: any) {
      console.error(`Erro ao deletar task ${req.params.id}:`, err);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }
}