import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/authStore";
import { AuthStackParamList } from "../../navigation/types";
import StyledTextInput from "../../components/StyledTextInput";
import StyledButton from "../../components/StyledButton";
import { Ionicons } from "@expo/vector-icons";

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, "Login">;
type RouteProps = RouteProp<AuthStackParamList, "ResetPassword">;

const ResetPasswordScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const insets = useSafeAreaInsets();
  const { resetPassword, isLoading, error } = useAuthStore();
  const { email, otp } = route.params;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleReset = async () => {
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return;
    }
    if (password.trim() !== confirmPassword.trim()) {
      setPasswordError("Passwords do not match.");
      return;
    }
    setPasswordError("");

    const success = await resetPassword({
      email,
      otp,
      password: password.trim(),
    });
    if (success) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } else if (error) {
      Alert.alert("Error", error);
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
      paddingHorizontal: 24,
      paddingTop: insets.top + 16,
      paddingBottom: 16,
      flexDirection: "row",
      alignItems: "center",
    },
    title: { fontSize: 24, fontWeight: "bold", color: theme.colors.text },
    content: { flex: 1, padding: 24 },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginBottom: 32,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: "center",
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Set New Password</Text>
      </View>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>
          Please create a new, secure password for your account.
        </Text>
        <StyledTextInput
          label="New Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your new password"
          secureTextEntry={!showPassword}
          error={passwordError}
          rightElement={
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={24}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          }
        />
        <StyledTextInput
          label="Confirm New Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm your new password"
          secureTextEntry={!showPassword}
        />
        <StyledButton
          title="Reset Password"
          onPress={handleReset}
          loading={isLoading}
          style={{ marginTop: 16, marginBottom: 24 }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ResetPasswordScreen;
