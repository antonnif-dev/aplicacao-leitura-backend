export interface Materia {
  id: number;
  usuario_id: number;
  titulo: string;
  tipo: "curso" | "livro" | "filme"; //adcionar tipos
  descricao: string;
  criado_em?: string;
}