import { View } from "react-native";
import StatItem from "./StatItem";

interface GameStatsProps {
  timeLeft: string;
  moves: number;
  maxMoves: number | undefined;
  pairsFound: number;
  totalPairs: number;
}

export default function GameStats({
  timeLeft,
  moves,
  maxMoves,
  pairsFound,
  totalPairs,
}: GameStatsProps) {
  const movesValue = maxMoves !== undefined ? `${moves}/${maxMoves}` : moves;
  return (
    <View style={{ flexDirection: "row", gap: 8, paddingHorizontal: 16 }}>
      <StatItem label="TIME LEFT" value={timeLeft} />
      <StatItem label="MOVES" value={movesValue} />
      <StatItem label="PAIRS" value={`${pairsFound}/${totalPairs}`} />
    </View>
  );
}
