import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ForumHeadStackParamList } from "../../navigation/ForumHeadNavigator";
import { TAB_BAR_HEIGHT } from "../../constants/constants";
import { useForumHeadStore } from "../../store/forumHeadStore";
import { Event } from "../../api/forum";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import Footer from "../../components/CommonFooter";

type NavigationProp = NativeStackNavigationProp<ForumHeadStackParamList>;

const EventsScreen: React.FC = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

  const { events, isLoading, getEvents } = useForumHeadStore();

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const EventCard = ({ item }: { item: Event }) => {
    const hasImage = item.bannerImage && item.bannerImage.trim() !== "";

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate("EventDetails", { eventId: item.id })
        }
      >
        {/* Background Image and Gradient */}
        <View style={styles.cardBackground}>
          {hasImage ? (
            <Image
              source={{ uri: item.bannerImage }}
              style={styles.bannerImage}
              contentFit="cover"
            />
          ) : (
            <View style={styles.placeholderBackground}>
              <Ionicons
                name="calendar-outline"
                size={48}
                color={theme.colors.border}
              />
            </View>
          )}
          <LinearGradient
            colors={
              hasImage
                ? [
                    `${theme.colors.background}00`,
                    `${theme.colors.background}22`,
                    `${theme.colors.background}33`,
                    `${theme.colors.background}55`,
                    `${theme.colors.background}99`,
                    theme.colors.background,
                  ]
                : ["transparent", theme.colors.surface]
            }
            style={styles.gradient}
          />
        </View>

        {/* Content */}
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <View style={styles.cardDetailRow}>
            <Ionicons
              name="calendar-outline"
              size={16}
              color={theme.colors.text}
            />
            <Text style={styles.cardDetailText}>
              {formatDate(item.startTime)}
            </Text>
          </View>
          <View style={styles.cardDetailRow}>
            <Ionicons
              name="location-outline"
              size={16}
              color={theme.colors.text}
            />
            <Text style={styles.cardDetailText}>{item.venue?.name || ""}</Text>
          </View>
          {/** Event Description */}
          <View style={styles.cardDetailRow}>
            <Ionicons
              name="document-text-outline"
              size={16}
              color={hasImage ? theme.colors.text : theme.colors.textSecondary}
            />
            <Text style={styles.cardDetailText}>
              {item.description.length < 25
                ? item.description
                : `${item.description.substring(0, 25)}...`}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
      paddingHorizontal: 24,
      paddingTop: insets.top + 16,
      paddingBottom: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.colors.primary,
      marginBottom: 8,
    },
    subtitle: { fontSize: 16, color: theme.colors.textSecondary },
    listContainer: {
      paddingHorizontal: 24,
      paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 80,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    emptyStateContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 48,
      paddingBottom: 80,
      marginTop:80
    },
    emptyStateIcon: { marginBottom: 16 },
    emptyStateText: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
      textAlign: "center",
    },
    emptyStateSubtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginTop: 8,
    },
    card: {
      minHeight: 220,
      borderRadius: 8,
      marginBottom: 16,
      overflow: "hidden",
      justifyContent: "flex-end",
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    cardBackground: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    bannerImage: {
      width: "100%",
      height: "100%",
    },
    placeholderBackground: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      justifyContent: "center",
      alignItems: "center",
    },
    gradient: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: "100%",
    },
    cardContent: {
      padding: 16,
      position: "relative", // Ensure content is on top of the background
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 8,
    },
    cardDetailRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
    cardDetailText: {
      fontSize: 14,
      color: theme.colors.text,
      marginLeft: 8,
      fontWeight: "500",
    },
    fab: {
      position: "absolute",
      bottom: TAB_BAR_HEIGHT + insets.bottom + 20,
      right: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      borderColor: theme.colors.primary,
      borderWidth: 1.5,
      borderStyle: "dashed",
      justifyContent: "center",
      alignItems: "center",
    },
  });

  const renderContent = () => {
    return (
      <FlatList
        data={events}
        renderItem={EventCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={getEvents}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyStateContainer}>
            <Ionicons
              name="calendar-outline"
              size={64}
              color={theme.colors.textSecondary}
              style={styles.emptyStateIcon}
            />
            <Text style={styles.emptyStateText}>No Events Found</Text>
            <Text style={styles.emptyStateSubtitle}>
              Create your first event to get started.
            </Text>
          </View>
        }
        ListFooterComponent={
          <Footer />
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Events</Text>
        <Text style={styles.subtitle}>Manage your forum's upcoming events</Text>
      </View>

      {renderContent()}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreateEvent")}
      >
        <Ionicons name="add" size={28} color={theme.colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

export default EventsScreen;
