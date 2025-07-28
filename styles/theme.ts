export interface Theme {
  colors: {
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    primary: string;
    accent: string;
    border: string;
    error: string;
    success: string;
    warning: string;
    placeholder: string;
  };
}

export const lightTheme: Theme = {
  colors: {
    background: '#FFFFFF',
    surface: '#F8F9FA',
    text: '#000000',
    textSecondary: '#666666',
    primary: '#000000',
    accent: '#007AFF',  // Blue accent
    border: '#E1E5E9',
    error: '#FF3B30',
    success: '#34C759',
    warning: '#FF9500',
    placeholder: '#999999',
  },
};

export const darkTheme: Theme = {
  colors: {
    background: '#1C1C1E',
    surface: '#2C2C2E',
    text: '#FFFFFF',
    textSecondary: '#AEAEB2',
    primary: '#FFFFFF',
    accent: '#007AFF',
    border: '#38383A',
    error: '#FF453A',
    success: '#30D158',
    warning: '#FF9F0A',
    placeholder: '#8E8E93',
  },
};
