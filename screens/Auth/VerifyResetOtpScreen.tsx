import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/authStore";
import { AuthStackParamList } from "../../navigation/types";
import StyledButton from "../../components/StyledButton";
import { Ionicons } from "@expo/vector-icons";

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;
type RouteProps = RouteProp<AuthStackParamList, "VerifyResetOtp">;

const VerifyResetOtpScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const insets = useSafeAreaInsets();
  const { verifyPasswordResetOtp, isLoading, error, requestPasswordReset } =
    useAuthStore();
  const { email } = route.params;

  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | undefined>();
  const [scrollable, setScrollable] = useState<boolean>(false);
  const { height } = useWindowDimensions();
  const [isResending, setIsResending] = useState(false);

  const handleResendOtp = async () => {
    setIsResending(true);
    await requestPasswordReset({ email });
    setIsResending(false);
    Alert.alert(
      "Code Sent",
      "A new verification code has been sent to your email"
    );
  };

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
    }
  }, [error]);

  const validateOtp = (): boolean => {
    if (!otp.trim()) {
      setOtpError("OTP is required");
      return false;
    }
    if (otp.trim().length !== 4) {
      setOtpError("OTP must be 4 digits");
      return false;
    }
    if (!/^\d+$/.test(otp.trim())) {
      setOtpError("OTP must contain only numbers");
      return false;
    }
    setOtpError(undefined);
    return true;
  };

  const handleVerify = async () => {
    if (!validateOtp()) {
      return;
    }

    const success = await verifyPasswordResetOtp({ email, otp: otp.trim() });
    if (success) {
      navigation.navigate("ResetPassword", { email, otp: otp.trim() });
    }
  };

  const handleNumberPress = (number: string) => {
    if (otp.length < 4) {
      const newOtp = otp + number;
      setOtp(newOtp);
      if (otpError) {
        setOtpError(undefined);
      }
    }
  };

  const handleDeletePress = () => {
    if (otp.length > 0) {
      setOtp(otp.slice(0, -1));
      if (otpError) {
        setOtpError(undefined);
      }
    }
  };

  const renderOtpDots = () => {
    const dots = [];
    for (let i = 0; i < 4; i++) {
      dots.push(
        <View
          key={i}
          style={[
            styles.otpBox,
            {
              backgroundColor:
                i < otp.length ? theme.colors.primary : "transparent",
              borderColor: otpError ? theme.colors.error : theme.colors.border,
            },
          ]}
        >
          {i < otp.length && (
            <Text style={[styles.otpBoxText, { color: theme.colors.surface }]}>
              {otp[i]}
            </Text>
          )}
        </View>
      );
    }
    return dots;
  };

  const renderNumberPad = () => {
    const numbers = [
      ["1", "2", "3"],
      ["4", "5", "6"],
      ["7", "8", "9"],
      ["", "0", "delete"],
    ];
    return (
      <View style={styles.numberPad}>
        {numbers.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.numberRow}>
            {row.map((item, colIndex) => {
              if (item === "") {
                return <View key={colIndex} style={styles.emptySpace} />;
              }
              const isDelete = item === "delete";
              return (
                <TouchableOpacity
                  key={colIndex}
                  style={[
                    styles.numberButton,
                    { backgroundColor: theme.colors.surface },
                  ]}
                  onPress={() =>
                    isDelete ? handleDeletePress() : handleNumberPress(item)
                  }
                  activeOpacity={0.7}
                >
                  {isDelete ? (
                    <Ionicons
                      name="backspace-outline"
                      size={22}
                      color={theme.colors.text}
                    />
                  ) : (
                    <Text
                      style={[
                        styles.numberButtonText,
                        { color: theme.colors.text },
                      ]}
                    >
                      {item}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 30,
    },
    header: {
      alignItems: "center",
      marginBottom: 20,
      paddingTop: 10,
    },
    backButton: {
      position: "absolute",
      left: 0,
      top: 10,
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: 6,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: "center",
      lineHeight: 20,
    },
    emailText: {
      fontWeight: "600",
      color: theme.colors.primary,
    },
    form: {
      flex: 1,
      justifyContent: "space-between",
      gap: 30,
      paddingBottom: 10,
    },
    otpContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: 10,
      marginBottom: 10,
    },
    otpDotsContainer: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 6,
      width: "100%",
      justifyContent: "space-evenly",
      alignItems: "center",
    },
    otpBox: {
      width: 50,
      height: 50,
      borderRadius: 8,
      borderWidth: 1.5,
      justifyContent: "center",
      alignItems: "center",
    },
    otpBoxText: {
      fontSize: 22,
      fontWeight: "600",
    },
    errorText: {
      color: theme.colors.error,
      fontSize: 12,
      textAlign: "center",
      marginTop: 6,
    },
    numberPad: {
      alignItems: "center",
    },
    numberRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      marginBottom: 12,
    },
    numberButton: {
      width: "30%",
      height: 50,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      elevation: 1,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 1,
    },
    emptySpace: {
      width: "30%",
      height: 50,
    },
    numberButtonText: {
      fontSize: 20,
      fontWeight: "500",
    },
    buttonContainer: {
      marginVertical: 16,
    },
    resendContainer: {
      alignItems: "center",
      paddingBottom: 10,
    },
    resendText: {
      fontSize: 13,
      color: theme.colors.textSecondary,
      marginBottom: 6,
    },
    resendButton: {
      padding: 0,
    },
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Enter Code</Text>
          <Text style={styles.subtitle}>
            Enter the 4-digit verification code sent to{"\n"}
            <Text style={styles.emailText}>{email}</Text>
          </Text>
        </View>
        <ScrollView
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
          style={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={(_, contentHeight) =>
            setScrollable(contentHeight > height - 250)
          }
          scrollEnabled={scrollable}
        >
          <View style={styles.form}>
            <View style={styles.otpContainer}>
              <View style={styles.otpDotsContainer}>{renderOtpDots()}</View>
              {otpError && <Text style={styles.errorText}>{otpError}</Text>}
            </View>
            {renderNumberPad()}
            <View style={styles.buttonContainer}>
              <StyledButton
                title="Verify Code"
                onPress={handleVerify}
                loading={isLoading}
                disabled={otp.length !== 4}
              />
            </View>
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't receive the code?</Text>
              <StyledButton
                title="Resend Code"
                onPress={handleResendOtp}
                variant="text"
                style={styles.resendButton}
                loading={isResending}
                disabled={isResending}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default VerifyResetOtpScreen;
