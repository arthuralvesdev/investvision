/**
 * Módulo de Cálculos Financeiros - InvestVision
 * Funções para processar dados de investimentos
 */
import { Investimento } from './storageService';
/**
 * Calcula o valor total investido (soma dos valores iniciais)
 * @param investimentos - Array de investimentos
 * @returns Valor total investido
 */
export const calcularTotalInvestido = (investimentos: Investimento[]): number => {
  if (!investimentos || investimentos.length === 0) return 0;
  
  return investimentos.reduce((total, item) => {
    return total + (item.valorInicial || 0);
  }, 0);
};

/**
 * Calcula o valor atual total da carteira
 * @param investimentos - Array de investimentos
 * @returns Valor total atual
 */
export const calcularValorAtualTotal = (investimentos: Investimento[]): number => {
  if (!investimentos || investimentos.length === 0) return 0;
  
  return investimentos.reduce((total, item) => {
    return total + (item.valorAtual || 0);
  }, 0);
};

/**
 * Calcula a valorização total (diferença entre valor atual e inicial)
 * @param investimentos - Array de investimentos
 * @returns Valor da valorização total
 */
export const calcularValorizacaoTotal = (investimentos: Investimento[]): number => {
  if (!investimentos || investimentos.length === 0) return 0;
  
  const valorAtual = calcularValorAtualTotal(investimentos);
  const valorInicial = calcularTotalInvestido(investimentos);
  
  return valorAtual - valorInicial;
};

/**
 * Calcula a rentabilidade média ponderada dos investimentos
 * @param investimentos - Array de investimentos
 * @returns Rentabilidade média em percentual
 */
export const calcularRentabilidadeMedia = (investimentos: Investimento[]): number => {
  if (!investimentos || investimentos.length === 0) return 0;
  
  const totalInicial = calcularTotalInvestido(investimentos);
  const valorizacaoTotal = calcularValorizacaoTotal(investimentos);
  
  if (totalInicial === 0) return 0;
  
  const rentabilidadeMedia = (valorizacaoTotal / totalInicial) * 100;
  return parseFloat(rentabilidadeMedia.toFixed(2));
};

/**
 * Agrupa investimentos por tipo e calcula totais
 * @param investimentos - Array de investimentos
 * @returns Objeto com totais agrupados por tipo
 */
export const agruparPorTipo = (investimentos: Investimento[]): Record<string, number> => {
  if (!investimentos || investimentos.length === 0) return {};
  
  return investimentos.reduce((acc, item) => {
    const tipo = item.tipo || "Outros";
    acc[tipo] = (acc[tipo] || 0) + (item.valorAtual || 0);
    return acc;
  }, {} as Record<string, number>);
};

/**
 * Calcula a porcentagem de cada tipo em relação ao total
 * @param investimentos - Array de investimentos
 * @returns Objeto com porcentagens por tipo
 */
export const calcularPorcentagensPorTipo = (
  investimentos: Investimento[]
): Record<string, number> => {
  if (!investimentos || investimentos.length === 0) return {};
  
  const totalAtual = calcularValorAtualTotal(investimentos);
  const agrupado = agruparPorTipo(investimentos);
  
  const porcentagens: Record<string, number> = {};
  
  Object.entries(agrupado).forEach(([tipo, valor]) => {
    porcentagens[tipo] = totalAtual > 0 ? (valor / totalAtual) * 100 : 0;
  });
  
  return porcentagens;
};

/**
 * Retorna o investimento com maior rentabilidade
 * @param investimentos - Array de investimentos
 * @returns Investimento com maior rentabilidade ou null
 */
export const melhorInvestimento = (investimentos: Investimento[]): Investimento | null => {
  if (!investimentos || investimentos.length === 0) return null;
  
  return investimentos.reduce((melhor, atual) => {
    return atual.rentabilidade > melhor.rentabilidade ? atual : melhor;
  });
};

/**
 * Retorna o investimento com pior rentabilidade
 * @param investimentos - Array de investimentos
 * @returns Investimento com pior rentabilidade ou null
 */
export const piorInvestimento = (investimentos: Investimento[]): Investimento | null => {
  if (!investimentos || investimentos.length === 0) return null;
  
  return investimentos.reduce((pior, atual) => {
    return atual.rentabilidade < pior.rentabilidade ? atual : pior;
  });
};

/**
 * Formata valor para moeda brasileira
 * @param valor - Valor numérico
 * @returns String formatada em R$
 */
export const formatarMoeda = (valor: number): string => {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
};

/**
 * Formata percentual com 2 casas decimais
 * @param valor - Valor numérico
 * @returns String formatada com %
 */
export const formatarPercentual = (valor: number): string => {
  return `${valor.toFixed(2)}%`;
};

/**
 * Calcula quantos investimentos estão em lucro
 * @param investimentos - Array de investimentos
 * @returns Número de investimentos com rentabilidade positiva
 */
export const contarInvestimentosEmLucro = (investimentos: Investimento[]): number => {
  if (!investimentos || investimentos.length === 0) return 0;
  
  return investimentos.filter(inv => inv.rentabilidade > 0).length;
};

/**
 * Calcula quantos investimentos estão em prejuízo
 * @param investimentos - Array de investimentos
 * @returns Número de investimentos com rentabilidade negativa
 */
export const contarInvestimentosEmPrejuizo = (investimentos: Investimento[]): number => {
  if (!investimentos || investimentos.length === 0) return 0;
  
  return investimentos.filter(inv => inv.rentabilidade < 0).length;
};