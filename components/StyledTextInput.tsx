import React from 'react';
import {
  TextInput,
  TextInputProps,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface StyledTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

const StyledTextInput: React.FC<StyledTextInputProps> = ({
  label,
  error,
  leftElement,
  rightElement,
  style,
  ...props
}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      marginVertical: 8,
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.text,
      marginBottom: 8,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: error ? theme.colors.error : theme.colors.border,
      borderRadius: 8,
    },
    leftElementContainer: {
      paddingLeft: 16,
      paddingRight: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    input: {
      flex: 1,
      paddingHorizontal: leftElement ? 8 : 16,
      paddingVertical: 12,
      fontSize: 16,
      color: theme.colors.text,
    },
    rightElementContainer: {
      paddingLeft: 8,
      paddingRight: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    error: {
      fontSize: 14,
      color: theme.colors.error,
      marginTop: 4,
    },
  });

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        {leftElement && (
          <View style={styles.leftElementContainer}>
            {leftElement}
          </View>
        )}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={theme.colors.placeholder}
          {...props}
        />
        {rightElement && (
          <View style={styles.rightElementContainer}>
            {rightElement}
          </View>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

export default StyledTextInput;
