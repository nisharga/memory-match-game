import { colors } from "@/styles";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import type { ReactNode } from "react";
import { Text, View } from "react-native";
import IconButton from "../ui/IconButton";
import Animate from "./Animate";

interface ScreenHeaderProps {
  title: string;
  left?: ReactNode;
  right?: ReactNode;
  className?: string;
  /** "center" (default) keeps title centred between slots; "left" aligns title beside the left slot */
  align?: "center" | "left";
  onPress?: () => void;
}

export default function ScreenHeader({
  title,
  left,
  right,
  className = "",
  align = "center",
  onPress,
}: ScreenHeaderProps) {
  if (align === "left") {
    return (
      <Animate type="fade-down" duration={400} distance={30}>
        <View className={`flex-row items-center gap-3 px-4 pt-2 pb-2 ${className}`}>
          <IconButton onPress={onPress}>
            <ChevronLeft size={26} color={colors.foreground} strokeWidth={2} />
          </IconButton>
          <Text className="three-xl-medium flex-1">{title}</Text>
          {right ? <View className="items-end">{right}</View> : null}
        </View>
      </Animate>
    );
  }

  return (
    <View className={`flex-row items-center px-4 pt-1 pb-2 ${className}`}>
      <View className="w-10">{left ?? null}</View>
      <View className="flex-1 items-center">
        <Text className="lg-medium">{title}</Text>
      </View>
      <View className="w-10 items-end">{right ?? null}</View>
    </View>
  );
}
