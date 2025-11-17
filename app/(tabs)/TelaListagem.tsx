import { router, useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { listarInvestimentos, deletarInvestimento, Investimento } from "../services/storageService";
import { formatarMoeda } from "../services/calculos";

export default function TelaListagem() {
  const [investimentos, setInvestimentos] = useState<Investimento[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Recarregar sempre que a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      carregarInvestimentos();
    }, [])
  );

  const carregarInvestimentos = async () => {
    setCarregando(true);
    try {
      const dados = await listarInvestimentos();
      setInvestimentos(dados);
      console.log(`📋 ${dados.length} investimentos carregados`);
    } catch (error) {
      console.error("Erro ao carregar:", error);
    } finally {
      setCarregando(false);
    }
  };

  const confirmarExclusao = (id: string, nome: string) => {
    Alert.alert(
      "Confirmar Exclusão",
      `Deseja realmente excluir "${nome}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => handleExcluir(id),
        },
      ]
    );
  };

  const handleExcluir = async (id: string) => {
    try {
      await deletarInvestimento(id); // Usar função existente
      await carregarInvestimentos(); // Recarregar lista
      Alert.alert("Sucesso", "Investimento excluído com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível excluir o investimento.");
      console.error("Erro ao excluir:", error);
    }
  };

  const total = investimentos.reduce((acc, item) => acc + item.valorAtual, 0);
  const totalInvestido = investimentos.reduce((acc, item) => acc + item.valorInicial, 0);
  const valorizacao = total - totalInvestido;

  const getIconByType = (tipo: string) => {
    switch (tipo) {
      case "Renda Fixa":
        return "lock-closed-outline";
      case "Ações":
        return "trending-up-outline";
      case "Criptos":
        return "logo-bitcoin";
      case "FIIs":
        return "business-outline";
      default:
        return "briefcase-outline";
    }
  };

  const renderItem = ({ item }: { item: Investimento }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name={getIconByType(item.tipo)} size={24} color="#00C853" />
        <View style={styles.cardContent}>
          <Text style={styles.cardNome}>{item.nome}</Text>
          <Text style={styles.cardTipo}>{item.tipo}</Text>
        </View>
        <TouchableOpacity onPress={() => confirmarExclusao(item.id, item.nome)}>
          <Ionicons name="trash-outline" size={20} color="#F44336" />
        </TouchableOpacity>
      </View>
      <View style={styles.cardFooter}>
        <View>
          <Text style={styles.cardLabel}>Investido</Text>
          <Text style={styles.cardValor}>{formatarMoeda(item.valorInicial)}</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.cardLabel}>Atual</Text>
          <Text style={styles.cardValor}>{formatarMoeda(item.valorAtual)}</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text
            style={[
              styles.cardRentabilidade,
              { color: item.rentabilidade >= 0 ? "#00C853" : "#F44336" },
            ]}
          >
            {item.rentabilidade >= 0 ? "▲" : "▼"} {Math.abs(item.rentabilidade).toFixed(2)}%
          </Text>
        </View>
      </View>
    </View>
  );

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Listagem de Investimentos</Text>
        <TouchableOpacity onPress={carregarInvestimentos}>
          <Ionicons name="refresh-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {investimentos.length > 0 ? (
        <>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Patrimônio Total</Text>
              <Text style={styles.summaryValue}>{formatarMoeda(total)}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={[styles.summarySubLabel, { color: valorizacao >= 0 ? "#00C853" : "#F44336" }]}>
                {valorizacao >= 0 ? "+" : ""}{formatarMoeda(valorizacao)}
              </Text>
              <Text style={[styles.summaryPercentage, { color: valorizacao >= 0 ? "#00C853" : "#F44336" }]}>
                ({valorizacao >= 0 ? "+" : ""}{((valorizacao / totalInvestido) * 100).toFixed(2)}%)
              </Text>
            </View>
          </View>

          <FlatList
            data={investimentos}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="folder-open-outline" size={80} color="#CCC" />
          <Text style={styles.emptyText}>Nenhum investimento cadastrado</Text>
          <Text style={styles.emptySubtext}>
            Comece adicionando seu primeiro investimento
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/TelaCadastroInvestimento")}
      >
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  summaryCard: {
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 12,
  },
  summarySubLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  summaryPercentage: {
    fontSize: 14,
    fontWeight: "600",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
  },
  cardNome: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
  },
  cardTipo: {
    fontSize: 13,
    color: "#666",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  cardLabel: {
    fontSize: 11,
    color: "#999",
    marginBottom: 2,
  },
  cardValor: {
    fontSize: 14,
    color: "#000",
    fontWeight: "600",
  },
  cardRentabilidade: {
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#999",
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#BBB",
    textAlign: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007AFF",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
});