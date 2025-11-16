import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
  ScrollView,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { MaskedTextInput } from "react-native-mask-text";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { salvarInvestimento } from "../services/storageService";

// Converte o rawText do MaskedTextInput (centavos) em número em reais
const rawCurrencyToNumber = (valor: string): number => {
  if (!valor) return 0;
  // Mantém apenas dígitos
  const apenasNumeros = valor.replace(/[^\d]/g, "");
  if (!apenasNumeros) return 0;

  // Últimos 2 dígitos = centavos
  const centavos = apenasNumeros.slice(-2);
  const reais = apenasNumeros.slice(0, -2) || "0";

  return parseFloat(`${reais}.${centavos}`);
};

export default function TelaCadastroInvestimento() {
  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [valorInicial, setValorInicial] = useState("");   // guarda rawText
  const [valorAtual, setValorAtual] = useState("");       // guarda rawText
  const [rentabilidade, setRentabilidade] = useState("0.00");
  const [dataAplicacao, setDataAplicacao] = useState("");
  const [salvando, setSalvando] = useState(false);

  const handleDateChange = (text: string) => {
    const numericText = text.replace(/[^\d]/g, "");
    const { length } = numericText;

    if (length <= 2) {
      setDataAplicacao(numericText);
    } else if (length <= 4) {
      setDataAplicacao(`${numericText.slice(0, 2)}/${numericText.slice(2)}`);
    } else {
      setDataAplicacao(
        `${numericText.slice(0, 2)}/${numericText.slice(2, 4)}/${numericText.slice(4, 8)}`
      );
    }
  };

  const validarData = (data: string): boolean => {
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = data.match(dateRegex);
    
    if (!match) return false;
    
    const dia = parseInt(match[1], 10);
    const mes = parseInt(match[2], 10);
    const ano = parseInt(match[3], 10);
    
    if (mes < 1 || mes > 12) return false;
    if (dia < 1 || dia > 31) return false;
    if (ano < 1900 || ano > 2100) return false;
    
    return true;
  };

  // calcula com base no número real (rawText convertido /100)
  const calcularRentabilidade = (inicialRaw: string, atualRaw: string): string => {
    const valorInicialNum = rawCurrencyToNumber(inicialRaw);
    const valorAtualNum = rawCurrencyToNumber(atualRaw);
    
    if (!valorInicialNum || !valorAtualNum || valorInicialNum === 0) {
      return "0.00";
    }
    
    const rentabilidadeCalc = ((valorAtualNum - valorInicialNum) / valorInicialNum) * 100;
    return rentabilidadeCalc.toFixed(2);
  };

  const handleValorAtualChange = (text: string, rawText: string) => {
    setValorAtual(rawText);
    if (valorInicial && rawText) {
      const novaRentabilidade = calcularRentabilidade(valorInicial, rawText);
      setRentabilidade(novaRentabilidade);
    }
  };

  const handleValorInicialChange = (text: string, rawText: string) => {
    setValorInicial(rawText);
    if (valorAtual && rawText) {
      const novaRentabilidade = calcularRentabilidade(rawText, valorAtual);
      setRentabilidade(novaRentabilidade);
    }
  };

  const handleSalvarInvestimento = async () => {
    Keyboard.dismiss();
    
    // Validações
    if (!nome || !tipo || !valorInicial || !valorAtual || !dataAplicacao) {
      Alert.alert("Campos Incompletos", "Por favor, preencha todos os campos.");
      return;
    }

    if (!validarData(dataAplicacao)) {
      Alert.alert("Data Inválida", "Por favor, insira uma data válida no formato DD/MM/AAAA.");
      return;
    }

    setSalvando(true);

    try {
      //  Converte rawText (centavos) para número correto em reais
      const valorInicialNumero = rawCurrencyToNumber(valorInicial);
      const valorAtualNumero = rawCurrencyToNumber(valorAtual);

      const investimento = {
        id: new Date().getTime().toString(),
        nome,
        tipo,
        valorInicial: valorInicialNumero,
        valorAtual: valorAtualNumero,
        rentabilidade: parseFloat(rentabilidade),
        dataAplicacao,
      };

      // Salvar no AsyncStorage
      await salvarInvestimento(investimento);

      console.log("✅ Investimento Salvo:", investimento);

      // Limpar campos
      setNome("");
      setTipo("");
      setValorInicial("");
      setValorAtual("");
      setRentabilidade("0.00");
      setDataAplicacao("");

      Alert.alert(
        "Sucesso!", 
        "Investimento salvo com sucesso!",
        [
          {
            text: "OK",
            onPress: () => {
              router.push("/(tabs)/telaDashboard");
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert(
        "Erro", 
        "Não foi possível salvar o investimento. Tente novamente."
      );
      console.error("Erro ao salvar:", error);
    } finally {
      setSalvando(false);
    }
  };

  const handleDateFocus = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[
          styles.scrollContainer,
          { paddingBottom: 100 + insets.bottom }
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Adicionar Investimento</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Detalhes do Investimento</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome do Investimento</Text>
            <TextInput
              placeholder="Ex: Ações da Apple"
              placeholderTextColor="#999"
              value={nome}
              onChangeText={setNome}
              style={styles.input}
              editable={!salvando}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tipo de Investimento</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={tipo}
                onValueChange={(itemValue) => setTipo(itemValue)}
                style={styles.picker}
                enabled={!salvando}
              >
                <Picker.Item label="Selecione o tipo" value="" />
                <Picker.Item label="Renda Fixa" value="Renda Fixa" />
                <Picker.Item label="Ações" value="Ações" />
                <Picker.Item label="Criptos" value="Criptos" />
                <Picker.Item label="Fundos Imobiliários" value="FIIs" />
              </Picker>
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputHalf}>
              <Text style={styles.label}>Valor Inicial (R$)</Text>
              <MaskedTextInput
                type="currency"
                options={{
                  prefix: "R$ ",
                  decimalSeparator: ",",
                  groupSeparator: ".",
                  precision: 2,
                }}
                value={valorInicial}
                onChangeText={handleValorInicialChange}
                style={styles.input}
                placeholder="R$ 0,00"
                placeholderTextColor="#999"
                keyboardType="numeric"
                editable={!salvando}
              />
            </View>

            <View style={styles.inputHalf}>
              <Text style={styles.label}>Valor Atual (R$)</Text>
              <MaskedTextInput
                type="currency"
                options={{
                  prefix: "R$ ",
                  decimalSeparator: ",",
                  groupSeparator: ".",
                  precision: 2,
                }}
                value={valorAtual}
                onChangeText={handleValorAtualChange}
                style={styles.input}
                placeholder="R$ 0,00"
                placeholderTextColor="#999"
                keyboardType="numeric"
                editable={!salvando}
              />
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputHalf}>
              <Text style={styles.label}>Rentabilidade (%)</Text>
              <View style={[styles.input, styles.inputDisabled]}>
                <Text style={styles.inputTextDisabled}>{rentabilidade}%</Text>
                <Ionicons name="lock-closed" size={18} color="#999" />
              </View>
            </View>

            <View style={styles.inputHalf}>
              <Text style={styles.label}>Data de Aquisição</Text>
              <View style={styles.dateInputContainer}>
                <TextInput
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor="#999"
                  value={dataAplicacao}
                  onChangeText={handleDateChange}
                  onFocus={handleDateFocus}
                  style={[styles.input, styles.dateInput]}
                  keyboardType="numeric"
                  maxLength={10}
                  editable={!salvando}
                />
                <Ionicons 
                  name="calendar-outline" 
                  size={18} 
                  color="#999" 
                  style={styles.calendarIcon} 
                />
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          onPress={handleSalvarInvestimento} 
          style={[styles.button, salvando && styles.buttonDisabled]}
          disabled={salvando}
        >
          {salvando ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Salvar Investimento</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 10,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center"
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#F8F9FA",
    color: "#000",
    padding: 14,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  pickerContainer: {
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    overflow: "hidden",
  },
  picker: {
    color: "#000",
    height: 53
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
    backgroundColor: "#F0F0F0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputTextDisabled: {
    color: "#999",
    fontSize: 16,
  },
  dateInputContainer: {
    position: "relative",
  },
  dateInput: {
    paddingRight: 40,
  },
  calendarIcon: {
    position: "absolute",
    right: 14,
    top: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: "#999",
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
