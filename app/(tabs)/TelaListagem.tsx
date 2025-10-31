import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { deleteInvestimento, getInvestimentos } from "../../src/services/investimentosService";
import { Investimento } from "../../src/types/Investimento";

export default function TelaListagem() {
  const [carregando, setCarregando] = useState(true);
  const [lista, setLista] = useState<Investimento[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const carregar = async () => {
    setCarregando(true);
    const dados = await getInvestimentos();
    setLista(dados);
    setCarregando(false);
  };

  useEffect(() => { carregar(); }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await carregar();
    setRefreshing(false);
  }, []);

  const total = lista.reduce((acc, it) => acc + (it.valorAtual ?? 0), 0);

  const confirmarExcluir = (id?: string) => {
    if (!id) return;
    Alert.alert("Excluir", "Deseja excluir este investimento?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          await deleteInvestimento(id);
          await carregar();
        }
      }
    ]);
  };

  if (carregando) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text>Carregando investimentos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>InvestVision</Text>
      <Text style={styles.total}>Total investido: R$ {total.toLocaleString("pt-BR")}</Text>

      <FlatList
        data={lista}
        keyExtractor={(item) => item.id!}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.nome}</Text>
              <Text style={styles.meta}>{item.tipo} • {item.dataAplicacao}</Text>
              <Text style={styles.value}>R$ {item.valorAtual.toLocaleString("pt-BR")}</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.btnOutline} onPress={() => router.push({ pathname: "/TelaCadastro", params: { id: item.id } })}>
                <Text style={styles.btnOutlineText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnDanger} onPress={() => confirmarExcluir(item.id)}>
                <Text style={styles.btnDangerText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => router.push("/(tabs)/TelaCadastro")}>
        <Text style={styles.addText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 },
  container: { flex: 1, backgroundColor: "#f4f4f4", padding: 16 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 20, marginTop: 35 },
  total: { fontSize: 18, marginBottom: 12, color: "#2e7d32" },
  card: { backgroundColor: "#fff", padding: 16, borderRadius: 8, marginBottom: 10, elevation: 2, flexDirection: "row", gap: 12 },
  name: { fontSize: 16, fontWeight: "bold" },
  meta: { fontSize: 12, color: "#666", marginTop: 2 },
  value: { fontSize: 16, color: "#007AFF", marginTop: 6 },

  actions: { justifyContent: "center", gap: 8 },
  btnOutline: { borderWidth: 1, borderColor: "#007AFF", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  btnOutlineText: { color: "#007AFF", fontWeight: "600" },
  btnDanger: { backgroundColor: "#E53935", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  btnDangerText: { color: "#fff", fontWeight: "600" },

  addButton: { position: "absolute", bottom: 30, right: 30, backgroundColor: "#007AFF", width: 60, height: 60, borderRadius: 30, alignItems: "center", justifyContent: "center", elevation: 5 },
  addText: { fontSize: 30, color: "#fff" },
});
