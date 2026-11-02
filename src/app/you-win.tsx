import { Animate } from "@/components/common";
import ResultActions from "@/components/ui/ResultActions";
import { colors } from "@/styles/colors";
import { useRouter } from "expo-router";
import { Trophy } from "lucide-react-native";
import { Image, StyleSheet, Text, View } from "react-native";
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

// ─── Confetti decoration (static colored pieces) ──────────────────────────────

interface ConfettiPiece {
  color: string;
  top: number;
  left?: number;
  right?: number;
  w: number;
  h: number;
  r: string;
}

const CONFETTI: ConfettiPiece[] = [
  { color: colors.shapeOrange, top: 60, left: 28, w: 16, h: 9, r: "30deg" },
  { color: colors.shapeIndigo, top: 120, left: 48, w: 10, h: 10, r: "-15deg" },
  { color: colors.warning, top: 44, left: 90, w: 8, h: 8, r: "0deg" },
  { color: colors.shapePink, top: 90, left: 145, w: 12, h: 6, r: "50deg" },
  { color: colors.shapeBlue, top: 135, left: 190, w: 8, h: 8, r: "0deg" },
  { color: colors.warning, top: 55, right: 32, w: 14, h: 8, r: "-30deg" },
  { color: colors.shapeOrange, top: 110, right: 55, w: 10, h: 10, r: "20deg" },
  { color: colors.success, top: 80, right: 95, w: 8, h: 12, r: "-45deg" },
  { color: colors.shapePink, top: 40, right: 130, w: 10, h: 6, r: "60deg" },
  { color: colors.shapeBlue, top: 145, right: 28, w: 7, h: 7, r: "0deg" },
];

function Confetti() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {CONFETTI.map((p, i) => (
        <View
          key={i}
          style={{
            position: "absolute",
            top: p.top,
            left: p.left,
            right: p.right,
            width: p.w,
            height: p.h,
            borderRadius: 3,
            backgroundColor: p.color,
            transform: [{ rotate: p.r }],
          }}
        />
      ))}
    </View>
  );
}

// ─── Star rating ──────────────────────────────────────────────────────────────

function StarRating({ stars, total = 3 }: { stars: number; total?: number }) {
  const mid = Math.floor(total / 2);
  return (
    <View
      style={{ flexDirection: "row", gap: 6, justifyContent: "center", alignItems: "flex-end" }}
    >
      {Array.from({ length: total }).map((_, i) => {
        const filled = i < stars;
        const isMid = i === mid;
        const size = isMid ? 72 : 52;
        return (
          <Animate key={i} type="zoom-in" duration={400} delay={80 + i * 120}>
            <Image
              source={
                filled ? require("../../assets/star.png") : require("../../assets/star-empty.png")
              }
              style={{ width: size, height: size, resizeMode: "contain" }}
            />
          </Animate>
        );
      })}
    </View>
  );
}

// ─── Stat box ─────────────────────────────────────────────────────────────────

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        paddingVertical: 14,
        paddingHorizontal: 12,
        alignItems: "center",
        gap: 4,
      }}
    >
      <Text className="stat-label">{label}</Text>
      <Text className="stat-value">{value}</Text>
    </View>
  );
}

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
