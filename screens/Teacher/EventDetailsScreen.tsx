// screens/Teacher/EventDetailsScreen.tsx
import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, RefreshControl } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { TeacherStackParamList } from "../../navigation/TeacherNavigator";
import { EventDetails } from "../../api/forum";
import { fetchPublicEventDetails } from "../../api/teacher";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image, ImageContentFit } from "expo-image";

type RouteProps = RouteProp<TeacherStackParamList, "EventDetails">;

const EventDetailsScreen: React.FC = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<RouteProps>();
  const { eventId } = route.params;

  const [event, setEvent] = useState<EventDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadEventDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchPublicEventDetails(eventId);
      setEvent(data);
    } catch (error) {
      Alert.alert("Error", "Could not load event details.", [{ text: "OK", onPress: () => navigation.goBack() }]);
    } finally {
      setIsLoading(false);
    }
  }, [eventId, navigation]);

  useEffect(() => {
    loadEventDetails();
  }, [loadEventDetails]);

  // Copied from ForumHead version, can be moved to a helper file
  const formatDate = (dateString: string) => new Date(dateString).toLocaleString("en-US", {
    month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"
  });

  const styles = createStyles(theme, insets);

  if (isLoading || !event) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={theme.colors.primary} /></View>;
  }

  return (
    <View style={styles.container}>
        {/* Header and other UI elements would be identical to the ForumHead version, minus any edit/delete buttons */}
        <Text>Details for {event.name}</Text>
    </View>
  );
};

// You can copy the styles and JSX from `screens/ForumHead/EventDetailsScreen.tsx`
// but REMOVE the header buttons for editing, and the "Staff" section.
// This will create a read-only view.

export default EventDetailsScreen;