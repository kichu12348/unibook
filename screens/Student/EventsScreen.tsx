import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StudentStackParamList } from "../../navigation/Student/StudentNavigator";
import { useStudentStore } from "../../store/studentStore";
import { Event } from "../../api/student";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";

type NavigationProp = NativeStackNavigationProp<StudentStackParamList>;

const EventsScreen: React.FC = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { events, isLoading, getEvents } = useStudentStore();

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  const EventCard = ({ item }: { item: Event }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate("EventDetails", {
          eventId: item.id,
          eventName: item.name,
        })
      }
    >
      <View style={styles.cardBackground}>
        {item.bannerImage ? (
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
          colors={["transparent", theme.colors.surface]}
          style={styles.gradient}
        />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <View style={styles.cardDetailRow}>
          <Ionicons
            name="location-outline"
            size={16}
            color={theme.colors.text}
          />
          <Text style={styles.cardDetailText}>
            {item.venue?.name || "Venue TBD"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
      paddingHorizontal: 24,
      paddingTop: insets.top + 16,
      paddingBottom: 16,
    },
    title: { fontSize: 28, fontWeight: "bold", color: theme.colors.text },
    subtitle: { fontSize: 16, color: theme.colors.textSecondary, marginTop: 4 },
    listContainer: {
      paddingHorizontal: 24,
      paddingTop: 8,
      paddingBottom: insets.bottom + 80,
    },
    card: {
      minHeight: 220,
      borderRadius: 12,
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
    bannerImage: { width: "100%", height: "100%" },
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
    cardContent: { padding: 16 },
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
    emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    emptyText: { fontSize: 16, color: theme.colors.textSecondary },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Upcoming Events</Text>
        <Text style={styles.subtitle}>
          Discover what's happening at your college
        </Text>
      </View>
      {isLoading && events.length === 0 ? (
        <ActivityIndicator
          style={{ flex: 1 }}
          size="large"
          color={theme.colors.primary}
        />
      ) : (
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
              progressBackgroundColor={theme.colors.background}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No upcoming events found.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default EventsScreen;
