import React, { useEffect } from "react";
import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { useAuthStore } from "./store/authStore";
import { useThemeStore } from "./store/themeStore";
import { useTheme } from "./hooks/useTheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./navigation/AppNavigator";

export default function App() {
  const { initializeApp } = useAuthStore();
  const { initializeTheme } = useThemeStore();
  const theme = useTheme();

  useEffect(() => {
    const initialize = async () => {
      await initializeTheme();
      await initializeApp();
    };
    initialize();
  }, [initializeApp, initializeTheme]);

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
