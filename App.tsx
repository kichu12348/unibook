import React, { useEffect } from "react";
import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { useAuthStore } from "./store/authStore";
import { useTheme } from "./hooks/useTheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./navigation/AppNavigator";

export default function App() {
  const { initializeApp } = useAuthStore();
  const theme = useTheme();

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar
            style={theme.colors.background === "#FFFFFF" ? "dark" : "light"}
            backgroundColor={theme.colors.background}
          />
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
