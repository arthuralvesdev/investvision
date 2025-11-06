import { Ionicons } from "@expo/vector-icons";
import * as d3 from "d3-shape";
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
import { PieChart } from "react-native-chart-kit";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

export default function TelaDashboard() {
  const [dados, setDados] = useState<{ tipo: string; valorAtual: number }[]>([]);
  const { width } = useWindowDimensions();

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

  // 🔹 Dados do gráfico de pizza
  const chartData = dados.map((item, index) => ({
    name: item.tipo,
    population: item.valorAtual,
    color:
      index === 0
        ? "#007AFF"
        : index === 1
        ? "#4CAF50"
        : "#FFC107",
    legendFontColor: "#FFF",
    legendFontSize: 13,
  }));

  // 🔹 Dados do gráfico de ondas
  const data = [10, 40, 20, 60, 30, 70, 50, 80, 60, 100, 70];
  const height = 200;

  // 🔹 Ajuste para centralizar a linha
  const chartWidth = width - 60; // margem lateral corrigida
  const x = (i: number) => (i / (data.length - 1)) * chartWidth;
  const y = (value: number) => height - value * 1.5;

  const line = d3
    .line<number>()
    .x((d, i) => x(i))
    .y((d) => y(d))
    .curve(d3.curveNatural)(data);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Ionicons name="bar-chart-outline" size={28} color="#00BFFF" />
        <Text style={styles.headerTitle}>InvestVision</Text>
      </View>

      {/* Cards */}
      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <Ionicons name="wallet-outline" size={24} color="#00BFFF" />
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

      {/* Gráfico de ondas */}
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Evolução dos Investimentos</Text>
        <Svg width={chartWidth} height={height}>
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#00FF7F" stopOpacity="0.7" />
              <Stop offset="1" stopColor="#000" stopOpacity="0.2" />
            </LinearGradient>
          </Defs>
          {/* Linha verde */}
          <Path d={line || ""} fill="none" stroke="#00FF7F" strokeWidth={3} />
          {/* Área preenchida */}
          <Path
            d={`${line} L ${chartWidth} ${height} L 0 ${height} Z`}
            fill="url(#grad)"
            opacity={0.6}
          />
        </Svg>
      </View>

      {/* Gráfico de pizza */}
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Distribuição dos Investimentos</Text>
        <View style={{ alignItems: "center" }}>
          <PieChart
            data={chartData}
            width={width - 40}
            height={220}
            chartConfig={{
              backgroundGradientFrom: "#000",
              backgroundGradientTo: "#000",
              color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
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
              color="#00BFFF"
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
    backgroundColor: "#000", // 🔹 Fundo escuro
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
    color: "#fff",
    marginLeft: 8,
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#111",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    width: "48%",
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    color: "#aaa",
    marginTop: 8,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 4,
  },
  chartContainer: {
    backgroundColor: "#111",
    borderRadius: 14,
    padding: 16,
    marginTop: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  investimentosContainer: {
    backgroundColor: "#111",
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
    borderColor: "#222",
  },
  itemTipo: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#ccc",
  },
  itemValor: {
    fontWeight: "bold",
    color: "#fff",
  },
  botao: {
    backgroundColor: "#00BFFF",
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
