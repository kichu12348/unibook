import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ManagementStackParamList } from "../../navigation/CollegeAdmin/ManagementStack";
import { useCollegeAdminStore } from "../../store/collegeAdminStore";
import { useDebounce } from "../../hooks/useDebounce";
import { Ionicons } from "@expo/vector-icons";
import StyledTextInput from "../../components/StyledTextInput";
import ForumListScreen from "./ForumListScreen";
import VenueListScreen from "./VenueListScreen";
import { TAB_BAR_HEIGHT } from "../../constants/constants";

type NavigationProp = NativeStackNavigationProp<ManagementStackParamList>;

const ForumsAndVenuesScreen: React.FC = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const isFocused = useIsFocused();

  const [activeTab, setActiveTab] = useState<"forums" | "venues">("forums");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const {
    forums,
    isLoadingForums,
    getForums,
    venues,
    isSearchingVenues,
    isLoadingVenues,
    getVenues,
  } = useCollegeAdminStore();

  useEffect(() => {
    if (isFocused) {
      getForums();
      getVenues();
      setSearchTerm("");
    }
  }, [isFocused]);

  useEffect(() => {
    if (debouncedSearchTerm.trim() === "" || debouncedSearchTerm.length < 3)
      return;
    if (activeTab === "forums") {
      getForums(debouncedSearchTerm);
    } else {
      getVenues(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  const filteredForums = useMemo(() => {
    if (!debouncedSearchTerm) return forums;
    return forums.filter((forum) =>
      forum.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [forums, debouncedSearchTerm]);

  const handleFabPress = () => {
    if (activeTab === "forums") {
      navigation.navigate("CreateForum");
    } else {
      navigation.navigate("CreateVenue");
    }
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
      color: theme.colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginBottom: 20,
    },
    tabContainer: {
      flexDirection: "row",
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 4,
    },
    tab: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 8,
      alignItems: "center",
    },
    activeTab: { backgroundColor: theme.colors.primary },
    tabText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.textSecondary,
    },
    activeTabText: { color: theme.colors.background },
    content: { flex: 1 },
    searchContainer: { paddingHorizontal: 24 },
    fab: {
      position: "absolute",
      bottom: TAB_BAR_HEIGHT + insets.bottom + 20,
      right: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      borderWidth: 2,
      borderColor: theme.colors.primary,
      borderStyle: "dashed",
      justifyContent: "center",
      alignItems: "center",
    },
  });

  const renderContent = () => {
    if (activeTab === "forums") {
      return (
        <ForumListScreen
          forums={filteredForums}
          isLoading={isLoadingForums}
          searchTerm={debouncedSearchTerm}
        />
      );
    }
    // Venues Tab
    return (
      <VenueListScreen
        venues={venues}
        searchTerm={debouncedSearchTerm}
        isLoading={isLoadingVenues || isSearchingVenues}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Management</Text>
        <Text style={styles.subtitle}>Manage forums and event venues</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "forums" && styles.activeTab]}
            onPress={() => setActiveTab("forums")}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "forums" && styles.activeTabText,
              ]}
            >
              Forums
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "venues" && styles.activeTab]}
            onPress={() => setActiveTab("venues")}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "venues" && styles.activeTabText,
              ]}
            >
              Venues
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <StyledTextInput
          placeholder={
            activeTab === "forums" ? "Search forums..." : "Search venues..."
          }
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

      <View style={styles.content} onTouchStart={Keyboard.dismiss}>
        {renderContent()}
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={handleFabPress}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color={theme.colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

export default ForumsAndVenuesScreen;
