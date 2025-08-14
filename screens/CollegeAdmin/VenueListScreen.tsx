import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../hooks/useTheme";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Venue } from "../../api/collegeAdmin";
import { ManagementStackParamList } from "../../navigation/CollegeAdmin/ManagementStack";

type NavigationProp = NativeStackNavigationProp<ManagementStackParamList>;

interface VenueListScreenProps {
  venues: Venue[];
  isLoading: boolean;
  searchTerm: string;
}

const VenueListScreen: React.FC<VenueListScreenProps> = ({
  venues,
  searchTerm,
  isLoading,
}) => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const VenueCard = ({ item }: { item: Venue }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("VenueDetails", { venueId: item.id })}
      activeOpacity={0.7}
    >
      <Text style={styles.cardTitle}>{item.name}</Text>
      <View style={styles.cardDetailRow}>
        <Ionicons
          name="people-outline"
          size={16}
          color={theme.colors.textSecondary}
        />
        <Text style={styles.cardDetailText}>Capacity: {item.capacity}</Text>
      </View>
      <View style={styles.cardDetailRow}>
        <Ionicons
          name="location-outline"
          size={16}
          color={theme.colors.textSecondary}
        />
        {item.locationDetails && (
          <Text style={styles.cardDetailText}>{item.locationDetails}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    listContainer: {
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 150,
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
    cardDetailRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
    cardDetailText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginLeft: 8,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 80,
      backgroundColor: theme.colors.background,
    },
  });

  if (isLoading && venues.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={venues}
      renderItem={VenueCard}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No Venues Found</Text>
          <Text style={styles.emptySubtext}>
            {searchTerm
              ? "Try adjusting your search."
              : "Create a venue to get started."}
          </Text>
        </View>
      }
    />
  );
};

export default VenueListScreen;
