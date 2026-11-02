import { View } from "react-native";
import StatItem from "./StatItem";

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
