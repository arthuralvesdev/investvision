import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { getInvestimentos } from "../../src/services/investimentosService";

export default function TelaListagem() {
  useEffect(() => {
    async function carregar() {
      const lista = await getInvestimentos();
      console.log("📊 Dados vindos do Firestore:", lista);
    }

    carregar();
  }, []);

  // const total = data.reduce((acc, item) => acc + item.valor, 0);

  return (

    <View>
      <Text>Testando Firestore...</Text>
    </View>
  //   <View style={styles.container}>
  //     <Text style={styles.header}>InvestVision</Text>

  //     <Text style={styles.total}>
  //       Total investido: R$ {total.toLocaleString("pt-BR")}
  //     </Text>

  //     <FlatList
  //       data={data}
  //       keyExtractor={(item) => item.id}
  //       renderItem={({ item }) => (
  //         <View style={styles.card}>
  //           <Text style={styles.name}>{item.nome}</Text>
  //           <Text style={styles.value}>
  //             R$ {item.valor.toLocaleString("pt-BR")}
  //           </Text>
  //         </View>
  //       )}
  //     />

  //     <TouchableOpacity style={styles.botao} onPress={() => router.back()}>
  //         <Text style={styles.textoBotao}>Voltar</Text>
  //     </TouchableOpacity>

  //     <TouchableOpacity style={styles.addButton}>
  //       <Text style={styles.addText}>+</Text>
  //     </TouchableOpacity>
  //   </View>
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
  textoBotao: {
  color: "#fff",
  fontWeight: "bold",
  fontSize: 16,
  },
});
