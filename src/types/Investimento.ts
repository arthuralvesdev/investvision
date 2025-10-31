export interface Investimento {
  id?: string;
  nome: string;
  tipo: "Renda Fixa" | "Ações" | "Criptos" | "Outros";
  valorInicial: number;
  valorAtual: number;
  rentabilidade: number; // em %
  dataAplicacao: string; // ISO yyyy-mm-dd
}
