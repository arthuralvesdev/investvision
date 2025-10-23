import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function TelaDashboard() {
  const [dados, setDados] = useState<
    { tipo: String; valorAtual: number }[]
  >([]);

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

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>InvestVision</Text>

      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total investido</Text>
          <Text style={styles.cardValue}>R$ {total.toLocaleString("pt-BR")}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Rentabilidade Média</Text>
          <Text style={[styles.cardValue, { color: "#4CAF50" }]}>
            {rentabilidadeMedia}%
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Valorização</Text>
          <Text style={[styles.cardValue, { color: "#4CAF50" }]}>
            R$ {valorizacao}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    width: "48%",
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    color: "#555",
  },
  cardValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 4,
  },
});
