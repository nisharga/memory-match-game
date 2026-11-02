import { colors } from "@/styles/colors";
import { Pause, RotateCcw } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

interface GameHeaderProps {
  title: string;
  onPause: () => void;
  onRestart: () => void;
}

function HeaderButton({ onPress, children }: { onPress: () => void; children: React.ReactNode }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: "center",
        justifyContent: "center",
        opacity: pressed ? 0.7 : 1,
      })}
    >
      {children}
    </Pressable>
  );
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
      <HeaderButton onPress={onPause}>
        <Pause size={18} color={colors.foreground} fill={colors.foreground} strokeWidth={0} />
      </HeaderButton>

      <Text className="two-xl-medium" style={{ color: colors.heading }}>
        {title}
      </Text>

      <HeaderButton onPress={onRestart}>
        <RotateCcw size={18} color={colors.foreground} strokeWidth={2} />
      </HeaderButton>
    </View>
  );
}
