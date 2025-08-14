import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { CompositeNavigationProp } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SuperAdminTabParamList } from "../../navigation/types";
import { SuperAdminStackParamList } from "../../navigation/SuperAdmin/SuperAdminNavigator";
import { useTheme } from "../../hooks/useTheme";
import { useSuperAdminStore } from "../../store/superAdminStore";
import { College } from "../../api/superAdmin";
import StyledButton from "../../components/StyledButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Footer from "../../components/CommonFooter";

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<SuperAdminTabParamList, "Colleges">,
  NativeStackNavigationProp<SuperAdminStackParamList>
>;

const CollegeListTabScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { colleges, isLoading, error, getColleges, clearError } =
    useSuperAdminStore();

  useEffect(() => {
    loadColleges();
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error, [{ text: "OK", onPress: clearError }]);
    }
  }, [error]);

  const loadColleges = async () => {
    await getColleges();
  };

  const handleCreateCollege = () => {
    navigation.navigate("CreateCollege");
  };

  const handleCollegePress = (college: College) => {
    navigation.navigate("CollegeDetails", { collegeId: college.id });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderCollegeItem = ({ item }: { item: College }) => (
    <TouchableOpacity
      style={[styles.collegeCard, { borderColor: theme.colors.border }]}
      onPress={() => handleCollegePress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.collegeHeader}>
        <View style={styles.collegeInfo}>
          <Text style={[styles.collegeName, { color: theme.colors.text }]}>
            {item.name}
          </Text>
          <Text
            style={[
              styles.collegeDomain,
              { color: theme.colors.textSecondary },
            ]}
          >
            {item.domainName}
          </Text>
        </View>
        <View style={styles.collegeStatus}>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: item.hasPaid ? "#4CAF50" : "#FF9800" },
            ]}
          />
          <Text
            style={[
              styles.statusText,
              { color: item.hasPaid ? "#4CAF50" : "#FF9800" },
            ]}
          >
            {item.hasPaid ? "Paid" : "Unpaid"}
          </Text>
        </View>
      </View>

      <View style={styles.collegeDetails}>
        <View style={styles.detailItem}>
          <Ionicons
            name="calendar-outline"
            size={16}
            color={theme.colors.textSecondary}
          />
          <Text
            style={[styles.detailText, { color: theme.colors.textSecondary }]}
          >
            Created {item.createdAt ? formatDate(item.createdAt) : "N/A"}
          </Text>
        </View>
      </View>

      <View style={styles.arrowContainer}>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={theme.colors.textSecondary}
        />
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons
        name="school-outline"
        size={64}
        color={theme.colors.textSecondary}
      />
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        No Colleges Found
      </Text>
      <Text
        style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}
      >
        Create your first college to get started
      </Text>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
    },
    header: {
      paddingHorizontal: 24,
      paddingBottom: 24,
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
      marginBottom: 24,
    },
    createButton: {
      marginBottom: 16,
    },
    list: {
      flex: 1,
      paddingHorizontal: 24,
    },
    collegeCard: {
      borderRadius: 12,
      borderWidth: 1,
      padding: 16,
      marginBottom: 12,
      backgroundColor: theme.colors.surface,
    },
    collegeHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 12,
    },
    collegeInfo: {
      flex: 1,
    },
    collegeName: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 4,
    },
    collegeDomain: {
      fontSize: 14,
      fontWeight: "500",
    },
    collegeStatus: {
      flexDirection: "row",
      alignItems: "center",
    },
    statusIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 6,
    },
    statusText: {
      fontSize: 12,
      fontWeight: "500",
    },
    collegeDetails: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    detailItem: {
      flexDirection: "row",
      alignItems: "center",
    },
    detailText: {
      fontSize: 12,
      marginLeft: 6,
    },
    arrowContainer: {
      position: "absolute",
      right: 16,
      top: "50%",
      transform: [{ translateY: -10 }],
    },
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 48,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: "600",
      marginTop: 16,
      marginBottom: 8,
    },
    emptySubtitle: {
      fontSize: 14,
      textAlign: "center",
      lineHeight: 20,
    },
  });

  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Colleges</Text>
        <Text style={styles.subtitle}>
          Manage colleges and their administrators
        </Text>
        <StyledButton
          title="Create New College"
          onPress={handleCreateCollege}
          style={styles.createButton}
        />
      </View>

      <View style={styles.list}>
        <FlatList
          data={colleges}
          renderItem={renderCollegeItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={loadColleges}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
              progressBackgroundColor={theme.colors.background}
            />
          }
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<Footer fontSize={18} />}
        />
      </View>
    </View>
  );
};

export default CollegeListTabScreen;
