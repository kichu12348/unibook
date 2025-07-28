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
import { Inter_600SemiBold, useFonts } from "@expo-google-fonts/inter";
import * as SplashScreen from "expo-splash-screen";
import { enableScreens } from "react-native-screens";

enableScreens();

SplashScreen.preventAutoHideAsync();

export default function App() {
  const initializeApp = useAuthStore((state) => state.initializeApp);
  const initializeTheme = useThemeStore((state) => state.initializeTheme);
  const theme = useTheme();

  const [fontsLoaded, error] = useFonts({
    Inter_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [error, fontsLoaded]);

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
