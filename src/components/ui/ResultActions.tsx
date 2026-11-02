import { colors } from "@/styles/colors";
import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

// ─── Single animated button ───────────────────────────────────────────────────

interface ActionButtonProps {
  label: string;
  icon?: ReactNode;
  onPress: () => void;
  variant: "primary" | "secondary";
  flex?: number;
}

function ActionButton({ label, icon, onPress, variant, flex = 0 }: ActionButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
    flex: flex || undefined,
  }));

  const bg = variant === "primary" ? colors.primary : colors.surface;
  const textColor = variant === "primary" ? colors.primaryForeground : colors.foreground;
  const borderColor = variant === "secondary" ? colors.border : "transparent";

  return (
    <Animated.View style={animStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withTiming(0.96, { duration: 90 });
          opacity.value = withTiming(0.8, { duration: 90 });
        }}
        onPressOut={() => {
          scale.value = withTiming(1, { duration: 160 });
          opacity.value = withTiming(1, { duration: 160 });
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          backgroundColor: bg,
          borderRadius: 16,
          borderWidth: variant === "secondary" ? 1 : 0,
          borderColor,
          paddingVertical: 17,
          paddingHorizontal: 20,
        }}
      >
        {icon}
        <Text
          style={{
            color: textColor,
            fontSize: variant === "primary" ? 17 : 15,
            fontWeight: "700",
            letterSpacing: 0.2,
          }}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

// ─── Public API ───────────────────────────────────────────────────────────────

interface ResultAction {
  label: string;
  icon?: ReactNode;
  onPress: () => void;
}

interface ResultActionsProps {
  primary: ResultAction;
  secondaryLeft: ResultAction;
  secondaryRight: ResultAction;
}

export default function ResultActions({
  primary,
  secondaryLeft,
  secondaryRight,
}: ResultActionsProps) {
  return (
    <View style={{ gap: 12 }}>
      {/* Full-width primary */}
      <ActionButton {...primary} variant="primary" />

      {/* Side-by-side secondaries */}
      <View style={{ flexDirection: "row", gap: 10 }}>
        <ActionButton {...secondaryLeft} variant="secondary" flex={1} />
        <ActionButton {...secondaryRight} variant="secondary" flex={1} />
      </View>
    </View>
  );
}
