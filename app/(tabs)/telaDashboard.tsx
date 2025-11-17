import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
// IMPORTAR FUNÇÕES DE CÁLCULO E STORAGE
import { listarInvestimentos, Investimento } from "../services/storageService";
import {
  calcularTotalInvestido,
  calcularValorAtualTotal,
  calcularValorizacaoTotal,
  calcularRentabilidadeMedia,
  agruparPorTipo,
  formatarMoeda,
} from "../services/calculos";

export default function TelaDashboard() {
  const [investimentos, setInvestimentos] = useState<Investimento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const { width } = useWindowDimensions();

  // CARREGAR DADOS REAIS DO ASYNCSTORAGE
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
      console.log(`📊 Dashboard: ${dados.length} investimentos carregados`);
    } catch (error) {
      console.error("Erro ao carregar investimentos:", error);
    } finally {
      setCarregando(false);
    }
  };

  // CÁLCULOS REAIS
  const totalInvestido = calcularTotalInvestido(investimentos);
  const valorAtualTotal = calcularValorAtualTotal(investimentos);
  const valorizacao = calcularValorizacaoTotal(investimentos);
  const rentabilidadeMedia = calcularRentabilidadeMedia(investimentos);
  const dadosPorTipo = agruparPorTipo(investimentos);

  // DADOS DO GRÁFICO BASEADOS NOS INVESTIMENTOS REAIS
  const coresGrafico = ["#007AFF", "#4CAF50", "#FFC107", "#FF5722", "#9C27B0"];
  
  const chartData = Object.entries(dadosPorTipo).map(([tipo, valor], index) => ({
    name: tipo,
    population: valor,
    color: coresGrafico[index % coresGrafico.length],
    legendFontColor: "#6E6E73",
    legendFontSize: 13,
  }));

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

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando investimentos...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>InvestVision</Text>
        <TouchableOpacity onPress={carregarInvestimentos}>
          <Ionicons name="refresh-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Cards com CÁLCULOS REAIS */}
      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Investido</Text>
          <Text style={styles.cardValue}>{formatarMoeda(totalInvestido)}</Text>
          <Text style={{ color: rentabilidadeMedia >= 0 ? 'green' : 'red', fontWeight: 'bold' }}>
            {rentabilidadeMedia >= 0 ? '+' : ''}{rentabilidadeMedia.toFixed(2)}%
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Valorização</Text>
          <Text style={[styles.cardValue, { color: valorizacao >= 0 ? 'green' : 'red' }]}>
            {formatarMoeda(valorizacao)}
          </Text>
          <Text style={{ color: valorizacao >= 0 ? 'green' : 'red', fontWeight: 'bold' }}>
            {valorizacao >= 0 ? 'Lucro' : 'Prejuízo'}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Valor Atual</Text>
          <Text style={styles.cardValue}>{formatarMoeda(valorAtualTotal)}</Text>
          <Text style={{ color: '#666', fontWeight: 'bold' }}>
            {investimentos.length} investimento{investimentos.length !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      {/* Gráfico de Pizza (só aparece se houver dados) */}
      {chartData.length > 0 && (
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Distribuição dos Investimentos</Text>
          <View style={{ alignItems: "center" }}>
            <PieChart
              data={chartData}
              width={width - 40}
              height={220}
              chartConfig={{
                backgroundGradientFrom: "#999",
                backgroundGradientTo: "#999",
                color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
                strokeWidth: 2,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="10"
              absolute
            />
          </View>
        </View>
      )}

      {/* Lista de Investimentos */}
      <View style={styles.investimentosContainer}>
        <Text style={styles.sectionTitle}>Meus Investimentos</Text>
        {investimentos.length > 0 ? (
          investimentos.map((item) => (
            <View key={item.id} style={styles.itemInvestimento}>
              <Ionicons
                name={getIconByType(item.tipo)}
                size={22}
                color="#007AFF"
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.itemNome}>{item.nome}</Text>
                <Text style={styles.itemTipo}>{item.tipo}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.itemValor}>{formatarMoeda(item.valorAtual)}</Text>
                <Text style={[
                  styles.itemRentabilidade,
                  { color: item.rentabilidade >= 0 ? '#4CAF50' : '#F44336' }
                ]}>
                  {item.rentabilidade >= 0 ? '+' : ''}{item.rentabilidade.toFixed(2)}%
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-open-outline" size={64} color="#CCC" />
            <Text style={styles.emptyText}>Nenhum investimento cadastrado</Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => router.push("/TelaCadastroInvestimento")}
            >
              <Text style={styles.emptyButtonText}>Adicionar Investimento</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#000",
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#F8F9FA",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    width: "48%",
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  chartContainer: {
    backgroundColor: "#F8F9FA",
    borderRadius: 14,
    padding: 16,
    marginTop: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  investimentosContainer: {
    backgroundColor: "#F8F9FA",
    borderRadius: 14,
    padding: 16,
    marginTop: 20,
    elevation: 2,
  },
  itemInvestimento: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#E0E0E0",
  },
  itemNome: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
  },
  itemTipo: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  itemValor: {
    fontWeight: "bold",
    color: "#000",
    fontSize: 15,
  },
  itemRentabilidade: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 16,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 15,
  },
});