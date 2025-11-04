import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PieChart } from "react-native-chart-kit";

export default function TelaDashboard() {
  const [dados, setDados] = useState<{ tipo: string; valorAtual: number }[]>([]);
  const { width } = useWindowDimensions(); // 🔹 largura da tela em tempo real

  useEffect(() => {
    const investimentos = [
      { tipo: "Renda Fixa", valorAtual: 6000 },
      { tipo: "Ações", valorAtual: 4000 },
      { tipo: "Criptos", valorAtual: 2000 },
    ];
    setDados(investimentos);
  }, []);

  const total = dados.reduce((acc, item) => acc + item.valorAtual, 0);
  const rentabilidadeMedia = 1.25;
  const valorizacao = 150;

  // 🔹 Dados do gráfico
  const chartData = dados.map((item, index) => ({
    name: item.tipo,
    population: item.valorAtual,
    color:
      index === 0
        ? "#007AFF"
        : index === 1
        ? "#4CAF50"
        : "#FFC107",
    legendFontColor: "#333",
    legendFontSize: 13,
  }));

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Ionicons name="bar-chart-outline" size={28} color="#007AFF" />
        <Text style={styles.headerTitle}>InvestVision</Text>
      </View>

      {/* Cards */}
      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <Ionicons name="wallet-outline" size={24} color="#007AFF" />
          <Text style={styles.cardTitle}>Total Investido</Text>
          <Text style={styles.cardValue}>R$ {total.toLocaleString("pt-BR")}</Text>
        </View>

        <View style={styles.card}>
          <Ionicons name="trending-up-outline" size={24} color="#4CAF50" />
          <Text style={styles.cardTitle}>Rentabilidade Média</Text>
          <Text style={[styles.cardValue, { color: "#4CAF50" }]}>
            {rentabilidadeMedia}%
          </Text>
        </View>

        <View style={styles.card}>
          <Ionicons name="cash-outline" size={24} color="#FFC107" />
          <Text style={styles.cardTitle}>Valorização</Text>
          <Text style={[styles.cardValue, { color: "#FFC107" }]}>
            R$ {valorizacao}
          </Text>
        </View>
      </View>

      {/* Gráfico de distribuição */}
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Distribuição dos Investimentos</Text>
        <View style={{ alignItems: "center" }}>
          <PieChart
            data={chartData}
            width={width - 40} // 🔹 largura dinâmica
            height={220}
            chartConfig={{
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              strokeWidth: 2,
            }}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"10"}
            absolute
          />
        </View>
      </View>

      {/* Lista de investimentos */}
      <View style={styles.investimentosContainer}>
        <Text style={styles.sectionTitle}>Meus Investimentos</Text>
        {dados.map((item, index) => (
          <View key={index} style={styles.itemInvestimento}>
            <Ionicons
              name={
                item.tipo === "Renda Fixa"
                  ? "lock-closed-outline"
                  : item.tipo === "Ações"
                  ? "trending-up-outline"
                  : "logo-bitcoin"
              }
              size={22}
              color="#007AFF"
            />
            <Text style={styles.itemTipo}>{item.tipo}</Text>
            <Text style={styles.itemValor}>
              R$ {item.valorAtual.toLocaleString("pt-BR")}
            </Text>
          </View>
        ))}
      </View>

      {/* Botão */}
      <TouchableOpacity
        style={styles.botao}
        onPress={() => router.push("/TelaListagem")}
      >
        <Text style={styles.textoBotao}>Ver detalhes completos</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFF",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 8,
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    width: "48%",
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 4,
  },
  chartContainer: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginTop: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  investimentosContainer: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginTop: 20,
    elevation: 2,
  },
  itemInvestimento: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#EEE",
  },
  itemTipo: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#555",
  },
  itemValor: {
    fontWeight: "bold",
    color: "#333",
  },
  botao: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 30,
  },
  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
