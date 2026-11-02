import { colors } from "@/styles/colors";
import { View } from "react-native";

interface GameProgressBarProps {
  /** 0 – 1, where 1 = full time remaining */
  progress: number;
}

export default function GameProgressBar({ progress }: GameProgressBarProps) {
  const clamped = Math.max(0, Math.min(1, progress));
  const fill = clamped > 0.4 ? colors.primary : clamped > 0.2 ? colors.warning : colors.destructive;

  return (
    <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
      <View
        style={{
          height: 8,
          backgroundColor: colors.muted,
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            height: 8,
            width: `${clamped * 100}%`,
            backgroundColor: fill,
            borderRadius: 4,
          }}
        />
      </View>
    </View>
  );
}
