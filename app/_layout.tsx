import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Platform, StatusBar } from "react-native";
import { useEffect } from "react";

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === "android") {
      StatusBar.setTranslucent(false);
      StatusBar.setBackgroundColor("#FFFFFF");
      StatusBar.setBarStyle("dark-content");
    }
  }, []);

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#F5F5F5" },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="TelaCadastroInvestimento" 
          options={{ headerShown: false }} 
        />
      </Stack>
    </SafeAreaProvider>
  );
}