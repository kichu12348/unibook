// screens/ForumHead/ManageCollaboratorsScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useForumHeadStore } from "../../store/forumHeadStore";
import { useAuthStore } from "../../store/authStore";
import { useDebounce } from "../../hooks/useDebounce";
import StyledTextInput from "../../components/StyledTextInput";
import StyledButton from "../../components/StyledButton";
import { Ionicons } from "@expo/vector-icons";

// Define your types for navigation
type RouteProps = RouteProp<
  { params: { eventId: string; eventName: string } },
  "params"
>;

const ManageCollaboratorsScreen: React.FC = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<RouteProps>();
  const { eventId, eventName } = route.params;

  const {
    searchedForums,
    isSearchingForums,
    searchAllForums,
    requestCollaboration,
    isSubmitting,
  } = useForumHeadStore();
  const user = useAuthStore((s) => s.user);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const organizingForum = user?.forum_heads?.find((fh) => fh.isVerified);
    const organizingForumId = organizingForum?.forumId;

    if (organizingForumId) {
      searchAllForums(debouncedSearchTerm, organizingForumId);
    }
  }, [debouncedSearchTerm, searchAllForums, user]);

  const ForumCard = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.college}>{item.college.name}</Text>
      </View>
      <StyledButton
        title="Request"
        size="small"
        onPress={() => requestCollaboration(eventId, item.id)}
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
      alignItems: "center",
      gap: 8,
    },
    title: { fontSize: 28, fontWeight: "bold", color: theme.colors.text },
    subtitle: { fontSize: 16, color: theme.colors.textSecondary, marginTop: 4 },
    searchContainer: { paddingHorizontal: 24, paddingBottom: 8 },
    listContainer: { paddingHorizontal: 24, paddingBottom: insets.bottom + 20 },
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
    info: { flex: 1, marginRight: 16 },
    name: { fontSize: 16, fontWeight: "600", color: theme.colors.text },
    college: { fontSize: 14, color: theme.colors.textSecondary, marginTop: 4 },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back"
            size={24}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Add Collaborator</Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            For: {eventName}
          </Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <StyledTextInput
          placeholder="Search for forums by name..."
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

      {isSearchingForums && (
        <ActivityIndicator
          style={{ marginTop: 20 }}
          size="large"
          color={theme.colors.primary}
        />
      )}

      <FlatList
        data={searchedForums}
        renderItem={ForumCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default ManageCollaboratorsScreen;
