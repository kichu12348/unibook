import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface StyledButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'text';
  size?: 'small' | 'medium' | 'large';
    style?: object;
    disabled?: boolean;
    textStyles?: object;
}

const StyledButton: React.FC<StyledButtonProps> = ({
  title,
  loading = false,
  variant = 'primary',
  size = 'medium',
  style,
  disabled,
  textStyles = {},
  ...props
}) => {
  const theme = useTheme();

  const getButtonStyle = () => {
    const baseStyle = {
      borderRadius: 8,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      flexDirection: 'row' as const,
    };

    const sizeStyles = {
      small: { paddingHorizontal: 16, paddingVertical: 8 },
      medium: { paddingHorizontal: 20, paddingVertical: 12 },
      large: { paddingHorizontal: 24, paddingVertical: 16 },
    };

    const variantStyles = {
      primary: {
        backgroundColor: disabled || loading ? theme.colors.textSecondary : theme.colors.primary,
      },
      secondary: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: disabled || loading ? theme.colors.textSecondary : theme.colors.primary,
      },
      text: {
        backgroundColor: 'transparent',
      },
    };

    return [baseStyle, sizeStyles[size], variantStyles[variant]];
  };

  const getTextStyle = () => {
    const baseStyle = {
      fontWeight: '600' as const,
      fontSize: size === 'small' ? 14 : size === 'large' ? 18 : 16,
    };

    const variantStyles = {
      primary: {
        color: disabled || loading ? theme.colors.background : theme.colors.background,
      },
      secondary: {
        color: disabled || loading ? theme.colors.textSecondary : theme.colors.primary,
      },
      text: {
        color: disabled || loading ? theme.colors.textSecondary : theme.colors.primary,
      },
    };

    return [baseStyle, variantStyles[variant]];
  };

  const buttonStyle = getButtonStyle();
  const textStyle = getTextStyle();

  return (
    <TouchableOpacity
      style={[buttonStyle, style]}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? theme.colors.background : theme.colors.primary}
          style={{ marginRight: 8 }}
        />
      )}
      <Text style={[textStyle, textStyles]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default StyledButton;
