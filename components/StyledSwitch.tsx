import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface StyledSwitchProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  description?: string;
}

const StyledSwitch: React.FC<StyledSwitchProps> = ({
  label,
  value,
  onValueChange,
  disabled = false,
  description,
}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    labelContainer: {
      flex: 1,
      marginRight: 12,
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.text,
      marginBottom: description ? 4 : 0,
    },
    description: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 18,
    },
    switch: {
      transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.switchContainer}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {description && (
            <Text style={styles.description}>{description}</Text>
          )}
        </View>
        <Switch
          style={styles.switch}
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          trackColor={{
            false: theme.colors.border,
            true: theme.colors.primary + '80', // 50% opacity
          }}
          thumbColor={
            value 
              ? theme.colors.primary 
              : theme.colors.background
          }
          ios_backgroundColor={theme.colors.border}
        />
      </View>
    </View>
  );
};

export default StyledSwitch;
