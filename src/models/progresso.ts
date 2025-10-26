export interface Progresso {
  id: number;
  usuario_id: number;
  tarefa_id: number;
  status: "em andamento" | "concluido";
  criado_em?: string;
}