import { Request, Response } from 'express';
import { getSupabaseClient } from '../config/supabase.js';
import { Usuario } from "../models/usuario.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = "seuSegredoAqui";

export class UsuarioController {
  async criarUsuario(req: Request, res: Response) {
    try {
      const supabase = getSupabaseClient();
      const { nome, email, senha } = req.body;
      if (!nome || !email || !senha) {
        return res.status(400).json({ error: "Preencha todos os campos." });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "E-mail inválido." });
      }
      const senhaRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{7,}$/;
      if (!senhaRegex.test(senha)) {
        return res.status(400).json({
          error: "A senha deve ter no mínimo 7 caracteres, uma letra maiúscula, um número e um símbolo.",
        });
      }
      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          data: {
            nome_completo: nome
          }
        }
      });
      if (error) throw error;
      return res.status(201).json({ message: "Usuário registrado com sucesso", data });
    } catch (err: any) {
      console.error('Erro ao criar usuário:', err);
      return res.status(400).json({ error: err.message });
    }
  }

  async loginUsuario(req: Request, res: Response) {
    try {
      const supabase = getSupabaseClient();
      const { email, senha } = req.body;
      if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
      }
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });
      if (error) throw error;
      return res.status(200).json({ message: "Login bem-sucedido", ...data });
    } catch (err: any) {
      console.error('Erro ao fazer login:', err);
      return res.status(401).json({ error: err.message });
    }
  }

  async listarUsuarios(req: Request, res: Response) {
    try {
      const supabase = getSupabaseClient();      
      const { data: { users }, error } = await supabase.auth.admin.listUsers();
      if (error) throw error;
      return res.status(200).json(users);
    } catch (err: any) {
      console.error('Erro ao listar usuários:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  async buscarPorId(req: Request, res: Response) {
    try {
      const supabase = getSupabaseClient();
      const userIdToFind = req.params.id;
      const { data: { user }, error } = await supabase.auth.admin.getUserById(userIdToFind);
      if (error) throw error;
      if (!user) return res.status(404).json({ error: "Usuário não encontrado." });
      
      return res.status(200).json(user);
    } catch (err: any) {
      console.error(`Erro ao buscar usuário ${req.params.id}:`, err);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  async atualizarUsuario(req: Request, res: Response) {
    try {
      const supabase = getSupabaseClient();
      const { nome, email } = req.body;
      const { data, error } = await supabase.auth.updateUser({
        email: email,
        data: { nome_completo: nome }
      });

      if (error) throw error;
      return res.status(200).json(data);
    } catch (err: any) {
      console.error('Erro ao atualizar usuário:', err);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }

  async deletarUsuario(req: Request, res: Response) {
    try {
      const supabase = getSupabaseClient();
      const { id } = req.params;
      const { error } = await supabase.auth.admin.deleteUser(id);
      if (error) throw error;
      return res.status(204).send();
    } catch (err: any) {
      console.error('Erro ao deletar usuário:', err);
      return res.status(500).json({ error: err.message });
    }
  }
}