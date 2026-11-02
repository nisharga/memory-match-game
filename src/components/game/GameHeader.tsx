import { colors } from "@/styles/colors";
import { Pause, RotateCcw } from "lucide-react-native";
import { Text, View } from "react-native";
import IconButton from "../ui/IconButton";

interface GameHeaderProps {
  title: string;
  onPause: () => void;
  onRestart: () => void;
}

export default function GameHeader({ title, onPause, onRestart }: GameHeaderProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 10,
      }}
    >
      <IconButton onPress={onPause}>
        <Pause size={18} color={colors.foreground} fill={colors.foreground} strokeWidth={0} />
      </IconButton>

      <Text className="two-xl-medium" style={{ color: colors.heading }}>
        {title}
      </Text>

      <IconButton onPress={onRestart}>
        <RotateCcw size={18} color={colors.foreground} strokeWidth={2} />
      </IconButton>
    </View>
  );
}
