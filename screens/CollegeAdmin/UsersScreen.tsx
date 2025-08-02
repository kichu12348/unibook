import React, { useEffect, useMemo, useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCollegeAdminStore } from "../../store/collegeAdminStore";
import { User } from "../../api/collegeAdmin";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute, useIsFocused } from "@react-navigation/native";
import { CollegeAdminTabParamList } from "../../navigation/types";
import StyledButton from "../../components/StyledButton";
import StyledTextInput from "../../components/StyledTextInput";
import { useDebounce } from "../../hooks/useDebounce";

type UsersScreenRouteProp = RouteProp<CollegeAdminTabParamList, "Users">;

const UsersScreen: React.FC = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const route = useRoute<UsersScreenRouteProp>();
  const isFocused = useIsFocused();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    users,
    isLoading,
    isSearchingUsers,
    getUsers,
    approveUser,
    rejectUser,
    deleteUser,
  } = useCollegeAdminStore();

  const filter = route.params?.filter;

  useEffect(() => {
    if (isFocused) {
      getUsers(debouncedSearchTerm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused, debouncedSearchTerm]);

  // --- MODIFIED APPROVAL LOGIC ---
  const handleApprove = (user: User) => {
    if (user.role === "forum_head") {
      // Find the specific unverified forum association from the user data
      const pendingForum = user.forum_heads?.find((fh) => !fh.isVerified);

      if (!pendingForum) {
        Alert.alert(
          "Approval Error",
          "Could not find a pending forum for this user. They may already be approved or their registration is incomplete."
        );
        return;
      }

      const { forumId, forum } = pendingForum;
      Alert.alert(
        "Approve Forum Head",
        `Are you sure you want to approve ${user.fullName} for the "${forum.name}" forum?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Approve", onPress: () => approveUser(user.id, forumId) },
        ]
      );
    } else {
      // For teachers
      Alert.alert(
        "Approve User",
        `Are you sure you want to approve ${user.fullName}?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Approve", onPress: () => approveUser(user.id) },
        ]
      );
    }
  };

  const handleReject = (user: User) => {
    if (user.role === "forum_head") {
      const pendingForum = user.forum_heads?.find((fh) => !fh.isVerified);

      if (!pendingForum) {
        Alert.alert(
          "Approval Error",
          "Could not find a pending forum for this user. They may already be approved or their registration is incomplete."
        );
        return;
      }

      const { forumId, forum } = pendingForum;
      Alert.alert(
        "Approve Forum Head",
        `Are you sure you want to approve ${user.fullName} for the "${forum.name}" forum?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Reject",
            onPress: () => rejectUser(user.id, forumId),
            style: "destructive",
          },
        ]
      );
    } else {
      // For teachers
      Alert.alert(
        "Approve User",
        `Are you sure you want to approve ${user.fullName}?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Reject",
            onPress: () => rejectUser(user.id),
            style: "destructive",
          },
        ]
      );
    }
  };

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setSearchTerm("");
    await getUsers();
    setIsRefreshing(false);
  }, [getUsers]);

  const filteredUsers = useMemo(() => {
    if (filter === "pending") {
      return users.filter((user) => user.approvalStatus === "pending");
    }
    return users;
  }, [users, filter]);

  const handleDelete = (userId: string) => {
    Alert.alert("Delete User", "This action is permanent. Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteUser(userId),
      },
    ]);
  };
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "approved":
        return {
          borderColor: theme.colors.success,
          color: theme.colors.success,
        };
      case "pending":
        return {
          borderColor: theme.colors.warning,
          color: theme.colors.warning,
        };
      case "rejected":
        return { borderColor: theme.colors.error, color: theme.colors.error };
      default:
        return {
          borderColor: theme.colors.textSecondary,
          color: theme.colors.textSecondary,
        };
    }
  };

  const UserCard = ({ item }: { item: User }) => {
    const statusStyle = getStatusStyle(item.approvalStatus);
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.userName}>{item.fullName}</Text>
          <View
            style={[
              styles.statusBadge,
              { borderColor: statusStyle.borderColor },
            ]}
          >
            <Text style={[styles.statusText, { color: statusStyle.color }]}>
              {item.approvalStatus}
            </Text>
          </View>
        </View>
        <Text style={styles.userEmail}>{item.email}</Text>
        <Text style={styles.userRole}>Role: {item.role.replace("_", " ")}</Text>
        {item.approvalStatus === "pending" && (
          <View style={styles.actionsContainer}>
            <StyledButton
              title="Reject"
              onPress={() => handleReject(item)}
              variant="secondary"
              size="small"
              style={styles.actionButton}
            />
            <StyledButton
              title="Approve"
              onPress={() => handleApprove(item)}
              size="small"
              style={styles.actionButton}
            />
          </View>
        )}
        {item.approvalStatus !== "pending" && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.deleteIcon}
              onPress={() => handleDelete(item.id)}
            >
              <Ionicons
                name="trash-outline"
                size={20}
                color={theme.colors.error}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
      paddingHorizontal: 24,
      paddingTop: insets.top + 16,
      paddingBottom: 16,
    },
    title: { fontSize: 28, fontWeight: "bold", color: theme.colors.text },
    subtitle: { fontSize: 16, color: theme.colors.textSecondary, marginTop: 4 },
    searchContainer: { paddingHorizontal: 24, paddingBottom: 8 },
    listContainer: { paddingHorizontal: 24, paddingBottom: insets.bottom + 80 },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
      paddingTop: 60,
    },
    emptyText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 4,
    },
    userName: { fontSize: 16, fontWeight: "600", color: theme.colors.text },
    userEmail: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    userRole: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      textTransform: "capitalize",
    },
    statusBadge: {
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 2,
    },
    statusText: {
      fontSize: 10,
      fontWeight: "bold",
      textTransform: "uppercase",
    },
    actionsContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginTop: 16,
      alignItems: "center",
    },
    actionButton: { minWidth: 80, marginLeft: 8 },
    deleteIcon: { padding: 8 },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {filter === "pending" ? "Pending Approvals" : "All Users"}
        </Text>
        <Text style={styles.subtitle}>
          {filter === "pending"
            ? "Approve or reject new user requests"
            : "View and manage all users"}
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <StyledTextInput
          placeholder="Search by user name..."
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

      {(isLoading || isSearchingUsers) &&
      users.length === 0 &&
      !isRefreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          renderItem={UserCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {debouncedSearchTerm
                  ? `No users found for "${debouncedSearchTerm}"`
                  : "No users to display."}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default UsersScreen;
