import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ManagementStackParamList } from "../../navigation/ManagementStack";
import { useTheme } from "../../hooks/useTheme";

type NavigationProp = NativeStackNavigationProp<ManagementStackParamList>;

interface ForumListScreenProps {
  forums: { id: string; name: string; description: string }[];
  isLoading: boolean;
  searchTerm: string;
}

const ForumListScreen: React.FC<ForumListScreenProps> = ({
  forums,
  isLoading,
  searchTerm,
}) => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const ForumCard = ({ item }: { item: { id: string; name: string; description: string } }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("ForumDetails", { forumId: item.id })}
      activeOpacity={0.7}
    >
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardDescription} numberOfLines={2}>
        {item.description}
      </Text>
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    listContainer: {
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 150,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 80,
    },
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 80,
      paddingHorizontal: 40,
    },
    emptyText: {
      fontSize: 18,
      color: theme.colors.text,
      fontWeight: "600",
      textAlign: "center",
      marginBottom: 8,
    },
    emptySubtext: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 8,
    },
    cardDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
      marginBottom: 12,
    },
    cardMeta: { fontSize: 12, color: theme.colors.primary, fontWeight: "500" },
  });

  if (isLoading && forums.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={forums}
      renderItem={ForumCard}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No Forums Found</Text>
          <Text style={styles.emptySubtext}>
            {searchTerm
              ? "Try adjusting your search."
              : "Create a forum to get started."}
          </Text>
        </View>
      }
    />
  );
};

export default ForumListScreen;
