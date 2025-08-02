import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Image, ImageContentFit } from "expo-image";
import { useTheme } from "../../hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ForumHeadStackParamList } from "../../navigation/ForumHeadNavigator";
import { useForumHeadStore } from "../../store/forumHeadStore";
import StyledButton from "../../components/StyledButton";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

type NavigationProp = NativeStackNavigationProp<ForumHeadStackParamList>;
type RouteProps = RouteProp<ForumHeadStackParamList, "CreateEventPreview">;

const CreateEventPreviewScreen: React.FC = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { eventData } = route.params;

  const { venues, isSubmitting, addEvent } = useForumHeadStore();
  const selectedVenue = venues.find((v) => v.id === eventData.venueId);

  const handleSubmit = async () => {
    const success = await addEvent(eventData);
    if (success) {
      navigation.pop(2); // Go back two screens (from Preview -> Form -> List)
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString || isNaN(new Date(dateString).getTime()))
      return "Invalid Date";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
    content: { padding: 24, paddingBottom: 120 },
    bannerContainer: {
      width: "100%",
      height: 250,
      borderRadius: 12,
      marginBottom: 16,
      justifyContent: "flex-end",
      overflow: "hidden", // Important for containing the gradient
      backgroundColor: theme.colors.surface,
    },
    bannerImage: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: "100%",
      height: "100%",
    },
    gradient: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: "60%", // Covers the bottom 60% of the image
    },
    eventName: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.colors.text,
      paddingHorizontal: 16,
      paddingBottom: 16,
      position: "relative", // Ensure it's on top of the gradient
    },
    detailRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 16,
    },
    iconContainer: { width: 30, alignItems: "center", paddingTop: 2 },
    detailTextContainer: { flex: 1, marginLeft: 12 },
    detailLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 4,
    },
    detailValue: { fontSize: 16, color: theme.colors.text, fontWeight: "500" },
    description: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      lineHeight: 24,
      marginTop: 8,
    },
    buttonContainer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: "row",
      padding: 24,
    },
    editButton: { flex: 1, marginRight: 8 },
    submitButton: { flex: 1, marginLeft: 8 },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Event Preview</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.bannerContainer}>
          {eventData.bannerImage && (
            <Image
              source={{
                uri: "https://assets.kichu.space/422870595_122095212344203418_2340982393893380870_n.png",
              }}
              style={styles.bannerImage}
              contentFit={(eventData.resizeMode as ImageContentFit) || "cover"}
            />
          )}
          <LinearGradient
            colors={[
              `${theme.colors.background}00`,
              `${theme.colors.background}99`,
              theme.colors.background,
            ]}
            style={styles.gradient}
          />
          <Text style={styles.eventName}>{eventData.name}</Text>
        </View>

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
              {formatDate(eventData.startTime)}
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
              {formatDate(eventData.endTime)}
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
              {selectedVenue?.name || "Not specified"}
            </Text>
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
            <Text style={styles.detailLabel}>Description</Text>
            <Text style={styles.description}>{eventData.description}</Text>
          </View>
        </View>
      </ScrollView>

      <View
        style={[styles.buttonContainer, { paddingBottom: insets.bottom + 24 }]}
      >
        <StyledButton
          title="Edit"
          variant="secondary"
          style={styles.editButton}
          onPress={() => navigation.goBack()}
        />
        <StyledButton
          title="Submit Event"
          style={styles.submitButton}
          onPress={handleSubmit}
          loading={isSubmitting}
        />
      </View>
    </View>
  );
};

export default CreateEventPreviewScreen;
