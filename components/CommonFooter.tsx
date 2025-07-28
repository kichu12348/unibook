import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { useCallback } from "react";
import { useThemeStore } from "../store/themeStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Animated, {
  withRepeat,
  withTiming,
  useSharedValue,
  useAnimatedStyle,
  Easing,
  runOnJS,
} from "react-native-reanimated";

const AnimatedFontAwesome6 = Animated.createAnimatedComponent(
  FontAwesome6
) as React.ComponentType<typeof FontAwesome6>;

const AnimatedIonicons = Animated.createAnimatedComponent(
  Ionicons
) as any; 

const Footer = ({ marginTop = 80 }: { marginTop?: number }) => {
  const { colors } = useThemeStore((s) => s.currentTheme);
  const glow = useSharedValue(1);
  const [animationRunning, setAnimationRunning] = React.useState(false);
  const [isHeartPressed, setIsHeartPressed] = React.useState(false);

  const glowingStyle = useAnimatedStyle(() => ({
    opacity: glow.value,
    transform: [{ scale: glow.value * 0.2 + 0.9 }],
  }));
  const startGlowAnimation = useCallback(() => {
    if (animationRunning || isHeartPressed) return;
    setAnimationRunning(true);
    glow.value = withRepeat(
      withTiming(0.3, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      }),
      6,
      true,
      () => {
        glow.value = withTiming(1, { duration: 200 });
        runOnJS(setAnimationRunning)(false);
      }
    );
  }, []);

  const scale = useSharedValue(1);

  const handlePress = useCallback(() => {
    if (animationRunning || isHeartPressed) return;
    setIsHeartPressed(true);
    scale.value = withRepeat(
      withTiming(1.5, { duration: 300, easing: Easing.in(Easing.ease) }),
      3,
      true,
      () => {
        scale.value = withTiming(1, { duration: 300, easing: Easing.inOut(Easing.ease) });
        runOnJS(setIsHeartPressed)(false);
      }
    );
  }, [animationRunning]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const styles = StyleSheet.create({
    container: {
      marginTop,
      backgroundColor: colors.background,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 30,
    },
    textContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
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
      <View>
        <Pressable style={styles.textContainer} onPress={startGlowAnimation}>
          <Text style={styles.text}>Powered by IEDC Bootcamp CEC </Text>
          <AnimatedFontAwesome6
            name="bolt-lightning"
            size={16}
            color={animationRunning ? "#FFD700" : colors.textSecondary}
            style={glowingStyle}
          />
        </Pressable>
      </View>
      <Pressable style={styles.subText} onPress={handlePress}>
        <Text style={styles.opacityLow}>Made wid </Text>
        <AnimatedIonicons
          name="heart"
          size={16}
          color="red"
          style={animatedStyle}
        />
        <Text style={styles.opacityLow}> by kichu</Text>
      </Pressable>
    </View>
  );
};

export default Footer;
