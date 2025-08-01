import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ManagementStackParamList } from "../../navigation/ManagementStack";
import { useCollegeAdminStore } from "../../store/collegeAdminStore";
import { Forum } from "../../api/collegeAdmin";
import StyledButton from "../../components/StyledButton";

type NavigationProp = NativeStackNavigationProp<ManagementStackParamList>;

const ForumsAndVenuesScreen: React.FC = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const isFocused = useIsFocused();
  const [activeTab, setActiveTab] = useState<'forums' | 'venues'>('forums');

  const { forums, isLoadingForums, getForums } = useCollegeAdminStore();

  useEffect(() => {
    if (isFocused) {
      getForums();
    }
  }, [isFocused, getForums]);

  const handleCreateForum = () => {
    navigation.navigate('CreateForum');
  };

  const handleCreateVenue = () => {
    navigation.navigate('CreateVenue');
  };

  const handleForumPress = (forumId: string) => {
    navigation.navigate('ForumDetails', { forumId });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingHorizontal: 24,
      paddingVertical: 16,
      paddingTop: insets.top + 16,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginBottom: 20,
    },
    tabContainer: {
      flexDirection: 'row',
      borderRadius: 12,
      padding: 4,
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: 'center',
    },
    activeTab: {
      backgroundColor: theme.colors.primary,
    },
    tabText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.textSecondary,
    },
    activeTabText: {
      color: theme.colors.background,
    },
    content: {
      flex: 1,
      padding: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 16,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 60,
    },
    emptyText: {
      fontSize: 18,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: 8,
    },
    emptySubtext: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: 24,
    },
    createButton: {
      marginTop: 20,
    },
    forumCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 16,
      marginBottom: 12,
    },
    forumName: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 8,
    },
    forumDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
      marginBottom: 12,
    },
    forumHeads: {
      fontSize: 12,
      color: theme.colors.primary,
      fontWeight: '500',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
    },
    loadingText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 12,
    },
  });

  const ForumCard: React.FC<{ forum: Forum }> = ({ forum }) => (
    <TouchableOpacity
      style={styles.forumCard}
      onPress={() => handleForumPress(forum.id)}
      activeOpacity={0.7}
    >
      <Text style={styles.forumName}>{forum.name}</Text>
      <Text style={styles.forumDescription} numberOfLines={3}>
        {forum.description}
      </Text>
      <Text style={styles.forumHeads}>
        {forum.heads?.length > 0 
          ? `${forum.heads.length} head${forum.heads.length !== 1 ? 's' : ''} assigned`
          : 'No heads assigned'
        }
      </Text>
    </TouchableOpacity>
  );

  const renderForumsTab = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Forums</Text>
      
      {isLoadingForums ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading forums...</Text>
        </View>
      ) : forums.length > 0 ? (
        <View>
          {forums.map((forum) => (
            <ForumCard key={forum.id} forum={forum} />
          ))}
          
          <StyledButton
            title="Create New Forum"
            onPress={handleCreateForum}
            style={styles.createButton}
          />
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No forums created yet</Text>
          <Text style={styles.emptySubtext}>
            Create your first forum to get started with organizing discussions and activities.
          </Text>
          
          <StyledButton
            title="Create New Forum"
            onPress={handleCreateForum}
            style={styles.createButton}
          />
        </View>
      )}
    </ScrollView>
  );

  const renderVenuesTab = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Venues</Text>
      
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>No venues created yet</Text>
        <Text style={styles.emptySubtext}>
          Add venues to help organize events and activities at specific locations.
        </Text>
        
        <StyledButton
          title="Create New Venue"
          onPress={handleCreateVenue}
          style={styles.createButton}
        />
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Forums & Venues</Text>
        <Text style={styles.subtitle}>
          Manage discussion forums and event venues for your college
        </Text>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'forums' && styles.activeTab]}
            onPress={() => setActiveTab('forums')}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.tabText, 
              activeTab === 'forums' && styles.activeTabText
            ]}>
              Forums
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'venues' && styles.activeTab]}
            onPress={() => setActiveTab('venues')}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.tabText, 
              activeTab === 'venues' && styles.activeTabText
            ]}>
              Venues
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === 'forums' ? renderForumsTab() : renderVenuesTab()}
    </View>
  );
};

export default ForumsAndVenuesScreen;
