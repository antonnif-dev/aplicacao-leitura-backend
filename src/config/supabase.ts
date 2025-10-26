/*
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Variável para armazenar a instância do cliente (padrão Singleton)
let supabaseInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
  // Se a instância já foi criada, apenas a retorne
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  // Verificação rigorosa para garantir que as variáveis existem
  if (!supabaseUrl || !supabaseKey) {
    console.error("ERRO CRÍTICO: Variáveis de ambiente SUPABASE_URL ou SUPABASE_SERVICE_KEY não definidas.");
    process.exit(1); // Encerra a aplicação se a configuração estiver faltando
  }

  // Cria a instância pela primeira vez
  supabaseInstance = createClient(supabaseUrl, supabaseKey);
  
  return supabaseInstance;
};*/

// Em src/config/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Esta é a única variável que precisamos para garantir que o cliente seja criado apenas uma vez.
let supabaseInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
  // Se o cliente já existe, retorne-o imediatamente.
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // A flag --env-file=.env no seu package.json garante que estas variáveis já existem.
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;

  // Cria a instância e a armazena na variável.
  supabaseInstance = createClient(supabaseUrl, supabaseKey);
  
  return supabaseInstance;
};