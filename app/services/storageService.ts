// services/storageService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE = '@investimentos';

// Adicionar esta interface (compatível com o que você já tem)
export interface Investimento {
  id: string;
  nome: string;
  tipo: string;
  valorInicial: number;
  valorAtual: number;
  rentabilidade: number;
  dataAplicacao: string; // ou 'data' se preferir manter o nome antigo
}

export async function salvarInvestimento(investimento: Investimento) {
  try {
    const dadosExistentes = await AsyncStorage.getItem(CHAVE);
    const lista = dadosExistentes ? JSON.parse(dadosExistentes) : [];
    lista.push(investimento);
    await AsyncStorage.setItem(CHAVE, JSON.stringify(lista));
    console.log('Investimento salvo com sucesso!');
  } catch (erro) {
    console.log('Erro ao salvar investimento:', erro);
  }
}

export async function listarInvestimentos(): Promise<Investimento[]> {
  try {
    const dados = await AsyncStorage.getItem(CHAVE);
    return dados ? JSON.parse(dados) : [];
  } catch (erro) {
    console.log('Erro ao buscar investimentos:', erro);
    return [];
  }
}

export async function deletarInvestimento(id: string) {
  try {
    const dadosExistentes = await AsyncStorage.getItem(CHAVE);
    const lista = dadosExistentes ? JSON.parse(dadosExistentes) : [];
    const novaLista = lista.filter((item: any) => item.id !== id);
    await AsyncStorage.setItem(CHAVE, JSON.stringify(novaLista));
    console.log('Investimento deletado com sucesso!');
  } catch (erro) {
    console.log('Erro ao deletar investimento:', erro);
  }
}