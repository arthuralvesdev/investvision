import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { MaskedTextInput } from "react-native-mask-text";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router"; // Importar o router para o botão de voltar

export default function TelaCadastroInvestimento() {
  // Estados dos inputs
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [valorInicial, setValorInicial] = useState("");
  const [valorAtual, setValorAtual] = useState("");
  const [rentabilidade, setRentabilidade] = useState("0.00"); // Começa com valor
  const [dataAplicacao, setDataAplicacao] = useState("");

  /**
   * Formata a data enquanto o usuário digita (DD/MM/AAAA)
   */
  const handleDateChange = (text: string) => {
    // Remove tudo que não for número
    const numericText = text.replace(/[^\d]/g, "");
    const { length } = numericText;

    if (length <= 2) {
      // DD
      setDataAplicacao(numericText);
    } else if (length <= 4) {
      // DD/MM
      setDataAplicacao(`${numericText.slice(0, 2)}/${numericText.slice(2)}`);
    } else {
      // DD/MM/AAAA (limita em 8 dígitos)
      setDataAplicacao(
        `${numericText.slice(0, 2)}/${numericText.slice(
          2,
          4
        )}/${numericText.slice(4, 8)}`
      );
    }
  };

  /**
   * Valida e salva o investimento
   */
  const salvarInvestimento = () => {
    // Validação de data simples (formato DD/MM/AAAA)
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;

    if (!nome || !tipo || !valorInicial || !valorAtual || !dataAplicacao) {
      Alert.alert(
        "Campos Incompletos",
        "Por favor, preencha todos os campos."
      );
      return;
    }

    if (!dateRegex.test(dataAplicacao)) {
      Alert.alert(
        "Data Inválida",
        "Por favor, insira uma data no formato DD/MM/AAAA."
      );
      return;
    }

    // Objeto final (pronto para AsyncStorage)
    const investimento = {
      id: new Date().getTime().toString(), // Adiciona um ID único
      nome,
      tipo,
      valorInicial, // O MaskedTextInput já deve retornar o valor numérico ou formatado
      valorAtual,
      rentabilidade: Number(rentabilidade),
      dataAplicacao,
    };

    // Log de teste
    console.log("Investimento Salvo:", investimento);

    // Limpa os campos
    setNome("");
    setTipo("");
    setValorInicial("");
    setValorAtual("");
    setRentabilidade("0.00");
    setDataAplicacao("");

    Alert.alert("Sucesso", "Investimento salvo com sucesso (ver console).");

    // Volta para a tela anterior (Listagem ou Dashboard)
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header com botão de voltar */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Adicionar Investimento</Text>
            <View style={{ width: 40 }} /> {/* Espaço para centralizar o título */}
          </View>

          {/* Card do Formulário */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Detalhes do Investimento</Text>

            {/* Nome do Investimento */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nome do Investimento</Text>
              <TextInput
                placeholder="Ex: Ações da Apple"
                placeholderTextColor="#A0A0A0"
                value={nome}
                onChangeText={setNome}
                style={styles.input}
              />
            </View>

            {/* Tipo de Investimento (Picker) */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Tipo de Investimento</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={tipo}
                  onValueChange={(itemValue) => setTipo(itemValue)}
                  style={styles.picker}
                  dropdownIconColor="#FFF"
                >
                  <Picker.Item label="Selecione o tipo" value="" color="#A0A0A0" />
                  <Picker.Item label="Renda Fixa" value="Renda Fixa" color="#FFF" />
                  <Picker.Item label="Ações" value="Ações" color="#FFF" />
                  <Picker.Item label="Criptos" value="Criptos" color="#FFF" />
                  <Picker.Item label="Fundos Imobiliários" value="FIIs" color="#FFF" />
                </Picker>
                <Ionicons name="chevron-down" size={20} color="#A0A0A0" style={styles.pickerIcon} />
              </View>
            </View>

            {/* Linha 1: Valor Inicial e Valor Atual */}
            <View style={styles.inputRow}>
              <View style={styles.inputHalf}>
                <Text style={styles.label}>Valor Inicial (R$)</Text>
                <MaskedTextInput
                  type={"currency"}
                  options={{
                    prefix: "R$ ",
                    decimalSeparator: ",",
                    groupSeparator: ".",
                    precision: 2,
                  }}
                  value={valorInicial}
                  onChangeText={(text, rawText) => setValorInicial(rawText)}
                  style={styles.input}
                  placeholder="R$ 1.000,00"
                  placeholderTextColor="#A0A0A0"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputHalf}>
                <Text style={styles.label}>Valor Atual (R$)</Text>
                <MaskedTextInput
                  type={"currency"}
                  options={{
                    prefix: "R$ ",
                    decimalSeparator: ",",
                    groupSeparator: ".",
                    precision: 2,
                  }}
                  value={valorAtual}
                  onChangeText={(text, rawText) => setValorAtual(rawText)}
                  style={styles.input}
                  placeholder="R$ 1.500,00"
                  placeholderTextColor="#A0A0A0"
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Linha 2: Rentabilidade e Data */}
            <View style={styles.inputRow}>
              <View style={styles.inputHalf}>
                <Text style={styles.label}>Rentabilidade (%)</Text>
                <View style={[styles.input, styles.inputDisabled]}>
                  <TextInput
                    editable={false}
                    value={rentabilidade}
                    style={styles.inputTextDisabled}
                  />
                  <Ionicons name="lock-closed" size={18} color="#A0A0A0" />
                </View>
              </View>

              <View style={styles.inputHalf}>
                <Text style={styles.label}>Data de Aquisição</Text>
                <View style={styles.inputIconContainer}>
                  <TextInput
                    placeholder="DD/MM/AAAA"
                    placeholderTextColor="#A0A0A0"
                    value={dataAplicacao}
                    onChangeText={handleDateChange} // Usa a função de formatação
                    style={styles.input}
                    keyboardType="numeric"
                    maxLength={10} // DD/MM/AAAA
                  />
                  <Ionicons name="calendar-outline" size={18} color="#A0A0A0" style={styles.inputIcon} />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Botão Salvar (fixo no final) */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={salvarInvestimento} style={styles.button}>
            <Text style={styles.buttonText}>Salvar Investimento</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Estilos baseados no Mockup
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#111", // Cor de fundo geral
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginBottom: 20,
    marginTop: Platform.OS === "android" ? 20 : 0,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#2C2C2E", // Cor do card
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 15,
  },
  cardTitle: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 25,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: "#A0A0A0", // Cor do label
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#3A3A3C", // Cor do input
    color: "#FFF",
    padding: 14,
    borderRadius: 8,
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: "#3A3A3C",
    borderRadius: 8,
    justifyContent: "center",
  },
  picker: {
    color: "#FFF",
    height: 50, // Altura padrão do input
    marginLeft: Platform.OS === "ios" ? 0 : -5, // Ajuste para Android
  },
  pickerIcon: {
    position: "absolute",
    right: 15,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  inputHalf: {
    width: "48%",
  },
  inputDisabled: {
    backgroundColor: "#3A3A3C",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputTextDisabled: {
    color: "#A0A0A0",
    fontSize: 16,
  },
  inputIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3A3A3C",
    borderRadius: 8,
  },
  inputIcon: {
    position: 'absolute',
    right: 14,
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: "#111", // Fundo para o botão
  },
  button: {
    backgroundColor: "#5856D6", // Cor roxa/azul do mockup
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});