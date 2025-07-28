import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme, Theme } from '../styles/theme';
import { useThemeStore } from '../store/themeStore';

export const useTheme = (): Theme => {
  const  currentTheme  = useThemeStore(s => s.currentTheme);
  return currentTheme;
};
