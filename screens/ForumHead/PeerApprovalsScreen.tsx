// screens/ForumHead/PeerApprovalsScreen.tsx
import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useForumHeadStore } from "../../store/forumHeadStore";
import { PendingHead } from "../../api/forum";
import StyledButton from "../../components/StyledButton";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";

const PeerApprovalsScreen: React.FC = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const {
    pendingHeads,
    isLoading,
    isSubmitting,
    getPendingHeads,
    approveHead,
    rejectHead,
  } = useForumHeadStore();

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getPendingHeads();
    }
  }, [getPendingHeads, isFocused]);

  const handleApprove = (user: PendingHead) => {
    Alert.alert(
      "Approve User",
      `Are you sure you want to approve ${user.fullName}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Approve", onPress: () => approveHead(user.id) },
      ]
    );
  };

  const handleReject = (user: PendingHead) => {
    Alert.alert(
      "Reject User",
      `Are you sure you want to reject ${user.fullName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: () => rejectHead(user.id),
        },
      ]
    );
  };

  const UserCard = ({ item }: { item: PendingHead }) => (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <View style={styles.userInfo}>
        <Text style={[styles.userName, { color: theme.colors.text }]}>
          {item.fullName}
        </Text>
        <Text style={[styles.userEmail, { color: theme.colors.textSecondary }]}>
          {item.email}
        </Text>
      </View>
      <View style={styles.actionsContainer}>
        <StyledButton
          title="Reject"
          variant="secondary"
          size="small"
          onPress={() => handleReject(item)}
          style={{ borderColor: theme.colors.error, marginRight: 8 }}
          textStyles={{ color: theme.colors.error }}
        />
        <StyledButton
          title="Approve"
          size="small"
          onPress={() => handleApprove(item)}
        />
      </View>
    </View>
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
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 60,
    },
    emptyText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
    card: { borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1 },
    userInfo: { marginBottom: 12 },
    userName: { fontSize: 16, fontWeight: "600" },
    userEmail: { fontSize: 14, marginTop: 4 },
    actionsContainer: { flexDirection: "row", justifyContent: "flex-end" },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Peer Approvals</Text>
        <Text style={styles.subtitle}>
          Manage pending requests for your forums
        </Text>
      </View>
      <FlatList
        data={pendingHeads}
        renderItem={UserCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={getPendingHeads}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="checkmark-done-circle-outline"
                size={48}
                color={theme.colors.textSecondary}
              />
              <Text style={[styles.emptyText, { marginTop: 16 }]}>
                No pending approvals at the moment.
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default PeerApprovalsScreen;
