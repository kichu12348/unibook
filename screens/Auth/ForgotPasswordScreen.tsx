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
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/authStore";
import { AuthStackParamList } from "../../navigation/types";
import StyledTextInput from "../../components/StyledTextInput";
import StyledButton from "../../components/StyledButton";
import { Ionicons } from "@expo/vector-icons";

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const ForgotPasswordScreen: React.FC = () => {
  const route = useRoute<RouteProp<AuthStackParamList, "ForgotPassword">>();
  const { email: initialEmail } = route.params;
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { requestPasswordReset, isLoading, error } = useAuthStore();
  const [email, setEmail] = useState(initialEmail || "");
  const [emailError, setEmailError] = useState("");

  const handleSendCode = async () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");

    const success = await requestPasswordReset({ email: email.trim() });
    if (success) {
      Alert.alert(
        "Check Your Email",
        "we've sent a code to reset your password."
      );
      navigation.navigate("VerifyResetOtp", { email: email.trim() });
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
    backButton: { padding: 8, marginRight: 16 },
    title: { fontSize: 24, fontWeight: "bold", color: theme.colors.text },
    content: { flex: 1, padding: 24, justifyContent: "center" },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginBottom: 32,
      lineHeight: 24,
    },
    scrollView: {
      flex: 1,
    },
    keyboardAvoidingView: {
      flex: 1,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Reset Password</Text>
      </View>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <Text style={styles.subtitle}>
              Enter your email address and we'll send you a code to reset your
              password.
            </Text>
            <StyledTextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your registered email"
              keyboardType="email-address"
              autoCapitalize="none"
              error={emailError}
            />
            <StyledButton
              title="Send Code"
              onPress={handleSendCode}
              loading={isLoading}
              style={{ marginTop: 16 }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ForgotPasswordScreen;
