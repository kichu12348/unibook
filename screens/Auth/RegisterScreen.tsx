import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { AuthStackParamList } from "../../navigation/types";
import { useTheme } from "../../hooks/useTheme";
import { useAuthStore } from "../../store/authStore";
import {
  fetchColleges,
  College,
  RegisterFormData,
  fetchForumsByCollege,
  Forum,
} from "../../api/public";
import StyledTextInput from "../../components/StyledTextInput";
import StyledButton from "../../components/StyledButton";
import StyledPicker from "../../components/StyledPicker";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type RegisterScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  "Register"
>;

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const { register, isLoading, error, clearError } = useAuthStore();

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedCollegeId, setSelectedCollegeId] = useState("");
  const [selectedRole, setSelectedRole] = useState<
    "student" | "teacher" | "forum_head"
  >("student");
  const [selectedForumId, setSelectedForumId] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Data state
  const [colleges, setColleges] = useState<College[]>([]);
  const [collegesLoading, setCollegesLoading] = useState(true);
  const [collegesError, setCollegesError] = useState("");

  // Forum state
  const [forums, setForums] = useState<Forum[]>([]);
  const [forumsLoading, setForumsLoading] = useState(false);
  const [forumsError, setForumsError] = useState("");

  // Form validation errors
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    college: "",
    forum: "",
  });

  // Role options
  const roleOptions = [
    { label: "Student", value: "student" },
    { label: "Teacher", value: "teacher" },
    { label: "Forum Head", value: "forum_head" },
  ];

  // Fetch colleges on component mount
  useEffect(() => {
    const loadColleges = async () => {
      try {
        setCollegesLoading(true);
        setCollegesError("");
        const collegesData = await fetchColleges();
        setColleges(collegesData);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to load colleges";
        setCollegesError(errorMessage);
        Alert.alert("Error", errorMessage);
      } finally {
        setCollegesLoading(false);
      }
    };

    loadColleges();
  }, []);

  // Load forums when college and role are selected
  useEffect(() => {
    const loadForums = async () => {
      if (selectedCollegeId && selectedRole === "forum_head") {
        try {
          setForumsLoading(true);
          setForumsError("");
          setSelectedForumId(""); // Reset forum selection
          const forumsData = await fetchForumsByCollege(selectedCollegeId);
          setForums(forumsData);
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to load forums";
          setForumsError(errorMessage);
          Alert.alert("Error", errorMessage);
          setForums([]);
        } finally {
          setForumsLoading(false);
        }
      } else {
        // Clear forum data when not needed
        setForums([]);
        setSelectedForumId("");
        setForumsError("");
      }
    };

    loadForums();
  }, [selectedCollegeId, selectedRole]);

  // Handle auth errors
  useEffect(() => {
    if (error) {
      Alert.alert("Registration Failed", error, [
        { text: "OK", onPress: clearError },
      ]);
    }
  }, [error]);

  // Convert colleges to picker format
  const collegeOptions = colleges.map((college) => ({
    label: college.name,
    value: college.id,
  }));

  // Convert forums to picker format
  const forumOptions = forums.map((forum) => ({
    label: forum.name,
    value: forum.id,
  }));

  // Form validation
  const validateForm = (): boolean => {
    const newErrors = {
      fullName: "",
      email: "",
      password: "",
      college: "",
      forum: "",
    };

    let isValid = true;

    // Full name validation
    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
      isValid = false;
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
      isValid = false;
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Password validation
    if (!password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    // College validation
    if (!selectedCollegeId) {
      newErrors.college = "Please select a college";
      isValid = false;
    }

    // Forum validation (only for forum heads)
    if (selectedRole === "forum_head" && !selectedForumId) {
      newErrors.forum = "Please select a forum";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleRegister = async () => {
    if (!validateForm()) return;

    const formData: RegisterFormData = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      collegeId: selectedCollegeId,
      role: selectedRole,
      ...(selectedRole === "forum_head" &&
        selectedForumId && { forumId: selectedForumId }),
    };

    const success = await register(formData);
    if (success) {
      navigation.navigate("OtpVerification", {
        email: email.trim().toLowerCase(),
        fullName: fullName.trim(),
      });
    }
  };

  // Handle role change
  const handleRoleChange = (role: string) => {
    setSelectedRole(role as "student" | "teacher" | "forum_head");
    // Reset forum selection when role changes
    if (role !== "forum_head") {
      setSelectedForumId("");
      setForums([]);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Navigate back to login
  const handleBackToLogin = () => {
    navigation.goBack();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      flexGrow: 1,
    },
    content: {
      paddingHorizontal: 24,
      paddingTop: 60,
      paddingBottom: 40,
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginBottom: 32,
    },
    formContainer: {
      marginBottom: 24,
    },
    registerButton: {
      marginBottom: 24,
    },
    loginContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    loginText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginRight: 8,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginTop: 16,
    },
    loginButton: {
      paddingHorizontal: 0,
      paddingVertical: 0,
    },
  });

  const insets = useSafeAreaInsets();

  // Show loading screen while fetching colleges
  if (collegesLoading) {
    return (
      <View
        style={[
          styles.container,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading colleges...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer,
            { paddingBottom: insets.bottom },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join UniBook today</Text>

            <View style={styles.formContainer}>
              <StyledTextInput
                label="Full Name"
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your full name"
                autoCapitalize="words"
                error={errors.fullName}
                leftElement={
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={theme.colors.textSecondary}
                  />
                }
              />

              <StyledTextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                error={errors.email}
                leftElement={
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={theme.colors.textSecondary}
                  />
                }
              />

              <StyledTextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                error={errors.password}
                leftElement={
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={theme.colors.textSecondary}
                  />
                }
                rightElement={
                  <TouchableOpacity onPress={togglePasswordVisibility}>
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={24}
                      color={theme.colors.textSecondary}
                    />
                  </TouchableOpacity>
                }
              />

              <StyledPicker
                label="College"
                placeholder="Select your college"
                items={collegeOptions}
                selectedValue={selectedCollegeId}
                onValueChange={setSelectedCollegeId}
                error={errors.college}
                disabled={collegesLoading}
              />

              <StyledPicker
                label="Role"
                placeholder="Select your role"
                items={roleOptions}
                selectedValue={selectedRole}
                onValueChange={handleRoleChange}
                disabled={
                  collegesLoading ||
                  selectedCollegeId === "" ||
                  !selectedCollegeId
                }
              />

              {selectedRole === "forum_head" && (
                <StyledPicker
                  label="Forum"
                  placeholder={
                    forumsLoading ? "Loading forums..." : "Select a forum"
                  }
                  items={forumOptions}
                  selectedValue={selectedForumId}
                  onValueChange={setSelectedForumId}
                  error={errors.forum}
                  disabled={forumsLoading || !selectedCollegeId}
                />
              )}
            </View>

            <StyledButton
              title="Create Account"
              onPress={handleRegister}
              loading={isLoading}
              disabled={collegesLoading}
              style={styles.registerButton}
            />

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account?</Text>
              <StyledButton
                title="Login"
                variant="text"
                onPress={handleBackToLogin}
                style={styles.loginButton}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default RegisterScreen;
