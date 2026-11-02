import { Animate } from "@/components/common";
import ResultActions from "@/components/ui/ResultActions";
import { colors } from "@/styles/colors";
import { useRouter } from "expo-router";
import { Hourglass, Lightbulb, RefreshCw } from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHaptics, useResultMusic } from "@/hooks";

// ─── Mock game result (replace with real params/state later) ─────────────────
const RESULT = {
  found: 6,
  total: 8,
  tip: "Remember where each picture is before flipping a new card.",
};

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ found, total }: { found: number; total: number }) {
  const pct = total > 0 ? found / total : 0;
  return (
    <View style={{ gap: 8 }}>
      <View
        style={{
          height: 10,
          backgroundColor: colors.muted,
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            height: 10,
            width: `${pct * 100}%`,
            backgroundColor: colors.warning,
            borderRadius: 6,
          }}
        />
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text className="sm-medium" style={{ color: colors.body }}>
          {found} pairs found
        </Text>
        <Text className="sm-medium" style={{ color: colors.mutedForeground }}>
          {total - found} to go
        </Text>
      </View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function TimeUpScreen() {
  const router = useRouter();
  const { haptic } = useHaptics();
  useResultMusic("lose");
  haptic("error");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top", "bottom"]}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 24,
          paddingVertical: 32,
          gap: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Icon */}
        <Animate type="zoom-in" duration={400} style={{ alignItems: "center" }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: colors.destructiveBg,
              borderWidth: 2,
              borderColor: colors.destructive,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Hourglass size={34} color={colors.destructive} strokeWidth={1.8} />
          </View>
        </Animate>

        {/* Title + subtitle */}
        <View style={{ alignItems: "center", gap: 10 }}>
          <Animate type="fade-down" duration={400} delay={80}>
            <Text className="four-xl-bold text-center" style={{ color: colors.heading }}>
              Time&apos;s up!
            </Text>
          </Animate>
          <Animate type="fade-up" duration={400} delay={140}>
            <Text className="base-normal text-center" style={{ color: colors.body }}>
              So close! You found {RESULT.found} of {RESULT.total} pairs.
            </Text>
          </Animate>
        </View>

        {/* Progress bar */}
        <Animate type="fade-up" duration={380} delay={200}>
          <ProgressBar found={RESULT.found} total={RESULT.total} />
        </Animate>

        {/* Tip box */}
        <Animate type="fade-up" duration={380} delay={260}>
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              backgroundColor: colors.surface,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.border,
              padding: 16,
              alignItems: "flex-start",
            }}
          >
            <Lightbulb
              size={18}
              color={colors.warning}
              strokeWidth={1.8}
              style={{ marginTop: 2 }}
            />
            <Text className="sm-normal" style={{ color: colors.body, flex: 1, lineHeight: 20 }}>
              Tip: {RESULT.tip}
            </Text>
          </View>
        </Animate>
      </ScrollView>

      {/* Bottom actions */}
      <Animate type="fade-up" duration={380} delay={320} distance={30}>
        <View style={{ paddingHorizontal: 24, paddingBottom: 24, paddingTop: 8 }}>
          <ResultActions
            primary={{
              label: "Try again",
              icon: <RefreshCw size={18} color={colors.primaryForeground} strokeWidth={2.2} />,
              onPress: () => {
                console.log("[TimeUp] Try again");
                router.replace("/game");
              },
            }}
            secondaryLeft={{
              label: "Easier level",
              onPress: () => {
                console.log("[TimeUp] Easier level");
                router.replace("/choose-level");
              },
            }}
            secondaryRight={{
              label: "Home",
              onPress: () => {
                console.log("[TimeUp] Home");
                router.replace("/");
              },
            }}
          />
        </View>
      </Animate>
    </SafeAreaView>
  );
}
