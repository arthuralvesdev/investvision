import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from 'react-native';
import { salvarInvestimento } from '../services/storageService';
import { Picker } from '@react-native-picker/picker';
import { router } from "expo-router";

export default function TelaAdicionar() {
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('');
  const [valorAtual, setValorAtual] = useState('');
  const [valorInicial, setValorInicial] = useState('');
  const [rentabilidade, setRentabilidade] = useState('');

  async function handleSalvar() {
    if (!nome || !tipo || !valorAtual || !valorInicial || !rentabilidade) {
      Alert.alert('Atenção', 'Preencha todos os campos!');
      return;
    }

    const novoInvestimento = {
      id: String(Date.now()),
      nome,
      tipo,
      valorAtual: parseFloat(valorAtual) || 0,
      valorInicial: parseFloat(valorInicial) || 0,
      rentabilidade: parseFloat(rentabilidade) || 0,
      data: new Date().toISOString(),
    };

    await salvarInvestimento(novoInvestimento);
    Alert.alert('Sucesso', 'Investimento salvo com sucesso!');
    router.push('/TelaListagem'); // redireciona para tela de listagem (se existir)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do investimento"
        value={nome}
        onChangeText={setNome}
      />


      <Text style={styles.label}>Tipo de Investimento</Text>
      <View>
        <Picker
          selectedValue={tipo}
          onValueChange={(itemValue) => setTipo(itemValue)}
        >
          <Picker.Item label="Selecione o tipo" value="" />
          <Picker.Item label="Ações" value="Ações" />
          <Picker.Item label="Fundos Imobiliários" value="Fundos Imobiliários" />
          <Picker.Item label="Tesouro Direto" value="Tesouro Direto" />
          <Picker.Item label="CDB" value="CDB" />
          <Picker.Item label="Outros" value="Outros" />
        </Picker>
      </View>

        <Text style={styles.label}>Valor Inicial</Text>
      <TextInput
        style={styles.input}
        placeholder="Valor Inicial"
        keyboardType="numeric"
        value={valorInicial}
        onChangeText={setValorInicial}
      />

      <Text style={styles.label}>Valor Atual</Text>
      <TextInput
        style={styles.input}
        placeholder="Valor atual"
        keyboardType="numeric"
        value={valorAtual}
        onChangeText={setValorAtual}
      />

       <Text style={styles.label}>Rentabilidade</Text>
      <TextInput
        style={styles.input}
        placeholder="rentabilidade"
        keyboardType="numeric"
        value={rentabilidade}
        onChangeText={setRentabilidade}
      />

      <TouchableOpacity style={styles.botao} onPress={handleSalvar}>
        <Text style={styles.textoBotao}>Salvar investimento</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontSize: 16, marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
  },
  botao: {
    backgroundColor: '#1E90FF',
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoBotao: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
