import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";
import { User } from "../api/collegeAdmin";

interface UserMultiSelectProps {
  users: User[];
  selectedUserIds: string[];
  onSelectionChange: (selectedUserIds: string[]) => void;
  searchTerm: string;
  onSearchChange: (searchTerm: string) => void;
  isSearching?: boolean;
  title?: string;
  placeholder?: string;
}

const UserMultiSelect: React.FC<UserMultiSelectProps> = ({
  users,
  selectedUserIds,
  onSelectionChange,
  searchTerm,
  onSearchChange,
  isSearching = false,
  title = "Select Users",
  placeholder = "Search users...",
}) => {
  const theme = useTheme();

  const handleUserToggle = (userId: string) => {
    const isSelected = selectedUserIds.includes(userId);

    if (isSelected) {
      // Remove user from selection
      onSelectionChange(selectedUserIds.filter((id) => id !== userId));
    } else {
      // Add user to selection
      onSelectionChange([...selectedUserIds, userId]);
    }
  };

  const RenderUserItem = ({ item }: { item: User }) => {
    const isSelected = selectedUserIds.includes(item.id);

    return (
      <TouchableOpacity
        style={[
          styles.userItem,
          {
            backgroundColor: isSelected
              ? theme.colors.primary + "10"
              : theme.colors.surface,
            borderColor: isSelected
              ? theme.colors.primary
              : theme.colors.border,
          },
        ]}
        onPress={() => handleUserToggle(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: theme.colors.text }]}>
            {item.fullName}
          </Text>
          <Text
            style={[styles.userEmail, { color: theme.colors.textSecondary }]}
          >
            {item.email}
          </Text>
          <Text
            style={[styles.userRole, { color: theme.colors.textSecondary }]}
          >
            Role:{" "}
            {item.role
              .replace("_", " ")
              .toLowerCase()
              .replace(/\b\w/g, (l) => l.toUpperCase())}
          </Text>
        </View>

        <View
          style={[
            styles.checkbox,
            {
              backgroundColor: isSelected
                ? theme.colors.primary
                : "transparent",
              borderColor: theme.colors.primary,
            },
          ]}
        >
          {isSelected && (
            <Ionicons
              name="checkmark"
              size={16}
              color={theme.colors.background}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 12,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: 16,
      marginBottom: 16,
      height: 48,
    },
    searchIcon: {
      marginRight: 12,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.text,
      paddingVertical: 0,
      paddingHorizontal: 0,
    },
    loadingIndicator: {
      marginLeft: 8,
    },
    usersList: {
      flex: 1,
    },
    userItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      marginBottom: 8,
      justifyContent: "space-between",
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 4,
    },
    userEmail: {
      fontSize: 14,
      marginBottom: 2,
    },
    userRole: {
      fontSize: 12,
      textTransform: "capitalize",
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 4,
      borderWidth: 2,
      justifyContent: "center",
      alignItems: "center",
      marginLeft: 12,
    },
    selectedCount: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 40,
    },
    emptyText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
  });

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      {selectedUserIds.length > 0 && (
        <Text style={styles.selectedCount}>
          {selectedUserIds.length} user{selectedUserIds.length !== 1 ? "s" : ""}{" "}
          selected
        </Text>
      )}

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={theme.colors.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          value={searchTerm}
          onChangeText={onSearchChange}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary}
          style={styles.searchInput}
        />
        {isSearching && (
          <ActivityIndicator
            size="small"
            color={theme.colors.primary}
            style={styles.loadingIndicator}
          />
        )}
      </View>

      {users.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            {searchTerm
              ? "No users found matching your search."
              : "No users available."}
          </Text>
        </View>
      ) : (
        <View>
          {users.map((user) => (
            <RenderUserItem key={user.id} item={user} />
          ))}
        </View>
      )}
    </View>
  );
};

export default UserMultiSelect;
