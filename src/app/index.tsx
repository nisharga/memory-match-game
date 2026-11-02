import { Button } from "@/components";
import { Animate } from "@/components/common";
import IconButton from "@/components/ui/IconButton";
import { colors } from "@/styles/colors";
import { useRouter } from "expo-router";
import { Play, Settings } from "lucide-react-native";
import { useState } from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type GameStats = {
  stars: number;
  bestTime: string;
  fewestMoves: number;
};

export default function HomeScreen() {
  const router = useRouter();
  const [stats] = useState<GameStats>({
    stars: 14,
    bestTime: "0:38",
    fewestMoves: 12,
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top", "bottom"]}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 24,
          paddingTop: 8,
        }}
      >
        {/* Stars earned */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Image
            source={require("../../assets/star.png")}
            style={{ width: 24, height: 24, resizeMode: "contain" }}
          />
          <Text className="lg-medium">{stats.stars}</Text>
        </View>

        {/* Settings */}
        <IconButton
          className="flex h-12 w-12 flex-row items-center justify-center rounded-xl bg-[#165253]"
          onPress={() => router.push("/setting")}
        >
          <Settings size={20} color={colors.foreground} strokeWidth={1.8} />
        </IconButton>
      </View>

      {/* Hero: logo + title */}
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Animate type="fade-down" duration={500} distance={55}>
          <Image
            source={require("../../assets/splash-icon.png")}
            style={{ width: 160, height: 160, resizeMode: "contain" }}
          />
        </Animate>

        <Animate
          type="fade-up"
          duration={500}
          delay={150}
          distance={40}
          style={{ marginTop: 20, alignItems: "center" }}
        >
          <Text className="four-xl-bold text-center">{"Memory\nMatch"}</Text>
        </Animate>
      </View>

      {/* Stats + Buttons */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 36, gap: 14 }}>
        {/* Stats row */}
        <Animate type="fade-up" duration={500} delay={220} distance={30}>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View
              style={{
                flex: 1,
                backgroundColor: colors.surface,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: colors.border,
                padding: 16,
                gap: 4,
              }}
            >
              <Text className="stat-label">Best Time</Text>
              <Text className="stat-value">{stats.bestTime}</Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: colors.surface,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: colors.border,
                padding: 16,
                gap: 4,
              }}
            >
              <Text className="stat-label">Fewest Moves</Text>
              <Text className="stat-value">{stats.fewestMoves}</Text>
            </View>
          </View>

          {/* <StatItem label="TIME LEFT" value={timeLeft} /> */}
        </Animate>

        {/* Play */}
        <Animate type="fade-up" duration={500} delay={300} distance={30}>
          <Button onPress={() => router.push("/game")} className="gap-10 rounded-2xl">
            <Play
              size={18}
              color={colors.primaryForeground}
              fill={colors.primaryForeground}
              strokeWidth={0}
            />
            <Text className="play-btn-label">Play</Text>
          </Button>
        </Animate>

        {/* Choose Level */}
        <Animate type="fade-up" duration={500} delay={360} distance={30}>
          <Button onPress={() => router.push("/game")} className="gap-10 rounded-2xl bg-[#165253]">
            <Text className="base-medium">Choose level</Text>
          </Button>
        </Animate>
      </View>
    </SafeAreaView>
  );
}
