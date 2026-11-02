import { Animate } from "@/components/common";
import Confetti from "@/components/ui/Confetti";
import ResultActions from "@/components/ui/ResultActions";
import StarRating from "@/components/ui/StarRating";
import StatBox from "@/components/ui/StatBox";
import { useResultMusic } from "@/hooks";
import { clearStatus, selectGame, selectStarsEarned } from "@/redux/features/gameSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { GameStorage } from "@/services/storages";
import { colors } from "@/styles/colors";
import { useRouter } from "expo-router";
import { Medal, Trophy } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function YouWinScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const game = useAppSelector(selectGame);
  const stars = useAppSelector(selectStarsEarned);

  useResultMusic("win");

  const timeUsed = game.totalSeconds - game.timeLeft;
  const timeLabel = `${Math.floor(timeUsed / 60)}:${String(timeUsed % 60).padStart(2, "0")}`;

  const [isNewBestTime, setIsNewBestTime] = useState(false);
  const [isNewBestMoves, setIsNewBestMoves] = useState(false);

  // Compare with stored records and save if better
  useEffect(() => {
    async function saveAndCompare() {
      const prev = await GameStorage.getLevelStats(game.level);

      // Best time: lower is better
      const prevTime = prev.bestTime;
      if (prevTime === null || timeUsed < prevTime) setIsNewBestTime(true);
      await GameStorage.setBestTime(game.level, timeUsed);

      // Fewest moves: lower is better
      const prevMoves = prev.fewestMoves;
      if (prevMoves === null || game.moves < prevMoves) setIsNewBestMoves(true);
      await GameStorage.setFewestMoves(game.level, game.moves);

      // Stars
      await GameStorage.setStars(game.level, stars);
    }
    saveAndCompare();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top", "bottom"]}>
      <Confetti />

      <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 24, gap: 22 }}>
        {/* Stars */}
        <StarRating stars={stars} total={3} />

        {/* Title + subtitle */}
        <View style={{ alignItems: "center", gap: 8 }}>
          <Animate type="fade-down" duration={400} delay={440}>
            <Text className="four-xl-bold text-center" style={{ color: colors.heading }}>
              You did it!
            </Text>
          </Animate>
          <Animate type="fade-up" duration={380} delay={500}>
            <Text className="base-normal text-center" style={{ color: colors.body }}>
              All {game.totalPairs} pairs matched
            </Text>
          </Animate>
        </View>

        {/* Stats */}
        <Animate type="fade-up" duration={380} delay={560}>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <StatBox label="TIME" value={timeLabel} />
            <StatBox label="MOVES" value={game.moves} />
          </View>
        </Animate>

        {/* New record badges */}
        {(isNewBestTime || isNewBestMoves) && (
          <Animate type="zoom-in" duration={360} delay={640}>
            <View
              style={{ flexDirection: "row", gap: 10, justifyContent: "center", flexWrap: "wrap" }}
            >
              {isNewBestTime && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    backgroundColor: colors.warningBg,
                    borderRadius: 50,
                    borderWidth: 1,
                    borderColor: colors.warning,
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                  }}
                >
                  <Trophy size={14} color={colors.warning} strokeWidth={2} />
                  <Text style={{ color: colors.warning, fontSize: 13, fontWeight: "700" }}>
                    New best time!
                  </Text>
                </View>
              )}
              {isNewBestMoves && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    backgroundColor: colors.warningBg,
                    borderRadius: 50,
                    borderWidth: 1,
                    borderColor: colors.warning,
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                  }}
                >
                  <Medal size={14} color={colors.warning} strokeWidth={2} />
                  <Text style={{ color: colors.warning, fontSize: 13, fontWeight: "700" }}>
                    Fewest moves!
                  </Text>
                </View>
              )}
            </View>
          </Animate>
        )}

        {/* Hint */}
        <Animate type="fade" duration={340} delay={720}>
          <Text className="sm-normal text-center" style={{ color: colors.mutedForeground }}>
            {stars < 3
              ? `Finish faster for ${3 - stars} more star${3 - stars > 1 ? "s" : ""}!`
              : "Perfect score — you're a memory master!"}
          </Text>
        </Animate>
      </View>

      {/* Actions */}
      <Animate type="fade-up" duration={380} delay={780} distance={30}>
        <View style={{ paddingHorizontal: 24, paddingBottom: 24, paddingTop: 8 }}>
          <ResultActions
            primary={{
              label: "Next level",
              onPress: () => router.replace("/choose-level"),
            }}
            secondaryLeft={{
              label: "Play again",
              onPress: () => {
                dispatch(clearStatus());
                router.replace("/game");
              },
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
