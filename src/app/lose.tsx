import { Animate } from "@/components/common";
import ResultActions from "@/components/ui/ResultActions";
import StatBox from "@/components/ui/StatBox";
import { clearStatus, selectGame, selectLoseReason } from "@/redux/features/gameSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useResultMusic } from "@/hooks";
import { colors } from "@/styles/colors";
import { useRouter } from "expo-router";
import { Hourglass, Footprints, RefreshCw } from "lucide-react-native";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function ProgressBar({ found, total }: { found: number; total: number }) {
  const pct = total > 0 ? found / total : 0;
  return (
    <View style={{ gap: 8 }}>
      <View
        style={{ height: 10, backgroundColor: colors.muted, borderRadius: 6, overflow: "hidden" }}
      >
        <View
          style={{
            height: 10,
            width: `${pct * 100}%`,
            backgroundColor: colors.destructive,
            borderRadius: 6,
          }}
        />
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text className="sm-medium" style={{ color: colors.body }}>
          {found} pairs found
        </Text>
        <Text className="sm-medium" style={{ color: colors.mutedForeground }}>
          {total - found} remaining
        </Text>
      </View>
    </View>
  );
}

export default function LoseScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const game = useAppSelector(selectGame);
  const loseReason = useAppSelector(selectLoseReason);

  useResultMusic("lose");

  const isTimeUp = loseReason === "time";

  const timeUsed = game.totalSeconds - game.timeLeft;
  const timeLabel = `${Math.floor(timeUsed / 60)}:${String(timeUsed % 60).padStart(2, "0")}`;

  const title = isTimeUp ? "Time's Up!" : "Out of Moves!";
  const subtitle = isTimeUp
    ? `You found ${game.pairsFound} of ${game.totalPairs} pairs before time ran out.`
    : `You used all ${game.maxMoves} moves but only found ${game.pairsFound} of ${game.totalPairs} pairs.`;
  const tip = isTimeUp
    ? "Try to remember card positions before flipping a new pair."
    : "Focus on pairs you've already seen to use fewer moves.";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top", "bottom"]}>
      <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 24, gap: 24 }}>
        {/* Icon */}
        <Animate type="zoom-in" duration={400} style={{ alignItems: "center" }}>
          <View
            style={{
              width: 88,
              height: 88,
              borderRadius: 44,
              backgroundColor: colors.destructiveBg,
              borderWidth: 2,
              borderColor: colors.destructive,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isTimeUp ? (
              <Hourglass size={38} color={colors.destructive} strokeWidth={1.8} />
            ) : (
              <Footprints size={38} color={colors.destructive} strokeWidth={1.8} />
            )}
          </View>
        </Animate>

        {/* Title + subtitle */}
        <View style={{ alignItems: "center", gap: 8 }}>
          <Animate type="fade-down" duration={400} delay={100}>
            <Text className="four-xl-bold text-center" style={{ color: colors.heading }}>
              {title}
            </Text>
          </Animate>
          <Animate type="fade-up" duration={380} delay={160}>
            <Text className="base-normal text-center" style={{ color: colors.body }}>
              {subtitle}
            </Text>
          </Animate>
        </View>

        {/* Progress bar */}
        <Animate type="fade-up" duration={380} delay={220}>
          <ProgressBar found={game.pairsFound} total={game.totalPairs} />
        </Animate>

        {/* Stats */}
        <Animate type="fade-up" duration={380} delay={280}>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <StatBox label="TIME USED" value={timeLabel} />
            <StatBox label="MOVES" value={game.moves} />
          </View>
        </Animate>

        {/* Tip */}
        <Animate type="fade" duration={340} delay={340}>
          <Text className="sm-normal text-center" style={{ color: colors.mutedForeground }}>
            💡 {tip}
          </Text>
        </Animate>
      </View>

      {/* Actions */}
      <Animate type="fade-up" duration={380} delay={400} distance={30}>
        <View style={{ paddingHorizontal: 24, paddingBottom: 24, paddingTop: 8 }}>
          <ResultActions
            primary={{
              label: "Try again",
              icon: <RefreshCw size={18} color={colors.primaryForeground} strokeWidth={2.2} />,
              onPress: () => {
                dispatch(clearStatus());
                router.replace("/game");
              },
            }}
            secondaryLeft={{
              label: "Choose level",
              onPress: () => router.replace("/choose-level"),
            }}
            secondaryRight={{
              label: "Home",
              onPress: () => router.replace("/"),
            }}
          />
        </View>
      </Animate>
    </SafeAreaView>
  );
}
