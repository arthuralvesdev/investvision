// services/storageService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE = '@investimentos';

export async function salvarInvestimento(investimento: any) {
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

export async function listarInvestimentos() {
  try {
    const dados = await AsyncStorage.getItem(CHAVE);
    return dados ? JSON.parse(dados) : [];
  } catch (erro) {
    console.log('Erro ao buscar investimentos:', erro);
    return [];
  }
}

// Função para deletar um investimento pelo id
export async function deletarInvestimento(id: string) {
  try {
    const dadosExistentes = await AsyncStorage.getItem(CHAVE);
    const lista = dadosExistentes ? JSON.parse(dadosExistentes) : [];

    // Filtra removendo o item com o id informado
    const novaLista = lista.filter((item: any) => item.id !== id);

    await AsyncStorage.setItem(CHAVE, JSON.stringify(novaLista));
    console.log('Investimento deletado com sucesso!');
  } catch (erro) {
    console.log('Erro ao deletar investimento:', erro);
  }
}
