import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { addInvestimento, getInvestimentos, updateInvestimento } from "../src/services/investimentosService";
import { Investimento } from "../src/types/Investimento";

export default function TelaCadastro() {
  const params = useLocalSearchParams<{ id?: string }>();
  const [form, setForm] = useState<Investimento>({
    nome: "",
    tipo: "Renda Fixa",
    valorInicial: 0,
    valorAtual: 0,
    rentabilidade: 0,
    dataAplicacao: new Date().toISOString().slice(0,10),
  });

  // Se tiver id, pré-carrega dados para edição
  useEffect(() => {
    (async () => {
      if (!params.id) return;
      const lista = await getInvestimentos();
      const atual = lista.find(x => x.id === params.id);
      if (atual) setForm(atual);
    })();
  }, [params.id]);

  const onSalvar = async () => {
    try {
      if (params.id) {
        await updateInvestimento(params.id, form);
      } else {
        await addInvestimento(form);
      }
      router.back();
    } catch (e) {
      console.error(e);
      Alert.alert("Erro", "Não foi possível salvar.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{params.id ? "Editar Investimento" : "Novo Investimento"}</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput style={styles.input} value={form.nome} onChangeText={(v) => setForm({ ...form, nome: v })} />

      <Text style={styles.label}>Tipo</Text>
      <TextInput style={styles.input} value={form.tipo} onChangeText={(v) => setForm({ ...form, tipo: v as any })} placeholder='Ex: "Renda Fixa", "Ações"…' />

      <Text style={styles.label}>Valor Inicial</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={String(form.valorInicial)} onChangeText={(v) => setForm({ ...form, valorInicial: Number(v) || 0 })} />

      <Text style={styles.label}>Valor Atual</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={String(form.valorAtual)} onChangeText={(v) => setForm({ ...form, valorAtual: Number(v) || 0 })} />

      <Text style={styles.label}>Rentabilidade (%)</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={String(form.rentabilidade)} onChangeText={(v) => setForm({ ...form, rentabilidade: Number(v) || 0 })} />

      <Text style={styles.label}>Data de Aplicação (YYYY-MM-DD)</Text>
      <TextInput style={styles.input} value={form.dataAplicacao} onChangeText={(v) => setForm({ ...form, dataAplicacao: v })} />

      <TouchableOpacity style={styles.btnPrimary} onPress={onSalvar}>
        <Text style={styles.btnPrimaryText}>Salvar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnGhost} onPress={() => router.back()}>
        <Text style={styles.btnGhostText}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 10 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  label: { fontSize: 14, color: "#555" },
  input: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12 },
  btnPrimary: { backgroundColor: "#007AFF", padding: 14, borderRadius: 8, marginTop: 10, alignItems: "center" },
  btnPrimaryText: { color: "#fff", fontWeight: "bold" },
  btnGhost: { padding: 12, alignItems: "center" },
  btnGhostText: { color: "#555" },
});
