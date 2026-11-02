import { useSound } from "@/hooks";
import { type ReactNode } from "react";
import { Pressable, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

interface IconButtonProps {
  children: ReactNode;
  onPress?: () => void;
  className?: string;
  badge?: boolean;
  hitSlop?: number;
  disabled?: boolean;
}

export default function IconButton({
  children,
  onPress,
  className = "",
  badge = false,
  hitSlop = 8,
  disabled = false,
}: IconButtonProps) {
  const { playSound } = useSound();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={animStyle}
      className={`relative items-center justify-center ${disabled ? "opacity-40" : ""} flex h-12 w-12 flex-row items-center justify-center rounded-xl bg-[#165253] ${className}`}
    >
      <Pressable
        onPress={() => {
          onPress?.();
          playSound("tap");
        }}
        disabled={disabled}
        hitSlop={hitSlop}
        onPressIn={() => {
          scale.value = withTiming(0.88, { duration: 90 });
          opacity.value = withTiming(0.7, { duration: 90 });
        }}
        onPressOut={() => {
          scale.value = withTiming(1, { duration: 160 });
          opacity.value = withTiming(1, { duration: 160 });
        }}
      >
        {children}
      </Pressable>

      {badge && <View className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />}
    </Animated.View>
  );
}
