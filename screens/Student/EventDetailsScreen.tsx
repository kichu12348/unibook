import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Linking,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StudentStackParamList } from "../../navigation/Student/StudentNavigator";
import { Event, fetchEventById } from "../../api/student";
import StyledButton from "../../components/StyledButton";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";

type NavigationProp = NativeStackNavigationProp<StudentStackParamList>;
type RouteProps = RouteProp<StudentStackParamList, "EventDetails">;

const EventDetailsScreen: React.FC = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { eventId } = route.params;

  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchEventById(eventId);
      setEvent(data);
    } catch (error) {
      Alert.alert("Error", "Could not load event details.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [eventId, navigation]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  const handleRegister = () => {
    if (event?.registrationLink) {
      Linking.openURL(event.registrationLink).catch(() =>
        Alert.alert("Error", "Could not open the registration link.")
      );
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
    },
    header: { position: "absolute", top: insets.top, left: 16, zIndex: 10 },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    content: { paddingBottom: 120 },
    bannerContainer: {
      width: "100%",
      height: 300,
      backgroundColor: theme.colors.surface,
    },
    bannerImage: { width: "100%", height: "100%" },
    gradient: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: "60%",
    },
    eventName: {
      fontSize: 32,
      fontWeight: "bold",
      color: theme.colors.text,
      paddingHorizontal: 24,
      marginTop: -60,
      marginBottom: 24,
    },
    detailsSection: { paddingHorizontal: 24 },
    detailRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 20,
    },
    iconContainer: { width: 30, alignItems: "center", paddingTop: 2 },
    detailTextContainer: { flex: 1, marginLeft: 16 },
    detailLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 4,
    },
    detailValue: { fontSize: 16, color: theme.colors.text, fontWeight: "500" },
  });

  if (isLoading || !event) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => navigation.goBack()}
      >
        <Ionicons
          name="chevron-back-circle"
          size={32}
          color={theme.colors.primary}
        />
      </TouchableOpacity>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={loadDetails} />
        }
      >
        <View style={styles.bannerContainer}>
          {event.bannerImage && (
            <Image
              source={{ uri: event.bannerImage }}
              style={styles.bannerImage}
              contentFit={event.resizeMode || "cover"}
            />
          )}
          <LinearGradient
            colors={[
              "transparent",
              `${theme.colors.background}99`,
              theme.colors.background,
            ]}
            style={styles.gradient}
          />
        </View>
        <Text style={styles.eventName}>{event.name}</Text>
        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="time-outline"
                size={24}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Start Time</Text>
              <Text style={styles.detailValue}>
                {formatDate(event.startTime)}
              </Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="flag-outline"
                size={24}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>End Time</Text>
              <Text style={styles.detailValue}>
                {formatDate(event.endTime)}
              </Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="location-outline"
                size={24}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Venue</Text>
              <Text style={styles.detailValue}>
                {event.venue?.name || "Not specified"}
              </Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="person-outline"
                size={24}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Organizer</Text>
              <Text style={styles.detailValue}>{event.forum.name}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="document-text-outline"
                size={24}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>About</Text>
              <Text style={[styles.detailValue, { lineHeight: 24 }]}>
                {event.description}
              </Text>
            </View>
          </View>
          {event.registrationLink && (
            <StyledButton
              title="Register for Event"
              onPress={handleRegister}
              style={{ marginTop: 24 }}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default EventDetailsScreen;
