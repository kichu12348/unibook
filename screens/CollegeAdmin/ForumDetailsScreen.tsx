import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { ManagementStackParamList } from "../../navigation/ManagementStack";
import { Forum, fetchForumDetails } from "../../api/collegeAdmin";
import { useCollegeAdminStore } from "../../store/collegeAdminStore";
import { TAB_BAR_HEIGHT } from "../../constants/constants";

type NavigationProp = NativeStackNavigationProp<ManagementStackParamList>;
type ForumDetailsRouteProp = RouteProp<
  ManagementStackParamList,
  "ForumDetails"
>;

const ForumDetailsScreen: React.FC = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ForumDetailsRouteProp>();
  const { forumId } = route.params;

  const [forum, setForum] = useState<Forum | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const forumData = await fetchForumDetails(forumId);
      setForum(forumData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load forum details";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [forumId]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleEdit = () => {
    if (forum) {
      navigation.navigate("EditForum", { forum });
    } else {
      Alert.alert("Error", "Could not find forum details to edit.");
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingVertical: 16,
      paddingTop: insets.top + 16,
    },
    backButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
    },
    backButtonText: {
      fontSize: 16,
      color: theme.colors.primary,
      marginLeft: 8,
      fontWeight: "500",
    },
    headerTitleContainer: { flex: 1, marginLeft: 16, marginRight: 16 },
    title: { fontSize: 28, fontWeight: "bold", color: theme.colors.text },
    editButton: {
      padding: 8,
      borderRadius: 20,
      borderWidth: 1.5,
      borderColor: theme.colors.primary,
      borderStyle: "dashed",
    },
    content: { flex: 1, padding: 24 },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      backgroundColor: theme.colors.background,
      alignItems: "center",
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 24,
      backgroundColor: theme.colors.background,
    },
    errorText: {
      fontSize: 16,
      color: theme.colors.error,
      textAlign: "center",
      marginBottom: 16,
    },
    retryButton: {
      borderWidth: 2,
      borderColor: theme.colors.primary,
      borderStyle: "dashed",
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    retryButtonText: {
      color: theme.colors.primary,
      fontSize: 16,
      fontWeight: "600",
    },
    section: { marginBottom: 32 },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 16,
    },
    description: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      lineHeight: 24,
    },
    headItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      padding: 16,
      borderRadius: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    headInfo: { flex: 1, marginLeft: 12 },
    headName: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 4,
    },
    headEmail: { fontSize: 14, color: theme.colors.textSecondary },
    headIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary + "20",
      justifyContent: "center",
      alignItems: "center",
    },
    emptyState: { paddingVertical: 24, alignItems: "center" },
    emptyText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
    eventsPlaceholder: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderStyle: "dashed",
      padding: 24,
      alignItems: "center",
    },
    placeholderText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginBottom: 8,
    },
    placeholderSubtext: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
    contentStyle: {
      paddingBottom: insets.bottom + 24 + TAB_BAR_HEIGHT,
    },
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.description, { marginTop: 16 }]}>
          Loading forum details...
        </Text>
      </View>
    );
  }

  if (error || !forum) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error || "Failed to load forum details"}
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            navigation.goBack();
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
          activeOpacity={0.7}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {forum.name}
          </Text>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Ionicons name="pencil" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentStyle}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchDetails}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
            progressBackgroundColor={theme.colors.background}
          />
        }
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{forum.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Forum Heads</Text>
          {forum.heads && forum.heads.length > 0 ? (
            forum.heads.map((head) => (
              <View key={head.id} style={styles.headItem}>
                <View style={styles.headIcon}>
                  <Ionicons
                    name="person"
                    size={20}
                    color={theme.colors.primary}
                  />
                </View>
                <View style={styles.headInfo}>
                  <Text style={styles.headName}>{head.fullName}</Text>
                  <Text style={styles.headEmail}>{head.email}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No forum heads assigned yet</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Organized Events</Text>
          <View style={styles.eventsPlaceholder}>
            <Ionicons
              name="calendar-outline"
              size={48}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.placeholderText}>Events Coming Soon</Text>
            <Text style={styles.placeholderSubtext}>
              Event management functionality will be available in future updates
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ForumDetailsScreen;
