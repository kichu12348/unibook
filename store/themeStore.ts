import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";
import { lightTheme, darkTheme, Theme } from "../styles/theme";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeState {
  themeMode: ThemeMode;
  currentTheme: Theme;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  initializeTheme: (
    cb?: (backgroundColor: string) => Promise<void>
  ) => Promise<void>;
}

const THEME_KEY = "theme_mode";

const getThemeForMode = (mode: ThemeMode): Theme => {
  switch (mode) {
    case "light":
      return lightTheme;
    case "dark":
      return darkTheme;
    case "system":
    default:
      const systemColorScheme = Appearance.getColorScheme();
      return systemColorScheme === "dark" ? darkTheme : lightTheme;
  }
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  themeMode: "system",
  currentTheme: getThemeForMode("system"),

  setThemeMode: async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_KEY, mode);
      const newTheme = getThemeForMode(mode);

      set({
        themeMode: mode,
        currentTheme: newTheme,
      });
    } catch (error) {
      console.error("Error saving theme mode:", error);
    }
  },

  initializeTheme: async (cb) => {
    try {
      const savedMode = (await AsyncStorage.getItem(THEME_KEY)) as ThemeMode;
      const mode = savedMode || "system";
      const theme = getThemeForMode(mode);

      set({
        themeMode: mode,
        currentTheme: theme,
      });
    } catch (error) {
      console.error("Error loading theme mode:", error);
      set({
        themeMode: "system",
        currentTheme: getThemeForMode("system"),
      });
    } finally {
      await cb?.(get().currentTheme.colors.background);
    }
  },
}));

Appearance.addChangeListener(({ colorScheme }) => {
  const { themeMode, setThemeMode } = useThemeStore.getState();
  if (themeMode === "system") {
    setThemeMode("system");
  }
});
