import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ForumHeadStackParamList } from "../../navigation/ForumHead/ForumHeadNavigator";
import { useForumHeadStore } from "../../store/forumHeadStore";
import { useDebounce } from "../../hooks/useDebounce";
import StyledTextInput from "../../components/StyledTextInput";
import StyledButton from "../../components/StyledButton";
import { Ionicons } from "@expo/vector-icons";
import { Teacher } from "../../api/forum";

type NavigationProp = NativeStackNavigationProp<ForumHeadStackParamList>;
type RouteProps = RouteProp<ForumHeadStackParamList, "ManageStaff">;

const ManageStaffScreen: React.FC = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { eventId, eventName } = route.params;

  const {
    teachers,
    isSearchingTeachers,
    searchTeachers,
    requestStaff,
    isSubmitting,
  } = useForumHeadStore();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    searchTeachers(debouncedSearchTerm);
  }, [debouncedSearchTerm, searchTeachers]);

  const handleRequest = (teacher: Teacher) => {
    Alert.alert(
      "Confirm Request",
      `Are you sure you want to request ${teacher.fullName} to be a staff-in-charge for "${eventName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send Request",
          onPress: () => requestStaff(eventId, teacher.id),
        },
      ]
    );
  };

  const TeacherCard = ({ item }: { item: Teacher }) => (
    <View style={styles.card}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.fullName}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
      <StyledButton
        title="Request"
        size="small"
        onPress={() => handleRequest(item)}
        loading={isSubmitting}
      />
    </View>
  );

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
      paddingHorizontal: 24,
      paddingTop: insets.top + 16,
      paddingBottom: 16,
      flexDirection: "row",
      gap: 8,
      alignItems: "center",
    },
    title: { fontSize: 28, fontWeight: "bold", color: theme.colors.text },
    subtitle: { fontSize: 16, color: theme.colors.textSecondary, marginTop: 4 },
    searchContainer: { paddingHorizontal: 24, paddingBottom: 8 },
    listContainer: { paddingHorizontal: 24, paddingBottom: insets.bottom + 20 },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },
    emptyText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    userInfo: { flex: 1, marginRight: 16 },
    userName: { fontSize: 16, fontWeight: "600", color: theme.colors.text },
    userEmail: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Request Staff</Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            For: {eventName}
          </Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <StyledTextInput
          placeholder="Search for teachers by name..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          leftElement={
            <Ionicons
              name="search"
              size={20}
              color={theme.colors.textSecondary}
            />
          }
        />
      </View>

      {isSearchingTeachers && teachers.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={teachers}
          renderItem={TeacherCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {debouncedSearchTerm
                  ? `No teachers found for "${debouncedSearchTerm}"`
                  : "No teachers available."}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default ManageStaffScreen;
