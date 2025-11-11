import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { listarInvestimentos, deletarInvestimento } from "../services/storageService";

export default function TelaListagem() {
  const [dados, setDados] = useState<
    { id: string; nome: string; valorAtual: number; tipo: string; data: string }[]
  >([]);

  // Carrega os investimentos do AsyncStorage ao iniciar a tela
  useEffect(() => {
    const carregarInvestimentos = async () => {
      const investimentos = await listarInvestimentos();
      setDados(investimentos);
    };

    carregarInvestimentos();
  }, []);

  const total = dados.reduce((acc, item) => acc + item.valorAtual, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>InvestVision</Text>

      <Text style={styles.total}>
        Total investido: R$ {total.toLocaleString("pt-BR")}
      </Text>

      <FlatList
        data={dados}
        keyExtractor={(item) => item.id || Math.random().toString()}
        renderItem={({ item }) => {
          const id = item.id || "ID não disponível";
          const valor = item.valorAtual ? Number(item.valorAtual) : 0;
          const nome = item.nome || "Sem nome";
          const tipo = item.tipo || "Tipo não especificado";
          const dataFormatada = item.data ? new Date(item.data).toLocaleDateString("pt-BR") : "Data não disponível";

          return (
            <View style={styles.card}>
              <Text>ID: {id}</Text>
              <Text style={styles.name}>Nome: {nome}</Text>
              <Text>Tipo: {tipo}</Text>
              <Text style={styles.value}>R$ {valor.toLocaleString("pt-BR")}</Text>
              <Text>Data: {dataFormatada}</Text>

              {/* Botão de deletar */}
              <TouchableOpacity
                style={{ marginTop: 10, backgroundColor: 'red', padding: 8, borderRadius: 5 }}
                onPress={async () => {
                  await deletarInvestimento(item.id);
                  setDados(prevDados => prevDados.filter(d => d.id !== item.id));
                }}
              >
                <Text style={{ color: '#fff', textAlign: 'center' }}>Deletar</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />

      <TouchableOpacity style={styles.botao} onPress={() => router.back()}>
        <Text style={styles.textoBotao}>Voltar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/telaAdicionar")}
      >
        <Text style={styles.addText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f4f4", padding: 16 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 20, marginTop: 35 },
  total: { fontSize: 18, marginBottom: 20, color: "#2e7d32" },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  name: { fontSize: 16, fontWeight: "bold" },
  value: { fontSize: 16, color: "#007AFF" },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#007AFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  addText: { fontSize: 30, color: "#fff" },
  botao: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  textoBotao: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
