import { Animate } from "@/components/common";
import Confetti from "@/components/ui/Confetti";
import ResultActions from "@/components/ui/ResultActions";
import StarRating from "@/components/ui/StarRating";
import StatBox from "@/components/ui/StatBox";
import { colors } from "@/styles/colors";
import { useRouter } from "expo-router";
import { Trophy } from "lucide-react-native";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Mock game result (replace with real params/state later) ─────────────────
const RESULT = {
  stars: 2,
  totalStars: 3,
  totalPairs: 8,
  time: "0:52",
  moves: 18,
  isNewBestTime: true,
  hintText: "Finish in 14 moves or fewer for 3 stars",
};

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function YouWinScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top", "bottom"]}>
      {/* Confetti behind everything */}
      <Confetti />

      {/* Main content */}
      <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 24, gap: 22 }}>
        {/* Stars */}
        <StarRating stars={RESULT.stars} total={RESULT.totalStars} />

        {/* Title + subtitle */}
        <View style={{ alignItems: "center", gap: 8 }}>
          <Animate type="fade-down" duration={400} delay={440}>
            <Text className="four-xl-bold text-center" style={{ color: colors.heading }}>
              You did it!
            </Text>
          </Animate>
          <Animate type="fade-up" duration={380} delay={500}>
            <Text className="base-normal text-center" style={{ color: colors.body }}>
              All {RESULT.totalPairs} pairs matched
            </Text>
          </Animate>
        </View>

        {/* Stats row */}
        <Animate type="fade-up" duration={380} delay={560}>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <StatBox label="TIME" value={RESULT.time} />
            <StatBox label="MOVES" value={RESULT.moves} />
          </View>
        </Animate>

        {/* New best time badge */}
        {RESULT.isNewBestTime && (
          <Animate type="zoom-in" duration={360} delay={640}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                backgroundColor: colors.warningBg,
                borderRadius: 50,
                borderWidth: 1,
                borderColor: colors.warning,
                paddingVertical: 10,
                paddingHorizontal: 20,
                alignSelf: "center",
              }}
            >
              <Trophy size={16} color={colors.warning} strokeWidth={2} />
              <Text
                style={{
                  color: colors.warning,
                  fontSize: 14,
                  fontWeight: "700",
                  letterSpacing: 0.3,
                }}
              >
                New best time!
              </Text>
            </View>
          </Animate>
        )}

        {/* Hint text */}
        <Animate type="fade" duration={340} delay={720}>
          <Text className="sm-normal text-center" style={{ color: colors.mutedForeground }}>
            {RESULT.hintText}
          </Text>
        </Animate>
      </View>

      {/* Bottom actions */}
      <Animate type="fade-up" duration={380} delay={780} distance={30}>
        <View style={{ paddingHorizontal: 24, paddingBottom: 24, paddingTop: 8 }}>
          <ResultActions
            primary={{
              label: "Next level",
              onPress: () => {
                console.log("[YouWin] Next level");
                router.replace("/choose-level");
              },
            }}
            secondaryLeft={{
              label: "Play again",
              onPress: () => {
                console.log("[YouWin] Play again");
                router.replace("/game");
              },
            }}
            secondaryRight={{
              label: "Home",
              onPress: () => {
                console.log("[YouWin] Home");
                router.replace("/");
              },
            }}
          />
        </View>
      </Animate>
    </SafeAreaView>
  );
}
