import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { ManagementStackParamList } from "../../navigation/ManagementStack";
import { Venue, fetchVenueDetails } from "../../api/collegeAdmin";

type NavigationProp = NativeStackNavigationProp<ManagementStackParamList>;
type VenueDetailsRouteProp = RouteProp<
  ManagementStackParamList,
  "VenueDetails"
>;

const VenueDetailsScreen: React.FC = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<VenueDetailsRouteProp>();
  const { venueId } = route.params;

  const [venue, setVenue] = useState<Venue | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        setIsLoading(true);
        const venueData = await fetchVenueDetails(venueId);
        setVenue(venueData);
      } catch (error) {
        Alert.alert("Error", "Failed to load venue details.");
      } finally {
        setIsLoading(false);
      }
    };
    loadDetails();
  }, [venueId]);

  const handleEdit = () => {
    if (venue) {
      navigation.navigate("EditVenue", { venue });
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
    backButton: { padding: 8 },
    headerTitleContainer: { flex: 1, marginLeft: 16, marginRight: 16 },
    title: { fontSize: 28, fontWeight: "bold", color: theme.colors.text },
    editButton: {
      padding: 8,
      borderRadius: 20,
      borderWidth: 1.5,
      borderColor: theme.colors.primary,
      borderStyle: "dashed",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
    },
    content: { padding: 24 },
    detailItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 24,
    },
    iconContainer: { width: 40, alignItems: "center" },
    detailTextContainer: { marginLeft: 16 },
    detailLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 4,
    },
    detailValue: { fontSize: 18, fontWeight: "600", color: theme.colors.text },
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

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
        <View style={styles.headerTitleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {venue?.name}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={handleEdit}
          activeOpacity={0.7}
        >
          <Ionicons name="pencil" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <View style={styles.detailItem}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="people-outline"
              size={24}
              color={theme.colors.textSecondary}
            />
          </View>
          <View style={styles.detailTextContainer}>
            <Text style={styles.detailLabel}>Capacity</Text>
            <Text style={styles.detailValue}>{venue?.capacity}</Text>
          </View>
        </View>
        <View style={styles.detailItem}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="location-outline"
              size={24}
              color={theme.colors.textSecondary}
            />
          </View>
          <View style={styles.detailTextContainer}>
            <Text style={styles.detailLabel}>Location Details</Text>
            <Text style={styles.detailValue}>
              {venue?.locationDetails || "Not specified"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default VenueDetailsScreen;
