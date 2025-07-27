import React, { useMemo } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ColorValue,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme"; 
import { Theme } from "../styles/theme";

// --- Constants ---
const TAB_BAR_HEIGHT = 80;
const TIMING_CONFIG = { 
  duration: 200,
  easing: Easing.inOut(Easing.ease),
};
// --- Types ---
interface TabItem {
  name: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface CustomTabNavigatorProps {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (tabName: string) => void;
}

interface TextRevealTabProps {
  tab: TabItem;
  isActive: boolean;
  onPress: (name: string) => void;
}

// --- Style Factory ---
const getStyles = (theme: Theme, insets: { bottom: number }) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: TAB_BAR_HEIGHT + insets.bottom,
    },
    gradient: {
      flex: 1,
      paddingBottom: insets.bottom,
    },
    tabBar: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
    },
    // Styles for the TextRevealTab child component
    tabContainer: {
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      height: 52,
      borderRadius: 26,
      paddingHorizontal: 14,
    },
    animatedLabelContainer: {
      overflow: "hidden",
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
    },
  });

// --- Child Component for Individual Tabs ---
const TextRevealTab: React.FC<TextRevealTabProps> = React.memo(
  ({ tab, isActive, onPress }) => {
    const theme = useTheme();
    const styles = useMemo(() => getStyles(theme, { bottom: 0 }), [theme]);

    // Animate the background color of the tab container
    const animatedContainerStyle = useAnimatedStyle(() => {
      return {
        backgroundColor: withTiming(
          isActive ? theme.colors.primary : "transparent",
          TIMING_CONFIG
        ),
      };
    });
    const animatedLabelContainerStyle = useAnimatedStyle(() => {
      return {
        maxWidth: withTiming(isActive ? 80 : 0, TIMING_CONFIG),
        marginLeft: withTiming(isActive ? 8 : 0, TIMING_CONFIG),
        opacity: withTiming(isActive ? 1 : 0, TIMING_CONFIG),
      };
    });

    return (
      <TouchableOpacity onPress={() => onPress(tab.name)} activeOpacity={0.8}>
        <Animated.View style={[styles.tabContainer, animatedContainerStyle]}>
          <Ionicons
            name={tab.icon}
            size={24}
            color={isActive ? theme.colors.background : theme.colors.primary}
          />
          <Animated.View
            style={[styles.animatedLabelContainer, animatedLabelContainerStyle]}
          >
            <Text
              style={[
                styles.label,
                {
                  color: isActive
                    ? theme.colors.background
                    : theme.colors.primary,
                },
              ]}
              numberOfLines={1}
            >
              {tab.label}
            </Text>
          </Animated.View>
        </Animated.View>
      </TouchableOpacity>
    );
  }
);

// --- Main Tab Navigator Component ---
const CustomTabNavigator: React.FC<CustomTabNavigatorProps> = ({
  tabs,
  activeTab,
  onTabPress,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => getStyles(theme, insets), [theme, insets]);

  const gradientColors = useMemo(
    () => [
      `${theme.colors.background}00`, // Transparent
      `${theme.colors.background}CC`, // 80% opaque
      `${theme.colors.background}FF`, // Fully opaque
    ],
    [theme.colors.background]
  );

  return (
    <View style={styles.container} pointerEvents="box-none">
      <LinearGradient
        colors={gradientColors as [ColorValue, ColorValue, ColorValue]}
        locations={[0, 0.2, 1]}
        style={styles.gradient}
        pointerEvents="auto"
      >
        <View style={styles.tabBar}>
          {tabs.map((tab) => (
            <TextRevealTab
              key={tab.name}
              tab={tab}
              isActive={tab.name === activeTab}
              onPress={onTabPress}
            />
          ))}
        </View>
      </LinearGradient>
    </View>
  );
};

export default React.memo(CustomTabNavigator);
