import { colors } from "@/styles/colors";
import { Text, View } from "react-native";

interface StatItemProps {
  label: string;
  value: string | number;
}

function StatItem({ label, value }: StatItemProps) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border,
        paddingVertical: 10,
        paddingHorizontal: 10,
        gap: 2,
      }}
    >
      <Text className="stat-label">{label}</Text>
      <Text className="stat-value">{value}</Text>
    </View>
  );
}

interface GameStatsProps {
  timeLeft: string;
  moves: number;
  pairsFound: number;
  totalPairs: number;
}

export default function GameStats({ timeLeft, moves, pairsFound, totalPairs }: GameStatsProps) {
  return (
    <View style={{ flexDirection: "row", gap: 8, paddingHorizontal: 16 }}>
      <StatItem label="TIME LEFT" value={timeLeft} />
      <StatItem label="MOVES" value={moves} />
      <StatItem label="PAIRS" value={`${pairsFound}/${totalPairs}`} />
    </View>
  );
}
