import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/authStore';
import StyledTextInput from '../../components/StyledTextInput';
import StyledButton from '../../components/StyledButton';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'OtpVerification'>;
type RouteProps = RouteProp<AuthStackParamList, 'OtpVerification'>;

const OtpVerificationScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { email } = route.params;
  const { verifyOtp, isLoading, error, clearError } = useAuthStore();

  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState<string | undefined>();

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [
        { text: 'OK', onPress: clearError }
      ]);
    }
  }, [error]);

  const validateOtp = (): boolean => {
    if (!otp.trim()) {
      setOtpError('OTP is required');
      return false;
    }
    
    if (otp.trim().length !== 6) {
      setOtpError('OTP must be 6 digits');
      return false;
    }
    
    if (!/^\d+$/.test(otp.trim())) {
      setOtpError('OTP must contain only numbers');
      return false;
    }

    setOtpError(undefined);
    return true;
  };

  const handleVerifyOtp = async () => {
    if (!validateOtp()) {
      return;
    }

    try {
      const isAuthenticated = await verifyOtp({
        email,
        otp: otp.trim(),
      });

      if (isAuthenticated) {
        // User is authenticated, navigation will be handled by App.tsx
        // based on the authentication state change
      } else {
        // User verification successful but pending approval
        // Navigate back to login screen
        navigation.navigate('Login');
      }
    } catch (error) {
      // Error is handled by the store and displayed via Alert
      console.error('OTP verification error:', error);
    }
  };

  const handleResendOtp = () => {
    Alert.alert(
      'Resend OTP',
      'This feature will be implemented when the backend supports it.',
      [{ text: 'OK' }]
    );
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 60,
    },
    header: {
      alignItems: 'center',
      marginBottom: 40,
    },
    backButton: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    emailText: {
      fontWeight: '600',
      color: theme.colors.primary,
    },
    form: {
      marginBottom: 32,
    },
    inputContainer: {
      marginBottom: 20,
    },
    otpInput: {
      textAlign: 'center',
      fontSize: 24,
      letterSpacing: 8,
      fontFamily: 'monospace',
    },
    buttonContainer: {
      gap: 16,
    },
    resendContainer: {
      alignItems: 'center',
      marginTop: 24,
    },
    resendText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    resendButton: {
      padding: 0,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <StyledButton
            title=""
            onPress={handleBack}
            variant="text"
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </StyledButton>
          
          <Text style={styles.title}>Verify Email</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit verification code sent to{'\n'}
            <Text style={styles.emailText}>{email}</Text>
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <StyledTextInput
              placeholder="000000"
              value={otp}
              onChangeText={(text) => {
                // Only allow numeric input and limit to 6 characters
                const numericText = text.replace(/[^0-9]/g, '').slice(0, 6);
                setOtp(numericText);
                if (otpError) {
                  setOtpError(undefined);
                }
              }}
              error={otpError}
              keyboardType="numeric"
              maxLength={6}
              style={styles.otpInput}
              leftElement={
                <Ionicons name="shield-checkmark-outline" size={20} color={theme.colors.textSecondary} />
              }
            />
          </View>

          <View style={styles.buttonContainer}>
            <StyledButton
              title="Verify Code"
              onPress={handleVerifyOtp}
              loading={isLoading}
              disabled={!otp.trim() || otp.length !== 6}
            />
          </View>
        </View>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code?</Text>
          <StyledButton
            title="Resend Code"
            onPress={handleResendOtp}
            variant="text"
            style={styles.resendButton}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OtpVerificationScreen;
