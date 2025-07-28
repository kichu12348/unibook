import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useThemeStore, ThemeMode } from '../store/themeStore';

interface ThemeSwitchProps {
  style?: any;
}

const ThemeSwitch: React.FC<ThemeSwitchProps> = ({ style }) => {
  const theme = useTheme();
  const { themeMode, setThemeMode } = useThemeStore();

  const themeOptions: { mode: ThemeMode; label: string; icon: string }[] = [
    { mode: 'light', label: 'Light', icon: 'sunny' },
    { mode: 'dark', label: 'Dark', icon: 'moon' },
    { mode: 'system', label: 'System', icon: 'phone-portrait' },
  ];

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
  };

  const styles = StyleSheet.create({
    container: {
      ...style,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 12,
    },
    optionsContainer: {
      flexDirection: 'row',
      borderRadius: 12,
      backgroundColor: theme.colors.surface,
      padding: 4,
    },
    option: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
    },
    selectedOption: {
      backgroundColor: theme.colors.primary,
    },
    optionText: {
      fontSize: 14,
      fontWeight: '500',
      marginLeft: 8,
      color: theme.colors.textSecondary,
    },
    selectedOptionText: {
      color: theme.colors.background,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Theme</Text>
      <View style={styles.optionsContainer}>
        {themeOptions.map((option) => (
          <TouchableOpacity
            key={option.mode}
            style={[
              styles.option,
              themeMode === option.mode && styles.selectedOption,
            ]}
            onPress={() => handleThemeChange(option.mode)}
          >
            <Ionicons
              name={option.icon as any}
              size={16}
              color={
                themeMode === option.mode
                  ? theme.colors.background
                  : theme.colors.textSecondary
              }
            />
            <Text
              style={[
                styles.optionText,
                themeMode === option.mode && styles.selectedOptionText,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default ThemeSwitch;
