import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ManagementStackParamList } from "../../navigation/CollegeAdmin/ManagementStack";
import { useTheme } from "../../hooks/useTheme";
import { useCollegeAdminStore } from "../../store/collegeAdminStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StyledTextInput from "../../components/StyledTextInput";
import StyledButton from "../../components/StyledButton";
import { TAB_BAR_HEIGHT } from "../../constants/constants";

type NavigationProp = NativeStackNavigationProp<ManagementStackParamList>;
type EditForumRouteProp = RouteProp<ManagementStackParamList, "EditForum">;

const EditForumScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<EditForumRouteProp>();
  const insets = useSafeAreaInsets();
  const { forum } = route.params;

  const { isCreatingForum, updateForum, deleteForum } = useCollegeAdminStore();

  const [name, setName] = useState(forum.name);
  const [description, setDescription] = useState(forum.description);
  const [errors, setErrors] = useState({ name: "", description: "" });

  const handleDelete = () => {
    Alert.alert(
      "Delete Forum",
      "Are you sure you want to permanently delete this forum? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const success = await deleteForum(forum.id);
            if (success) {
              // Navigate back twice to go from Edit -> Details -> List
              navigation.pop(2);
            }
          },
        },
      ]
    );
  };

  const validateForm = () => {
    const newErrors = { name: "", description: "" }; //check if all are the same
    if (name === forum.name && description === forum.description) return false;

    let isValid = true;
    if (!name.trim() || name.trim().length < 3) {
      newErrors.name = "Forum name must be at least 3 characters";
      isValid = false;
    }
    if (!description.trim() || description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const success = await updateForum(forum.id, { name, description });
    if (success) {
      navigation.goBack();
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingTop: insets.top + 16,
      paddingBottom: 16,
    },
    backButton: { marginRight: 16, padding: 8 },
    title: { fontSize: 24, fontWeight: "bold", color: theme.colors.text },
    content: { flex: 1 },
    scrollContent: { padding: 24 },
    footer: {
      marginTop: 16,
    },
  });

  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Forum</Text>
        </View>
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <StyledTextInput
            label="Forum Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter forum name"
            error={errors.name}
          />
          <StyledTextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Describe the purpose of this forum"
            multiline
            numberOfLines={10}
            error={errors.description}
          />
          <View style={styles.footer}>
            <StyledButton
              title={isCreatingForum ? "Saving..." : "Save Changes"}
              onPress={handleSave}
              loading={isCreatingForum}
              disabled={isCreatingForum}
            />
          </View>
          <StyledButton
            title="Delete Forum"
            onPress={handleDelete}
            variant="secondary"
            style={{ borderColor: theme.colors.error, marginTop: 24 }}
            textStyles={{ color: theme.colors.error }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default EditForumScreen;
