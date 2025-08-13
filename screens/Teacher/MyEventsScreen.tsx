// screens/Teacher/MyEventsScreen.tsx
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
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TeacherStackParamList } from "../../navigation/TeacherNavigator";
import { useTeacherStore } from "../../store/teacherStore";
import { Event } from "../../api/forum";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";

type NavigationProp = NativeStackNavigationProp<TeacherStackParamList>;

const MyEventsScreen: React.FC = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { events, isLoading, getPublicEvents } = useTeacherStore();

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getPublicEvents();
    }
  }, [getPublicEvents, isFocused]);

  const EventCard = ({ item }: { item: Event }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigation.navigate("EventDetails", { eventId: item.id })}
    >
      {/* ... The exact same JSX for the card as in ForumHead's screen ... */}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  const styles = createStyles(theme); // Use a style factory

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>College Events</Text>
        <Text style={styles.subtitle}>All public events in your college</Text>
      </View>
      <FlatList
        data={events}
        renderItem={EventCard}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={getPublicEvents} />
        }
        // ... other FlatList props
      />
    </View>
  );
};

// Again, you can copy the full styles from `screens/ForumHead/EventsScreen.tsx`
// making sure to remove the `fab` style, as teachers cannot create events.
const createStyles = (theme: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: { paddingHorizontal: 24, paddingBottom: 16 },
    title: { fontSize: 28, fontWeight: "bold", color: theme.colors.text },
    subtitle: { fontSize: 16, color: theme.colors.textSecondary, marginTop: 4 },
    card: {
      minHeight: 220,
      borderRadius: 8,
      marginBottom: 16,
      overflow: "hidden",
    },
    cardContent: { padding: 16 },
    cardTitle: { fontSize: 20, fontWeight: "bold", color: theme.colors.text },
  });

export default MyEventsScreen;
