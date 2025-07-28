import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { useThemeStore } from "../store/themeStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const Footer = ({ marginTop = 80 }: { marginTop?: number }) => {
  const { colors } = useThemeStore((s) => s.currentTheme);
  const styles = StyleSheet.create({
    container: {
      marginTop,
      backgroundColor: colors.background,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 30,
    },
    text: {
      color: colors.textSecondary,
      fontSize: 20,
      fontFamily: "Inter_600SemiBold",
      opacity: 0.5,
    },
    subText: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    opacityLow: {
      opacity: 0.5,
      color: colors.textSecondary,
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
    },
  });
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Powered by IEDC Bootcamp CEC{" "}
        <FontAwesome6
          name="bolt-lightning"
          size={16}
          color={colors.textSecondary}
        />
      </Text>
      <View style={styles.subText}>
        <Text style={styles.opacityLow}>Made wid </Text>
        <Ionicons name="heart" size={16} color="red" />
        <Text style={styles.opacityLow}> by kichu</Text>
      </View>
    </View>
  );
};

export default Footer;
