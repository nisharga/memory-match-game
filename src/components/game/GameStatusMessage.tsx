import { colors } from "@/styles/colors";
import { Text, View } from "react-native";

interface GameStatusMessageProps {
  message: string;
}

export default function GameStatusMessage({ message }: GameStatusMessageProps) {
  if (!message) return null;
  return (
    <View style={{ alignItems: "center", paddingVertical: 12 }}>
      <Text className="base-normal" style={{ color: colors.body }}>
        {message}
      </Text>
    </View>
  );
}
